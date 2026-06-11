import pool from '../config/database.js';
import { Debt, DebtRequest } from '../types/index.js';

export class DebtModel {
  static async create(userId: string, data: DebtRequest): Promise<Debt> {
    const query = `
      INSERT INTO debts (user_id, creditor, amount, remaining_balance, interest_rate, due_date, type, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, user_id, creditor, amount, remaining_balance, interest_rate, due_date, type, status, notes, created_at, updated_at
    `;

    const result = await pool.query(query, [
      userId,
      data.creditor,
      data.amount,
      data.remainingBalance ?? data.amount,
      data.interestRate,
      data.dueDate,
      data.type,
      data.status || 'active',
      data.notes,
    ]);

    return this.mapRow(result.rows[0]);
  }

  static async findByUserId(userId: string): Promise<Debt[]> {
    const query = `
      SELECT * FROM debts
      WHERE user_id = $1
      ORDER BY due_date ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map((row: any) => this.mapRow(row));
  }

  static async findById(id: string, userId: string): Promise<Debt | null> {
    const query = `SELECT * FROM debts WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  static async update(id: string, userId: string, data: Partial<DebtRequest>): Promise<Debt> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.creditor !== undefined) {
      fields.push(`creditor = $${paramCount++}`);
      values.push(data.creditor);
    }
    if (data.amount !== undefined) {
      fields.push(`amount = $${paramCount++}`);
      values.push(data.amount);
    }
    if (data.remainingBalance !== undefined) {
      fields.push(`remaining_balance = $${paramCount++}`);
      values.push(data.remainingBalance);
    }
    if (data.interestRate !== undefined) {
      fields.push(`interest_rate = $${paramCount++}`);
      values.push(data.interestRate);
    }
    if (data.dueDate !== undefined) {
      fields.push(`due_date = $${paramCount++}`);
      values.push(data.dueDate);
    }
    if (data.type !== undefined) {
      fields.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(data.notes);
    }

    values.push(id, userId);
    const query = `
      UPDATE debts
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount++} AND user_id = $${paramCount}
      RETURNING id, user_id, creditor, amount, remaining_balance, interest_rate, due_date, type, status, notes, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return this.mapRow(result.rows[0]);
  }

  static async delete(id: string, userId: string): Promise<void> {
    const query = `DELETE FROM debts WHERE id = $1 AND user_id = $2`;
    await pool.query(query, [id, userId]);
  }

  static async getActiveDebts(userId: string): Promise<Debt[]> {
    const query = `
      SELECT * FROM debts
      WHERE user_id = $1 AND status = 'active'
      ORDER BY due_date ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map((row: any) => this.mapRow(row));
  }

  private static mapRow(row: any): Debt {
    return {
      id: row.id,
      userId: row.user_id,
      creditor: row.creditor,
      amount: parseFloat(row.amount),
      remainingBalance: parseFloat(row.remaining_balance),
      interestRate: parseFloat(row.interest_rate),
      dueDate: row.due_date,
      type: row.type,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
