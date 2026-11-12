import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { FindMatchesPage } from './pages/FindMatchesPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { SessionsPage } from './pages/SessionsPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // If user is logged in and route is landing, or login/signup, switch to dashboard
  React.useEffect(() => {
    if (user && (currentRoute === 'login' || currentRoute === 'signup')) {
      setCurrentRoute('dashboard');
    }
  }, [user]);

  const handleNavigate = (route: string) => {
    setSelectedMemberId(null);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewMemberProfile = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentRoute('member_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary space-y-3">
        <div className="w-10 h-10 rounded-[10px] bg-primary text-white flex items-center justify-center shadow-card animate-pulse">
          <span className="font-bold text-sm tracking-tight">SS</span>
        </div>
        <p className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
          Connecting to SkillSwap...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased relative">
      {/* Global Navbar */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {currentRoute === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentRoute === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentRoute === 'signup' && <SignupPage onNavigate={handleNavigate} />}

        {/* Authenticated views */}
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
      </main>

      {/* Global Product Footer */}
      <Footer />
    </div>
  );
};
