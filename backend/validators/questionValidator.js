import { body } from 'express-validator';

export const createQuestionValidation = [
  body('examId').isMongoId().withMessage('Valid exam ID is required'),
  body('questionText').trim().notEmpty().withMessage('Question text is required').isLength({ max: 1000 }),
  body('questionType').isIn(['mcq', 'true_false', 'short_answer']).withMessage('Invalid question type'),
  body('correctAnswer').trim().notEmpty().withMessage('Correct answer is required'),
  body('marks').isInt({ min: 1 }).withMessage('Marks must be a positive number'),
  body('options').custom((value, { req }) => {
  if (req.body.questionType === 'mcq') {
    if (!Array.isArray(value) || value.length < 2) {
      throw new Error('MCQ questions must have at least 2 options');
    }
    const filled = value.filter((v) => v?.trim());
    if (filled.length < 2) {
      throw new Error('MCQ questions must have at least 2 non-empty options');
    }
  }
  return true;
}),
];
