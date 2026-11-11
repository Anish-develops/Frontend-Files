# SkillSwap — User Journey & Verification Walkthrough

This document outlines the step-by-step verification script to test every user journey, business flow, and screen in the current version of the SkillSwap web platform.

---

## Prerequisites
- The frontend development server is running at **`http://localhost:3000`**.
- Open the application in Google Chrome or any modern browser.

---

## Phase 1: Landing Page & Live Reciprocal Simulator

1. **Open the Homepage (`http://localhost:3000`)**:
   - Observe the deep dark orange-reddish gradient canvas with radiant ember undertones.
   - Verify the top floating capsule navbar with brand logo, central route pills (`Overview`, `Explore Skills`, `How It Works`), and auth CTAs (`Log In`, `Get Started`).
   - Read the defining headline: **`MASTERY SWAPPED, NOT BOUGHT.`** with glowing flame gradient on `"SWAPPED,"`.
2. **Test the Live Reciprocal Match Simulator**:
   - In the right-hand hero card (*Live Reciprocal Match Engine*), click the **"What You Teach"** dropdown and select `React & Next.js Architecture`.
   - Click the **"What You Want to Learn"** dropdown and select `Figma Design Systems & Tokens`.
   - Observe the calculated card updating dynamically to: **`Two-Way Match: 99% Fit`** with recommended reciprocal partners.
3. **Explore Curated Specialists Grid**:
   - Scroll down to the **"Real Specialists. Real Knowledge. Zero Cash."** section.
   - Inspect the three real photography cards:
     - Elena Rostova (Design Systems, 5.0 rating).
     - Marcus Vance (Distributed Systems, 4.9 rating).
     - Sofia Morales (Languages & UX, 5.0 rating).
   - Click **"Request Swap"** on any card to navigate directly into the platform.

---

## Phase 2: Production Authentication & Onboarding

SkillSwap operates with production-grade authentication flows (prototype switcher shortcuts are retired from the primary UI):

### Path A: Register a New Member Profile
1. Click **"Get Started"** in the top navigation or hero.
2. Fill out the registration form:
   - **Full Name**: e.g., `Jordan Taylor`
   - **Email**: `jordan@example.com`
   - **Password**: `secure_password`
   - **Headline**: `Senior React Developer & Open Source Contributor`
   - **First Skill You Can Teach**: `React & Next.js Architecture`
   - **First Skill You Want to Learn**: `Figma Design Systems & Tokens`
3. Click **"Publish Profile & Enter Platform"**.
4. You are immediately authenticated, your initial skills are stored, and you are redirected to your personalized **Dashboard**.

### Path B: Sign In to an Existing Account
1. Click **"Log In"** in the top navigation.
2. Enter credentials:
   - When running against the built-in offline engine:
     - **Email**: `alex.chen@example.com`
     - **Password**: Any password (e.g. `password123`)
3. Click **"Sign In to Account"**.
4. You are logged in as **Alex Chen** (Frontend Engineer) and redirected to the **Dashboard**.

---

## Phase 3: Dashboard & Reciprocal Alignment

1. **Inspect Personal Greeting Header**:
   - Observe user avatar, name, headline, location, and quick counters for offered skills vs wishlist targets.
2. **Check the Four Platform Metrics**:
   - *Swaps Completed* (e.g. `12` completed 1:1 sessions).
   - *Hours Swapped* (e.g. `18h` in flame orange).
   - *Community Rating* (e.g. `4.9` with star icon).
   - *Active Wishlist* (e.g. `3` target skills).
3. **Review Contextual Action Banners**:
   - If incoming requests are pending, an amber alert banner prompts immediate review.
   - If a completed session has not yet been reviewed, a flame banner prompts feedback submission.
4. **Examine Recommended Reciprocal Matches**:
   - Top-ranked peer will be **Elena Rostova** with **99% Reciprocal Fit**.
   - Read the plain-language explanation: *"Direct 2-way exchange: You can teach React, and Elena can teach you Figma."*

---

## Phase 4: Directory Discovery & Multi-Facet Filtering

1. **Navigate to "Find Matches"**:
   - Click **"Find Matches"** in the top navigation or click **"Explore Directory"** from the hero.
2. **Test Keyword Search**:
   - Type `"Figma"` in the search bar. The list instantly filters to members teaching or learning Figma.
   - Type `"Spanish"`. The list updates to Sofia Morales and other language specialists.
3. **Test Category Chips**:
   - Click **"Design & UX"**, **"Engineering & Code"**, or **"Languages & Writing"**. Observe instant client-side filtering.
4. **Test Availability & Rating Dropdowns**:
   - Change availability to `Weekends` or rating to `4.9+`.
   - Notice the **"Reset"** button appears. Click **"Reset"** to restore all partners.

---

## Phase 5: Proposing a Reciprocal Session

1. **Open Member Profile**:
   - On **Elena Rostova's** match card, click **"View Profile"**.
   - Review her detailed background, teach skills, wishlist priorities, and verified community reviews.
2. **Initiate Request**:
   - Click the prominent **"Request Exchange"** button.
3. **Configure 2-Way Reciprocal Proposal**:
   - In the modal dialog:
     - *You will teach*: Select `React & Next.js Architecture`.
     - *Elena will teach*: Select `Figma Design Systems & Tokens`.
     - *Proposed Date*: Pick a date 2 days in the future.
     - *Proposed Time*: Pick `06:30 PM`.
     - *Duration*: Select `60 minutes`.
     - *Format*: Select **Online Video Call**.
     - *Agenda Note*: Enter at least 15 characters, e.g.:
       > *"Hi Elena, excited to swap React custom hook patterns for your Figma token architecture!"*
4. **Submit Request**:
   - Click **"Send Exchange Request"**.
   - Notice the toast confirmation: *"Exchange request sent to Elena Rostova!"* and modal dismissal.

---

## Phase 6: Session Coordination & Rescheduling

1. **Navigate to "Sessions"**:
   - Click **"Sessions"** in the top navigation bar.
2. **Inspect Tabbed Organization**:
   - **Pending Requests Tab**: Shows outgoing and incoming proposals with the proposed reciprocal agenda.
   - **Confirmed Tab**: Shows active appointments.
   - **Completed Tab**: Historical record of finished sessions.
3. **Test Session Inspection & Rescheduling**:
   - On any session card, click **"View Details"**.
   - In the modal, click **"Propose New Time"**.
   - Select a new date, time, and enter an explanatory note (e.g. *"Tuesday evening works better"*).
   - Click **"Send New Time"**.
   - Observe the session status updating to **"Time Proposed"** and the proposal logged into the chronological reschedule history.
4. **Accepting a Session**:
   - Click **"Accept"** on any pending incoming session.
   - Status instantly transitions to **Confirmed** and a Google Meet virtual room link is generated.

---

## Phase 7: Attending & Completing the Session

1. **Join the Call**:
   - Under the **Confirmed & Upcoming** tab, locate the confirmed session card.
   - Click the **"Join Call"** link to verify that the external virtual room link opens.
2. **Mark Completed**:
   - Click the green **"Mark Completed"** button.
   - Status immediately transitions to **Completed**, incrementing both members' session counters and unlocking the review submission flow.

---

## Phase 8: Submitting a Verified Review & Duplicate Prevention

1. **Trigger Review Modal**:
   - On the completed session card, click **"Leave Review"**.
2. **Select Star Rating & Enter Feedback**:
   - Hover over the 5 stars and click the **5th star** (caption reads: *"Outstanding — Highly recommended partner"*).
   - In the written feedback box, enter:
     > *"Elena was extraordinarily structured and walked through Figma tokens effortlessly. Highly recommend!"*
3. **Submit Verified Feedback**:
   - Click **"Submit Verified Review"**.
   - Notice the toast notification: *"Review submitted for Elena Rostova!"*.
4. **Verify Duplicate Prevention**:
   - The session card now permanently displays a green badge: **"Review Submitted"**.
   - Re-submitting feedback for the same session is disabled, enforcing authentic reputation.

---

## Phase 9: Profile Customization & Notifications

1. **Navigate to "My Profile"**:
   - Click the user avatar in the top right and select **"My Profile & Skills"**.
2. **Update Personal Info**:
   - Modify your headline or bio and click **"Save Profile Changes"**.
3. **Add a Teachable Skill**:
   - Click **"+ Add Teachable Skill"**.
   - Enter skill name, category, proficiency level (`Advanced`), and description. Click **"Save Skill"**.
   - Verify the new skill chip appears in your profile.
4. **Manage Interests**:
   - Type a new interest (e.g. `Tailwind CSS`) into the input and press Enter. Click the `×` on any chip to remove it.
5. **Check Notifications Center**:
   - Click **"Notifications"** in the top navigation.
   - Filter by **"All"** vs **"Unread"**.
   - Click **"Mark all read"** and verify that all unread indicator pings clear.
