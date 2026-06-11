import pool from '../config/database.js';
import { MonthlyReview } from '../types/index.js';

export class MonthlyReviewService {
  /**
   * Get monthly financial review for a specific month
   */
  static async getMonthlyReview(userId: string, year: number, month: number): Promise<MonthlyReview> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    // Calculate total income
    const incomeQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'income' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const incomeResult = await pool.query(incomeQuery, [userId, startDate, endDate]);
    const totalIncome = parseFloat(incomeResult.rows[0].total || 0);

    // Calculate total expenses
    const expenseQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const expenseResult = await pool.query(expenseQuery, [userId, startDate, endDate]);
    const totalExpenses = parseFloat(expenseResult.rows[0].total || 0);

    // Calculate total debt added (debt_received transactions)
    const debtAddedQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'debt_received' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const debtAddedResult = await pool.query(debtAddedQuery, [userId, startDate, endDate]);
    const totalDebtAdded = parseFloat(debtAddedResult.rows[0].total || 0);

    // Calculate total debt paid (debt_payment transactions)
    const debtPaidQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'debt_payment' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const debtPaidResult = await pool.query(debtPaidQuery, [userId, startDate, endDate]);
    const totalDebtPaid = parseFloat(debtPaidResult.rows[0].total || 0);

    // Calculate total savings added (savings_deposit transactions)
    const savingsAddedQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'savings_deposit' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const savingsAddedResult = await pool.query(savingsAddedQuery, [userId, startDate, endDate]);
    const totalSavingsAdded = parseFloat(savingsAddedResult.rows[0].total || 0);

    // Calculate total savings withdrawn (savings_withdrawal transactions)
    const savingsWithdrawnQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'savings_withdrawal' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const savingsWithdrawnResult = await pool.query(savingsWithdrawnQuery, [userId, startDate, endDate]);
    const totalSavingsWithdrawn = parseFloat(savingsWithdrawnResult.rows[0].total || 0);

    // Calculate net gain or loss (income - expenses)
    const netGainOrLoss = totalIncome - totalExpenses;

    // Find largest expense category
    const categoryQuery = `
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense' 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `;
    const categoryResult = await pool.query(categoryQuery, [userId, startDate, endDate]);
    const largestExpenseCategory = categoryResult.rows[0]?.category || 'None';

    // Calculate balance change (income - expenses + debt_received - debt_payment - money_lent + debt_collected - savings_deposit + savings_withdrawal)
    const balanceChangeQuery = `
      SELECT COALESCE(SUM(CASE 
        WHEN type IN ('income', 'debt_received', 'debt_collected', 'savings_withdrawal') THEN amount 
        WHEN type IN ('expense', 'debt_payment', 'money_lent', 'savings_deposit') THEN -amount 
        ELSE 0 
      END), 0) as change
      FROM transactions
      WHERE user_id = $1 
        AND status = 'completed'
        AND date >= $2 AND date <= $3
    `;
    const balanceChangeResult = await pool.query(balanceChangeQuery, [userId, startDate, endDate]);
    const balanceChange = parseFloat(balanceChangeResult.rows[0].change || 0);

    return {
      month: monthName,
      year,
      totalIncome,
      totalExpenses,
      totalDebtAdded,
      totalDebtPaid,
      totalSavingsAdded,
      totalSavingsWithdrawn,
      netGainOrLoss,
      largestExpenseCategory,
      balanceChange,
    };
  }

  /**
   * Get monthly reviews for the last N months
   */
  static async getRecentMonthlyReviews(userId: string, months: number = 6): Promise<MonthlyReview[]> {
    const reviews: MonthlyReview[] = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const review = await this.getMonthlyReview(userId, date.getFullYear(), date.getMonth() + 1);
      reviews.push(review);
    }

    return reviews.reverse();
  }
}
