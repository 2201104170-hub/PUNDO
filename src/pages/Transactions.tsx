import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button, AddTransactionModal } from '../components';
import { NavItem } from '../types';
import { transactionsApi } from '../services/api';
import { transactionActions } from '../services/transactionActions';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  status: string;
  currency?: string;
  isPaid?: boolean;
  hasReceipt?: boolean;
  receiptNote?: string;
}

interface TransactionFormData {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
}

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(searchParams.get('modal') === 'add');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions', active: true },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  // Get unique categories from transactions
  const getCategories = (): string[] => {
    const categories = new Set(transactions.map(t => t.category));
    return Array.from(categories).sort();
  };

  // Filter transactions based on search term and category
  const getFilteredTransactions = (): Transaction[] => {
    return transactions.filter(transaction => {
      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower) ||
        transaction.date.includes(searchTerm);

      // Filter by category
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Fetch transactions from backend on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await transactionsApi.getAll();
        if (response.success && response.data) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleOpenModal = () => {
    setShowAddModal(true);
    navigate('/transactions?modal=add');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    navigate('/transactions');
    setMessage(null);
  };

  const handleSubmitTransaction = async (data: TransactionFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await transactionsApi.create(data);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Transaction saved successfully!',
        });

        // Refresh transactions
        const updatedResponse = await transactionsApi.getAll();
        if (updatedResponse.success && updatedResponse.data) {
          setTransactions(updatedResponse.data);
        }

        // Close modal after 1.5 seconds
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to save transaction',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await transactionActions.delete(id);
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Transaction deleted successfully',
        });
        // Refresh transactions
        const updatedResponse = await transactionsApi.getAll();
        if (updatedResponse.success && updatedResponse.data) {
          setTransactions(updatedResponse.data);
        }
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to delete transaction',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };

  const handleConfirmPayment = async (hasReceipt: boolean, receiptNote: string) => {
    if (!selectedTransaction) return;

    setIsLoading(true);
    try {
      const response = await transactionActions.markAsPaid(
        selectedTransaction.id,
        !selectedTransaction.isPaid,
        hasReceipt,
        receiptNote
      );
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: selectedTransaction.isPaid 
            ? 'Transaction marked as unpaid' 
            : 'Transaction marked as paid',
        });
        // Refresh transactions
        const updatedResponse = await transactionsApi.getAll();
        if (updatedResponse.success && updatedResponse.data) {
          setTransactions(updatedResponse.data);
        }
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to update payment status',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
      setShowReceiptModal(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      onLogout={() => navigate('/login')}
    >
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Transactions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            View and manage all your transactions.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenModal}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Transaction
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          <span className="material-symbols-outlined">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="font-body-md">{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {getCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-4 px-4 font-label-md text-label-md text-on-surface-variant">Date</th>
                <th className="text-left py-4 px-4 font-label-md text-label-md text-on-surface-variant">Description</th>
                <th className="text-left py-4 px-4 font-label-md text-label-md text-on-surface-variant">Category</th>
                <th className="text-right py-4 px-4 font-label-md text-label-md text-on-surface-variant">Amount</th>
                <th className="text-center py-4 px-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                <th className="text-center py-4 px-4 font-label-md text-label-md text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                    <td className="py-4 px-4 font-body-md text-body-md text-on-surface">
                      {transaction.date}
                    </td>
                    <td className="py-4 px-4 font-body-md text-body-md text-on-surface">
                      {transaction.description}
                    </td>
                    <td className="py-4 px-4 font-body-md text-body-md text-on-surface-variant">
                      {transaction.category}
                    </td>
                    <td className={`py-4 px-4 font-headline-md text-headline-md text-right ${
                      transaction.amount > 0 ? 'text-secondary' : 'text-on-surface'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{(typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount)).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {transaction.isPaid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">
                          <span className="material-symbols-outlined text-[14px]">pending</span>
                          Pending
                        </span>
                      )}
                      {transaction.hasReceipt && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          <span className="material-symbols-outlined text-[14px]">receipt</span>
                          Receipt
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleMarkAsPaid(transaction)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={transaction.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {transaction.isPaid ? 'cancel' : 'check_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete transaction"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-on-surface-variant">
                    <p className="font-body-md">No transactions found matching your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
              {selectedTransaction.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              {selectedTransaction.description} - {(typeof selectedTransaction.amount === 'number' ? selectedTransaction.amount : parseFloat(selectedTransaction.amount)).toFixed(2)}
            </p>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="hasReceipt"
                  onChange={(e) => {
                    setSelectedTransaction({
                      ...selectedTransaction,
                      hasReceipt: e.target.checked
                    });
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="font-body-md text-body-md text-on-surface">
                  I have a receipt for this transaction
                </span>
              </label>
            </div>

            {selectedTransaction.hasReceipt && (
              <div className="mb-4">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                  Receipt Note (optional)
                </label>
                <textarea
                  id="receiptNote"
                  placeholder="Add any notes about the receipt..."
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  rows={3}
                  value={selectedTransaction.receiptNote || ''}
                  onChange={(e) => {
                    setSelectedTransaction({
                      ...selectedTransaction,
                      receiptNote: e.target.value
                    });
                  }}
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setShowReceiptModal(false);
                  setSelectedTransaction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleConfirmPayment(selectedTransaction.hasReceipt || false, selectedTransaction.receiptNote || '')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (selectedTransaction.isPaid ? 'Mark as Unpaid' : 'Mark as Paid')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default Transactions;
