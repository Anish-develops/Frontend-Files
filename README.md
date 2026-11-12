# SkillSwap — Peer-to-Peer Skill Exchange Frontend

> **Mastery swapped, not bought. Trade what you know for what you don't.**  
> A production-grade, non-monetary peer learning web platform designed for engineers, designers, and specialists to exchange skills 1:1.

---

## Highlights

- **Strict 1:1 Reciprocal Matching**: Highlights two-way skill alignment ("You teach X; they teach Y") with contextual compatibility scoring and plain-language fit explanations.
- **Warm Minimalist, High-Taste Editorial Design**:
  - **Base Canvas**: Warm Ivory (`#F7F4EE`) providing an inviting, calm, and readable background.
  - **Surfaces**: Soft White (`#FFFEFB`) elevated surfaces with 1px Warm Borders (`#E4DACE`) and restrained shadows (`0 4px 16px rgba(41, 42, 39, 0.05)`).
  - **Primary Brand / Action**: Terracotta (`#C66A4A`, hover `#A95338`, 10px radius) for key calls to action and primary navigation buttons.
  - **Semantic Accents**: Pale Sage (`#E5EDE4`) with Muted Sage (`#71836D`) text for reciprocal matches and positive statuses; Soft Peach (`#EEDDD2`) for skill chips.
  - **Ratings & Highlights**: Muted Gold (`#D6A75D`) for star ratings and reviews.
  - **Typography**: Inter / sans-serif with high-contrast Charcoal (`#292A27`) headings and Warm Grey (`#716D66`) body copy.
- **Production-Ready**: Demo switcher shortcuts retired from the primary UI; complete authentication flows (`/login` and `/signup` with initial skill onboarding) ready for direct REST backend connection.
- **Dual-Mode API Architecture**: Operates autonomously offline using browser storage (`localStorage`), and connects seamlessly to any live REST API by setting `VITE_API_BASE_URL`.
- **Complete Feature Set (11 Core Screens & Modals)**:
  1. Welcome / Landing Page (with live simulator & curated specialist grid)
  2. Authentication (Production Login & Signup with initial skill capture)
  3. Dashboard (exchange stats, action alerts, recommended reciprocal matches)
  4. Find Matches (directory search, category pills, availability & rating filters)
  5. Member Profile & Match Detail (skills curriculum, bio, verified peer reviews)
  6. Session Request Dialog (2-way reciprocal skill pairing & scheduling)
  7. Sessions Management (Pending, Confirmed, Completed, Archived tabs)
  8. Session Detail Modal (multi-party reschedule flow with chronological history)
  9. Review Flow (1–5 star ratings & single-review duplicate prevention)
  10. My Profile & Skills Manager (teachable skills, learning wishlist, availability)
  11. Notifications Center (real-time exchange alerts and unread status)

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at **`http://localhost:3000`**.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.

---

## Connecting to a Backend

The application is structured for direct backend integration. All network requests are isolated in `src/services/api.ts`.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your REST API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
3. Restart the dev server (`npm run dev`). The frontend will automatically route all authentication, matching, sessions, and review requests to your live endpoints using standard `Authorization: Bearer <token>` headers.

---

## Documentation

Comprehensive technical documentation is available in the [`docs/`](./docs/README.md) folder:

- [**01. Project Overview & Architecture**](./docs/01_PROJECT_OVERVIEW.md) — Tech stack, folder structure, and design system.
- [**02. Pages & Features Walkthrough**](./docs/02_PAGES_AND_FEATURES.md) — Comprehensive report on each screen, component, and interaction.
- [**03. REST API Specification**](./docs/03_API_SPECIFICATION.md) — Endpoint specifications, JSON request/response contracts, and error schemas.
- [**04. Backend Integration Guide**](./docs/04_BACKEND_INTEGRATION_GUIDE.md) — Integration setup, CORS requirements, and matching algorithm guidance.
- [**05. User Journey & Verification Walkthrough**](./docs/05_DEMO_WALKTHROUGH.md) — Step-by-step testing script for the full exchange lifecycle.

---

## License & Attribution

Designed and engineered for the SkillSwap Peer Exchange platform. Built with React, TypeScript, Tailwind CSS, and Vite.
