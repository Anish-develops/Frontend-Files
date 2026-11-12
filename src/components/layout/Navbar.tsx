import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Bell,
  Calendar,
  Compass,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/avatar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../ui/Logo';
import { api } from '../../services/api';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { user, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const handleDemoLogin = async () => {
    try {
      await login('demo@skillswap.demo', 'SkillSwap123');
      onNavigate('dashboard');
    } catch {
      onNavigate('dashboard');
    }
  };

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const notifs = await api.notifications.getAll();
        setUnreadCount(notifs.filter((n) => !n.isRead).length);

        const sessions = await api.sessions.getAll();
        if (user) {
          const pending = sessions.filter(
            (s) => s.status === 'pending' && s.receiverId === user.id
          );
          setPendingCount(pending.length);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCounters();
  }, [user, currentRoute]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'matches', label: 'Find Matches', icon: Compass },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: Calendar,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
              className="flex items-center text-left group focus:outline-none"
            >
              <Logo size="md" />
            </button>

            {/* Authenticated Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 ml-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-soft text-primary-hover font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent text-accent-fg">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Center Links for Public Landing */}
          {!user && (
            <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => handleNavClick('landing')}
                className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                  currentRoute === 'landing'
                    ? 'text-text-primary font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  handleNavClick('landing');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="px-3 py-1.5 rounded-[8px] text-text-secondary hover:text-text-primary transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('matches')}
                className="px-3 py-1.5 rounded-[8px] text-text-secondary hover:text-text-primary transition-colors"
              >
                Explore Skills
              </button>
              <button
                onClick={() => {
                  handleNavClick('landing');
                  setTimeout(() => {
                    document.getElementById('why-skillswap')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="px-3 py-1.5 rounded-[8px] text-text-secondary hover:text-text-primary transition-colors"
              >
                Why SkillSwap
              </button>
            </div>
          )}

          {/* Right: User Menu or Auth CTAs */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              /* Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-surface-muted border border-border transition-colors focus:outline-none"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className="hidden sm:block text-xs font-semibold text-text-primary px-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary pr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-[14px] bg-surface border border-border shadow-pop py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-border">
                      <p className="text-xs font-bold text-text-primary leading-tight font-heading">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-text-secondary" />
                      <span>Dashboard Workspace</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-text-secondary" />
                      <span>My Profile & Skills</span>
                    </button>

                    <div className="my-1 border-t border-border" />

                    <button
                      onClick={() => {
                        logout();
                        handleNavClick('landing');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-danger hover:bg-danger-soft transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary rounded-[8px] hover:bg-surface-muted transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={handleDemoLogin}
                  className="px-3 py-1.5 text-xs font-bold bg-accent text-accent-fg hover:bg-accent-hover rounded-[10px] shadow-subtle transition-all active:scale-[0.98] flex items-center gap-1.5 border border-accent/40"
                  title="Explore with 1-click Demo Account"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Demo</span>
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-primary text-primary-fg rounded-[10px] hover:bg-primary-hover shadow-subtle transition-all active:scale-[0.98]"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-[8px] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border p-4 space-y-3 bg-surface rounded-b-[14px] shadow-lifted">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-medium text-text-secondary">Theme</span>
              <ThemeToggle showLabel />
            </div>
            {user ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-xs sm:text-sm font-medium ${
                        currentRoute === item.id
                          ? 'bg-primary-soft text-primary-hover font-semibold'
                          : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-fg">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-border space-y-1">
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary"
                  >
                    <UserIcon className="w-4 h-4 text-text-secondary" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick('landing');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-danger hover:bg-danger-soft rounded-[8px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 text-center text-xs font-bold bg-accent text-accent-fg rounded-[10px] shadow-subtle flex items-center justify-center gap-1.5 border border-accent/40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Demo Account</span>
                </button>
                <button
                  onClick={() => handleNavClick('matches')}
                  className="w-full py-2 text-center text-xs font-medium text-text-secondary bg-surface-muted rounded-[8px]"
                >
                  Explore Skills
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2 text-center text-xs font-medium text-text-primary border border-border rounded-[8px]"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="w-full py-2 text-center text-xs font-semibold bg-primary text-primary-fg rounded-[10px] shadow-subtle hover:bg-primary-hover"
                >
                  Start Swapping Free
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
