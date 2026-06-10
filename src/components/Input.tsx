import React from 'react';
import { InputProps } from '../types';

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  label,
  error,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 ${className} ${
          error ? 'border-error focus:border-error' : ''
        }`}
      />
      {error && (
        <p className="text-error font-label-md text-label-md mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
