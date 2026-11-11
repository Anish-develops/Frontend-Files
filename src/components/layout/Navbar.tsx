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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/avatar';
import { api } from '../../services/api';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

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
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className="max-w-7xl mx-auto rounded-2xl bg-[#0c1e34]/90 backdrop-blur-xl border border-lilac-300/20 shadow-lifted">
        <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b4d] via-[#f95738] to-[#c5280b] text-white flex items-center justify-center shadow-flame transition-transform group-hover:scale-105">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-white block leading-tight">
                  SkillSwap
                </span>
                <span className="text-[10px] text-lilac-200/80 font-bold tracking-widest uppercase block">
                  Peer Exchange
                </span>
              </div>
            </button>

            {/* Authenticated Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1.5 ml-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-flame-gradient text-white shadow-flame'
                          : 'text-lilac-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-seal-900">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Center Pill Menu for Public Landing (QuantraLogic style) */}
          {!user && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071322] border border-lilac-300/20 text-white text-xs font-semibold shadow-inner">
              <button
                onClick={() => handleNavClick('landing')}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  currentRoute === 'landing'
                    ? 'bg-flame-500/20 text-flame-300 border border-flame-500/30 font-bold'
                    : 'text-lilac-200/80 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleNavClick('matches')}
                className="px-3.5 py-1.5 rounded-full text-lilac-200/80 hover:text-white transition-colors"
              >
                Explore Skills
              </button>
              <button
                onClick={() => {
                  handleNavClick('landing');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="px-3.5 py-1.5 rounded-full text-lilac-200/80 hover:text-white transition-colors"
              >
                How It Works
              </button>
            </div>
          )}

          {/* Right: User Menu or Auth CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              /* Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-lilac-300/40 transition-all focus:outline-none bg-white/5"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className="hidden sm:block text-xs font-bold text-white px-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-lilac-200" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0c1e34] border border-lilac-300/25 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-lilac-200/10">
                      <p className="text-sm font-bold text-white leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-lilac-200/70 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-lilac-100 hover:bg-white/10"
                    >
                      <UserIcon className="w-4 h-4 text-lilac-300" />
                      <span>My Profile & Skills</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('landing')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-lilac-100 hover:bg-white/10"
                    >
                      <Compass className="w-4 h-4 text-lilac-300" />
                      <span>Platform Landing Page</span>
                    </button>

                    <div className="my-1.5 border-t border-lilac-200/10" />

                    <button
                      onClick={() => {
                        logout();
                        handleNavClick('landing');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-xs font-bold text-lilac-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-5 py-2.5 text-xs font-bold bg-[#ea3a18] bg-gradient-to-r from-[#ff6b4d] via-[#f95738] to-[#c5280b] text-white rounded-full hover:brightness-110 shadow-flame transition-all active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-lilac-200 hover:text-white hover:bg-white/10 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-lilac-200/15 p-4 space-y-2 bg-[#071322] rounded-b-2xl">
            {user ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                        currentRoute === item.id
                          ? 'bg-flame-gradient text-white'
                          : 'text-lilac-100 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-seal-900">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-lilac-200/15 space-y-1">
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-lilac-100"
                  >
                    <UserIcon className="w-4 h-4 text-lilac-300" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick('landing');
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-rose-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={() => handleNavClick('matches')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-lilac-100 bg-white/5 rounded-xl"
                >
                  Explore Skills
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white border border-lilac-300/20 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="w-full py-2.5 text-center text-sm font-bold bg-flame-gradient text-white rounded-xl shadow-flame"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
