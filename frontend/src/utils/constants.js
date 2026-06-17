export const ACTIVITY_TYPES = [
  { value: 'tab_switch', label: 'Tab Switch', severity: 'high' },
  { value: 'multiple_faces', label: 'Multiple Faces', severity: 'high' },
  { value: 'face_not_visible', label: 'Face Not Visible', severity: 'medium' },
  { value: 'looking_away', label: 'Looking Away', severity: 'medium' },
  { value: 'head_down', label: 'Head Down', severity: 'medium' },
  { value: 'looking_left', label: 'Looking Left', severity: 'medium' },
  { value: 'looking_right', label: 'Looking Right', severity: 'medium' },
  { value: 'suspicious_audio', label: 'Suspicious Audio', severity: 'high' },
  { value: 'copy_paste', label: 'Copy/Paste', severity: 'medium' },
  { value: 'idle_timeout', label: 'Idle Timeout', severity: 'low' },
  { value: 'fullscreen_exit', label: 'Fullscreen Exit', severity: 'high' },
  { value: 'browser_minimize', label: 'Browser Minimize', severity: 'high' },
  { value: 'screenshot_attempt', label: 'Screenshot Attempt', severity: 'high' },
  { value: 'right_click', label: 'Right Click', severity: 'high' },
  { value: 'devtools_open', label: 'Developer Tools', severity: 'high' },
];

export const SEVERITY_LEVELS = ['low', 'medium', 'high'];

export const SEVERITY_WEIGHTS = { low: 1, medium: 3, high: 5 };

export const WARNING_THRESHOLDS = {
  soft: 5,
  hard: 15,
  autoSubmit: 30,
};

export const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'short_answer', label: 'Short Answer' },
];

export const HEAD_POSE = {
  THRESHOLD_UP: 20,
  THRESHOLD_DOWN: 25,
  THRESHOLD_LEFT: 20,
  THRESHOLD_RIGHT: 20,
};
