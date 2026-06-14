import { isPositiveTransactionType } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface TransactionPayload {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Transactions API
export const transactionsApi = {
  async create(data: TransactionPayload): Promise<ApiResponse<any>> {
    try {
      // Validate required fields
      if (!data.date || !data.type || !data.category || !data.amount || !data.description) {
        return {
          success: false,
          error: 'Please fill in all required fields',
        };
      }

      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        return {
          success: false,
          error: 'Amount must be a valid number greater than 0',
        };
      }

      const token = localStorage.getItem('auth_token') || 'test_token'; // Temporary: allow without auth
      if (!token) {
        return {
          success: false,
          error: 'Authentication required. Please log in.',
        };
      }

      // Apply sign based on transaction type
      const isPositive = isPositiveTransactionType(data.type as any);
      const signedAmount = isPositive ? amount : -amount;

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: new Date(data.date).toISOString(),
          type: data.type,
          category: data.category,
          description: data.description,
          amount: signedAmount,
          currency: data.currency || 'PHP',
          status: 'completed',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || errorData.error || 'Failed to save transaction',
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Transaction saved successfully!',
      };
    } catch (error) {
      console.error('Transaction API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },

  async getAll(): Promise<ApiResponse<any[]>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
          data: [],
        };
      }

      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const result = await response.json();
      const transactions = (result.data || []).map((transaction: any) => ({
        ...transaction,
        amount: parseFloat(transaction.amount),
      }));
      
      return {
        success: true,
        data: transactions,
      };
    } catch (error) {
      console.error('Transactions API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        data: [],
      };
    }
  },
};

export const transactionActions = {
  async delete(id: string): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to delete transaction',
        };
      }

      return {
        success: true,
        message: 'Transaction deleted successfully',
      };
    } catch (error) {
      console.error('Delete transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async markAsPaid(id: string, isPaid: boolean, hasReceipt: boolean = false, receiptNote: string = ''): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/transactions/${id}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPaid,
          hasReceipt,
          receiptNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to update payment status',
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result.transaction,
        message: 'Payment status updated successfully',
      };
    } catch (error) {
      console.error('Mark as paid error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// Dashboard API
export const dashboardApi = {
  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Dashboard API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// Analytics API
export const analyticsApi = {
  async getAnalyticsData(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Analytics API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// Debt API
export const debtApi = {
  async create(data: any): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/debts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to create debt',
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Debt created successfully',
      };
    } catch (error) {
      console.error('Debt API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async getAll(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/debts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch debts');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Debt API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// Reports API - uses transactions API for data
export const reportsApi = {
  async getFinancialMetrics(period: string = 'all'): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      // Get all transactions and calculate metrics
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions for reports');
      }

      const result = await response.json();
      const transactions = result.data || [];

      // Calculate financial metrics
      let totalIncome = 0;
      let totalExpense = 0;
      const categoryExpenses: { [key: string]: number } = {};

      transactions.forEach((tx: any) => {
        if (tx.amount > 0) {
          totalIncome += parseFloat(tx.amount);
        } else {
          const expenseAmount = Math.abs(parseFloat(tx.amount));
          totalExpense += expenseAmount;
          const category = tx.category || 'Other';
          categoryExpenses[category] = (categoryExpenses[category] || 0) + expenseAmount;
        }
      });

      const metrics = {
        totalIncome,
        totalExpense,
        netCashFlow: totalIncome - totalExpense,
        categoryExpenses,
        transactionCount: transactions.length,
        period,
      };

      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      console.error('Reports API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async getTransactionReport(period: string = 'all'): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions for reports');
      }

      const result = await response.json();
      let transactions = result.data || [];
      
      // Filter transactions by period if needed
      if (period !== 'all') {
        const now = new Date();
        const periodDate = new Date();
        
        if (period === 'month') {
          periodDate.setMonth(now.getMonth() - 1);
        } else if (period === 'week') {
          periodDate.setDate(now.getDate() - 7);
        } else if (period === 'year') {
          periodDate.setFullYear(now.getFullYear() - 1);
        }
        
        transactions = transactions.filter((tx: any) => {
          const txDate = new Date(tx.date);
          return txDate >= periodDate;
        });
      }

      return {
        success: true,
        data: transactions,
      };
    } catch (error) {
      console.error('Transaction report API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};
