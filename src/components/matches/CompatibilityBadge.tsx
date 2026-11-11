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
  const isHighMatch = score >= 90;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors',
          isHighMatch
            ? 'bg-flame-950/80 text-flame-300 border-flame-500/40 shadow-flame'
            : 'bg-[#071322] text-lilac-200 border-lilac-300/30'
        )}
      >
        <ArrowLeftRight className={cn('w-3.5 h-3.5', isHighMatch ? 'text-flame-400' : 'text-lilac-300')} />
        <span>{score}% Reciprocal Fit</span>
      </div>
      {showReason && reason && (
        <p className="text-xs text-lilac-200/75 leading-snug">{reason}</p>
      )}
    </div>
  );
};
