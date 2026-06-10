import React from 'react';
import { DashboardCard as DashboardCardType } from '../types';

interface DashboardCardProps {
  card: DashboardCardType;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ card }) => {
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col justify-between relative overflow-hidden hover:border-primary/50 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-8xl" data-icon={card.icon}>
          {card.icon}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-full ${card.bgColor || 'bg-primary-container/20'} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-primary text-[18px]">
            {card.icon}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide mb-2">
          {card.title}
        </h3>
        <div className="font-numeric-display text-numeric-display text-on-surface mb-3">
          {card.value}
        </div>

        {card.trend && (
          <div
            className={`flex items-center gap-1 font-label-md text-label-md ${
              card.trend.direction === 'up' ? 'text-secondary-fixed-dim' : 'text-error'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {card.trend.direction === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {card.trend.direction === 'up' ? '+' : '-'}
            {Math.abs(card.trend.value)}% vs last month
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
