import React from 'react';
import { NavItem } from '../types';
import { Sidebar, Header, Footer } from '../components';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navItems,
  onLogout,
}) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar navItems={navItems} onLogout={onLogout} />
      <div className="flex-1 md:ml-64">
        <Header />
        <main className="md:p-gutter p-4 pt-20 md:pt-8 min-h-[calc(100vh-64px)] pb-24 md:pb-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
