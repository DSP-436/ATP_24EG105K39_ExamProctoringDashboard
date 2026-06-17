import Result from '../models/Result.js';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const getMyResults = catchAsync(async (req, res, next) => {
  const results = await Result.find({ studentId: req.user._id })
    .populate('examId', 'title totalMarks passingMarks')
    .sort({ submittedAt: -1 });

  res.json({ success: true, count: results.length, results });
});

export const getResultById = catchAsync(async (req, res, next) => {
  const result = await Result.findById(req.params.id)
    .populate('examId', 'title totalMarks passingMarks')
    .populate('answers.questionId', 'questionText correctAnswer marks');

  if (!result) return next(new AppError('Result not found.', 404));
  res.json({ success: true, result });
});

export const getExamResults = catchAsync(async (req, res, next) => {
  const results = await Result.find({ examId: req.params.examId })
    .populate('studentId', 'name email')
    .sort({ totalMarksObtained: -1 });

  res.json({ success: true, count: results.length, results });
});

export const getStudentResults = catchAsync(async (req, res, next) => {
  const results = await Result.find({ studentId: req.params.studentId })
    .populate('examId', 'title totalMarks')
    .sort({ submittedAt: -1 });

  res.json({ success: true, count: results.length, results });
});

export const submitExam = catchAsync(async (req, res, next) => {
  const { examId, answers } = req.body;

  const exam = await Exam.findById(examId);
  if (!exam) return next(new AppError('Exam not found.', 404));

  const now = new Date();
  if (new Date(exam.scheduledAt) > now) {
    return next(new AppError('This exam has not started yet.', 400));
  }
  if (new Date(exam.endsAt) < now) {
    return next(new AppError('This exam has already ended.', 400));
  }

  const existing = await Result.findOne({ studentId: req.user._id, examId });
  if (existing) return next(new AppError('You have already submitted this exam.', 400));

  const questions = await Question.find({ examId });
  const questionMap = {};
  questions.forEach((q) => { questionMap[q._id.toString()] = q; });

  let totalMarksObtained = 0;
  const gradedAnswers = answers.map((a) => {
    const question = questionMap[a.questionId];
    if (!question) return { ...a, isCorrect: false, marksObtained: 0 };

    const isCorrect = question.correctAnswer.toString().trim().toLowerCase()
      === (a.answer || '').toString().trim().toLowerCase();

    const marksObtained = isCorrect ? question.marks : 0;
    if (isCorrect) totalMarksObtained += marksObtained;

    return { questionId: a.questionId, answer: a.answer, isCorrect, marksObtained };
  });

  const percentage = (totalMarksObtained / exam.totalMarks) * 100;

  const result = await Result.create({
    studentId: req.user._id,
    examId,
    answers: gradedAnswers,
    totalMarksObtained,
    percentage: Math.round(percentage * 100) / 100,
    passed: percentage >= exam.passingMarks,
    startedAt: new Date(Date.now() - exam.duration * 60000),
    submittedAt: new Date(),
  });

  res.status(201).json({ success: true, result });
});
