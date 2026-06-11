import { Router } from 'express';
import { MonthlyReviewController } from '../controllers/MonthlyReviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/recent', MonthlyReviewController.getRecentMonthlyReviews);
router.get('/:year/:month', MonthlyReviewController.getMonthlyReview);

export default router;
