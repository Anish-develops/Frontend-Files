import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-surface-muted rounded-[10px] border border-border text-sm font-medium',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm font-medium transition-colors select-none',
              isActive
                ? 'bg-surface text-text-primary shadow-subtle font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-[5px] text-[11px] leading-none transition-colors',
                  isActive
                    ? 'bg-primary-soft text-primary-hover font-semibold'
                    : 'bg-surface text-text-secondary border border-border'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
