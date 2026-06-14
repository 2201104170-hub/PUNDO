import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, DashboardCard, Card } from '../components';
import { DashboardCard as DashboardCardType, NavItem } from '../types';
import { dashboardApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for dashboard data
  const [dashboardCards, setDashboardCards] = useState<DashboardCardType[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', active: true },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getDashboardStats();

      if (response.success && response.data) {
        const { metrics, recentTransactions: txns } = response.data;

        // Calculate monthly metrics from recent transactions
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyTxns = (txns || []).filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        const monthlyIncome = monthlyTxns
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + (typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount) || 0), 0);

        const monthlyExpenses = monthlyTxns
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + Math.abs(typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount) || 0), 0);

        // Calculate savings rate: (totalIncome - totalExpenses) / totalIncome * 100
        const savingsRate = metrics.totalIncome > 0 
          ? ((metrics.totalIncome - metrics.totalExpenses) / metrics.totalIncome) * 100
          : 0;

        // Build dashboard cards from metrics
        const cards: DashboardCardType[] = [
          {
            id: '1',
            title: 'Total Balance',
            value: `$${typeof metrics.currentBalance === 'number' ? metrics.currentBalance.toFixed(2) : parseFloat(metrics.currentBalance || '0').toFixed(2)}`,
            icon: 'account_balance_wallet',
            trend: { value: 0, direction: 'neutral' },
            bgColor: 'bg-primary-container/20',
          },
          {
            id: '2',
            title: 'Monthly Income',
            value: `$${typeof monthlyIncome === 'number' ? monthlyIncome.toFixed(2) : '0.00'}`,
            icon: 'trending_up',
            trend: { value: 0, direction: 'neutral' },
            bgColor: 'bg-secondary-container/20',
          },
          {
            id: '3',
            title: 'Monthly Expenses',
            value: `$${typeof monthlyExpenses === 'number' ? monthlyExpenses.toFixed(2) : '0.00'}`,
            icon: 'trending_down',
            trend: { value: 0, direction: 'neutral' },
            bgColor: 'bg-tertiary-container/20',
          },
          {
            id: '4',
            title: 'Savings Rate',
            value: `${typeof savingsRate === 'number' ? savingsRate.toFixed(1) : '0.0'}%`,
            icon: 'savings',
            bgColor: 'bg-primary-container/20',
          },
        ];

        setDashboardCards(cards);

        // Format recent transactions
        const formattedTransactions = (txns || []).map((tx: any, idx: number) => ({
          id: tx.id || idx.toString(),
          description: tx.description || 'Transaction',
          amount: tx.type === 'income' ? `+$${Math.abs(typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount) || 0).toFixed(2)}` : `-$${Math.abs(typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount) || 0).toFixed(2)}`,
          date: formatDate(new Date(tx.date)),
          category: tx.category || 'Other',
          type: tx.type || 'expense',
        }));

        setRecentTransactions(formattedTransactions);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
      
      // Set default empty state
      setDashboardCards([]);
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        onLogout={() => navigate('/login')}
      >
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-on-surface-variant">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      onLogout={() => navigate('/login')}
    >
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Dashboard Overview
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Welcome back, {user?.firstName || 'User'}. Here's your financial summary.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/transactions?modal=add')}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Transaction
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-8">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} card={card} />
        ))}
      </div>

      {/* Recent Transactions Card */}
      <Card title="Recent Transactions">
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-secondary-container/20'
                      : 'bg-error-container/20'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      transaction.type === 'income'
                        ? 'text-secondary'
                        : 'text-error'
                    }`}>
                      {transaction.type === 'income' ? 'trending_up' : 'trending_down'}
                    </span>
                  </div>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface font-medium">
                      {transaction.description}
                    </p>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-body-md text-body-md font-semibold ${
                    transaction.type === 'income' ? 'text-secondary' : 'text-error'
                  }`}>
                    {transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-on-surface-variant mb-4">No transactions yet. Add one to get started!</p>
            <Button variant="primary" size="md" onClick={() => navigate('/transactions?modal=add')}>
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Transaction
            </Button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
