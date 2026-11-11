# SkillSwap — Frontend Design Prompt

Act as a senior product designer and frontend engineer. Design and build a polished, responsive, interactive frontend for **SkillSwap**, a peer-to-peer skill exchange platform. Members teach skills they already know in exchange for learning skills from other members. The exchange is non-monetary.

## 1. Scope: frontend only

Build only the frontend experience.

- Use realistic sample data and client-side state to demonstrate the product.
- Do not build or specify backend services, APIs, databases, server architecture, authentication infrastructure or deployment.
- Do not imply that sample data is real or synchronized with other users.
- Where a real service would eventually be needed, demonstrate the intended experience with a clear frontend-only interaction.

## 2. Product requirements

The interface should support these product concepts:

- Member profiles with a bio, interests, profile image/avatar, skills they can teach, skills they want to learn, proficiency, priority, availability and profile visibility.
- Match discovery based on reciprocal skill needs: both members should benefit from the exchange.
- Match cards that clearly explain the two-way exchange, for example: “You teach JavaScript; they teach UI Design”.
- Match suggestions with illustrative compatibility, rating/review count and availability context.
- Session requests with a proposed date, time and short note.
- Session request states and actions: pending, accept, reject and propose a new time.
- Upcoming/confirmed and completed session views.
- Post-session review interface with a 1–5 rating and written feedback.
- Dashboard with suggested matches, upcoming sessions, pending requests, notifications, rating/review summary and simple learning activity.

## 3. Required screens

Create the following screens and connect them through working navigation:

1. **Welcome / Landing**
   - Explain the skill-exchange concept in plain language.
   - Provide a clear entry point into the demo.
   - Keep the page concise and product-focused.

2. **Dashboard**
   - Personal greeting.
   - Recommended matches.
   - Upcoming sessions and pending requests.
   - Rating/review summary.
   - Notifications and recent activity.
   - A useful first-time empty state.

3. **Find Matches**
   - Search by member name or skill.
   - Filters for relevant skill/category and availability.
   - Match cards showing reciprocal skill fit.
   - Clear “View profile” and “Request exchange” actions.
   - No-results state.

4. **Member Profile / Match Detail**
   - Avatar, name, short bio and interests.
   - Skills the member can teach.
   - Skills the member wants to learn.
   - Availability.
   - Rating, review count and written reviews.
   - Clear session-request action.

5. **Sessions**
   - Separate Pending, Upcoming/Confirmed and Completed views.
   - Show participants, skill exchange, proposed date/time and status.
   - Provide the correct next action for each status.

6. **Session Request Dialog**
   - Show the proposed skill exchange.
   - Collect date, time and a short note.
   - Validate required fields.
   - Show a clear request-submitted confirmation.

7. **Session Detail**
   - Show request/session information and status.
   - Pending requests: accept, reject or propose another time.
   - Confirmed sessions: show the session details and completion action.
   - Completed sessions: provide the review action.

8. **My Profile**
   - Edit personal details, bio and interests.
   - Add, edit and remove skills to teach.
   - Add, edit and remove skills to learn.
   - Set proficiency for teachable skills and priority for learning skills.
   - Edit availability and profile visibility.

9. **Notifications**
   - Show session requests, confirmations, reschedules and reviews.
   - Distinguish read and unread items.
   - Include a mark-as-read interaction.

10. **Review Flow**
    - Allow a 1–5 rating and written feedback after a completed session.
    - Show a submission confirmation.
    - Prevent duplicate review submission for the same demo session.

## 4. Visual direction

Create a modern, calm, confident SaaS product interface.

- Use a warm near-white or light neutral background.
- Use dark, readable typography and one restrained purple accent.
- Use consistent spacing, clear hierarchy and clean alignment.
- Prefer subtle borders, modest corner radii and minimal shadows.
- Create reusable visual patterns for buttons, forms, cards, tabs, badges and dialogs.
- Keep the interface practical, focused and believable.
- Make the reciprocal skill exchange the most visually understandable part of match discovery.

### Avoid visual clichés and AI slop

Do not use:
- Purple/blue gradient washes.
- Glowing blobs or glassmorphism.
- Floating 3D objects or random abstract illustrations.
- Sparkle icons or decorative AI motifs.
- Fake testimonials, invented brand partnerships or unsupported claims.
- Excessive pill-shaped elements, unnecessary charts or decorative dashboards.
- Oversized marketing headings inside the application.
- Unnecessary animation.

Do not describe SkillSwap as an AI-powered product.

## 5. Interaction requirements

Every visible primary control must work in the frontend demo.

- Navigation opens the correct screen and indicates the active destination.
- Search and filters update the displayed matches.
- Match cards open the member detail screen or request dialog.
- Valid request submission creates a visible pending demo session.
- Accept and reject actions visibly update the session status.
- Proposing another time updates the displayed proposed date/time.
- Completing a confirmed session changes its status.
- Completion enables the review form.
- A demo session can be reviewed only once.
- Profile edits and skill additions/removals update the visible UI.
- Notifications can be marked as read.
- Dialogs can be opened, closed and submitted.
- Forms show useful validation and success/error feedback.
- Provide meaningful empty states when lists have no items.
- Do not leave visible buttons or navigation items inert.

## 6. Responsive design and accessibility

- Design for desktop first, then adapt carefully to tablet and mobile.
- Use a responsive sidebar/navigation pattern.
- Avoid horizontal overflow on narrow screens.
- Keep cards, forms, dialogs and navigation usable on touch devices.
- Use semantic labels and accessible form controls.
- Provide visible keyboard focus states.
- Maintain sufficient text and control contrast.
- Do not communicate status through color alone.
- Do not make important actions available only on hover.

## 7. Content and copy style

Use concise, natural product language.

Examples:
- “Find a learning partner”
- “You can teach”
- “You want to learn”
- “Propose a time”
- “Request sent”
- “Exchange confirmed”

Avoid hype, filler, vague labels and unnecessarily long descriptions. Do not introduce money, credits, paid lessons or features not supported by the product requirements.

## 8. Demo data and frontend state

Use believable sample members, skills, availability, matches, sessions, reviews and notifications. Make the data varied enough to demonstrate the interface.

Use frontend-only state/local storage as appropriate so interactions remain visible during the demo. Clearly treat all records and actions as sample/demo content.

Any compatibility score must be illustrative and accompanied by a plain-language explanation. Do not present an undefined score as a real production algorithm.

## 9. Final deliverable

Produce a cohesive, polished frontend prototype with:

- All required screens.
- Consistent design tokens and reusable components.
- Responsive desktop, tablet and mobile layouts.
- Realistic sample data.
- Functional client-side interactions.
- Clear empty, validation, success and error states.
- A consistent navigation and interaction model.

Prioritize usability, clarity, visual consistency and completeness over adding extra features. Keep the design simple, precise and production-minded. The most important experience is helping a member quickly understand **what they can teach, what they can learn, and why a particular person is a good exchange partner**.
