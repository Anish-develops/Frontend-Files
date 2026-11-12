import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User as UserIcon, LogOut, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/avatar';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AppHeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenMobileSidebar: () => void;
  unreadCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenMobileSidebar,
  unreadCount = 0,
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = (route: string) => {
    switch (route) {
      case 'dashboard':
        return 'Overview & Dashboard';
      case 'matches':
        return 'Discover People';
      case 'sessions':
        return 'Exchange Sessions';
      case 'profile':
        return 'My Profile & Skills';
      case 'notifications':
        return 'Notifications';
      case 'member_detail':
        return 'Peer Profile';
      case 'messages':
        return 'Messages & Chat';
      default:
        return 'SkillSwap Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-[9px] border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-text-primary font-heading tracking-tight">
            {getPageTitle(currentRoute)}
          </h1>
          <p className="text-[11px] text-text-secondary hidden sm:block">
            Peer-to-peer 1:1 reciprocal exchange platform
          </p>
        </div>
      </div>

      {/* Right: Actions, Demo Mode pill, Theme Toggle & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Mode Badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-semibold bg-accent text-accent-fg border border-accent/40 shadow-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Mode</span>
        </div>

        {/* Quick Discover button */}
        {currentRoute !== 'matches' && (
          <button
            onClick={() => onNavigate('matches')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-medium border border-border bg-surface hover:bg-surface-muted text-text-primary transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-text-secondary" />
            <span>Find Swaps</span>
          </button>
        )}

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-[9px] border border-border bg-surface hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-fg font-bold text-[10px] flex items-center justify-center border-2 border-surface">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-surface-muted border border-border transition-colors focus:outline-none"
            >
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <span className="hidden sm:block text-xs font-semibold text-text-primary px-1">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary pr-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-[14px] bg-surface border border-border shadow-pop py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2.5 border-b border-border">
                  <p className="text-xs font-bold text-text-primary leading-tight font-heading">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>My Profile & Skills</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('sessions');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>My Scheduled Sessions</span>
                </button>

                <div className="my-1 border-t border-border" />

                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await logout();
                    onNavigate('landing');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-danger hover:bg-danger-soft transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

