import { Router } from 'express';
import {
  adminLogin,
  getStudents,
  toggleStudentStatus,
  getStats,
  getAnalytics,
  getStudentRankings,
  getViolationTrends,
  getPassFailDistribution,
} from '../controllers/adminController.js';
import { adminProtect } from '../middleware/adminAuth.js';
import validate from '../middleware/validate.js';
import { adminLoginValidation } from '../validators/authValidator.js';

const router = Router();

router.post('/login', adminLoginValidation, validate, adminLogin);
router.get('/students', adminProtect, getStudents);
router.put('/student/:id/toggle-status', adminProtect, toggleStudentStatus);
router.get('/stats', adminProtect, getStats);
router.get('/analytics', adminProtect, getAnalytics);
router.get('/rankings', adminProtect, getStudentRankings);
router.get('/violation-trends', adminProtect, getViolationTrends);
router.get('/pass-fail-distribution', adminProtect, getPassFailDistribution);

export default router;
