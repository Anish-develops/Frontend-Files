import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { FindMatchesPage } from './pages/FindMatchesPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { SessionsPage } from './pages/SessionsPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { api } from './services/api';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './components/ui/button';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const initialRedirectDone = React.useRef<boolean>(false);

  // 1. Initial entry check: if user is returning with an active session, directly redirect to dashboard
  useEffect(() => {
    if (!isLoading && !initialRedirectDone.current) {
      initialRedirectDone.current = true;
      if (user) {
        setCurrentRoute('dashboard');
      }
    }
  }, [isLoading, user]);

  // 2. Route protection & auth transitions
  useEffect(() => {
    // If signed in and on auth pages, go to dashboard
    if (user && (currentRoute === 'login' || currentRoute === 'signup')) {
      setCurrentRoute('dashboard');
    }
    // If not signed in and trying to view private member routes, redirect to landing
    if (!user && !isLoading && ['dashboard', 'sessions', 'profile', 'notifications', 'messages'].includes(currentRoute)) {
      setCurrentRoute('landing');
    }
  }, [user, currentRoute, isLoading]);

  // 3. Keep notification badge synchronized
  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      try {
        const notifs = await api.notifications.getAll();
        setUnreadCount(notifs.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifs();
  }, [user, currentRoute]);

  const handleNavigate = (route: string) => {
    setSelectedMemberId(null);
    setCurrentRoute(route);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewMemberProfile = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentRoute('member_detail');
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-card border border-border animate-pulse flex items-center justify-center">
          <img
            src="/logo.png"
            alt="SkillSwap Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
          Connecting to SkillSwap...
        </p>
      </div>
    );
  }

  // Determine whether to show the dedicated Authenticated Web App experience
  const isAuthenticatedView = Boolean(
    user && !['landing', 'login', 'signup'].includes(currentRoute)
  );

  // Authenticated Web App Experience (Sidebar + Header, NO marketing footer)
  if (isAuthenticatedView) {
    return (
      <div className="min-h-screen bg-background text-text-primary font-sans antialiased flex">
        {/* Left Sidebar Navigation */}
        <AppSidebar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          unreadCount={unreadCount}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onOpenSettings={() => handleNavigate('profile')}
        />

        {/* Main Content Viewport */}
        <div className="lg:pl-64 flex flex-col flex-1 min-h-screen w-full">
          <AppHeader
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            unreadCount={unreadCount}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {currentRoute === 'dashboard' && (
              <DashboardPage
                onNavigate={handleNavigate}
                onViewMemberProfile={handleViewMemberProfile}
              />
            )}
            {currentRoute === 'matches' && (
              <FindMatchesPage onViewMemberProfile={handleViewMemberProfile} />
            )}
            {currentRoute === 'member_detail' && selectedMemberId && (
              <MemberProfilePage
                memberId={selectedMemberId}
                onBack={() => handleNavigate('matches')}
              />
            )}
            {currentRoute === 'sessions' && <SessionsPage />}
            {currentRoute === 'profile' && <MyProfilePage />}
            {currentRoute === 'notifications' && (
              <NotificationsPage
                onNavigateToSession={() => handleNavigate('sessions')}
              />
            )}
            {currentRoute === 'messages' && (
              <div className="p-8 bg-surface rounded-[16px] border border-border shadow-card text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 text-accent-fg flex items-center justify-center mx-auto">
                  <MessageSquare className="w-7 h-7 text-accent-fg" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-text-primary">
                    Direct P2P Messaging
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Chat with your confirmed swap partners before your scheduled session. In this demo, reciprocal session requests and automated notifications handle full synchronization!
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleNavigate('sessions')}
                  >
                    View Active Sessions
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleNavigate('matches')}
                  >
                    Discover New Peers
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // Public / Marketing Experience (Header + Main + Marketing Footer)
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased relative">
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      <main className="flex-1 w-full mx-auto">
        {currentRoute === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentRoute === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentRoute === 'signup' && <SignupPage onNavigate={handleNavigate} />}

        {/* Public view of matches if unauthenticated user clicks Explore Skills */}
        {currentRoute === 'matches' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FindMatchesPage onViewMemberProfile={handleViewMemberProfile} />
          </div>
        )}
        {currentRoute === 'member_detail' && selectedMemberId && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MemberProfilePage
              memberId={selectedMemberId}
              onBack={() => handleNavigate('matches')}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
