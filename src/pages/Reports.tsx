import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button } from '../components';
import { NavItem } from '../types';

const Reports: React.FC = () => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports', active: true },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

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
          <Button variant="secondary" size="md">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="mb-8">
        <div className="flex gap-2">
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${
                period === 'Monthly'
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-8">
        <Card>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
            Total Net Flow
          </h3>
          <p className="font-numeric-display text-numeric-display text-primary">
            +$12,450.00
          </p>
          <p className="font-label-md text-label-md text-secondary mt-2">
            ↑ 14.2% vs last month
          </p>
        </Card>

        <Card>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
            Top Expense Category
          </h3>
          <p className="font-headline-md text-headline-md text-on-surface">
            Housing & Utilities
          </p>
          <div className="mt-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>$3,200.00</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div className="bg-tertiary h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
            Savings Rate
          </h3>
          <p className="font-numeric-display text-numeric-display text-primary">
            28.5%
          </p>
          <div className="mt-4">
            <p className="text-sm text-on-surface-variant mb-2">Target: 30%</p>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card title="Transaction Breakdown">
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
              {[
                { date: '2024-01-15', category: 'Income', amount: 4500 },
                { date: '2024-01-14', category: 'Food', amount: -125.50 },
                { date: '2024-01-13', category: 'Utilities', amount: -89.00 },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant hover:bg-surface-container-low">
                  <td className="py-4 px-4 font-body-md text-body-md">{row.date}</td>
                  <td className="py-4 px-4 font-body-md text-body-md">{row.category}</td>
                  <td className={`py-4 px-4 font-headline-md text-right ${
                    row.amount > 0 ? 'text-secondary' : 'text-on-surface'
                  }`}>
                    {row.amount > 0 ? '+' : ''}{row.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
