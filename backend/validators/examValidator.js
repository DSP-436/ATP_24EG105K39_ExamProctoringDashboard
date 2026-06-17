import { body } from 'express-validator';

export const createExamValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('totalMarks').isInt({ min: 1 }).withMessage('Total marks must be a positive number'),
  body('passingMarks').isInt({ min: 0 }).withMessage('Passing marks must be a non-negative number'),
  body('scheduledAt').isISO8601().withMessage('Valid scheduled date is required'),
  body('endsAt').isISO8601().withMessage('Valid end date is required'),
];
