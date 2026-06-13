import { Request, Response } from 'express';
import { DebtModel } from '../models/Debt.js';
import { TransactionModel } from '../models/Transaction.js';
import { DebtRequest, FinancialMetrics, DashboardStats } from '../types/index.js';
import { FinancialService } from '../services/FinancialService.js';

export class DebtController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const data = req.body as DebtRequest;
      // Set remaining_balance to amount initially if not provided
      if (!data.remainingBalance) {
        data.remainingBalance = data.amount;
      }
      const debt = await DebtModel.create(userId, data);

      // Create a corresponding transaction record
      try {
        const transactionAmount = data.type === 'i_owe' ? -data.amount : data.amount;
        await TransactionModel.create(userId, {
          date: new Date().toISOString(),
          description: `Debt recorded: ${data.creditor}`,
          amount: transactionAmount,
          category: 'Debt',
          type: data.type === 'i_owe' ? 'debt_payment' : 'money_lent',
          status: 'completed',
          currency: 'PHP',
          debtId: debt.id,
        });
      } catch (transactionError) {
        console.warn('Warning: Failed to create transaction record for debt:', transactionError);
        // Don't fail the debt creation if transaction creation fails
      }

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

      // Use FinancialService to calculate all metrics
      const metrics = await FinancialService.getFinancialMetrics(userId);

      // Get recent transactions (last 5)
      const transactions = await TransactionModel.findByUserId(userId, 5, 0);

      // Get upcoming debts (next 5 active debts)
      const debts = await DebtModel.findByUserId(userId);
      const upcomingDebts = debts
        .filter((d) => d.status === 'active')
        .slice(0, 5);

      const stats: DashboardStats = {
        metrics,
        recentTransactions: transactions,
        upcomingDebts,
      };

      res.json(stats);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
