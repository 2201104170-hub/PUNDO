export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  savingsBalance?: number;
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
  type: 'income' | 'expense' | 'debt_received' | 'debt_payment' | 'money_lent' | 'debt_collected' | 'savings_deposit' | 'savings_withdrawal';
  status: 'completed' | 'pending' | 'cancelled';
  currency: 'PHP' | 'USD' | 'EUR';
  debtId?: string;
  isPaid?: boolean;
  hasReceipt?: boolean;
  receiptNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Debt {
  id: string;
  userId: string;
  creditor: string;
  amount: number;
  remainingBalance: number;
  interestRate: number;
  dueDate: Date;
  type: 'i_owe' | 'they_owe_me';
  status: 'active' | 'fully_paid' | 'collected' | 'overdue';
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

export interface GoogleAuthRequest {
  tokenId: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  currency?: string;
}

export interface TransactionRequest {
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'debt_received' | 'debt_payment' | 'money_lent' | 'debt_collected' | 'savings_deposit' | 'savings_withdrawal';
  status?: 'completed' | 'pending' | 'cancelled';
  currency?: 'PHP' | 'USD' | 'EUR';
  debtId?: string;
  isPaid?: boolean;
  hasReceipt?: boolean;
  receiptNote?: string;
}

export interface DebtRequest {
  creditor: string;
  amount: number;
  remainingBalance?: number;
  interestRate: number;
  dueDate: Date;
  type: 'i_owe' | 'they_owe_me';
  status?: 'active' | 'fully_paid' | 'collected' | 'overdue';
  notes?: string;
}

export interface FinancialMetrics {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  totalDebtOwed: number;
  totalDebtReceivable: number;
  savingsBalance: number;
}

export interface DashboardStats {
  metrics: FinancialMetrics;
  recentTransactions: Transaction[];
  upcomingDebts: Debt[];
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
}

export interface AnalyticsData {
  spendingByCategory: CategorySpending[];
  monthlyTrends: MonthlyTrend[];
  cashFlowTrends: MonthlyTrend[];
  debtTrends: MonthlyTrend[];
  savingsTrends: MonthlyTrend[];
}

export interface MonthlyReview {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  totalDebtAdded: number;
  totalDebtPaid: number;
  totalSavingsAdded: number;
  totalSavingsWithdrawn: number;
  netGainOrLoss: number;
  largestExpenseCategory: string;
  balanceChange: number;
}

export interface Insight {
  type: 'spending' | 'income' | 'debt' | 'savings' | 'warning';
  title: string;
  description: string;
  value?: number;
  trend?: 'up' | 'down' | 'neutral';
}
