import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import ProctorLog from '../models/ProctorLog.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import env from '../config/env.js';

const signToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password, secretCode } = req.body;

  if (secretCode !== env.adminSecretCode) {
    return next(new AppError('Invalid admin secret code.', 403));
  }

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const token = signToken(admin._id);
  res.json({
    success: true,
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

export const getStudents = catchAsync(async (req, res, next) => {
  const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
  res.json({ success: true, count: students.length, students });
});

export const toggleStudentStatus = catchAsync(async (req, res, next) => {
  const student = await User.findById(req.params.id);
  if (!student) return next(new AppError('Student not found.', 404));

  student.isActive = !student.isActive;
  await student.save();

  res.json({ success: true, message: `Student ${student.isActive ? 'activated' : 'deactivated'}.` });
});

export const getStats = catchAsync(async (req, res, next) => {
  const [totalStudents, totalExams, activeExams, totalResults, flaggedResults, totalLogs] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Exam.countDocuments(),
    Exam.countDocuments({ isActive: true }),
    Result.countDocuments(),
    Result.countDocuments({ isFlagged: true }),
    ProctorLog.countDocuments(),
  ]);

  res.json({
    success: true,
    stats: { totalStudents, totalExams, activeExams, totalResults, flaggedResults, totalLogs },
  });
});

export const getAnalytics = catchAsync(async (req, res, next) => {
  const exams = await Exam.find().populate('createdBy', 'name');

  const examAnalytics = await Promise.all(
    exams.map(async (exam) => {
      const results = await Result.find({ examId: exam._id });
      const totalStudents = results.length;
      const passed = results.filter((r) => r.passed).length;
      const failed = totalStudents - passed;
      const avgScore = totalStudents
        ? results.reduce((sum, r) => sum + r.percentage, 0) / totalStudents
        : 0;
      const flagged = results.filter((r) => r.isFlagged).length;

      return {
        examId: exam._id,
        title: exam.title,
        totalStudents,
        passed,
        failed,
        avgScore: Math.round(avgScore * 100) / 100,
        flagged,
      };
    })
  );

  const suspiciousActivities = await ProctorLog.aggregate([
    { $group: { _id: '$activityType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const dailySubmissions = await Result.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);

  res.json({
    success: true,
    analytics: { examAnalytics, suspiciousActivities, dailySubmissions },
  });
});

export const getStudentRankings = catchAsync(async (req, res, next) => {
  const rankings = await Result.aggregate([
    {
      $group: {
        _id: '$studentId',
        examsTaken: { $sum: 1 },
        totalScore: { $sum: '$totalMarksObtained' },
        avgPercentage: { $avg: '$percentage' },
        passedCount: { $sum: { $cond: ['$passed', 1, 0] } },
        flaggedCount: { $sum: { $cond: ['$isFlagged', 1, 0] } },
        suspiciousCount: { $sum: '$suspiciousCount' },
      },
    },
    { $sort: { avgPercentage: -1 } },
    { $limit: 50 },
  ]);

  const populated = await User.populate(rankings, {
    path: '_id',
    select: 'name email',
  });

  const result = populated
    .filter((r) => r._id)
    .map((r) => ({
      studentId: r._id._id,
      name: r._id.name,
      email: r._id.email,
      examsTaken: r.examsTaken,
      avgPercentage: Math.round(r.avgPercentage * 100) / 100,
      passedCount: r.passedCount,
      failedCount: r.examsTaken - r.passedCount,
      flaggedCount: r.flaggedCount,
      suspiciousCount: r.suspiciousCount,
    }));

  res.json({ success: true, rankings: result });
});

export const getViolationTrends = catchAsync(async (req, res, next) => {
  const trends = await ProctorLog.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          severity: '$severity',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
    { $limit: 90 },
  ]);

  const dateMap = {};
  trends.forEach((t) => {
    const date = t._id.date;
    if (!dateMap[date]) dateMap[date] = { date, low: 0, medium: 0, high: 0 };
    dateMap[date][t._id.severity] = t.count;
  });

  const daily = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

  res.json({ success: true, trends: daily });
});

export const getPassFailDistribution = catchAsync(async (req, res, next) => {
  const data = await Result.aggregate([
    {
      $group: {
        _id: '$examId',
        passed: { $sum: { $cond: ['$passed', 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);

  const populated = await Exam.populate(data, {
    path: '_id',
    select: 'title',
  });

  const result = populated
    .filter((d) => d._id)
    .map((d) => ({
      examId: d._id._id,
      title: d._id.title,
      passed: d.passed,
      failed: d.total - d.passed,
    }));

  res.json({ success: true, distribution: result });
});
