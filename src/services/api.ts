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
          amount: amount,
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

// Auth API
export const authApi = {
  async getUser(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
        };
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('auth_token');
        return {
          success: false,
          error: 'Session expired',
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Auth API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// Debts API
export const debtsApi = {
  async create(data: {
    creditor: string;
    amount: string;
    interestRate: string;
    dueDate: string;
    type: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    try {
      if (!data.creditor || !data.amount || !data.interestRate || !data.dueDate || !data.type) {
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

      const token = localStorage.getItem('auth_token') || 'test_token';
      if (!token) {
        return {
          success: false,
          error: 'Authentication required. Please log in.',
        };
      }

      const response = await fetch(`${API_URL}/debts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          creditor: data.creditor,
          amount: amount,
          remainingBalance: amount,
          interestRate: parseFloat(data.interestRate),
          dueDate: new Date(data.dueDate).toISOString(),
          type: data.type === 'I Owe' ? 'i_owe' : 'they_owe_me',
          status: 'active',
          notes: data.notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || errorData.error || 'Failed to save debt',
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Debt created successfully!',
      };
    } catch (error) {
      console.error('Debt API error:', error);
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

      const response = await fetch(`${API_URL}/debts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch debts');
      }

      const result = await response.json();
      const debts = (result.data || []).map((debt: any) => ({
        ...debt,
        amount: parseFloat(debt.amount),
        remainingBalance: parseFloat(debt.remaining_balance || debt.remainingBalance),
        interestRate: parseFloat(debt.interest_rate || debt.interestRate),
      }));

      return {
        success: true,
        data: debts,
      };
    } catch (error) {
      console.error('Debts API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        data: [],
      };
    }
  },
};
