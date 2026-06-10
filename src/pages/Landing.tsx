import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';

const Landing: React.FC = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant h-16 flex items-center px-gutter">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-container text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance
            </span>
            <span className="font-headline-md text-headline-md font-black text-primary tracking-tight">
              MoneyFlow
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="#benefits"
            >
              Benefits
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="font-label-md text-label-md text-on-surface hover:text-primary transition-colors hidden sm:block"
            >
              Login
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-container-max mx-auto text-center">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Take Control of Your Money
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            MoneyFlow is a modern financial dashboard that helps you track expenses,
            manage debts, and reach your financial goals with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-surface-container/50">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'dashboard',
                title: 'Smart Dashboard',
                description: 'Get a comprehensive overview of your finances at a glance.',
              },
              {
                icon: 'trending_up',
                title: 'Advanced Analytics',
                description: 'Understand your spending patterns with detailed analytics.',
              },
              {
                icon: 'account_balance',
                title: 'Debt Management',
                description: 'Track and manage all your debts in one place.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-surface-container border border-outline-variant rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
              >
                <span
                  className="material-symbols-outlined text-primary-container text-[40px] mx-auto block mb-4"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {feature.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  {feature.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Ready to take control?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            Join thousands of users already managing their finances with MoneyFlow.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" size="lg">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant py-8 mt-12">
        <div className="max-w-container-max mx-auto px-4 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 MoneyFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
