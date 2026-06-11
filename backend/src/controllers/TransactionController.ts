import { Request, Response } from 'express';
import { TransactionModel } from '../models/Transaction.js';
import { TransactionRequest } from '../types/index.js';
import { FinancialService } from '../services/FinancialService.js';

export class TransactionController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const data = req.body as TransactionRequest;
      const transaction = await TransactionModel.create(userId, data);

      // Process transaction to update balances automatically
      await FinancialService.processTransaction(transaction);

      res.status(201).json({
        message: 'Transaction created successfully',
        transaction,
      });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const transactions = await TransactionModel.findByUserId(userId, limit, offset);

      res.json({
        data: transactions,
        total: transactions.length,
      });
    } catch (error) {
      console.error('Get transactions error:', error);
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
      const transaction = await TransactionModel.findById(id, userId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ transaction });
    } catch (error) {
      console.error('Get transaction error:', error);
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
      const data = req.body as Partial<TransactionRequest>;

      const transaction = await TransactionModel.update(id, userId, data);

      res.json({
        message: 'Transaction updated successfully',
        transaction,
      });
    } catch (error) {
      console.error('Update transaction error:', error);
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
      await TransactionModel.delete(id, userId);

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getByDateRange(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Missing startDate or endDate' });
      }

      const transactions = await TransactionModel.getByDateRange(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        data: transactions,
        total: transactions.length,
      });
    } catch (error) {
      console.error('Get transactions by date range error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
