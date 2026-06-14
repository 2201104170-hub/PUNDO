import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button, AddDebtModal } from '../components';
import { NavItem } from '../types';
import { debtApi } from '../services/api';

interface Debt {
  id: string;
  creditor: string;
  amount: number;
  interestRate: number;
  dueDate: string;
  status: string;
  remainingBalance?: number;
  type: string;
}

// Helper function to format debt type for display
const formatDebtType = (type: string): string => {
  switch (type) {
    case 'i_owe':
      return 'I Owe';
    case 'they_owe_me':
      return 'They Owe Me';
    default:
      return type;
  }
};

const DebtTracker: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(searchParams.get('modal') === 'add');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker', active: true },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  // Fetch debts from backend on component mount
  useEffect(() => {
    const fetchDebts = async () => {
      setIsLoading(true);
      try {
        const response = await debtApi.getAll();
        if (response.success && response.data) {
          const debtsData = Array.isArray(response.data) ? response.data : response.data.data || [];
          setDebts(debtsData);
        }
      } catch (error) {
        console.error('Error fetching debts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebts();
  }, []);

  // Calculate summary statistics
  const totalDebt = Array.isArray(debts) ? debts.reduce((sum, debt) => sum + (typeof debt.amount === 'number' ? debt.amount : parseFloat(debt.amount || 0)), 0) : 0;
  const averageInterestRate =
    Array.isArray(debts) && debts.length > 0 ? debts.reduce((sum, debt) => sum + (typeof debt.interestRate === 'number' ? debt.interestRate : parseFloat(debt.interestRate || 0)), 0) / debts.length : 0;
  
  const nextPaymentDue = Array.isArray(debts) && debts.length > 0
    ? debts.reduce((closest, debt) => {
        const debtDate = new Date(debt.dueDate).getTime();
        const closestDate = new Date(closest.dueDate).getTime();
        return debtDate < closestDate ? debt : closest;
      })
    : null;

  const handleOpenModal = () => {
    setShowAddModal(true);
    navigate('/debt-tracker?modal=add');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    navigate('/debt-tracker');

  };

  const handleSubmitDebt = async (_data: any) => {
    // Refresh debts after successful submission
    const response = await debtApi.getAll();
    if (response.success && response.data) {
      const debtsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setDebts(debtsData);
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
            Debt Management
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Track and manage outstanding balances.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenModal}>
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
              ${totalDebt.toFixed(2)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
              Average Interest Rate
            </h3>
            <p className="font-numeric-display text-numeric-display text-tertiary">
              {averageInterestRate.toFixed(2)}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
              Next Payment Due
            </h3>
            <p className="font-numeric-display text-numeric-display text-on-surface">
              {nextPaymentDue
                ? new Date(nextPaymentDue.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </Card>
      </div>

      {/* Debts Table */}
      <Card title="Your Debts">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-on-surface-variant">
              Loading debts...
            </div>
          ) : debts.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              No debts added yet. Click "Add Debt" to get started.
            </div>
          ) : (
            debts.map((debt) => (
              <div
                key={debt.id}
                className="border border-outline-variant rounded-lg p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-headline-md text-headline-md text-on-surface">
                    {debt.creditor}
                  </h4>
                  <div className="flex gap-2">
                    <span className="font-label-md text-label-md bg-secondary-container/20 text-secondary px-3 py-1 rounded-full">
                      {formatDebtType(debt.type)}
                    </span>
                    <span className="font-label-md text-label-md bg-primary-container/20 text-primary px-3 py-1 rounded-full">
                      {debt.status}
                  </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Amount</p>
                    <p className="font-numeric-display text-numeric-display text-error">
                      ${(typeof debt.amount === 'number' ? debt.amount : parseFloat(debt.amount)).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Interest Rate</p>
                    <p className="font-numeric-display text-numeric-display text-tertiary">
                      {(typeof debt.interestRate === 'number' ? debt.interestRate : parseFloat(debt.interestRate)).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Due Date</p>
                    <p className="font-numeric-display text-numeric-display text-on-surface">
                      {new Date(debt.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
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
            ))
          )}
        </div>
      </Card>

      {/* Add Debt Modal */}
      <AddDebtModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDebt}
      />
    </DashboardLayout>
  );
};

export default DebtTracker;
