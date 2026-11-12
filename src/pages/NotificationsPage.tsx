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
          <div className="p-2 rounded-[8px] bg-primary-soft text-primary-hover border border-border">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        );
      case 'request_accepted':
        return (
          <div className="p-2 rounded-[8px] bg-success-soft text-success border border-success/20">
            <Check className="w-4 h-4" />
          </div>
        );
      case 'request_declined':
        return (
          <div className="p-2 rounded-[8px] bg-danger-soft text-danger border border-danger-border">
            <X className="w-4 h-4" />
          </div>
        );
      case 'session_rescheduled':
        return (
          <div className="p-2 rounded-[8px] bg-primary-soft text-primary-hover border border-border">
            <Clock className="w-4 h-4" />
          </div>
        );
      case 'session_completed':
      case 'review_received':
        return (
          <div className="p-2 rounded-[8px] bg-surface text-rating border border-border">
            <Star className="w-4 h-4 fill-rating" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-[8px] bg-surface-muted text-text-secondary border border-border">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Exchange requests, schedule updates, and community feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-[9px] border border-border p-1 bg-surface-muted text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-[6px] transition-colors ${
                filter === 'all' ? 'bg-surface text-text-primary shadow-subtle font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-[6px] transition-colors ${
                filter === 'unread' ? 'bg-surface text-text-primary shadow-subtle font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Unread ({notifications.filter((n) => !n.isRead).length})
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5 text-text-secondary" />
            <span>Mark all read</span>
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      {displayedNotifs.length > 0 ? (
        <div className="bg-surface rounded-[14px] border border-border shadow-card divide-y divide-border overflow-hidden">
          {displayedNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.isRead ? 'bg-primary-soft/30' : 'hover:bg-surface-muted/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-text-primary text-xs sm:text-sm">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-normal">{notif.message}</p>
                  <p className="text-[11px] text-text-secondary/70 font-normal">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {notif.relatedSessionId && onNavigateToSession && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary-hover font-medium"
                    onClick={() => onNavigateToSession(notif.relatedSessionId)}
                  >
                    View Session
                  </Button>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="text-xs text-text-secondary hover:text-text-primary font-medium px-2 py-1"
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
        <div className="p-10 bg-surface rounded-[14px] border border-border text-center space-y-2.5 max-w-md mx-auto shadow-card">
          <div className="w-10 h-10 rounded-full bg-surface-muted text-text-secondary flex items-center justify-center mx-auto border border-border">
            <Bell className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary">No notifications</h3>
            <p className="text-xs text-text-secondary">
              {filter === 'unread' ? 'You are all caught up! No unread alerts.' : 'No notifications received yet.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
