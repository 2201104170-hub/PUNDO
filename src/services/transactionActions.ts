interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
