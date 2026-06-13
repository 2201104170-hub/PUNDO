import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button, AddTransactionModal } from '../components';
import { NavItem } from '../types';
import { transactionsApi } from '../services/api';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  status: string;
  currency?: string;
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
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2024-01-15', description: 'Salary Deposit', amount: 4500, category: 'Income', type: 'income', status: 'completed' },
    { id: '2', date: '2024-01-14', description: 'Grocery Store', amount: -125.50, category: 'Food', type: 'expense', status: 'completed' },
    { id: '3', date: '2024-01-13', description: 'Electric Bill', amount: -89.00, category: 'Utilities', type: 'expense', status: 'completed' },
    { id: '4', date: '2024-01-12', description: 'Restaurant', amount: -45.30, category: 'Dining', type: 'expense', status: 'completed' },
    { id: '5', date: '2024-01-11', description: 'Gas', amount: -52.00, category: 'Transport', type: 'expense', status: 'completed' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

        // Add the new transaction to the list
        const amount = data.type === 'income' ? parseFloat(data.amount) : -parseFloat(data.amount);
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          date: data.date,
          type: data.type,
          category: data.category,
          description: data.description,
          amount: amount,
          currency: data.currency || 'PHP',
          status: 'completed',
        };

        setTransactions((prev) => [newTransaction, ...prev]);

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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-on-surface-variant">
                    <p className="font-body-md">No transactions found matching your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
