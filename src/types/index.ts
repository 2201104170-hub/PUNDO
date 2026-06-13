// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type TransactionType = 
  | 'income' 
  | 'expense' 
  | 'debt_received' 
  | 'debt_payment' 
  | 'money_lent' 
  | 'debt_collected' 
  | 'savings_deposit' 
  | 'savings_withdrawal';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  status: 'completed' | 'pending';
}

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'income', label: 'Income', icon: 'trending_up', color: 'text-green-600' },
  { value: 'expense', label: 'Expense', icon: 'trending_down', color: 'text-red-600' },
  { value: 'debt_payment', label: 'Debt Payment', icon: 'payment', color: 'text-blue-600' },
  { value: 'debt_received', label: 'Debt Received', icon: 'download', color: 'text-green-600' },
  { value: 'money_lent', label: 'Money Lent', icon: 'upload', color: 'text-orange-600' },
  { value: 'debt_collected', label: 'Debt Collected', icon: 'attach_money', color: 'text-green-600' },
  { value: 'savings_deposit', label: 'Savings Deposit', icon: 'savings', color: 'text-blue-600' },
  { value: 'savings_withdrawal', label: 'Savings Withdrawal', icon: 'withdraw', color: 'text-red-600' },
];

export const TRANSACTION_CATEGORIES: Record<string, string[]> = {
  income: ['Salary', 'Freelance', 'Bonus', 'Investment Income', 'Refund', 'Gift', 'Interest'],
  expense: ['Groceries', 'Utilities', 'Rent/Mortgage', 'Dining', 'Transportation', 'Entertainment', 'Healthcare', 'Subscription', 'Shopping', 'Other'],
  debt_payment: ['Loan Payment', 'Credit Card Payment', 'Personal Debt', 'Medical Debt'],
  debt_received: ['Loan Received', 'Credit', 'Advance', 'Borrowed Amount'],
  money_lent: ['Personal Loan', 'Advance Given', 'Investment'],
  debt_collected: ['Loan Returned', 'Debt Settled', 'Repayment'],
  savings_deposit: ['Savings Account', 'Investment Fund', 'Emergency Fund'],
  savings_withdrawal: ['Savings Withdrawal', 'Fund Transfer', 'Investment Liquidation'],
};

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  interestRate: number;
  dueDate: string;
  status: 'active' | 'paid';
}

export interface FinancialMetrics {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  netFlow: number;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  bgColor?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}
