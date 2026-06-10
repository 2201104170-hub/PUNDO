import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button } from '../components';
import { NavItem } from '../types';

const DebtTracker: React.FC = () => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker', active: true },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  const debts = [
    { id: '1', creditor: 'Bank of America', amount: 5000, interestRate: 6.5, dueDate: '2024-02-15', status: 'active' },
    { id: '2', creditor: 'Chase Credit Card', amount: 2300, interestRate: 18.9, dueDate: '2024-01-20', status: 'active' },
    { id: '3', creditor: 'Auto Loan', amount: 12000, interestRate: 5.2, dueDate: '2024-03-10', status: 'active' },
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
            Debt Management
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Track and manage outstanding balances.
          </p>
        </div>
        <Button variant="primary" size="md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Debt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-8">
        <Card>
          <div className="text-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
              Total Debt
            </h3>
            <p className="font-numeric-display text-numeric-display text-error">
              $19,300.00
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
              Average Interest Rate
            </h3>
            <p className="font-numeric-display text-numeric-display text-tertiary">
              10.2%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
              Next Payment Due
            </h3>
            <p className="font-numeric-display text-numeric-display text-on-surface">
              Jan 20, 2024
            </p>
          </div>
        </Card>
      </div>

      {/* Debts Table */}
      <Card title="Your Debts">
        <div className="space-y-4">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="border border-outline-variant rounded-lg p-4 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-headline-md text-headline-md text-on-surface">
                  {debt.creditor}
                </h4>
                <span className="font-label-md text-label-md bg-primary-container/20 text-primary px-3 py-1 rounded-full">
                  {debt.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">Amount</p>
                  <p className="font-numeric-display text-numeric-display text-error">
                    ${debt.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">Interest Rate</p>
                  <p className="font-numeric-display text-numeric-display text-tertiary">
                    {debt.interestRate}%
                  </p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">Due Date</p>
                  <p className="font-numeric-display text-numeric-display text-on-surface">
                    {debt.dueDate}
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-surface-container rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: '35%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default DebtTracker;
