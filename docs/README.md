# SkillSwap — Technical Documentation Index

Welcome to the **SkillSwap Technical Documentation**. This directory provides architectural specifications, functional page walkthroughs, complete REST API contracts, backend integration instructions, and end-to-end verification guides for the SkillSwap frontend platform.

---

## Documentation Contents

1. [**01. Project Overview & Architecture**](./01_PROJECT_OVERVIEW.md)
   - Executive summary of the 100% non-monetary peer exchange concept.
   - Core technology stack: React 18, TypeScript, Tailwind CSS, Vite, and Lucide icons.
   - Production Design System (Warm Minimalist · Professional SaaS):
     - **Main Background**: Warm Ivory (`#F7F4EE`) providing a calm, legible editorial canvas.
     - **Card & Navigation Surfaces**: Soft White (`#FFFEFB`) with subtle 1px Warm Borders (`#E4DACE`) and restrained shadows (`0 4px 16px rgba(41, 42, 39, 0.05)`).
     - **Secondary Surfaces**: Sand Beige (`#EFE9DF`) for internal card panels and subtle section grouping.
     - **Primary Brand / Action CTA**: Terracotta (`#C66A4A`), hover Burnt Clay (`#A95338`), with a 10px button radius.
     - **Reciprocal & Success Indicators**: Pale Sage (`#E5EDE4`) with Muted Sage (`#71836D`) text for positive two-way matches.
     - **Ratings & Achievements**: Muted Gold (`#D6A75D`) for community star ratings.
     - **Typography**: High-contrast Charcoal (`#292A27`) headings and Warm Grey (`#716D66`) body text.
   - Decoupled architecture and directory structure.

2. [**02. Pages & Features Walkthrough**](./02_PAGES_AND_FEATURES.md)
   - Complete technical breakdown of all core screens:
     - **Landing Page**: Spacious editorial hero, live reciprocal fit simulator, 3-discipline photo showcase, 3-step exchange protocol, closing CTA banner.
     - **Authentication**: Production `/login` and `/signup` flows with validation and onboarding skill capture.
     - **Dashboard**: Exchange statistics (hours swapped, rating, wishlist), action alerts, recommended reciprocal matches, and upcoming sessions.
     - **Find Matches Directory**: Keyword search, category pills, rating and availability filters, reciprocal compatibility scoring cards.
     - **Member Profile**: Detailed background, teach/learn skills, availability calendar, and verified community reviews.
     - **Session Request Modal**: 2-way reciprocal skill pairing, date/time scheduling, format selection, and agenda notes.
     - **Sessions Management**: Tabbed views for Pending, Confirmed, Completed, and Archived sessions.
     - **Session Details & Reschedule Flow**: Multi-party rescheduling with chronological history logging.
     - **Verified Review Modal**: Interactive 1–5 star rating and duplicate-prevention feedback flow.
     - **My Profile & Skills Editor**: Self-service management for personal info, teachable skills, wishlist priorities, and availability windows.
     - **Notifications Center**: Real-time alerts for requests, confirmations, reschedule proposals, and reviews.

3. [**03. REST API Specification**](./03_API_SPECIFICATION.md)
   - Comprehensive API contract for backend engineers:
     - Global standards, headers, Bearer JWT authentication, and standard error formats.
     - Authentication endpoints (`/auth/login`, `/auth/signup`, `/auth/me`, `/auth/logout`).
     - Profile and skill endpoints (`/profile`, `/profile/skills/teach`, `/profile/skills/learn`).
     - Member directory and reciprocal matching (`/members`, `/members/:id`, `/members/matches`).
     - Sessions coordination (`/sessions`, `/sessions/:id/status`).
     - Verified peer reviews (`/reviews`, `/members/:id/reviews`).
     - Notification alerts (`/notifications`, `/notifications/:id/read`).
     - Complete JSON request and response payloads with strict typing.

4. [**04. Backend Integration Guide**](./04_BACKEND_INTEGRATION_GUIDE.md)
   - 30-second connection instructions using `.env` (`VITE_API_BASE_URL`).
   - Network layer architecture ([`src/services/api.ts`](file:///e:/skillSwap/src/services/api.ts)).
   - CORS requirements for local development and production.
   - JWT Bearer token lifecycle, local storage sync, and automatic header injection.
   - Recommended reciprocal matching algorithm formula for backend implementation.
   - Pre-flight checklist for direct backend connection.

5. [**05. User Journey & Verification Walkthrough**](./05_DEMO_WALKTHROUGH.md)
   - Step-by-step end-to-end verification script testing every user journey.
   - Covers account creation, browsing directory, reciprocal match calculation, session proposals, approvals, meeting links, completions, and peer reviews.

---

## Quick Reference
- **Local Dev Server**: `http://localhost:5173`
- **Application Entry Point**: [`src/main.tsx`](file:///e:/skillSwap/src/main.tsx) & [`src/App.tsx`](file:///e:/skillSwap/src/App.tsx)
- **Deployment Platform**: Vercel (configured via [`vercel.json`](file:///e:/skillSwap/vercel.json))
- **Production Tokens**: [`tailwind.config.js`](file:///e:/skillSwap/tailwind.config.js) & [`src/index.css`](file:///e:/skillSwap/src/index.css)
