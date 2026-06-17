import { Router } from 'express';
import { getQuestionsByExam, createQuestion, bulkCreateQuestions, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { adminProtect } from '../middleware/adminAuth.js';
import validate from '../middleware/validate.js';
import { createQuestionValidation } from '../validators/questionValidator.js';

const router = Router();

router.get('/exam/:examId', getQuestionsByExam);
router.post('/', adminProtect, createQuestionValidation, validate, createQuestion);
router.post('/bulk', adminProtect, bulkCreateQuestions);
router.put('/:id', adminProtect, updateQuestion);
router.delete('/:id', adminProtect, deleteQuestion);

export default router;
