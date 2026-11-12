import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Calendar,
  MessageSquare,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  X,
  BookOpen,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

interface AppSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  unreadCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenSettings?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentRoute,
  onNavigate,
  unreadCount = 0,
  isOpenMobile = false,
  onCloseMobile,
  onOpenSettings,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'matches', label: 'Discover People', icon: Compass },
    { id: 'profile', label: 'My Skills & Profile', icon: BookOpen },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 'Demo' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-pop' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Close Button (mobile) */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-border">
            <button
              onClick={() => handleItemClick('dashboard')}
              className="group focus:outline-none text-left"
            >
              <Logo size="sm" showBadge={false} />
            </button>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-[8px] text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Preview & Demo Badge */}
          {user && (
            <div className="p-4 mx-3 my-3 rounded-[12px] bg-surface-muted border border-border">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-[10px] object-cover border border-border"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-text-primary truncate font-heading">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">
                    {user.headline.split('&')[0]}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent-fg bg-accent px-1.5 py-0.5 rounded-[4px]">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Demo Mode</span>
                </span>
                <span className="text-[10px] text-text-muted">Alex Morgan</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <p className="px-3 pb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-fg font-semibold shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-fg' : 'text-text-secondary'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-surface text-text-primary'
                          : 'bg-accent text-accent-fg'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings & Logout */}
        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else handleItemClick('profile');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <Settings className="w-4 h-4 text-text-secondary" />
            <span>Settings</span>
          </button>

          <button
            onClick={async () => {
              await logout();
              onNavigate('landing');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-danger hover:bg-danger-soft transition-colors"
          >
            <LogOut className="w-4 h-4 text-danger" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

