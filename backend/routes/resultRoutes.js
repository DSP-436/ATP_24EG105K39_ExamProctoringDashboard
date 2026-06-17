import { Router } from 'express';
import { getMyResults, getResultById, getExamResults, getStudentResults, submitExam } from '../controllers/resultController.js';
import { protect } from '../middleware/auth.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = Router();

router.get('/my-results', protect, getMyResults);
router.get('/exam/:examId', adminProtect, getExamResults);
router.get('/student/:studentId', adminProtect, getStudentResults);
router.get('/:id', protect, getResultById);
router.post('/submit', protect, submitExam);

export default router;
