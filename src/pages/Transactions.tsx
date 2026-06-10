import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button } from '../components';
import { NavItem } from '../types';

const Transactions: React.FC = () => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions', active: true },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  const transactions = [
    { id: '1', date: '2024-01-15', description: 'Salary Deposit', amount: 4500, category: 'Income', status: 'completed' },
    { id: '2', date: '2024-01-14', description: 'Grocery Store', amount: -125.50, category: 'Food', status: 'completed' },
    { id: '3', date: '2024-01-13', description: 'Electric Bill', amount: -89.00, category: 'Utilities', status: 'completed' },
    { id: '4', date: '2024-01-12', description: 'Restaurant', amount: -45.30, category: 'Dining', status: 'completed' },
    { id: '5', date: '2024-01-11', description: 'Gas', amount: -52.00, category: 'Transport', status: 'completed' },
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
            Transactions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            View and manage all your transactions.
          </p>
        </div>
        <Button variant="primary" size="md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search transactions..."
            className="flex-1 bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />
          <select className="bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary">
            <option>All Categories</option>
            <option>Income</option>
            <option>Food</option>
            <option>Utilities</option>
            <option>Transport</option>
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
              {transactions.map((transaction) => (
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
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
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

export default Transactions;
