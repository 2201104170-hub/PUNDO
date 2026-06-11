import pool from '../config/database.js';
import { Transaction } from '../types/index.js';

export class FinancialService {
  /**
   * Calculate current balance based on all transactions
   * Income: +balance
   * Expense: -balance
   * Debt Received: +balance
   * Debt Payment: -balance
   * Money Lent: -balance
   * Debt Collected: +balance
   * Savings Deposit: -balance (from available cash)
   * Savings Withdrawal: +balance (to available cash)
   */
  static async calculateCurrentBalance(userId: string): Promise<number> {
    const query = `
      SELECT 
        COALESCE(SUM(CASE 
          WHEN type IN ('income', 'debt_received', 'debt_collected', 'savings_withdrawal') 
          THEN amount 
          ELSE -amount 
        END), 0) as balance
      FROM transactions
      WHERE user_id = $1 AND status = 'completed'
    `;
    
    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].balance || 0);
  }

  /**
   * Calculate total income
   */
  static async calculateTotalIncome(userId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 AND type = 'income' AND status = 'completed'
    `;
    
    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].total || 0);
  }

  /**
   * Calculate total expenses
   */
  static async calculateTotalExpenses(userId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = $1 AND type = 'expense' AND status = 'completed'
    `;
    
    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].total || 0);
  }

  /**
   * Calculate net cash flow (income - expenses)
   */
  static async calculateNetCashFlow(userId: string): Promise<number> {
    const income = await this.calculateTotalIncome(userId);
    const expenses = await this.calculateTotalExpenses(userId);
    return income - expenses;
  }

  /**
   * Calculate total debt owed (i_owe debts with remaining balance)
   */
  static async calculateTotalDebtOwed(userId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(remaining_balance), 0) as total
      FROM debts
      WHERE user_id = $1 AND type = 'i_owe' AND status IN ('active', 'overdue')
    `;
    
    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].total || 0);
  }

  /**
   * Calculate total debt receivable (they_owe_me debts with remaining balance)
   */
  static async calculateTotalDebtReceivable(userId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(remaining_balance), 0) as total
      FROM debts
      WHERE user_id = $1 AND type = 'they_owe_me' AND status IN ('active', 'overdue')
    `;
    
    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].total || 0);
  }

  /**
   * Update user savings balance based on savings transactions
   */
  static async updateSavingsBalance(userId: string): Promise<void> {
    const query = `
      SELECT COALESCE(SUM(CASE 
        WHEN type = 'savings_deposit' THEN amount 
        WHEN type = 'savings_withdrawal' THEN -amount 
        ELSE 0 
      END), 0) as savings_balance
      FROM transactions
      WHERE user_id = $1 AND type IN ('savings_deposit', 'savings_withdrawal') AND status = 'completed'
    `;
    
    const result = await pool.query(query, [userId]);
    const savingsBalance = parseFloat(result.rows[0].savings_balance || 0);
    
    await pool.query(
      'UPDATE users SET savings_balance = $1, updated_at = NOW() WHERE id = $2',
      [savingsBalance, userId]
    );
  }

  /**
   * Update debt remaining balance and status based on transactions
   */
  static async updateDebtBalance(debtId: string): Promise<void> {
    // Calculate total payments made against this debt
    const query = `
      SELECT COALESCE(SUM(CASE 
        WHEN type = 'debt_payment' THEN amount 
        WHEN type = 'debt_collected' THEN amount 
        ELSE 0 
      END), 0) as total_paid
      FROM transactions
      WHERE debt_id = $1 AND status = 'completed'
    `;
    
    const result = await pool.query(query, [debtId]);
    const totalPaid = parseFloat(result.rows[0].total_paid || 0);
    
    // Get the original debt amount
    const debtQuery = 'SELECT amount, type FROM debts WHERE id = $1';
    const debtResult = await pool.query(debtQuery, [debtId]);
    
    if (debtResult.rows.length === 0) return;
    
    const originalAmount = parseFloat(debtResult.rows[0].amount);
    const debtType = debtResult.rows[0].type;
    
    const remainingBalance = originalAmount - totalPaid;
    
    // Determine new status
    let newStatus = 'active';
    if (remainingBalance <= 0) {
      newStatus = debtType === 'i_owe' ? 'fully_paid' : 'collected';
    }
    
    // Update debt
    await pool.query(
      'UPDATE debts SET remaining_balance = $1, status = $2, updated_at = NOW() WHERE id = $3',
      [Math.max(0, remainingBalance), newStatus, debtId]
    );
  }

  /**
   * Process transaction and update all related balances
   */
  static async processTransaction(transaction: Transaction): Promise<void> {
    // Update savings balance if this is a savings transaction
    if (transaction.type === 'savings_deposit' || transaction.type === 'savings_withdrawal') {
      await this.updateSavingsBalance(transaction.userId);
    }
    
    // Update debt balance if this transaction is linked to a debt
    if (transaction.debtId && (transaction.type === 'debt_payment' || transaction.type === 'debt_collected')) {
      await this.updateDebtBalance(transaction.debtId);
    }
  }

  /**
   * Get complete financial metrics for a user
   */
  static async getFinancialMetrics(userId: string) {
    const [currentBalance, totalIncome, totalExpenses, netCashFlow, totalDebtOwed, totalDebtReceivable] = await Promise.all([
      this.calculateCurrentBalance(userId),
      this.calculateTotalIncome(userId),
      this.calculateTotalExpenses(userId),
      this.calculateNetCashFlow(userId),
      this.calculateTotalDebtOwed(userId),
      this.calculateTotalDebtReceivable(userId),
    ]);

    // Get savings balance from user record
    const userQuery = 'SELECT savings_balance FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    const savingsBalance = parseFloat(userResult.rows[0]?.savings_balance || 0);

    return {
      currentBalance,
      totalIncome,
      totalExpenses,
      netCashFlow,
      totalDebtOwed,
      totalDebtReceivable,
      savingsBalance,
    };
  }
}
