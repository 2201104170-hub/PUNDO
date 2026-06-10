import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
}) => {
  const baseStyles = 'font-label-md text-label-md rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles: Record<string, string> = {
    primary: 'bg-primary-container text-on-primary-container hover:brightness-110 active:brightness-95 shadow-[0_4px_12px_rgba(37,99,235,0.15)] disabled:opacity-50',
    secondary: 'bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest disabled:opacity-50',
    tertiary: 'bg-transparent text-primary hover:bg-primary-container/10 disabled:opacity-50',
    danger: 'bg-error-container text-on-error-container hover:brightness-110 active:brightness-95 disabled:opacity-50',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-base',
  };

  const disabledStyles = disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
