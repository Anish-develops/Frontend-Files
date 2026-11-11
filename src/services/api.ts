import {
  User,
  SessionRequest,
  Review,
  NotificationItem,
  ReciprocalMatch,
  SessionStatus,
  TeachSkill,
  LearnSkill,
} from '../types';
import { DummyBackend, calculateReciprocalMatches } from './dummyBackend';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic fetch wrapper for when a live REST API backend is configured.
 */
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('skillswap_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Standard API Client interface for SkillSwap frontend.
 * If VITE_API_BASE_URL is defined, dispatches real HTTP calls to the backend.
 * Otherwise, falls back to DummyBackend with full localStorage persistence.
 */
export const api = {
  auth: {
    async getCurrentUser(): Promise<User | null> {
      if (API_BASE_URL) {
        return fetchClient<User>('/auth/me').catch(() => null);
      }
      return DummyBackend.getCurrentUser();
    },
    async login(email: string, password?: string): Promise<User> {
      if (API_BASE_URL) {
        const data = await fetchClient<{ user: User; token: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('skillswap_token', data.token);
        return data.user;
      }
      return DummyBackend.login(email, password);
    },
    async signup(data: Partial<User> & { email: string; name: string }): Promise<User> {
      if (API_BASE_URL) {
        const res = await fetchClient<{ user: User; token: string }>('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        localStorage.setItem('skillswap_token', res.token);
        return res.user;
      }
      return DummyBackend.signup(data);
    },
    async logout(): Promise<void> {
      if (API_BASE_URL) {
        await fetchClient('/auth/logout', { method: 'POST' }).catch(() => {});
      }
      return DummyBackend.logout();
    },
  },

  profile: {
    async update(updates: Partial<User>): Promise<User> {
      if (API_BASE_URL) {
        return fetchClient<User>('/profile', {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
      }
      return DummyBackend.updateCurrentUser(updates);
    },
    async addTeachSkill(skill: Omit<TeachSkill, 'id'>): Promise<User> {
      if (API_BASE_URL) {
        return fetchClient<User>('/profile/skills/teach', {
          method: 'POST',
          body: JSON.stringify(skill),
        });
      }
      return DummyBackend.addTeachSkill(skill);
    },
    async removeTeachSkill(skillId: string): Promise<User> {
      if (API_BASE_URL) {
        return fetchClient<User>(`/profile/skills/teach/${skillId}`, {
          method: 'DELETE',
        });
      }
      return DummyBackend.removeTeachSkill(skillId);
    },
    async addLearnSkill(skill: Omit<LearnSkill, 'id'>): Promise<User> {
      if (API_BASE_URL) {
        return fetchClient<User>('/profile/skills/learn', {
          method: 'POST',
          body: JSON.stringify(skill),
        });
      }
      return DummyBackend.addLearnSkill(skill);
    },
    async removeLearnSkill(skillId: string): Promise<User> {
      if (API_BASE_URL) {
        return fetchClient<User>(`/profile/skills/learn/${skillId}`, {
          method: 'DELETE',
        });
      }
      return DummyBackend.removeLearnSkill(skillId);
    },
  },

  members: {
    async getAll(): Promise<User[]> {
      if (API_BASE_URL) {
        return fetchClient<User[]>('/members');
      }
      return DummyBackend.getMembers();
    },
    async getById(id: string): Promise<User | null> {
      if (API_BASE_URL) {
        return fetchClient<User>(`/members/${id}`).catch(() => null);
      }
      return DummyBackend.getMemberById(id);
    },
    async getMatches(currentUser: User): Promise<ReciprocalMatch[]> {
      if (API_BASE_URL) {
        return fetchClient<ReciprocalMatch[]>('/members/matches');
      }
      const allMembers = await DummyBackend.getMembers();
      return calculateReciprocalMatches(currentUser, allMembers);
    },
  },

  sessions: {
    async getAll(): Promise<SessionRequest[]> {
      if (API_BASE_URL) {
        return fetchClient<SessionRequest[]>('/sessions');
      }
      return DummyBackend.getSessions();
    },
    async create(request: {
      receiverId: string;
      teachSkillName: string;
      learnSkillName: string;
      proposedDate: string;
      proposedTime: string;
      durationMinutes: number;
      format: 'online' | 'in_person';
      locationOrLink?: string;
      note: string;
    }): Promise<SessionRequest> {
      if (API_BASE_URL) {
        return fetchClient<SessionRequest>('/sessions', {
          method: 'POST',
          body: JSON.stringify(request),
        });
      }
      return DummyBackend.createSessionRequest(request);
    },
    async updateStatus(
      sessionId: string,
      status: SessionStatus,
      rescheduleDetails?: { proposedDate: string; proposedTime: string; note?: string }
    ): Promise<SessionRequest> {
      if (API_BASE_URL) {
        return fetchClient<SessionRequest>(`/sessions/${sessionId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, ...rescheduleDetails }),
        });
      }
      return DummyBackend.updateSessionStatus(sessionId, status, rescheduleDetails);
    },
  },

  reviews: {
    async getForMember(memberId: string): Promise<Review[]> {
      if (API_BASE_URL) {
        return fetchClient<Review[]>(`/members/${memberId}/reviews`);
      }
      return DummyBackend.getReviewsForMember(memberId);
    },
    async submit(data: {
      sessionId: string;
      recipientId: string;
      rating: number;
      feedback: string;
      skillExchanged: string;
    }): Promise<Review> {
      if (API_BASE_URL) {
        return fetchClient<Review>('/reviews', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      return DummyBackend.submitReview(data);
    },
  },

  notifications: {
    async getAll(): Promise<NotificationItem[]> {
      if (API_BASE_URL) {
        return fetchClient<NotificationItem[]>('/notifications');
      }
      return DummyBackend.getNotifications();
    },
    async markAsRead(id: string): Promise<void> {
      if (API_BASE_URL) {
        await fetchClient(`/notifications/${id}/read`, { method: 'PATCH' });
        return;
      }
      return DummyBackend.markNotificationRead(id);
    },
    async markAllAsRead(): Promise<void> {
      if (API_BASE_URL) {
        await fetchClient('/notifications/read-all', { method: 'POST' });
        return;
      }
      return DummyBackend.markAllNotificationsRead();
    },
  },

  demo: {
    reset(): void {
      DummyBackend.resetToDefault();
    },
  },
};
