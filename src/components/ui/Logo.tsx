import React from 'react';

interface LogoProps {
  variant?: 'icon' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showBadge = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  // Use the brand logo image provided by the user with elegant container
  const LogoImage = (
    <div
      className={`${iconSizes[size]} rounded-[10px] bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-sm border border-border/40 transition-transform duration-200 group-hover:scale-[1.04]`}
    >
      <img
        src="/logo.png"
        alt="SkillSwap Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{LogoImage}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {LogoImage}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-heading font-bold tracking-tight text-text-primary ${textSizes[size]}`}>
            Skill<span className="text-[#E07993] dark:text-[#F2B8C8]">Swap</span>
          </span>
          {showBadge && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-accent text-accent-fg uppercase tracking-wider">
              P2P
            </span>
          )}
        </div>
        <span className="text-[11px] text-text-secondary tracking-normal font-sans hidden sm:block mt-0.5">
          Two-way peer learning
        </span>
      </div>
    </div>
  );
};
