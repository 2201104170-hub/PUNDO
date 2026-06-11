import pool from '../config/database.js';
import { Insight } from '../types/index.js';

export class InsightsService {
  /**
   * Get most spent category
   */
  static async getMostSpentCategory(userId: string): Promise<Insight | null> {
    const query = `
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense' 
        AND status = 'completed'
        AND date >= NOW() - INTERVAL '30 days'
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      type: 'spending',
      title: 'Most Spent Category',
      description: `You spent the most on ${row.category} this month.`,
      value: parseFloat(row.total),
      trend: 'neutral',
    };
  }

  /**
   * Get highest spending day
   */
  static async getHighestSpendingDay(userId: string): Promise<Insight | null> {
    const query = `
      SELECT TO_CHAR(date, 'Day') as day_name, SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense' 
        AND status = 'completed'
        AND date >= NOW() - INTERVAL '30 days'
      GROUP BY TO_CHAR(date, 'Day'), EXTRACT(DOW FROM date)
      ORDER BY total DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      type: 'spending',
      title: 'Highest Spending Day',
      description: `You spend the most on ${row.day_name.trim()}.`,
      value: parseFloat(row.total),
      trend: 'neutral',
    };
  }

  /**
   * Get largest income source
   */
  static async getLargestIncomeSource(userId: string): Promise<Insight | null> {
    const query = `
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'income' 
        AND status = 'completed'
        AND date >= NOW() - INTERVAL '30 days'
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      type: 'income',
      title: 'Largest Income Source',
      description: `Your largest income source is ${row.category}.`,
      value: parseFloat(row.total),
      trend: 'neutral',
    };
  }

  /**
   * Compare spending with previous month
   */
  static async getSpendingComparison(userId: string): Promise<Insight | null> {
    const currentMonthQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense' 
        AND status = 'completed'
        AND date >= DATE_TRUNC('month', NOW())
    `;
    
    const previousMonthQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense' 
        AND status = 'completed'
        AND date >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
        AND date < DATE_TRUNC('month', NOW())
    `;
    
    const [currentResult, previousResult] = await Promise.all([
      pool.query(currentMonthQuery, [userId]),
      pool.query(previousMonthQuery, [userId]),
    ]);
    
    const currentSpending = parseFloat(currentResult.rows[0].total || 0);
    const previousSpending = parseFloat(previousResult.rows[0].total || 0);
    
    if (previousSpending === 0) return null;
    
    const change = ((currentSpending - previousSpending) / previousSpending) * 100;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    return {
      type: 'spending',
      title: 'Spending Comparison',
      description: `Your spending is ${change > 0 ? 'up' : 'down'} by ${Math.abs(change).toFixed(1)}% compared to last month.`,
      value: Math.abs(change),
      trend,
    };
  }

  /**
   * Get debt warnings
   */
  static async getDebtWarnings(userId: string): Promise<Insight[]> {
    const insights: Insight[] = [];
    
    // Check for overdue debts
    const overdueQuery = `
      SELECT COUNT(*) as count, COALESCE(SUM(remaining_balance), 0) as total
      FROM debts
      WHERE user_id = $1 
        AND type = 'i_owe' 
        AND status = 'active'
        AND due_date < NOW()
    `;
    
    const overdueResult = await pool.query(overdueQuery, [userId]);
    const overdueCount = parseInt(overdueResult.rows[0].count || 0);
    const overdueTotal = parseFloat(overdueResult.rows[0].total || 0);
    
    if (overdueCount > 0) {
      insights.push({
        type: 'warning',
        title: 'Overdue Debts',
        description: `You have ${overdueCount} overdue debt(s) totaling ₱${overdueTotal.toFixed(2)}.`,
        value: overdueTotal,
        trend: 'up',
      });
    }
    
    // Check for debts due soon (within 7 days)
    const dueSoonQuery = `
      SELECT COUNT(*) as count, COALESCE(SUM(remaining_balance), 0) as total
      FROM debts
      WHERE user_id = $1 
        AND type = 'i_owe' 
        AND status = 'active'
        AND due_date >= NOW()
        AND due_date <= NOW() + INTERVAL '7 days'
    `;
    
    const dueSoonResult = await pool.query(dueSoonQuery, [userId]);
    const dueSoonCount = parseInt(dueSoonResult.rows[0].count || 0);
    const dueSoonTotal = parseFloat(dueSoonResult.rows[0].total || 0);
    
    if (dueSoonCount > 0) {
      insights.push({
        type: 'warning',
        title: 'Upcoming Debt Payments',
        description: `You have ${dueSoonCount} debt payment(s) due within 7 days totaling ₱${dueSoonTotal.toFixed(2)}.`,
        value: dueSoonTotal,
        trend: 'neutral',
      });
    }
    
    return insights;
  }

  /**
   * Get savings progress
   */
  static async getSavingsProgress(userId: string): Promise<Insight | null> {
    const query = `
      SELECT savings_balance
      FROM users
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    const savingsBalance = parseFloat(result.rows[0]?.savings_balance || 0);
    
    if (savingsBalance === 0) return null;
    
    // Get savings this month
    const monthlySavingsQuery = `
      SELECT COALESCE(SUM(CASE 
        WHEN type = 'savings_deposit' THEN amount 
        WHEN type = 'savings_withdrawal' THEN -amount 
        ELSE 0 
      END), 0) as total
      FROM transactions
      WHERE user_id = $1 
        AND type IN ('savings_deposit', 'savings_withdrawal')
        AND status = 'completed'
        AND date >= DATE_TRUNC('month', NOW())
    `;
    
    const monthlySavingsResult = await pool.query(monthlySavingsQuery, [userId]);
    const monthlySavings = parseFloat(monthlySavingsResult.rows[0].total || 0);
    
    const trend = monthlySavings > 0 ? 'up' : monthlySavings < 0 ? 'down' : 'neutral';
    
    return {
      type: 'savings',
      title: 'Savings Progress',
      description: `Your current savings balance is ₱${savingsBalance.toFixed(2)}. ${monthlySavings > 0 ? `You added ₱${monthlySavings.toFixed(2)} this month.` : monthlySavings < 0 ? `You withdrew ₱${Math.abs(monthlySavings).toFixed(2)} this month.` : 'No change this month.'}`,
      value: savingsBalance,
      trend,
    };
  }

  /**
   * Get all insights for a user
   */
  static async getAllInsights(userId: string): Promise<Insight[]> {
    const insights: Insight[] = [];
    
    const [mostSpentCategory, highestSpendingDay, largestIncomeSource, spendingComparison, debtWarnings, savingsProgress] = await Promise.all([
      this.getMostSpentCategory(userId),
      this.getHighestSpendingDay(userId),
      this.getLargestIncomeSource(userId),
      this.getSpendingComparison(userId),
      this.getDebtWarnings(userId),
      this.getSavingsProgress(userId),
    ]);
    
    if (mostSpentCategory) insights.push(mostSpentCategory);
    if (highestSpendingDay) insights.push(highestSpendingDay);
    if (largestIncomeSource) insights.push(largestIncomeSource);
    if (spendingComparison) insights.push(spendingComparison);
    insights.push(...debtWarnings);
    if (savingsProgress) insights.push(savingsProgress);
    
    return insights;
  }
}
