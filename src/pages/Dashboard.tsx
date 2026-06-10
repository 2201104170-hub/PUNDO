import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, DashboardCard, Card } from '../components';
import { DashboardCard as DashboardCardType, NavItem } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', active: true },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  const dashboardCards: DashboardCardType[] = [
    {
      id: '1',
      title: 'Total Balance',
      value: '$12,450.00',
      icon: 'account_balance_wallet',
      trend: { value: 14.2, direction: 'up' },
      bgColor: 'bg-primary-container/20',
    },
    {
      id: '2',
      title: 'Monthly Income',
      value: '$8,900.00',
      icon: 'trending_up',
      trend: { value: 8.5, direction: 'up' },
      bgColor: 'bg-secondary-container/20',
    },
    {
      id: '3',
      title: 'Monthly Expenses',
      value: '$5,200.00',
      icon: 'trending_down',
      trend: { value: 3.2, direction: 'down' },
      bgColor: 'bg-tertiary-container/20',
    },
    {
      id: '4',
      title: 'Savings Rate',
      value: '41.6%',
      icon: 'savings',
      bgColor: 'bg-primary-container/20',
    },
  ];

  const recentTransactions = [
    { id: '1', description: 'Salary Deposit', amount: '+$4,500.00', date: 'Today', category: 'Income', type: 'income' },
    { id: '2', description: 'Grocery Store', amount: '-$125.50', date: 'Yesterday', category: 'Food', type: 'expense' },
    { id: '3', description: 'Electric Bill', amount: '-$89.00', date: '2 days ago', category: 'Utilities', type: 'expense' },
    { id: '4', description: 'Restaurant', amount: '-$45.30', date: '3 days ago', category: 'Dining', type: 'expense' },
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
            Dashboard Overview
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Welcome back, Alex. Here's your financial summary.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/transactions?modal=add')}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-8">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} card={card} />
        ))}
      </div>

      {/* Recent Transactions Card */}
      <Card title="Recent Transactions">
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
              <p className={`font-headline-md text-headline-md ${
                transaction.type === 'income'
                  ? 'text-secondary'
                  : 'text-on-surface'
              }`}>
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
