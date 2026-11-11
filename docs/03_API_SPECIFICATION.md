# SkillSwap — REST API Specification

This document provides the complete API contracts, endpoint definitions, HTTP methods, headers, and JSON request/response schemas required to connect the SkillSwap frontend to any backend server (Node.js/Express, NestJS, Python/FastAPI/Django, Go, Ruby, Java/Spring, etc.).

---

## 1. Global Standards & Authentication

### 1.1 Base URL
All endpoints are relative to the base URL configured in `.env`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```
*(If `VITE_API_BASE_URL` is omitted or empty, the frontend runs autonomously using its browser `localStorage` engine).*

### 1.2 Headers
Every authenticated request dispatched by the frontend includes:
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_or_session_token>
```

### 1.3 Standard Error Format
When an operation fails, the backend must return a JSON response with status code `>= 400`:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Introductory note must be at least 15 characters long."
}
```

---

## 2. Authentication Endpoints

### 2.1 Get Current User (`GET /auth/me`)
Fetches the session profile of the currently authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "id": "usr_94812",
  "name": "Alex Chen",
  "email": "alex.chen@example.com",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256",
  "headline": "Frontend Engineer & Web Accessibility Advocate",
  "bio": "Building accessible, fast web applications for 6+ years. Passionate about design systems.",
  "location": "San Francisco, CA (PST)",
  "interests": ["Design Systems", "Web Performance", "Coffee Brewing"],
  "teachSkills": [
    {
      "id": "tch_1",
      "name": "React & Next.js Architecture",
      "category": "Engineering & Code",
      "proficiency": "Expert",
      "yearsExperience": 6,
      "description": "Component architecture, custom hooks, and server-side rendering."
    }
  ],
  "learnSkills": [
    {
      "id": "lrn_1",
      "name": "Figma Design Systems & Auto Layout",
      "category": "Design & UX",
      "priority": "High",
      "currentLevel": "Intermediate",
      "learningGoal": "Master variables, token systems, and auto layout nested frames."
    }
  ],
  "availability": {
    "summary": "Tuesday & Thursday evenings (6:00 PM – 9:00 PM PST)",
    "days": ["Tuesday", "Thursday"],
    "timeSlots": ["6:00 PM", "7:30 PM"]
  },
  "visibility": "public",
  "rating": 4.9,
  "reviewCount": 14,
  "sessionsCompleted": 12,
  "hoursSwapped": 18,
  "joinedDate": "March 2024"
}
```

### 2.2 Login (`POST /auth/login`)
Authenticates existing members.
- **Request Body**:
```json
{
  "email": "alex.chen@example.com",
  "password": "user_password_here"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* User Object as above */ }
}
```

### 2.3 Registration (`POST /auth/signup`)
Registers a new member and captures their initial reciprocal skills.
- **Request Body**:
```json
{
  "name": "Jordan Taylor",
  "email": "jordan@example.com",
  "password": "secure_password",
  "headline": "Mobile & Flutter Developer",
  "bio": "Excited to exchange knowledge and collaborate with peers on SkillSwap!",
  "teachSkills": [
    {
      "name": "Flutter Architecture",
      "category": "Engineering & Code",
      "proficiency": "Advanced"
    }
  ],
  "learnSkills": [
    {
      "name": "UX Copywriting",
      "category": "Languages & Writing",
      "priority": "High"
    }
  ]
}
```
- **Response `201 Created`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* Newly created User Object */ }
}
```

### 2.4 Logout (`POST /auth/logout`)
Terminates the session and invalidates the token.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ "success": true }`

---

## 3. Profile & Skills Endpoints

### 3.1 Update Profile (`PUT /profile`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Alex Chen",
  "headline": "Staff Frontend Engineer",
  "bio": "Updated bio statement...",
  "location": "Seattle, WA",
  "visibility": "public",
  "interests": ["Design Systems", "Web Performance", "Rust"],
  "availability": {
    "summary": "Weekday evenings & Saturday mornings",
    "days": ["Tuesday", "Thursday", "Saturday"],
    "timeSlots": ["6:00 PM", "10:00 AM"]
  }
}
```
- **Response `200 OK`**: Updated `User` object.

### 3.2 Add Teachable Skill (`POST /profile/skills/teach`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Tailwind CSS Architecture",
  "category": "Engineering & Code",
  "proficiency": "Advanced",
  "yearsExperience": 4,
  "description": "Container queries, fluid typography, and design tokens."
}
```
- **Response `201 Created`**: Updated `User` object.

### 3.3 Remove Teachable Skill (`DELETE /profile/skills/teach/:skillId`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Updated `User` object.

### 3.4 Add Wishlist Skill (`POST /profile/skills/learn`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Conversational Spanish",
  "category": "Languages & Writing",
  "priority": "High",
  "currentLevel": "Beginner",
  "learningGoal": "Travel conversation and everyday vocabulary."
}
```
- **Response `201 Created`**: Updated `User` object.

### 3.5 Remove Wishlist Skill (`DELETE /profile/skills/learn/:skillId`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Updated `User` object.

---

## 4. Member Discovery & Reciprocal Matching

### 4.1 Get Member Directory (`GET /members`)
- **Query Params**: `?category=&availability=&search=`
- **Response `200 OK`**: Array of `User` objects (omits users with `visibility: "paused"`).

### 4.2 Get Member Detail (`GET /members/:memberId`)
- **Response `200 OK`**: Single `User` object.

### 4.3 Get Reciprocal Matches (`GET /members/matches`)
Fetches match records for the currently authenticated user with calculated two-way compatibility.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
[
  {
    "member": { /* Member User Object */ },
    "youTeach": ["React & Next.js Architecture"],
    "theyTeach": ["Figma Design Systems & Tokens"],
    "compatibilityScore": 99,
    "compatibilityReason": "Direct 2-way exchange: You can teach React, and Elena can teach you Figma."
  }
]
```

---

## 5. Sessions Management Endpoints

### 5.1 List All User Sessions (`GET /sessions`)
Returns sessions where the logged-in user is either `senderId` or `receiverId`.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
[
  {
    "id": "sess_81023",
    "senderId": "usr_94812",
    "senderName": "Alex Chen",
    "senderAvatar": "https://...",
    "receiverId": "usr_51829",
    "receiverName": "Elena Rostova",
    "receiverAvatar": "https://...",
    "teachSkillName": "React & Next.js Architecture",
    "learnSkillName": "Figma Design Systems & Tokens",
    "proposedDate": "2026-11-14",
    "proposedTime": "18:30",
    "durationMinutes": 60,
    "format": "online",
    "locationOrLink": "https://meet.google.com/skillswap-session",
    "note": "Looking forward to swapping React custom hooks for Figma tokens!",
    "status": "pending",
    "createdAt": "2026-11-09T14:20:00Z",
    "updatedAt": "2026-11-09T14:20:00Z",
    "rescheduleHistory": [],
    "reviewId": null
  }
]
```

### 5.2 Create Session Request (`POST /sessions`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "receiverId": "usr_51829",
  "teachSkillName": "React & Next.js Architecture",
  "learnSkillName": "Figma Design Systems & Tokens",
  "proposedDate": "2026-11-14",
  "proposedTime": "18:30",
  "durationMinutes": 60,
  "format": "online",
  "note": "Let's split 30m on React architecture and 30m on Figma tokens."
}
```
- **Response `201 Created`**: Returns created `SessionRequest` object with `status: "pending"`.

### 5.3 Update Session Status / Reschedule (`PATCH /sessions/:sessionId/status`)
Used to accept, decline, complete, or reschedule a session.
- **Headers**: `Authorization: Bearer <token>`
- **Accept**: `{ "status": "confirmed" }`
- **Decline**: `{ "status": "declined" }`
- **Mark Completed**: `{ "status": "completed" }`
- **Reschedule Proposal**:
```json
{
  "status": "rescheduled",
  "proposedDate": "2026-11-16",
  "proposedTime": "19:00",
  "note": "Tuesday works much better for my schedule."
}
```
- **Response `200 OK`**: Returns updated `SessionRequest` object.

---

## 6. Reviews Endpoints

### 6.1 Get Reviews for Member (`GET /members/:memberId/reviews`)
- **Response `200 OK`**: Array of `Review` objects.
```json
[
  {
    "id": "rev_39102",
    "sessionId": "sess_81023",
    "authorId": "usr_94812",
    "authorName": "Alex Chen",
    "authorAvatar": "https://...",
    "authorHeadline": "Frontend Engineer",
    "recipientId": "usr_51829",
    "rating": 5,
    "feedback": "Elena was extraordinarily structured and walked through Figma tokens effortlessly.",
    "skillExchanged": "Taught React in exchange for Figma Design",
    "createdAt": "2026-11-14T20:00:00Z"
  }
]
```

### 6.2 Submit Review (`POST /reviews`)
- **Headers**: `Authorization: Bearer <token>`
- **Validation**: Enforces `rating` between 1 and 5, minimum 15-character `feedback`, and prevents duplicate reviews for the same `sessionId`.
- **Request Body**:
```json
{
  "sessionId": "sess_81023",
  "recipientId": "usr_51829",
  "rating": 5,
  "feedback": "Outstanding session! We covered both React hooks and Figma variables in depth.",
  "skillExchanged": "Taught React in exchange for Figma Design"
}
```
- **Response `201 Created`**: Returns created `Review` object and automatically updates the recipient's average rating.

---

## 7. Notifications Endpoints

### 7.1 List User Notifications (`GET /notifications`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
[
  {
    "id": "notif_1029",
    "userId": "usr_94812",
    "type": "session_request",
    "title": "New Exchange Request",
    "message": "Elena Rostova requested a 60-min exchange.",
    "relatedSessionId": "sess_81023",
    "relatedMemberId": "usr_51829",
    "isRead": false,
    "createdAt": "2026-11-09T14:20:00Z"
  }
]
```

### 7.2 Mark Single Notification Read (`PATCH /notifications/:id/read`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ "success": true }`

### 7.3 Mark All Notifications Read (`POST /notifications/read-all`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ "success": true }`
