import React from 'react';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-surface-container border border-outline-variant rounded-xl p-6 ${
        hoverable ? 'hover:border-primary/50 transition-colors' : ''
      } ${className}`}
    >
      {title && (
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
