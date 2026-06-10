// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
}

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
