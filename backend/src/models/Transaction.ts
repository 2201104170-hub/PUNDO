import pool from '../config/database.js';
import { Transaction, TransactionRequest } from '../types/index.js';

export class TransactionModel {
  static async create(userId: string, data: TransactionRequest): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (user_id, date, description, amount, category, type, status, currency, debt_id, is_paid, has_receipt, receipt_note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, user_id, date, description, amount, category, type, status, currency, debt_id, is_paid, has_receipt, receipt_note, created_at, updated_at
    `;

    const result = await pool.query(query, [
      userId,
      data.date,
      data.description,
      data.amount,
      data.category,
      data.type,
      data.status || 'completed',
      data.currency || 'PHP',
      data.debtId || null,
      data.isPaid || false,
      data.hasReceipt || false,
      data.receiptNote || null,
    ]);

    return this.mapRow(result.rows[0]);
  }

  static async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<Transaction[]> {
    const query = `
      SELECT * FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows.map((row: any) => this.mapRow(row));
  }

  static async findById(id: string, userId: string): Promise<Transaction | null> {
    const query = `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  static async update(id: string, userId: string, data: Partial<TransactionRequest>): Promise<Transaction> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.date !== undefined) {
      fields.push(`date = $${paramCount++}`);
      values.push(data.date);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.amount !== undefined) {
      fields.push(`amount = $${paramCount++}`);
      values.push(data.amount);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(data.category);
    }
    if (data.type !== undefined) {
      fields.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.isPaid !== undefined) {
      fields.push(`is_paid = $${paramCount++}`);
      values.push(data.isPaid);
    }
    if (data.hasReceipt !== undefined) {
      fields.push(`has_receipt = $${paramCount++}`);
      values.push(data.hasReceipt);
    }
    if (data.receiptNote !== undefined) {
      fields.push(`receipt_note = $${paramCount++}`);
      values.push(data.receiptNote);
    }

    values.push(id, userId);
    const query = `
      UPDATE transactions
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount++} AND user_id = $${paramCount}
      RETURNING id, user_id, date, description, amount, category, type, status, currency, debt_id, is_paid, has_receipt, receipt_note, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return this.mapRow(result.rows[0]);
  }

  static async delete(id: string, userId: string): Promise<void> {
    const query = `DELETE FROM transactions WHERE id = $1 AND user_id = $2`;
    await pool.query(query, [id, userId]);
  }

  static async getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    const query = `
      SELECT * FROM transactions
      WHERE user_id = $1 AND date >= $2 AND date <= $3
      ORDER BY date DESC
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows.map((row: any) => this.mapRow(row));
  }

  private static mapRow(row: any): Transaction {
    return {
      id: row.id,
      userId: row.user_id,
      date: row.date,
      description: row.description,
      amount: row.amount,
      category: row.category,
      type: row.type,
      status: row.status,
      currency: row.currency,
      debtId: row.debt_id,
      isPaid: row.is_paid,
      hasReceipt: row.has_receipt,
      receiptNote: row.receipt_note,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
