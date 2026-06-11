import { Router } from 'express';
import { InsightsController } from '../controllers/InsightsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', InsightsController.getAllInsights);
router.get('/most-spent-category', InsightsController.getMostSpentCategory);
router.get('/debt-warnings', InsightsController.getDebtWarnings);

export default router;
