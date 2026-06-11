import pool from '../config/database.js';
import { CategorySpending, MonthlyTrend, AnalyticsData } from '../types/index.js';

export class AnalyticsService {
  /**
   * Get spending by category
   */
  static async getSpendingByCategory(userId: string): Promise<CategorySpending[]> {
    const query = `
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as amount
      FROM transactions
      WHERE user_id = $1 AND type = 'expense' AND status = 'completed'
      GROUP BY category
      ORDER BY amount DESC
    `;
    
    const result = await pool.query(query, [userId]);
    const totalExpenses = result.rows.reduce((sum: number, row: any) => sum + parseFloat(row.amount), 0);
    
    return result.rows.map((row: any) => ({
      category: row.category,
      amount: parseFloat(row.amount),
      percentage: totalExpenses > 0 ? (parseFloat(row.amount) / totalExpenses) * 100 : 0,
    }));
  }

  /**
   * Get monthly trends for transactions
   */
  static async getMonthlyTrends(userId: string, months: number = 6): Promise<MonthlyTrend[]> {
    const query = `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses
      FROM transactions
      WHERE user_id = $1 
        AND date >= NOW() - INTERVAL '${months} months'
        AND status = 'completed'
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `;
    
    const result = await pool.query(query, [userId]);
    
    return result.rows.map((row: any) => ({
      month: row.month,
      income: parseFloat(row.income),
      expenses: parseFloat(row.expenses),
      netFlow: parseFloat(row.income) - parseFloat(row.expenses),
    }));
  }

  /**
   * Get cash flow trends
   */
  static async getCashFlowTrends(userId: string, months: number = 6): Promise<MonthlyTrend[]> {
    return this.getMonthlyTrends(userId, months);
  }

  /**
   * Get debt trends
   */
  static async getDebtTrends(userId: string, months: number = 6): Promise<MonthlyTrend[]> {
    const query = `
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'i_owe' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'they_owe_me' THEN amount ELSE 0 END), 0) as expenses
      FROM debts
      WHERE user_id = $1 
        AND created_at >= NOW() - INTERVAL '${months} months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month ASC
    `;
    
    const result = await pool.query(query, [userId]);
    
    return result.rows.map((row: any) => ({
      month: row.month,
      income: parseFloat(row.income),
      expenses: parseFloat(row.expenses),
      netFlow: parseFloat(row.income) - parseFloat(row.expenses),
    }));
  }

  /**
   * Get savings trends
   */
  static async getSavingsTrends(userId: string, months: number = 6): Promise<MonthlyTrend[]> {
    const query = `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'savings_deposit' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'savings_withdrawal' THEN amount ELSE 0 END), 0) as expenses
      FROM transactions
      WHERE user_id = $1 
        AND date >= NOW() - INTERVAL '${months} months'
        AND type IN ('savings_deposit', 'savings_withdrawal')
        AND status = 'completed'
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `;
    
    const result = await pool.query(query, [userId]);
    
    return result.rows.map((row: any) => ({
      month: row.month,
      income: parseFloat(row.income),
      expenses: parseFloat(row.expenses),
      netFlow: parseFloat(row.income) - parseFloat(row.expenses),
    }));
  }

  /**
   * Get complete analytics data
   */
  static async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    const [spendingByCategory, monthlyTrends, cashFlowTrends, debtTrends, savingsTrends] = await Promise.all([
      this.getSpendingByCategory(userId),
      this.getMonthlyTrends(userId),
      this.getCashFlowTrends(userId),
      this.getDebtTrends(userId),
      this.getSavingsTrends(userId),
    ]);

    return {
      spendingByCategory,
      monthlyTrends,
      cashFlowTrends,
      debtTrends,
      savingsTrends,
    };
  }
}
