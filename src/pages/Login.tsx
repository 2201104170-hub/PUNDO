import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { getCountriesList } from '../utils/currency';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('US');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password || !country) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container mb-4">
            <span
              className="material-symbols-outlined text-on-primary-container text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            MoneyFlow
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">
            Premium Finance
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-error-container/20 border border-error/50 rounded-lg">
              <p className="font-body-md text-body-md text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="mt-2 text-right">
                <a
                  href="#"
                  className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Country & Currency Selection */}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                Your Country & Currency
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              >
                <option value="">Select your country...</option>
                {getCountriesList().map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code} - {c.symbol})
                  </option>
                ))}
              </select>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                Your preferred currency will be used throughout the app
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant"></div>
            <span className="font-label-md text-label-md text-on-surface-variant">or</span>
            <div className="flex-1 h-px bg-outline-variant"></div>
          </div>

          {/* Social Login */}
          <button className="w-full py-2 px-4 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined align-middle mr-2">
              account_circle
            </span>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-primary hover:text-primary-fixed transition-colors font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 font-body-md text-body-md text-on-surface-variant">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary hover:text-primary-fixed">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
