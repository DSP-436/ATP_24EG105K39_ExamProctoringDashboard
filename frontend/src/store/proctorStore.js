import { create } from 'zustand';
import { logActivity } from '../services/proctorService';
import { ACTIVITY_TYPES, WARNING_THRESHOLDS } from '../utils/constants';
import { getWeightedViolationScore } from '../utils/helpers';

const initialState = {
  isMonitoring: false,
  violations: {
    tab_switch: 0,
    multiple_faces: 0,
    face_not_visible: 0,
    looking_away: 0,
    head_down: 0,
    looking_left: 0,
    looking_right: 0,
    copy_paste: 0,
    fullscreen_exit: 0,
    browser_minimize: 0,
    screenshot_attempt: 0,
    right_click: 0,
    devtools_open: 0,
  },
  faceStatus: 'unknown',
  headPose: { yaw: 0, pitch: 0, status: 'center' },
  isFullScreen: false,
  warnings: [],
  lastLogTime: {},
  warningLevel: null,
  shouldAutoSubmit: false,
};

const useProctorStore = create((set, get) => ({
  ...initialState,

  startMonitoring: () => set({ isMonitoring: true }),

  stopMonitoring: () => set({ ...initialState }),

  logSuspiciousActivity: async (data) => {
    const now = Date.now();
    const lastLog = get().lastLogTime[data.activityType] || 0;
    const cooldown = data.severity === 'high' ? 5000 : 10000;

    if (now - lastLog < cooldown) return;

    set((state) => ({
      lastLogTime: { ...state.lastLogTime, [data.activityType]: now },
    }));

    try {
      await logActivity(data);
    } catch {
      // silently fail — don't disrupt the exam
    }
  },

  incrementViolation: (type, severity = 'medium') => {
    set((state) => {
      const newViolations = {
        ...state.violations,
        [type]: (state.violations[type] || 0) + 1,
      };

      const score = getWeightedViolationScore(newViolations, ACTIVITY_TYPES);
      let warningLevel = null;

      if (score >= WARNING_THRESHOLDS.autoSubmit) {
        return {
          violations: newViolations,
          warningLevel: 'auto_submit',
          shouldAutoSubmit: true,
        };
      }

      if (score >= WARNING_THRESHOLDS.hard) {
        warningLevel = 'hard';
      } else if (score >= WARNING_THRESHOLDS.soft) {
        warningLevel = 'soft';
      }

      let newWarnings = state.warnings;
      if (warningLevel && warningLevel !== state.warningLevel) {
        newWarnings = [
          ...state.warnings,
          { type, severity, level: warningLevel, score, timestamp: new Date() },
        ].slice(-20);
      }

      return { violations: newViolations, warnings: newWarnings, warningLevel };
    });
  },

  setFaceStatus: (status) => set({ faceStatus: status }),

  setHeadPose: (pose) => set({ headPose: pose }),

  setIsFullScreen: (val) => set({ isFullScreen: val }),

  clearWarning: () => set({ warningLevel: null }),

  reset: () => set({ ...initialState }),
}));

export default useProctorStore;
