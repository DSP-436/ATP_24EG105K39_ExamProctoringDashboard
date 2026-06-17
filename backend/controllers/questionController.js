import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const getQuestionsByExam = catchAsync(async (req, res, next) => {
  const questions = await Question.find({ examId: req.params.examId });
  res.json({ success: true, count: questions.length, questions });
});

export const createQuestion = catchAsync(async (req, res, next) => {
  const exam = await Exam.findById(req.body.examId);
  if (!exam) return next(new AppError('Exam not found.', 404));

  const question = await Question.create(req.body);
  exam.questions.push(question._id);
  await exam.save();

  res.status(201).json({ success: true, question });
});

export const bulkCreateQuestions = catchAsync(async (req, res, next) => {
  const { examId, questions } = req.body;
  const exam = await Exam.findById(examId);
  if (!exam) return next(new AppError('Exam not found.', 404));

  const created = await Question.insertMany(
    questions.map((q) => ({ ...q, examId }))
  );

  const ids = created.map((q) => q._id);
  await Exam.findByIdAndUpdate(examId, { $push: { questions: { $each: ids } } });

  res.status(201).json({ success: true, count: created.length, questions: created });
});

export const updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!question) return next(new AppError('Question not found.', 404));
  res.json({ success: true, question });
});

export const deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) return next(new AppError('Question not found.', 404));

  await Exam.findByIdAndUpdate(question.examId, { $pull: { questions: question._id } });
  res.json({ success: true, message: 'Question deleted.' });
});
