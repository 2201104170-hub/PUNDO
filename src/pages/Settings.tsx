import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button, Input } from '../components';
import { NavItem } from '../types';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: '2', label: 'Transactions', icon: 'payments', path: '/transactions' },
    { id: '3', label: 'Debt Tracker', icon: 'account_balance', path: '/debt-tracker' },
    { id: '4', label: 'Reports', icon: 'description', path: '/reports' },
    { id: '5', label: 'Analytics', icon: 'analytics', path: '/analytics' },
    { id: '6', label: 'Settings', icon: 'settings', path: '/settings', active: true },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      onLogout={() => navigate('/login')}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Settings
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Account Settings */}
      <Card title="Account Settings" className="mb-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="Alex" value="Alex" />
            <Input label="Last Name" placeholder="Mercer" value="Mercer" />
          </div>
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value="alex@example.com"
          />
          <div className="flex gap-4 pt-4">
            <Button variant="primary">Save Changes</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card title="Notification Preferences" className="mb-8">
        <div className="space-y-4">
          {[
            { id: 'email-transactions', label: 'Email me about new transactions' },
            { id: 'email-bills', label: 'Email me about upcoming bills' },
            { id: 'email-reports', label: 'Send me weekly financial reports' },
            { id: 'email-alerts', label: 'Alert me about unusual spending' },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={item.id}
                defaultChecked
                className="w-5 h-5 rounded"
              />
              <label
                htmlFor={item.id}
                className="font-body-md text-body-md text-on-surface cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy & Security" className="mb-8">
        <div className="space-y-6">
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface mb-3">
              Password
            </h4>
            <Button variant="secondary">Change Password</Button>
          </div>
          <div className="pt-4 border-t border-outline-variant">
            <h4 className="font-headline-md text-headline-md text-on-surface mb-3">
              Two-Factor Authentication
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Add an extra layer of security to your account.
            </p>
            <Button variant="primary">Enable 2FA</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-error/50 bg-error-container/10">
        <div>
          <h3 className="font-headline-md text-headline-md text-error mb-2">
            Danger Zone
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            These actions cannot be undone.
          </p>
          <Button variant="danger">Delete Account</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Settings;
