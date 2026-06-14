import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button } from '../components';
import { NavItem } from '../types';
import { reportsApi } from '../services/api';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface FinancialMetrics {
  totalNetFlow: number;
  monthlyChange: number;
  topExpenseCategory: string;
  topExpenseAmount: number;
  topExpensePercentage: number;
  savingsRate: number;
  savingsTarget: number;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalNetFlow: 0,
    monthlyChange: 0,
    topExpenseCategory: 'N/A',
    topExpenseAmount: 0,
    topExpensePercentage: 0,
    savingsRate: 0,
    savingsTarget: 30,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports', active: true },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  // Fetch data when period changes
  useEffect(() => {
    fetchReportData();
  }, [period]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [metricsResponse, transactionsResponse] = await Promise.all([
        reportsApi.getFinancialMetrics(period),
        reportsApi.getTransactionReport(period),
      ]);

      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(calculateMetrics(transactionsResponse.data || []));
      }

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (txns: Transaction[]) => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses: { [key: string]: number } = {};

    txns.forEach((tx) => {
      const amount = typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount);
      if (amount > 0) {
        totalIncome += amount;
      } else {
        totalExpense += Math.abs(amount);
        categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + Math.abs(amount);
      }
    });

    const topCategory = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a)[0];
    const netFlow = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return {
      totalNetFlow: netFlow,
      monthlyChange: 14.2, // This would come from comparing periods
      topExpenseCategory: topCategory ? topCategory[0] : 'N/A',
      topExpenseAmount: topCategory ? topCategory[1] : 0,
      topExpensePercentage: totalExpense > 0 && topCategory ? (topCategory[1] / totalExpense) * 100 : 0,
      savingsRate: savingsRate,
      savingsTarget: 30,
    };
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Category', 'Amount'],
      ...transactions.map((tx) => [
        tx.date,
        tx.category,
        (tx.amount > 0 ? '+' : '') + (typeof tx.amount === 'number' ? tx.amount.toFixed(2) : parseFloat(tx.amount).toFixed(2)),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `financial-report-${period}-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            Financial Reports
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Comprehensive breakdown of your financial trajectory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={handleExport}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="mb-8">
        <div className="flex gap-2">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((p) => {
            const periodValue = p.toLowerCase() as 'daily' | 'weekly' | 'monthly' | 'yearly';
            return (
              <button
                key={p}
                onClick={() => setPeriod(periodValue)}
                className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${
                  period === periodValue
                    ? 'bg-surface-container-highest text-on-surface'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-8">
        <Card>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
            Total Net Flow
          </h3>
          <p className={`font-numeric-display text-numeric-display ${metrics.totalNetFlow >= 0 ? 'text-primary' : 'text-error'}`}>
            {metrics.totalNetFlow >= 0 ? '+' : ''}{metrics.totalNetFlow.toFixed(2)}
          </p>
          <p className="font-label-md text-label-md text-secondary mt-2">
            ↑ {metrics.monthlyChange.toFixed(1)}% vs last month
          </p>
        </Card>

        <Card>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
            Top Expense Category
          </h3>
          <p className="font-headline-md text-headline-md text-on-surface">
            {metrics.topExpenseCategory}
          </p>
          <div className="mt-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>${metrics.topExpenseAmount.toFixed(2)}</span>
              <span>{metrics.topExpensePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div
                className="bg-tertiary h-2 rounded-full"
                style={{ width: `${metrics.topExpensePercentage}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
            Savings Rate
          </h3>
          <p className="font-numeric-display text-numeric-display text-primary">
            {metrics.savingsRate.toFixed(1)}%
          </p>
          <div className="mt-4">
            <p className="text-sm text-on-surface-variant mb-2">Target: {metrics.savingsTarget}%</p>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(metrics.savingsRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card title="Transaction Breakdown">
        {isLoading ? (
          <div className="text-center py-8 text-on-surface-variant">
            <p className="font-body-md">Loading report data...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-4 px-4 font-label-md text-label-md text-on-surface-variant">Date</th>
                  <th className="text-left py-4 px-4 font-label-md text-label-md text-on-surface-variant">Category</th>
                  <th className="text-right py-4 px-4 font-label-md text-label-md text-on-surface-variant">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                    <td className="py-4 px-4 font-body-md text-body-md text-on-surface">
                      {tx.date}
                    </td>
                    <td className="py-4 px-4 font-body-md text-body-md text-on-surface-variant">
                      {tx.category}
                    </td>
                    <td className={`py-4 px-4 font-headline-md text-headline-md text-right ${
                      tx.amount > 0 ? 'text-secondary' : 'text-on-surface'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{(typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-on-surface-variant">
            <p className="font-body-md">No transactions found for the selected period.</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
