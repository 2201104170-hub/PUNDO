export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'cancelled';
  currency: 'PHP' | 'USD' | 'EUR';
  createdAt: Date;
  updatedAt: Date;
}

export interface Debt {
  id: string;
  userId: string;
  creditor: string;
  amount: number;
  interestRate: number;
  dueDate: Date;
  type: 'i_owe' | 'they_owe_me' | 'loan';
  status: 'active' | 'paid' | 'overdue';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  id: string;
  email: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface TransactionRequest {
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status?: 'completed' | 'pending' | 'cancelled';
  currency?: 'PHP' | 'USD' | 'EUR';
}

export interface DebtRequest {
  creditor: string;
  amount: number;
  interestRate: number;
  dueDate: Date;
  type: 'i_owe' | 'they_owe_me' | 'loan';
  status?: 'active' | 'paid' | 'overdue';
  notes?: string;
}

export interface FinancialMetrics {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  netFlow: number;
  totalDebt: number;
}

export interface DashboardStats {
  metrics: FinancialMetrics;
  recentTransactions: Transaction[];
  upcomingDebts: Debt[];
}
