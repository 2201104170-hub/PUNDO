import { Request, Response } from 'express';
import { InsightsService } from '../services/InsightsService.js';

export class InsightsController {
  static async getAllInsights(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const insights = await InsightsService.getAllInsights(userId);

      res.json({ data: insights });
    } catch (error) {
      console.error('Get insights error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMostSpentCategory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const insight = await InsightsService.getMostSpentCategory(userId);

      res.json({ insight });
    } catch (error) {
      console.error('Get most spent category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDebtWarnings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const insights = await InsightsService.getDebtWarnings(userId);

      res.json({ data: insights });
    } catch (error) {
      console.error('Get debt warnings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
