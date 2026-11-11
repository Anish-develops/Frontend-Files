import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Star, ArrowLeftRight, Check, X, Clock } from 'lucide-react';
import { NotificationItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '../components/ui/button';

interface NotificationsPageProps {
  onNavigateToSession?: (sessionId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onNavigateToSession,
}) => {
  const { user } = useAuth();
  const { toast } = useNotification();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.notifications.getAll();
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error marking read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast('All notifications marked as read', 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error marking all read', 'error');
    }
  };

  const displayedNotifs =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'session_request':
        return (
          <div className="p-2 rounded-xl bg-flame-950/80 text-flame-400 border border-flame-500/40">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        );
      case 'request_accepted':
        return (
          <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <Check className="w-4 h-4" />
          </div>
        );
      case 'request_declined':
        return (
          <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-500/40">
            <X className="w-4 h-4" />
          </div>
        );
      case 'session_rescheduled':
        return (
          <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <Clock className="w-4 h-4" />
          </div>
        );
      case 'session_completed':
      case 'review_received':
        return (
          <div className="p-2 rounded-xl bg-flame-950/80 text-flame-400 border border-flame-500/40">
            <Star className="w-4 h-4 fill-flame-400" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-[#071322] text-lilac-300 border border-lilac-300/20">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-lilac-200/80 mt-1 font-medium">
            Exchange requests, schedule updates, and community feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-lilac-300/20 p-1 bg-[#071322] text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-flame-gradient text-white shadow-flame' : 'text-lilac-200/70 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-flame-gradient text-white shadow-flame' : 'text-lilac-200/70 hover:text-white'
              }`}
            >
              Unread ({notifications.filter((n) => !n.isRead).length})
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-bold gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5 text-lilac-300" />
            <span>Mark all read</span>
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      {displayedNotifs.length > 0 ? (
        <div className="bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted divide-y divide-lilac-200/10 overflow-hidden">
          {displayedNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.isRead ? 'bg-flame-950/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-flame-500 shrink-0 animate-ping"></span>
                    )}
                  </div>
                  <p className="text-xs text-lilac-200/90 leading-relaxed font-normal">{notif.message}</p>
                  <p className="text-[11px] text-lilac-200/50 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {notif.relatedSessionId && onNavigateToSession && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-flame-400 hover:text-white"
                    onClick={() => onNavigateToSession(notif.relatedSessionId)}
                  >
                    View Session
                  </Button>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="text-xs text-lilac-200/60 hover:text-white font-bold px-2 py-1"
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 text-center space-y-3 max-w-md mx-auto shadow-lifted">
          <div className="w-14 h-14 rounded-2xl bg-white/5 text-lilac-300 flex items-center justify-center mx-auto border border-lilac-300/20">
            <Bell className="w-7 h-7 text-lilac-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No notifications</h3>
            <p className="text-xs text-lilac-200/70">
              {filter === 'unread' ? 'You are all caught up! No unread alerts.' : 'No notifications received yet.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
