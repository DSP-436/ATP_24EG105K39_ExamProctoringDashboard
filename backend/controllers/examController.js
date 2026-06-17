import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const getExams = catchAsync(async (req, res, next) => {
  const now = new Date();
  const exams = await Exam.find({
    isActive: true,
    endsAt: { $gte: now },
  }).select('-questions').populate('createdBy', 'name');

  res.json({ success: true, count: exams.length, exams });
});

export const getExamById = catchAsync(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id).populate('questions').populate('createdBy', 'name');
  if (!exam) return next(new AppError('Exam not found.', 404));

  const now = new Date();
  if (new Date(exam.scheduledAt) > now) {
    return next(new AppError('This exam has not started yet.', 400));
  }

  const result = await Result.findOne({ studentId: req.user._id, examId: exam._id });
  if (result) return next(new AppError('You have already taken this exam.', 400));

  res.json({ success: true, exam });
});

export const getAdminExamById = catchAsync(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id).populate('questions').populate('createdBy', 'name');
  if (!exam) return next(new AppError('Exam not found.', 404));
  res.json({ success: true, exam });
});

export const createExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.create({ ...req.body, createdBy: req.admin._id });
  res.status(201).json({ success: true, exam });
});

export const updateExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!exam) return next(new AppError('Exam not found.', 404));
  res.json({ success: true, exam });
});

export const deleteExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.findByIdAndDelete(req.params.id);
  if (!exam) return next(new AppError('Exam not found.', 404));

  await Question.deleteMany({ examId: exam._id });
  res.json({ success: true, message: 'Exam deleted.' });
});

export const getAdminExams = catchAsync(async (req, res, next) => {
  const exams = await Exam.find().populate('createdBy', 'name').sort({ createdAt: -1 });
  res.json({ success: true, count: exams.length, exams });
});
