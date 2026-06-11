import pool from '../config/database.js';
import { User } from '../types/index.js';

export class UserModel {
  static async create(email: string, password: string, name: string): Promise<User> {
    const query = `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, password, name, avatar, savings_balance, created_at, updated_at
    `;

    const result = await pool.query(query, [email, password, name]);
    const row = result.rows[0];

    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      avatar: row.avatar,
      savingsBalance: parseFloat(row.savings_balance || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      avatar: row.avatar,
      savingsBalance: parseFloat(row.savings_balance || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      avatar: row.avatar,
      savingsBalance: parseFloat(row.savings_balance || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async update(id: string, data: Partial<User>): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.avatar !== undefined) {
      fields.push(`avatar = $${paramCount++}`);
      values.push(data.avatar);
    }
    if (data.savingsBalance !== undefined) {
      fields.push(`savings_balance = $${paramCount++}`);
      values.push(data.savingsBalance);
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, email, password, name, avatar, savings_balance, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    const row = result.rows[0];

    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      avatar: row.avatar,
      savingsBalance: parseFloat(row.savings_balance || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
