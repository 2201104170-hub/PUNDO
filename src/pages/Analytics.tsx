import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card } from '../components';
import { NavItem } from '../types';
import { analyticsApi } from '../services/api';

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  netFlow?: number;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics data states
  const [spendingByCategory, setSpendingByCategory] = useState<CategorySpending[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Calculated metrics
  const [avgDailySpend, setAvgDailySpend] = useState(0);
  const [highestExpenseDay, setHighestExpenseDay] = useState('');
  const [mostUsedCategory, setMostUsedCategory] = useState('');
  const [budgetRemaining, setBudgetRemaining] = useState(0);

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics', active: true },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [spendingRes, trendsRes, transactionsRes] = await Promise.all([
        analyticsApi.getSpendingByCategory(),
        analyticsApi.getMonthlyTrends(3),
        analyticsApi.getAllTransactions(),
      ]);

      // Handle spending by category
      if (spendingRes.success && spendingRes.data) {
        setSpendingByCategory(spendingRes.data);
        
        // Get most used category
        if (spendingRes.data.length > 0) {
          setMostUsedCategory(spendingRes.data[0].category);
        }
      }

      // Handle monthly trends
      if (trendsRes.success && trendsRes.data) {
        setMonthlyTrends(trendsRes.data);
      }

      // Handle transactions
      if (transactionsRes.success && transactionsRes.data) {
        const expenseTransactions = transactionsRes.data.filter(
          (t: Transaction) => t.type === 'expense'
        );
        setTransactions(expenseTransactions);

        // Calculate metrics from transactions
        calculateMetrics(expenseTransactions, spendingRes.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
      
      // Set default values on error
      setSpendingByCategory([]);
      setMonthlyTrends([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (expenses: Transaction[], spending: CategorySpending[]) => {
    if (expenses.length === 0) {
      setAvgDailySpend(0);
      setHighestExpenseDay('N/A');
      setBudgetRemaining(0);
      return;
    }

    // Calculate average daily spend
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const uniqueDays = new Set(
      expenses.map(t => new Date(t.date).toDateString())
    ).size;
    const avgDaily = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;
    setAvgDailySpend(avgDaily);

    // Find highest expense day
    const expensesByDay: { [key: string]: { date: string; amount: number; day: string } } = {};
    expenses.forEach(t => {
      const date = new Date(t.date);
      const dateStr = date.toDateString();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (!expensesByDay[dateStr]) {
        expensesByDay[dateStr] = { date: dateStr, amount: 0, day: dayName };
      }
      expensesByDay[dateStr].amount += t.amount;
    });

    const highestDay = Object.values(expensesByDay).reduce((max, curr) =>
      curr.amount > max.amount ? curr : max,
      Object.values(expensesByDay)[0] || { amount: 0, day: 'N/A' }
    );
    setHighestExpenseDay(highestDay.day);

    // Calculate budget remaining (assuming monthly budget of $5000)
    const monthlyBudget = 5000;
    const remaining = ((monthlyBudget - totalExpenses) / monthlyBudget) * 100;
    setBudgetRemaining(Math.max(0, Math.min(100, remaining)));
  };

  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        onLogout={() => navigate('/login')}
      >
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-on-surface-variant">Loading analytics...</p>
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
      <div className="mb-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Analytics
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Detailed insights into your spending patterns and financial trends.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-8">
        {[
          { label: 'Average Daily Spend', value: `$${avgDailySpend.toFixed(2)}` },
          { label: 'Highest Expense Day', value: highestExpenseDay },
          { label: 'Most Used Category', value: mostUsedCategory || 'N/A' },
          { label: 'Budget Remaining', value: `${budgetRemaining.toFixed(0)}%` },
        ].map((metric, idx) => (
          <Card key={idx}>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
              {metric.label}
            </p>
            <p className="font-numeric-display text-numeric-display text-primary">
              {metric.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        {/* Spending by Category */}
        <Card title="Spending by Category">
          {spendingByCategory.length > 0 ? (
            <div className="space-y-4">
              {spendingByCategory.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="font-body-md text-body-md text-on-surface">
                      {item.category}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant text-sm">No spending data available</p>
          )}
        </Card>

        {/* Monthly Trends */}
        <Card title="Monthly Trends">
          {monthlyTrends.length > 0 ? (
            <div className="space-y-4">
              {monthlyTrends.map((item, idx) => (
                <div key={idx}>
                  <p className="font-body-md text-body-md text-on-surface mb-2">
                    {new Date(item.month + '-01').toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex-1">
                      <p className="font-label-md text-label-md text-secondary mb-1">
                        Income
                      </p>
                      <p className="font-body-lg text-body-lg text-on-surface">
                        ${item.income.toFixed(0)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-label-md text-error mb-1">
                        Expenses
                      </p>
                      <p className="font-body-lg text-body-lg text-on-surface">
                        ${item.expenses.toFixed(0)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                        Net Flow
                      </p>
                      <p className={`font-body-lg text-body-lg ${
                        (item.netFlow ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${(item.netFlow ?? item.income - item.expenses).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant text-sm">No monthly data available</p>
          )}
        </Card>
      </div>

      {/* Total Summary Section */}
      <div className="mt-8">
        <Card title="Summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                Total Expenses
              </p>
              <p className="font-headline-md text-headline-md text-on-surface">
                ${transactions
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                Transactions Count
              </p>
              <p className="font-headline-md text-headline-md text-on-surface">
                {transactions.length}
              </p>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                Average per Transaction
              </p>
              <p className="font-headline-md text-headline-md text-on-surface">
                ${transactions.length > 0
                  ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
