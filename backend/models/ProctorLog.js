import mongoose from 'mongoose';

const proctorLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true,
  },
  activityType: {
    type: String,
    enum: [
      'tab_switch',
      'multiple_faces',
      'face_not_visible',
      'looking_away',
      'head_down',
      'looking_left',
      'looking_right',
      'suspicious_audio',
      'copy_paste',
      'idle_timeout',
      'fullscreen_exit',
      'browser_minimize',
      'screenshot_attempt',
      'right_click',
      'devtools_open',
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

proctorLogSchema.index({ studentId: 1, examId: 1, timestamp: -1 });

export default mongoose.model('ProctorLog', proctorLogSchema);
