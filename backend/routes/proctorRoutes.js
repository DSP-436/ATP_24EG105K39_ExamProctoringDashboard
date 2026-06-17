import { Router } from 'express';
import { logActivity, getExamLogs, getStudentLogs, heartbeat } from '../controllers/proctorController.js';
import { protect } from '../middleware/auth.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = Router();

router.post('/log', protect, logActivity);
router.get('/exam/:examId', adminProtect, getExamLogs);
router.get('/student/:studentId/exam/:examId', adminProtect, getStudentLogs);
router.post('/heartbeat', protect, heartbeat);

export default router;
