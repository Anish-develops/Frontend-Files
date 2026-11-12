export type SkillCategory =
  | 'Engineering & Code'
  | 'Programming'
  | 'Design & UX'
  | 'UI/UX Design'
  | 'Graphic Design'
  | 'Product & Strategy'
  | 'Languages & Writing'
  | 'Content Writing'
  | 'Data & Analytics'
  | 'Marketing & Media'
  | 'Digital Marketing'
  | 'Video Editing'
  | 'Music & Arts'
  | 'Music'
  | 'Photography'
  | 'Fitness & Wellness';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type ProfileVisibility = 'public' | 'members_only' | 'paused';
export type SessionFormat = 'online' | 'in_person';
export type SessionStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'declined'
  | 'cancelled';

export interface TeachSkill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsExperience?: number;
  description?: string;
}

export interface LearnSkill {
  id: string;
  name: string;
  category: SkillCategory;
  priority: PriorityLevel;
  currentLevel?: string;
  learningGoal?: string;
}

export interface UserAvailability {
  summary: string;
  days: string[];
  timeSlots: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  interests: string[];
  teachSkills: TeachSkill[];
  learnSkills: LearnSkill[];
  availability: UserAvailability;
  visibility: ProfileVisibility;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  hoursSwapped: number;
  joinedDate: string;
}

export interface SessionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  teachSkillName: string; // What sender teaches
  learnSkillName: string; // What receiver teaches (what sender learns)
  proposedDate: string; // YYYY-MM-DD
  proposedTime: string; // HH:mm
  durationMinutes: number;
  format: SessionFormat;
  locationOrLink?: string;
  note: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  rescheduleHistory?: {
    proposedBy: string;
    proposedDate: string;
    proposedTime: string;
    note?: string;
    timestamp: string;
  }[];
  reviewId?: string;
}

export interface Review {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline?: string;
  recipientId: string;
  rating: number; // 1 to 5
  feedback: string;
  skillExchanged: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type:
    | 'session_request'
    | 'request_accepted'
    | 'request_declined'
    | 'session_rescheduled'
    | 'session_completed'
    | 'review_received';
  title: string;
  message: string;
  relatedSessionId?: string;
  relatedMemberId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReciprocalMatch {
  member: User;
  youTeach: string[]; // skills you can offer that this member desires
  theyTeach: string[]; // skills this member offers that you desire
  compatibilityScore: number;
  compatibilityReason: string;
}

