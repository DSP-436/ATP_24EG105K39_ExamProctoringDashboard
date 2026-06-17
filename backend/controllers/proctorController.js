import ProctorLog from '../models/ProctorLog.js';
import Result from '../models/Result.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const logActivity = catchAsync(async (req, res, next) => {
  const { examId, activityType, severity, details } = req.body;

  const log = await ProctorLog.create({
    studentId: req.user._id,
    examId,
    activityType,
    severity: severity || 'medium',
    details,
  });

  await Result.findOneAndUpdate(
    { studentId: req.user._id, examId },
    { $inc: { suspiciousCount: 1 }, isFlagged: true }
  );

  res.status(201).json({ success: true, log });
});

export const getExamLogs = catchAsync(async (req, res, next) => {
  const logs = await ProctorLog.find({ examId: req.params.examId })
    .populate('studentId', 'name email')
    .sort({ timestamp: -1 });

  res.json({ success: true, count: logs.length, logs });
});

export const getStudentLogs = catchAsync(async (req, res, next) => {
  const logs = await ProctorLog.find({
    studentId: req.params.studentId,
    examId: req.params.examId,
  }).sort({ timestamp: -1 });

  res.json({ success: true, count: logs.length, logs });
});

export const heartbeat = catchAsync(async (req, res, next) => {
  res.json({ success: true, timestamp: new Date() });
});
