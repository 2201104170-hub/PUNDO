import { Request, Response } from 'express';
import { DebtModel } from '../models/Debt.js';
import { TransactionModel } from '../models/Transaction.js';
import { DebtRequest, FinancialMetrics, DashboardStats } from '../types/index.js';

export class DebtController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const data = req.body as DebtRequest;
      const debt = await DebtModel.create(userId, data);

      res.status(201).json({
        message: 'Debt created successfully',
        debt,
      });
    } catch (error) {
      console.error('Create debt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const debts = await DebtModel.findByUserId(userId);

      res.json({
        data: debts,
        total: debts.length,
      });
    } catch (error) {
      console.error('Get debts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const debt = await DebtModel.findById(id, userId);

      if (!debt) {
        return res.status(404).json({ error: 'Debt not found' });
      }

      res.json({ debt });
    } catch (error) {
      console.error('Get debt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const data = req.body as Partial<DebtRequest>;

      const debt = await DebtModel.update(id, userId, data);

      res.json({
        message: 'Debt updated successfully',
        debt,
      });
    } catch (error) {
      console.error('Update debt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      await DebtModel.delete(id, userId);

      res.json({ message: 'Debt deleted successfully' });
    } catch (error) {
      console.error('Delete debt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getActiveDebts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const debts = await DebtModel.getActiveDebts(userId);

      res.json({
        data: debts,
        total: debts.length,
      });
    } catch (error) {
      console.error('Get active debts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export class DashboardController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get all transactions and debts
      const transactions = await TransactionModel.findByUserId(userId, 1000);
      const debts = await DebtModel.findByUserId(userId);

      // Calculate metrics
      const totalIncome = transactions
        .filter((t) => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t) => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalDebt = debts
        .filter((d) => d.status !== 'paid')
        .reduce((sum, d) => sum + d.amount, 0);

      const netFlow = totalIncome - totalExpenses;
      const totalBalance = totalIncome - totalExpenses - totalDebt;
      const savingsRate = totalIncome > 0 ? (netFlow / totalIncome) * 100 : 0;

      const metrics: FinancialMetrics = {
        totalBalance: Math.max(0, totalBalance),
        totalIncome,
        totalExpenses,
        savingsRate,
        netFlow,
        totalDebt,
      };

      // Get recent transactions (last 5)
      const recentTransactions = transactions.slice(0, 5);

      // Get upcoming debts (next 5)
      const upcomingDebts = debts
        .filter((d) => d.status !== 'paid')
        .slice(0, 5);

      const stats: DashboardStats = {
        metrics,
        recentTransactions,
        upcomingDebts,
      };

      res.json(stats);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
