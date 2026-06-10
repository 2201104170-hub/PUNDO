import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card } from '../components';
import { NavItem } from '../types';

const Analytics: React.FC = () => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics', active: true },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-8">
        {[
          { label: 'Average Daily Spend', value: '$156.32' },
          { label: 'Highest Expense Day', value: 'Saturday' },
          { label: 'Most Used Category', value: 'Food & Dining' },
          { label: 'Budget Remaining', value: '32%' },
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
          <div className="space-y-4">
            {[
              { category: 'Food & Dining', amount: 523.45, percentage: 35 },
              { category: 'Transportation', amount: 234.50, percentage: 20 },
              { category: 'Entertainment', amount: 156.30, percentage: 12 },
              { category: 'Utilities', amount: 189.00, percentage: 15 },
              { category: 'Other', amount: 234.75, percentage: 18 },
            ].map((item, idx) => (
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
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card title="Monthly Trends">
          <div className="space-y-4">
            {[
              { month: 'January', income: 4500, expenses: 2800 },
              { month: 'February', income: 4500, expenses: 2950 },
              { month: 'March', income: 4500, expenses: 2600 },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="font-body-md text-body-md text-on-surface mb-2">
                  {item.month}
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-secondary mb-1">
                      Income
                    </p>
                    <p className="font-numeric-display text-numeric-display text-secondary">
                      ${item.income}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-error mb-1">
                      Expenses
                    </p>
                    <p className="font-numeric-display text-numeric-display text-error">
                      ${item.expenses}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
