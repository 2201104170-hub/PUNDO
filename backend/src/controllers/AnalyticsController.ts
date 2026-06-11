import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService.js';

export class AnalyticsController {
  static async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const analyticsData = await AnalyticsService.getAnalyticsData(userId);

      res.json(analyticsData);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSpendingByCategory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const spendingByCategory = await AnalyticsService.getSpendingByCategory(userId);

      res.json({ data: spendingByCategory });
    } catch (error) {
      console.error('Get spending by category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMonthlyTrends(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const months = parseInt(req.query.months as string) || 6;
      const monthlyTrends = await AnalyticsService.getMonthlyTrends(userId, months);

      res.json({ data: monthlyTrends });
    } catch (error) {
      console.error('Get monthly trends error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
