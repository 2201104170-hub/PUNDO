import pool from '../config/database.js';

const addPaymentStatusSQL = `
-- Add payment status fields to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_receipt BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS receipt_note TEXT;
`;

async function migrate() {
  try {
    console.log('Adding payment status fields to transactions table...');
    
    const client = await pool.connect();
    await client.query(addPaymentStatusSQL);
    client.release();

    console.log('✅ Payment status fields added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
