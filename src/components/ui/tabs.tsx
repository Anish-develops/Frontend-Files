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
        'inline-flex items-center gap-1.5 p-1.5 bg-[#071322] rounded-2xl border border-lilac-300/20 text-sm font-semibold',
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
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all select-none',
              isActive
                ? 'bg-flame-gradient text-white shadow-flame'
                : 'text-lilac-200/80 hover:text-white hover:bg-white/10'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[11px] font-extrabold leading-none transition-colors',
                  isActive
                    ? 'bg-white text-seal-900 shadow-xs'
                    : 'bg-purple-950/80 text-purple-200 border border-purple-500/30'
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
