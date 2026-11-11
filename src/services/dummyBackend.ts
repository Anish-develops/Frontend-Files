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
import {
  INITIAL_CURRENT_USER,
  INITIAL_MEMBERS,
  INITIAL_SESSIONS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'skillswap_current_user',
  MEMBERS: 'skillswap_members',
  SESSIONS: 'skillswap_sessions',
  REVIEWS: 'skillswap_reviews',
  NOTIFICATIONS: 'skillswap_notifications',
  AUTH_TOKEN: 'skillswap_token',
};

// Helper for local storage with initial fallback
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}:`, e);
  }
}

// Compute reciprocal matches dynamically between current user and other members
export function calculateReciprocalMatches(
  currentUser: User,
  allMembers: User[]
): ReciprocalMatch[] {
  const userTeachNames = currentUser.teachSkills.map((s) => s.name.toLowerCase());
  const userLearnNames = currentUser.learnSkills.map((s) => s.name.toLowerCase());

  return allMembers
    .filter((m) => m.id !== currentUser.id && m.visibility !== 'paused')
    .map((member) => {
      // Skills you teach that this member wants to learn
      const youTeach = currentUser.teachSkills
        .filter((userTeach) =>
          member.learnSkills.some(
            (mLearn) =>
              mLearn.name.toLowerCase().includes(userTeach.name.toLowerCase()) ||
              userTeach.name.toLowerCase().includes(mLearn.name.toLowerCase())
          )
        )
        .map((s) => s.name);

      // Skills this member teaches that you want to learn
      const theyTeach = member.teachSkills
        .filter((mTeach) =>
          currentUser.learnSkills.some(
            (uLearn) =>
              uLearn.name.toLowerCase().includes(mTeach.name.toLowerCase()) ||
              mTeach.name.toLowerCase().includes(uLearn.name.toLowerCase())
          )
        )
        .map((s) => s.name);

      let score = 65; // baseline reasonable peer match
      let reason = 'General learning interest in complementary skill areas.';

      if (youTeach.length > 0 && theyTeach.length > 0) {
        score = 95 + Math.min(youTeach.length + theyTeach.length, 4);
        if (score > 99) score = 99;
        reason = `Direct 2-way exchange: You can teach ${youTeach[0]}, and ${member.name.split(' ')[0]} can teach you ${theyTeach[0]}.`;
      } else if (theyTeach.length > 0) {
        score = 84;
        reason = `${member.name.split(' ')[0]} teaches ${theyTeach[0]} which is on your wishlist.`;
      } else if (youTeach.length > 0) {
        score = 80;
        reason = `You can teach ${youTeach[0]} which ${member.name.split(' ')[0]} wants to learn.`;
      }

      return {
        member,
        youTeach,
        theyTeach,
        compatibilityScore: score,
        compatibilityReason: reason,
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

// Simulated backend API implementation with local persistence
export class DummyBackend {
  // Initialize storage if empty
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      setStored(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      setStored(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      setStored(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      setStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
  }

  // Auth
  static async getCurrentUser(): Promise<User | null> {
    this.init();
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      // If we don't have a token, return null to show login or allow demo login
      return null;
    }
    return getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
  }

  static async login(email: string, _password?: string): Promise<User> {
    this.init();
    // Simulate token
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dummy-jwt-token-' + Date.now());
    let user = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    if (email && email !== user.email) {
      user = { ...user, email };
      setStored(STORAGE_KEYS.CURRENT_USER, user);
    }
    return user;
  }

  static async signup(userData: Partial<User> & { email: string; name: string }): Promise<User> {
    this.init();
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dummy-jwt-token-' + Date.now());
    const newUser: User = {
      ...INITIAL_CURRENT_USER,
      ...userData,
      id: 'user-' + Date.now(),
      joinedDate: 'Just now',
      sessionsCompleted: 0,
      hoursSwapped: 0,
      rating: 5.0,
      reviewCount: 0,
    };
    setStored(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Profile Updates
  static async updateCurrentUser(updates: Partial<User>): Promise<User> {
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }

  static async addTeachSkill(skill: Omit<TeachSkill, 'id'>): Promise<User> {
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const newSkill: TeachSkill = { ...skill, id: 'teach-' + Date.now() };
    const updated = { ...current, teachSkills: [...current.teachSkills, newSkill] };
    setStored(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }

  static async removeTeachSkill(skillId: string): Promise<User> {
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const updated = {
      ...current,
      teachSkills: current.teachSkills.filter((s) => s.id !== skillId),
    };
    setStored(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }

  static async addLearnSkill(skill: Omit<LearnSkill, 'id'>): Promise<User> {
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const newSkill: LearnSkill = { ...skill, id: 'learn-' + Date.now() };
    const updated = { ...current, learnSkills: [...current.learnSkills, newSkill] };
    setStored(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }

  static async removeLearnSkill(skillId: string): Promise<User> {
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const updated = {
      ...current,
      learnSkills: current.learnSkills.filter((s) => s.id !== skillId),
    };
    setStored(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }

  // Members & Discovery
  static async getMembers(): Promise<User[]> {
    this.init();
    return getStored<User[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
  }

  static async getMemberById(id: string): Promise<User | null> {
    this.init();
    const members = getStored<User[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const member = members.find((m) => m.id === id);
    if (member) return member;

    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    if (current.id === id) return current;

    return null;
  }

  // Sessions
  static async getSessions(): Promise<SessionRequest[]> {
    this.init();
    return getStored<SessionRequest[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
  }

  static async createSessionRequest(request: {
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
    this.init();
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const members = getStored<User[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const target = members.find((m) => m.id === request.receiverId);

    const newSession: SessionRequest = {
      id: 'sess-' + Date.now(),
      senderId: current.id,
      senderName: current.name,
      senderAvatar: current.avatar,
      receiverId: request.receiverId,
      receiverName: target ? target.name : 'Exchange Partner',
      receiverAvatar: target ? target.avatar : '',
      teachSkillName: request.teachSkillName,
      learnSkillName: request.learnSkillName,
      proposedDate: request.proposedDate,
      proposedTime: request.proposedTime,
      durationMinutes: request.durationMinutes,
      format: request.format,
      locationOrLink: request.locationOrLink || 'https://meet.google.com/skillswap-' + Date.now().toString(36),
      note: request.note,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sessions = getStored<SessionRequest[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    setStored(STORAGE_KEYS.SESSIONS, [newSession, ...sessions]);

    // Create confirmation notification
    const notifications = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: current.id,
      type: 'session_request',
      title: 'Exchange Request Sent',
      message: `Your request was sent to ${newSession.receiverName} for ${newSession.proposedDate}.`,
      relatedSessionId: newSession.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifications]);

    return newSession;
  }

  static async updateSessionStatus(
    sessionId: string,
    status: SessionStatus,
    rescheduleDetails?: { proposedDate: string; proposedTime: string; note?: string }
  ): Promise<SessionRequest> {
    const sessions = getStored<SessionRequest[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    let updatedSession: SessionRequest | null = null;

    const newSessions = sessions.map((sess) => {
      if (sess.id === sessionId) {
        const history = sess.rescheduleHistory ? [...sess.rescheduleHistory] : [];
        if (rescheduleDetails) {
          history.push({
            proposedBy: current.name,
            proposedDate: rescheduleDetails.proposedDate,
            proposedTime: rescheduleDetails.proposedTime,
            note: rescheduleDetails.note,
            timestamp: new Date().toISOString(),
          });
        }

        updatedSession = {
          ...sess,
          status,
          proposedDate: rescheduleDetails ? rescheduleDetails.proposedDate : sess.proposedDate,
          proposedTime: rescheduleDetails ? rescheduleDetails.proposedTime : sess.proposedTime,
          updatedAt: new Date().toISOString(),
          rescheduleHistory: history,
        };
        return updatedSession;
      }
      return sess;
    });

    if (!updatedSession) {
      throw new Error('Session not found');
    }

    setStored(STORAGE_KEYS.SESSIONS, newSessions);

    // If marked completed, increment sessions completed and hours swapped
    if (status === 'completed') {
      const hoursToAdd = (updatedSession as SessionRequest).durationMinutes / 60;
      const updatedUser: User = {
        ...current,
        sessionsCompleted: current.sessionsCompleted + 1,
        hoursSwapped: Math.round((current.hoursSwapped + hoursToAdd) * 10) / 10,
      };
      setStored(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }

    // Add status notification
    const notifications = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const notifTitle =
      status === 'confirmed'
        ? 'Session Confirmed'
        : status === 'rescheduled'
        ? 'New Time Proposed'
        : status === 'completed'
        ? 'Session Marked Completed'
        : status === 'declined'
        ? 'Session Declined'
        : 'Session Updated';

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: current.id,
      type: status === 'confirmed' ? 'request_accepted' : 'session_rescheduled',
      title: notifTitle,
      message: `Status changed to ${status} for exchange with ${
        (updatedSession as SessionRequest).senderId === current.id
          ? (updatedSession as SessionRequest).receiverName
          : (updatedSession as SessionRequest).senderName
      }.`,
      relatedSessionId: sessionId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifications]);

    return updatedSession;
  }

  // Reviews
  static async getReviewsForMember(memberId: string): Promise<Review[]> {
    this.init();
    const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return reviews.filter((r) => r.recipientId === memberId);
  }

  static async submitReview(data: {
    sessionId: string;
    recipientId: string;
    rating: number;
    feedback: string;
    skillExchanged: string;
  }): Promise<Review> {
    this.init();
    const current = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const sessions = getStored<SessionRequest[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);

    // Check if duplicate review already exists
    const existing = reviews.find((r) => r.sessionId === data.sessionId);
    if (existing) {
      throw new Error('This session has already been reviewed.');
    }

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      sessionId: data.sessionId,
      authorId: current.id,
      authorName: current.name,
      authorAvatar: current.avatar,
      authorHeadline: current.headline,
      recipientId: data.recipientId,
      rating: data.rating,
      feedback: data.feedback,
      skillExchanged: data.skillExchanged,
      createdAt: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);

    // Update session with reviewId
    const updatedSessions = sessions.map((s) =>
      s.id === data.sessionId ? { ...s, reviewId: newReview.id } : s
    );
    setStored(STORAGE_KEYS.SESSIONS, updatedSessions);

    // Update recipient's rating
    const members = getStored<User[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const memberToUpdate = members.find((m) => m.id === data.recipientId);
    if (memberToUpdate) {
      const newCount = memberToUpdate.reviewCount + 1;
      const newRating =
        Math.round(
          ((memberToUpdate.rating * memberToUpdate.reviewCount + data.rating) / newCount) * 10
        ) / 10;
      const updatedMembers = members.map((m) =>
        m.id === data.recipientId ? { ...m, rating: newRating, reviewCount: newCount } : m
      );
      setStored(STORAGE_KEYS.MEMBERS, updatedMembers);
    }

    return newReview;
  }

  // Notifications
  static async getNotifications(): Promise<NotificationItem[]> {
    this.init();
    return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static async markNotificationRead(id: string): Promise<void> {
    const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  static async markAllNotificationsRead(): Promise<void> {
    const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => ({ ...n, isRead: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  // Reset to default sample data for testing
  static resetToDefault(): void {
    setStored(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
    setStored(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    setStored(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    setStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dummy-jwt-token-active');
  }
}

