# SkillSwap — Pages & Features Documentation

This document provides a comprehensive functional report of every page, modal dialog, interactive component, and business logic flow implemented in the current version of the SkillSwap web platform.

---

## Screen Directory

1. [Landing Page (Showcase & Simulator)](#1-landing-page)
2. [Authentication Pages (Login & Signup)](#2-authentication-pages)
3. [Dashboard (Member Command Center)](#3-dashboard)
4. [Find Matches (Reciprocal Discovery Directory)](#4-find-matches)
5. [Member Profile & Verified Reviews](#5-member-profile--verified-reviews)
6. [Session Request Dialog (Two-Way Skill Pairing)](#6-session-request-dialog)
7. [Sessions Management (Tabbed Exchange Lifecycle)](#7-sessions-management)
8. [Session Detail Modal & Reschedule Flow](#8-session-detail-modal--reschedule-flow)
9. [Verified Review & Rating Modal](#9-verified-review--rating-modal)
10. [My Profile & Skills Editor](#10-my-profile--skills-editor)
11. [Notifications Center](#11-notifications-center)

---

### 1. Landing Page
**Source**: [`src/pages/LandingPage.tsx`](file:///e:/skillSwap/src/pages/LandingPage.tsx)

The public homepage communicates the core philosophy of SkillSwap—exchanging proven craft directly between peers with zero monetary fees—using high-contrast editorial typography and interactive preview tools.

#### Key Functional Sections:
- **Clean Soft White Navbar**:
  - Soft White surface (`bg-surface/95 backdrop-blur-md border-b border-border shadow-subtle`) anchored at the top of the viewport.
  - Brand identity with solid Terracotta emblem (`#C66A4A`).
  - Centered navigation links: `Overview`, `Explore Skills`, and `How It Works`.
  - Direct authentication actions: `Log In` and `Get Started` (Terracotta fill, 10px radius).
- **Asymmetric Hero Section**:
  - **Left Column (7 cols)**:
    - Subtle badge: `"100% NON-MONETARY PEER LEARNING"` in Soft Peach (`#EEDDD2`) and Terracotta (`#C66A4A`).
    - Clear editorial headline:
      ```
      Mastery swapped,
      not bought.
      ```
      Set in crisp Charcoal (`#292A27`) text with `"not bought."` highlighted in Terracotta (`#C66A4A`).
    - Value proposition: *"Trade what you know for what you don’t. Direct 1:1 reciprocal exchange sessions between verified engineers, designers, and domain specialists."*
    - Primary CTA buttons: `Get Started Free` (Terracotta fill with arrow) and `Explore Directory` (Soft White with Warm Border).
    - Trust indicators: Zero monetary fee, strictly 1:1 sessions, verified peer ratings.
  - **Right Column (5 cols)**:
    - **Interactive Live Reciprocal Match Engine**: A functional micro-simulator widget. Visitors select what they teach (e.g. *React & Next.js Architecture*) and what they want to learn (e.g. *Figma Design Systems & Tokens*).
    - Live computed badge: Displays an instant `Two-Way Match: 99% Fit` badge in Pale Sage (`#E5EDE4`) with Muted Sage (`#71836D`) text.
- **Curated Specialists Showcase**:
  - Three rich editorial cards on Soft White surfaces with 1px Warm Borders:
    1. **Elena Rostova** — Principal Design Systems Lead (Seattle, WA) | Teaches: Figma Tokens & Layout | Learns: React Architecture | Rating: 5.0 (19 completed swaps).
    2. **Marcus Vance** — Staff Distributed Systems Architect (Austin, TX) | Teaches: Redis & Sharded DBs | Learns: TypeScript Generics | Rating: 4.9 (15 completed swaps).
    3. **Sofia Morales** — Native Spanish Coach & UX Strategist (New York, NY) | Teaches: Conversational Spanish | Learns: CSS & Tailwind Architecture | Rating: 5.0 (26 completed swaps).
  - One-click `"Request Swap"` action on each card.
- **The Exchange Protocol (3-Step How It Works)**:
  - Soft White cards with clean Terracotta index numbers:
    - `01`: **Publish Your Profile** — List mastered skills and target wishlist.
    - `02`: **Pair on Two-Way Fit** — Match based on mutual skill needs.
    - `03`: **Split the Hour & Review** — Meet 1:1 on video (e.g. 30m each) and leave verified community reviews.
- **Closing Statement Banner**:
  - *"STOP PAYING FOR COURSES YOU NEVER FINISH."*
  - Dual CTAs to join the network or browse active skills.

---

### 2. Authentication Pages
**Source**: [`src/pages/LoginPage.tsx`](file:///e:/skillSwap/src/pages/LoginPage.tsx) and [`src/pages/SignupPage.tsx`](file:///e:/skillSwap/src/pages/SignupPage.tsx)

Production-ready authentication views directly integrated with the auth client layer. Prototype/demo persona switcher buttons have been cleanly commented out to deliver a final product ready for production backend connection.

#### Login Page Features:
- Form fields for Email Address and Password with validation.
- Responsive validation error display with styled alert messages.
- Clean redirect to `/dashboard` upon successful authentication.
- Navigation link to `/signup` for new visitors.
- Non-monetary security badge (*"Strictly 1:1 reciprocal exchange • Zero cash required"*).

#### Signup Page Features:
- Comprehensive registration fields: Full Name, Email, Password, Professional Headline / Title.
- **Initial Reciprocal Pairing Setup**: Collects the first skill the user can teach and the first skill they want to learn during signup. This ensures the recommendation algorithm immediately calculates reciprocal matches the moment their profile is created.
- Saves profile to store/backend and redirects directly to the dashboard.

---

### 3. Dashboard
**Source**: [`src/pages/DashboardPage.tsx`](file:///e:/skillSwap/src/pages/DashboardPage.tsx)

The daily command center for authenticated members, aggregating reciprocal matches, active sessions, and community reputation.

#### Key Functional Sections:
- **Welcome Banner**:
  - Displays user avatar, name, headline, location, and quick badges for skills to teach vs wishlist targets.
  - Quick action buttons: `Edit Skills` and `Explore Matches`.
- **Four Platform Metrics**:
  1. *Swaps Completed*: Count of 1:1 reciprocal sessions fulfilled.
  2. *Hours Swapped*: Total mutual learning time in hours.
  3. *Community Rating*: Aggregated 1–5 star rating with total review count.
  4. *Active Wishlist*: Count of skills targeted for learning.
- **Contextual Action Alert Banners**:
  - **Pending Incoming Requests Banner**: Highlighted in warm amber with count and direct link to review incoming proposals.
  - **Completed Review Needed Banner**: Highlighted in flame orange with partner name and direct link to submit verified post-session feedback.
- **Recommended Reciprocal Matches (2-Column Grid)**:
  - Dynamic list of members whose teaching skills match your wishlist and vice-versa.
  - Displays compatibility score (e.g. `98% Reciprocal Fit`) and plain-language explanation.
  - Buttons for `View Profile` and `Request Swap`.
- **Upcoming Confirmed Sessions**:
  - Displays scheduled sessions with partner avatar, date, time, duration, and direct `Join Call` Google Meet virtual room links.
  - Quick action to mark session as completed once finished.
- **Quick Learning Wishlist Card**:
  - Side widget listing current wishlist skills with priority badges (`High`, `Medium`, `Low`) and a quick link to manage them in profile settings.

---

### 4. Find Matches
**Source**: [`src/pages/FindMatchesPage.tsx`](file:///e:/skillSwap/src/pages/FindMatchesPage.tsx)

A discovery directory allowing members to explore the exchange network and filter peers on multi-facet criteria.

#### Filter & Search Features:
- **Keyword Search**: Debounced search matching against member name, headline, teachable skills, wishlist skills, and bio.
- **Category Filter Chips**:
  - `All`, `Engineering & Code`, `Design & UX`, `Product & Strategy`, `Languages & Writing`, `Data & Analytics`.
  - Active category highlighted in vibrant flame gradient; inactive in frosted translucent chips.
- **Availability Filter**: Dropdown filtering by `Any Availability`, `Evenings`, or `Weekends`.
- **Minimum Rating Filter**: Dropdown filtering by `Any Rating`, `4.8+`, or `4.9+`.
- **Reset Filters Button**: Appears when any filter is active, restoring default state in 1 click.
- **Live Match Counter**: Shows total matching members and reciprocal fit ranking.
- **MatchCard Architecture**:
  - Member avatar, headline, rating, location, and completed swaps.
  - Luminous purple compatibility reason pill.
  - Two-way breakdown: *They can teach you* (emerald badges) vs *You can teach them* (flame badges).
  - General availability summary snippet.
  - Direct CTAs: `View Profile` and `Request Swap`.
- **Empty State**: Illustrated card with reset action when no peers match the search query.

---

### 5. Member Profile & Verified Reviews
**Source**: [`src/pages/MemberProfilePage.tsx`](file:///e:/skillSwap/src/pages/MemberProfilePage.tsx)

In-depth public profile view showing a member's credentials, curriculum, availability, and community trust history.

#### Sections:
- **Profile Header Card**:
  - Avatar, full name, headline, location, member since date, verified exchanges counter, and star rating.
  - Prominent `Request Exchange` button (hidden when viewing your own profile).
  - Biographical background statement.
  - Focus areas & interest tags.
- **Skills They Teach**:
  - Detailed cards displaying each skill name, proficiency level (`Beginner`, `Intermediate`, `Advanced`, `Expert`), years of experience, and topics covered.
- **Skills They Want to Learn (Wishlist)**:
  - Cards displaying target skills, priority levels (`High`, `Medium`, `Low`), current knowledge level, and specific learning goals.
- **General Availability Window**:
  - Human-readable summary (e.g. *Tuesday & Thursday evenings*) and daily schedule chips.
- **Verified Peer Reviews List**:
  - Feed of reviews submitted by partners of completed exchanges.
  - Each review displays reviewer avatar, reviewer headline, star rating, feedback text, exchanged skills badge, and timestamp.
  - Empty state when member is newly onboarded.

---

### 6. Session Request Dialog
**Source**: [`src/components/matches/RequestSessionModal.tsx`](file:///e:/skillSwap/src/components/matches/RequestSessionModal.tsx)

The modal dialog that formalizes a reciprocal exchange proposal between two members.

#### Form Controls & Validation:
- **Partner Header**: Summary card showing partner name, avatar, headline, and general availability window.
- **Reciprocal Skill Pairing**:
  - *You Will Teach*: Select dropdown populated with your teachable skills.
  - *Partner Will Teach*: Select dropdown populated with partner's teachable skills.
- **Date & Time Picker**:
  - Date input validated to prevent past dates.
  - Time dropdown offering clean slots from 09:00 AM to 08:30 PM.
- **Duration**: Selector for 30, 45, 60, or 90 minutes.
- **Format Toggle**:
  - *Online Video Call*: Generates a Google Meet room link.
  - *In-Person Meetup*: Local coordination for coffee shop or workspace meetings.
- **Introductory Note & Agenda**: Textarea with minimum 15-character validation to encourage clear learning agendas.
- **Submission Feedback**: Loading spinner, modal dismissal, toast alert, and instant session insertion into the store.

---

### 7. Sessions Management
**Source**: [`src/pages/SessionsPage.tsx`](file:///e:/skillSwap/src/pages/SessionsPage.tsx)

A comprehensive lifecycle hub organizing all historical, active, and pending learning appointments.

#### Tabbed Lifecycle Views:
1. **Pending Requests**:
   - Shows incoming requests requiring your response, plus outgoing proposals waiting for partner action.
   - Shows unread count badge.
   - Actions on card: `Accept`, `Decline`, `Reschedule`.
2. **Confirmed & Upcoming**:
   - Scheduled sessions with verified date and time.
   - Actions: `Join Call` (external video link), `Mark Completed`, `View Details`.
3. **Completed**:
   - Historical record of successfully executed swaps.
   - Actions: `Leave Review` (or `Review Submitted` badge).
4. **Past / Declined**:
   - Archived record of declined or cancelled requests.

---

### 8. Session Detail Modal & Reschedule Flow
**Source**: [`src/components/sessions/SessionDetailModal.tsx`](file:///e:/skillSwap/src/components/sessions/SessionDetailModal.tsx)

Comprehensive inspection modal for any session with built-in multi-party rescheduling.

#### Features:
- Partner info, current status badge, reciprocal agenda breakdown (what each party teaches).
- Proposed date, time, duration, and format.
- Meeting link banner for confirmed video sessions.
- Chronological reschedule history log showing previous proposals, timestamps, and notes.
- **Inline Reschedule Form**:
  - Date picker and time picker for proposed alternative time.
  - Textarea explaining the reason for rescheduling.
  - Automatically transitions session status to `rescheduled` and notifies the partner.

---

### 9. Verified Review & Rating Modal
**Source**: [`src/components/sessions/ReviewModal.tsx`](file:///e:/skillSwap/src/components/sessions/ReviewModal.tsx)

Post-session evaluation dialog that enforces community accountability.

#### Features:
- Displays partner name, avatar, and exact skills exchanged during the session.
- **1–5 Star Rating Selector**:
  - Interactive hover state with descriptive captions:
    - 5 Stars: *Outstanding — Highly recommended partner*
    - 4 Stars: *Great — Smooth and productive session*
    - 3 Stars: *Good — Met expectations*
    - 2 Stars: *Fair — Some coordination difficulties*
    - 1 Star: *Poor — Skill exchange was not fulfilled*
- **Written Feedback**: Required textarea with 15-character validation.
- **Duplicate Review Prevention**: Once submitted, the session record is updated with `reviewId`, preventing duplicate feedback while incrementing the recipient's average rating and total review count.

---

### 10. My Profile & Skills Editor
**Source**: [`src/pages/MyProfilePage.tsx`](file:///e:/skillSwap/src/pages/MyProfilePage.tsx)

Self-service profile and exchange preference management center.

#### Features:
- **Personal Information**: Full Name, Headline / Title, Location / Timezone, Bio.
- **Profile Visibility Selector**:
  - `Public`: Discoverable by all members.
  - `Members Only`: Visible to authenticated users.
  - `Paused`: Temporarily hides profile from search results without deleting any data.
- **Focus Areas & Interests**: Tag manager allowing 1-click addition and deletion of interest chips.
- **Skills You Can Teach**:
  - List of active teachable skills with proficiency tags.
  - Modal to add new skills with name, category, proficiency level (`Beginner`, `Intermediate`, `Advanced`, `Expert`), and curriculum description.
- **Skills You Want to Learn (Wishlist)**:
  - List of target skills with priority tags.
  - Modal to add wishlist items with name, category, priority level (`High`, `Medium`, `Low`), and specific learning goal.
- **Availability Window**: General weekly availability summary input.

---

### 11. Notifications Center
**Source**: [`src/pages/NotificationsPage.tsx`](file:///e:/skillSwap/src/pages/NotificationsPage.tsx)

Activity feed tracking reciprocal interactions across the platform.

#### Features:
- **Notification Types Handled**:
  - `session_request`: New incoming exchange proposal.
  - `request_accepted`: Partner accepted your session.
  - `request_declined`: Partner declined your proposal.
  - `session_rescheduled`: Partner proposed a new date/time.
  - `session_completed`: Session concluded, prompts review.
  - `review_received`: Partner submitted a review for your exchange.
- **Interactive Controls**:
  - Filter toggle between `All` and `Unread`.
  - 1-click `Mark all read` button.
  - Individual `Mark read` action and unread pulse indicators.
  - Direct `View Session` action button navigating straight to the relevant appointment.
