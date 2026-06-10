import React, { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="hidden md:flex justify-between items-center h-16 px-gutter ml-64 w-[calc(100%-16rem)] bg-surface/80 backdrop-blur-md sticky top-0 border-b border-outline-variant z-40">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Search transactions, categories..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {showNotifications && (
          <>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-full">
              <span className="material-symbols-outlined" data-icon="notifications">
                notifications
              </span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-full">
              <span className="material-symbols-outlined" data-icon="account_circle">
                account_circle
              </span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
