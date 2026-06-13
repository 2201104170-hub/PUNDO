import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  currency?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signup: (firstName: string, lastName: string, email: string, password: string, country?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (firstName: string, lastName: string, email: string, country?: string) => Promise<void>;
  setUser: (user: User | null) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currency, setCurrencyState] = useState<string>('USD');

  // Load user and currency from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    
    setCurrencyState(savedCurrency);
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
  }, []);

  const signup = async (firstName: string, lastName: string, email: string, password: string, country?: string) => {
    // In a real app, this would call your backend API
    const newUser: User = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      country: country || 'US',
      currency: getCurrencyCodeFromCountry(country || 'US'),
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setCurrencyState(newUser.currency!);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('currency', newUser.currency!);
    localStorage.setItem('auth_token', 'test_token');
  };

  const login = async (email: string, password: string) => {
    // In a real app, this would call your backend API
    const newUser: User = {
      id: Date.now().toString(),
      firstName: email.split('@')[0],
      lastName: 'User',
      email,
      country: 'US',
      currency: 'USD',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setCurrencyState('USD');
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('currency', 'USD');
    localStorage.setItem('auth_token', 'test_token');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrencyState('USD');
    localStorage.removeItem('user');
    localStorage.removeItem('currency');
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (firstName: string, lastName: string, email: string, country?: string) => {
    if (!user) throw new Error('No user logged in');

    const currencyCode = country ? getCurrencyCodeFromCountry(country) : user.currency;
    const updatedUser: User = {
      ...user,
      firstName,
      lastName,
      email,
      country: country || user.country,
      currency: currencyCode,
    };

    setUser(updatedUser);
    setCurrencyState(currencyCode || 'USD');
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('currency', currencyCode || 'USD');
  };

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
    if (user) {
      const updatedUser = { ...user, currency: newCurrency };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signup, login, logout, updateProfile, setUser, currency, setCurrency }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to get currency code from country code
function getCurrencyCodeFromCountry(countryCode: string): string {
  const currencyMap: { [key: string]: string } = {
    US: 'USD', PH: 'PHP', GB: 'GBP', CA: 'CAD', AU: 'AUD', IN: 'INR', JP: 'JPY',
    SG: 'SGD', MY: 'MYR', TH: 'THB', ID: 'IDR', VN: 'VND', EU: 'EUR', SA: 'SAR',
    AE: 'AED', MX: 'MXN', BR: 'BRL', ZA: 'ZAR', NZ: 'NZD', HK: 'HKD', CN: 'CNY',
    KR: 'KRW', TW: 'TWD', PK: 'PKR', BD: 'BDT', LK: 'LKR', NG: 'NGN', KE: 'KES',
    EG: 'EGP', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', NL: 'EUR', BE: 'EUR',
    FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR',
  };
  return currencyMap[countryCode] || 'USD';
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
