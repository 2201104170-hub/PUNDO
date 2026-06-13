import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  navItems: NavItem[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant p-4 z-50">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            MoneyFlow
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant">
            Premium Finance
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold scale-95'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined" data-icon={item.icon}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 border-t border-outline-variant">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-all duration-200 rounded-lg w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
        <div className="mt-4 flex items-center gap-3 px-4">
          <img
            alt="User Profile"
            className="w-8 h-8 rounded-full border border-outline-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZPBNdnmG7gbjkSmafL65mSrGTRCiBKMctfEaq0q4NwEnWUIJiA-G5vZiN-3IlAzS4h-notUcPqy406HwapglyVXNOyikpWvt_aOxjyRyIVNEiUvAOHmGLhKs-4XYyiQG6h4JvFw8RmO2yNXSWe9BRN9nfi2ReuRoyEDaEN8RzJV6yKS01kKfmW0TB79YOjOmTBfj-IqBM5Zh6km2xmlHxxqvq734WvQOabGdpeAAeagXSng2W43Op2-RivtbTDjGz2bXkFPiXlL8_"
          />
          <div>
            <p className="font-body-md text-body-md font-bold text-on-surface">
              {user?.email || 'User Profile'}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
