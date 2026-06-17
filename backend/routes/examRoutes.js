import { Router } from 'express';
import { getExams, getExamById,getAdminExamById ,createExam, updateExam, deleteExam, getAdminExams } from '../controllers/examController.js';
import { protect } from '../middleware/auth.js';
import { adminProtect } from '../middleware/adminAuth.js';
import validate from '../middleware/validate.js';
import { createExamValidation } from '../validators/examValidator.js';

const router = Router();

router.get('/', protect, getExams);
router.get('/admin', adminProtect, getAdminExams);
router.get('/admin/:id', adminProtect, getAdminExamById);
router.get('/:id', protect, getExamById);
router.post('/', adminProtect, createExamValidation, validate, createExam);
router.put('/:id', adminProtect, updateExam);
router.delete('/:id', adminProtect, deleteExam);

export default router;
