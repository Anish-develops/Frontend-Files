import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CompatibilityBadgeProps {
  score: number;
  reason?: string;
  showReason?: boolean;
  className?: string;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  reason,
  showReason = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-medium border bg-success-soft text-success border-success/25'
        )}
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-success" />
        <span>{score}% Reciprocal Fit</span>
      </div>
      {showReason && reason && (
        <p className="text-xs text-text-secondary leading-snug">{reason}</p>
      )}
    </div>
  );
};
