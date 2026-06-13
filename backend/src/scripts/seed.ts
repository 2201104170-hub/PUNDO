import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Starting database seeding...');

    const client = await pool.connect();

    // Create test user with fixed UUID to match auth middleware
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUserId = '123e4567-e89b-12d3-a456-426614174000';
    
    const userResult = await client.query(
      `INSERT INTO users (id, email, password, name, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [testUserId, 'test@example.com', hashedPassword, 'Test User', null]
    );

    const userId = userResult.rows[0].id;

    // Create sample transactions
    const transactionsData = [
      {
        date: new Date('2024-01-15'),
        description: 'Salary',
        amount: 5000,
        category: 'Income',
        type: 'income',
      },
      {
        date: new Date('2024-01-20'),
        description: 'Grocery Shopping',
        amount: 150,
        category: 'Food & Dining',
        type: 'expense',
      },
      {
        date: new Date('2024-01-22'),
        description: 'Electric Bill',
        amount: 80,
        category: 'Utilities',
        type: 'expense',
      },
      {
        date: new Date('2024-01-25'),
        description: 'Freelance Project',
        amount: 1000,
        category: 'Income',
        type: 'income',
      },
    ];

    for (const transaction of transactionsData) {
      await client.query(
        `INSERT INTO transactions (user_id, date, description, amount, category, type, status, currency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, transaction.date, transaction.description, transaction.amount, transaction.category, transaction.type, 'completed', 'PHP']
      );
    }

    // Create sample debts
    const debtsData = [
      {
        creditor: 'Bank of America',
        amount: 5000,
        interestRate: 6.5,
        dueDate: new Date('2024-02-15'),
        type: 'i_owe',
      },
      {
        creditor: 'Chase Credit Card',
        amount: 2300,
        interestRate: 18.9,
        dueDate: new Date('2024-01-20'),
        type: 'i_owe',
      },
    ];

    for (const debt of debtsData) {
      await client.query(
        `INSERT INTO debts (user_id, creditor, amount, remaining_balance, interest_rate, due_date, type, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, debt.creditor, debt.amount, debt.amount, debt.interestRate, debt.dueDate, debt.type, 'active']
      );
    }

    client.release();

    console.log('✅ Database seeding completed successfully');
    console.log('Test user: test@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seed();
