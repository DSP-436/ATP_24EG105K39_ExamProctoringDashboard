import { FiCamera, FiMonitor, FiEye, FiMaximize2, FiShield } from 'react-icons/fi';
import { classNames } from '../../utils/helpers';

const INDICATORS = [
  {
    key: 'camera',
    icon: FiCamera,
    label: 'Camera',
    getStatus: (state) => {
      const fs = state.faceStatus;
      if (fs === 'visible') return { ok: true, text: 'Active' };
      if (fs === 'not_visible') return { ok: false, text: 'No Face' };
      if (fs === 'multiple_faces') return { ok: false, text: 'Multiple!' };
      return { ok: null, text: 'Waiting...' };
    },
  },
  {
    key: 'headpose',
    icon: FiEye,
    label: 'Head Pose',
    getStatus: (state) => {
      const p = state.headPose.status;
      if (p === 'center') return { ok: true, text: 'Center' };
      if (p === 'up') return { ok: false, text: 'Looking Up' };
      if (p === 'down') return { ok: false, text: 'Head Down' };
      if (p === 'left') return { ok: false, text: 'Looking Left' };
      if (p === 'right') return { ok: false, text: 'Looking Right' };
      return { ok: null, text: '...' };
    },
  },
  {
    key: 'fullscreen',
    icon: FiMaximize2,
    label: 'Fullscreen',
    getStatus: (state) => ({
      ok: state.isFullScreen,
      text: state.isFullScreen ? 'Active' : 'Off!',
    }),
  },
  {
    key: 'monitoring',
    icon: FiShield,
    label: 'Monitoring',
    getStatus: () => ({ ok: true, text: 'Active' }),
  },
  {
    key: 'tabs',
    icon: FiMonitor,
    label: 'Tab Switches',
    getStatus: (state) => {
      const count = state.violations.tab_switch || 0;
      return {
        ok: count < 3,
        text: count > 0 ? `${count}x` : 'None',
      };
    },
  },
];

export default function ProctorStatusBar({ store }) {
  const state = store();

  return (
    <div className="bg-gray-900 text-white rounded-lg p-3 space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Proctor Status</h4>
      {INDICATORS.map((ind) => {
        const Icon = ind.icon;
        const status = ind.getStatus(state);

        return (
          <div key={ind.key} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Icon className="text-gray-400" />
              <span>{ind.label}</span>
            </div>
            <span
              className={classNames(
                'px-2 py-0.5 rounded font-medium',
                status.ok === true && 'bg-success-600/20 text-success-400',
                status.ok === false && 'bg-danger-600/20 text-danger-400',
                status.ok === null && 'bg-gray-700 text-gray-400'
              )}
            >
              {status.text}
            </span>
          </div>
        );
      })}

      <div className="border-t border-gray-700 pt-2 mt-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Head Pose</span>
          <span className="font-mono">
            {state.headPose.yaw.toFixed(0)}° / {state.headPose.pitch.toFixed(0)}°
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Violation Score</span>
          <span className={state.warningLevel === 'hard' ? 'text-danger-400 font-bold' : ''}>
            {Object.values(state.violations).reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
