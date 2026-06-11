import { Request, Response } from 'express';
import { MonthlyReviewService } from '../services/MonthlyReviewService.js';

export class MonthlyReviewController {
  static async getMonthlyReview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { year, month } = req.params;
      
      if (!year || !month) {
        return res.status(400).json({ error: 'Year and month are required' });
      }

      const review = await MonthlyReviewService.getMonthlyReview(
        userId,
        parseInt(year),
        parseInt(month)
      );

      res.json(review);
    } catch (error) {
      console.error('Get monthly review error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRecentMonthlyReviews(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const months = parseInt(req.query.months as string) || 6;
      const reviews = await MonthlyReviewService.getRecentMonthlyReviews(userId, months);

      res.json({ data: reviews });
    } catch (error) {
      console.error('Get recent monthly reviews error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
