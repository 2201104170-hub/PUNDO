import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', AnalyticsController.getAnalytics);
router.get('/spending-by-category', AnalyticsController.getSpendingByCategory);
router.get('/monthly-trends', AnalyticsController.getMonthlyTrends);

export default router;
