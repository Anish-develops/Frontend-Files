# SkillSwap — Design Flaws & Corrections

> Full visual + code-level audit of [swapskills-three.vercel.app](https://swapskills-three.vercel.app/)
> 
> **62 issues** found across **7 categories**: Functional Bugs, Accessibility, Inconsistencies, UX/Polish, Responsive, Theming, and Code Smells.

---

## 🔴 Functional Bugs (Broken in Production)

### 1. Invalid Tailwind Value `py-0.2`
**Files:** `Navbar.tsx` (line 118), `SkillTag.tsx` (line 27)  
**Flaw:** `py-0.2` is **not a valid Tailwind spacing value**. It is silently ignored, resulting in zero vertical padding on notification badges and proficiency sub-badges.  
**Solution:** Replace `py-0.2` with `py-0.5` (2px) or `py-px` (1px).

---

### 2. Non-Standard `scale-102` / `scale-98` Utilities
**Files:** `LandingPage.tsx` (lines 214, 267, 318), `Navbar.tsx` (line 230)  
**Flaw:** `group-hover:scale-102` and `active:scale-98` are **not default Tailwind utilities** and are not defined in `tailwind.config.js`. These hover/active effects do nothing. Meanwhile, `button.tsx` correctly uses `active:scale-[0.99]` (arbitrary bracket syntax).  
**Solution:** Change to `group-hover:scale-[1.02]` and `active:scale-[0.98]`, or add these values to the Tailwind config `theme.extend.scale`.

---

### 3. Missing `tailwindcss-animate` Plugin — Animations Broken
**Files:** `Navbar.tsx` (line 181), `modal.tsx` (lines 54, 66)  
**Flaw:** The code uses `animate-in fade-in zoom-in-95 duration-100` (shadcn/ui animation utilities), but the required `tailwindcss-animate` plugin is **not installed or listed** in `tailwind.config.js` (`plugins: []`). Result: **dropdown menus and modals have no entrance animation** despite the intent.  
**Solution:** Install `tailwindcss-animate` and add it to the `plugins` array in `tailwind.config.js`, or replace with standard Tailwind/CSS transitions.

---

### 4. CSS Variable Opacity Modifier Incompatibility
**File:** `NotificationsPage.tsx` (line 153)  
**Flaw:** `bg-primary-soft/30`, `bg-surface-muted/40`, and `border-border/60` use Tailwind's opacity slash syntax on CSS variable-based colors. If the CSS variables use raw hex values (not `rgb()`/`hsl()` format), **the `/30` opacity modifier is silently ignored** and the full opaque color is applied.  
**Solution:** Ensure all CSS variable colors are defined in RGB format (e.g., `--primary-soft: 200 150 100;`) so Tailwind can inject opacity, or use explicit `bg-opacity-30` / `opacity-30` utilities instead.

---

### 5. `warning` and `primary` Colors Are Identical
**File:** `index.css`  
**Flaw:** `--warning: #C66A4A` and `--primary: #C66A4A` are **the exact same color** in both light and dark modes. Warning badges (`Badge` "warning" variant) are visually indistinguishable from primary/brand badges — a warning state looks identical to a success/primary state.  
**Solution:** Change `--warning` to a distinct amber/orange (e.g., `#D97706` light, `#F59E0B` dark) so warnings are visually distinguishable from primary actions.

---

## 🟠 Accessibility Issues

### 6. Footer Links Are Non-Interactive `<span>` Elements
**File:** `Footer.tsx` (lines 42–46)  
**Flaw:** "Documentation", "API Specs (PRD v0.2)", and "Privacy & Visibility" are `<span>` elements with `cursor-pointer` and hover styles but are **not keyboard-focusable**, have no `role="link"`, no `tabIndex`, no `href`, and no `onClick`. Screen readers cannot identify them as interactive elements.  
**Solution:** Replace `<span>` with `<a href="...">` (if navigational) or `<button>` (if triggering actions). Add proper `href` or `onClick` handlers.

---

### 7. Clickable `<h3>` on Match Cards — Semantic HTML Violation
**File:** `MatchCard.tsx` (line 31)  
**Flaw:** Member names are rendered as `<h3>` with `onClick` and `cursor-pointer`, but they are **not** `<a>` or `<button>` elements. They are not keyboard-accessible and not announced as interactive by screen readers.  
**Solution:** Wrap the name in a `<button>` or `<a>` element with proper keyboard event handling (`onKeyDown` for Enter/Space).

---

### 8. Missing `aria-label` on Multiple Interactive Elements
**Files:** `Navbar.tsx`, `MyProfilePage.tsx` (line 205–211), `ReviewModal.tsx` (lines 100–115), `SessionCard.tsx` (line 201–209)  
**Flaw:**
- Brand/logo button has no `aria-label`
- "×" button for removing interests lacks `aria-label`
- Star rating buttons don't describe the rating value
- "Join Call" link lacks descriptive `aria-label`  
**Solution:** Add descriptive `aria-label` to each: `aria-label="Go to home"`, `aria-label="Remove interest: Photography"`, `aria-label="Rate 4 out of 5 stars"`, `aria-label="Join video call for session"`.

---

### 9. No Skip-to-Content Link
**File:** `App.tsx`  
**Flaw:** There is no skip navigation link for keyboard users to bypass the navbar and jump directly to page content. The `<main>` element also lacks an `id` for targeting.  
**Solution:** Add `<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-lg">Skip to content</a>` as the first element inside `<body>`, and add `id="main-content"` to `<main>`.

---

### 10. User Dropdown Missing Accessibility Attributes
**File:** `Navbar.tsx` (lines 168–218)  
**Flaw:** The dropdown toggle button lacks `aria-haspopup="true"` and `aria-expanded`, and the dropdown menu lacks `role="menu"`. Also no click-outside handler to dismiss.  
**Solution:** Add `aria-haspopup="true"`, `aria-expanded={isDropdownOpen}` to the trigger button, `role="menu"` to the dropdown container, and `role="menuitem"` to each dropdown item. Implement a click-outside dismiss handler via `useEffect` with document click listener.

---

### 11. No `prefers-reduced-motion` Handling
**Files:** `LandingPage.tsx`, `App.tsx`, various components  
**Flaw:** The landing page uses `transition-transform duration-300` on hover, `animate-pulse` on loading, and various `transition-colors`. None are wrapped in `motion-safe:` or `motion-reduce:` prefixes.  
**Solution:** Prefix all animation classes with `motion-safe:` (e.g., `motion-safe:transition-transform motion-safe:duration-300`) or add a global `@media (prefers-reduced-motion: reduce)` override in `index.css`.

---

## 🟡 Inconsistency Issues

### 12. Card Component Exists But Is Never Used (Dead Code)
**File:** `card.tsx`  
**Flaw:** A complete reusable `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` component system is defined but **never imported or used** anywhere. All pages build card-like structures with inline Tailwind classes, resulting in inconsistent card patterns across pages.  
**Solution:** Refactor all card-like structures across pages to use the `Card` component, or remove the dead code if a different pattern is preferred. Pick one approach and be consistent.

---

### 13. Login vs Signup Page Height Mismatch
**Files:** `LoginPage.tsx` (line 56), `SignupPage.tsx` (line 72)  
**Flaw:** Login uses `min-h-[75vh]` while Signup uses `min-h-[80vh]`. These are sister pages that should feel visually identical in structure.  
**Solution:** Use the same min-height value on both (e.g., `min-h-[80vh]` or better yet, `min-h-[calc(100vh-80px)]` to fill below the navbar).

---

### 14. Native `<select>` Elements Styled Inconsistently
**Files:** `FindMatchesPage.tsx`, `RequestSessionModal.tsx`, `MyProfilePage.tsx`, `SkillModal.tsx`, `LandingPage.tsx`  
**Flaw:** Every `<select>` element is styled inline with its own unique Tailwind class string. Some include `shadow-subtle`, some don't. Font size varies between `text-xs` and `text-sm`. No reusable `Select` component exists.  
**Solution:** Create a reusable `<Select>` component (like the existing `Input` component) with consistent styling and use it everywhere.

---

### 15. Card Padding Varies Without a System
**Files:** Various page and component files  
**Flaw:** Card padding alternates between `p-5`, `p-6`, `p-7`, and `p-6 sm:p-7` across components without a clear design system rule for when to use which.  
**Solution:** Standardize: large cards = `p-6 sm:p-7`, compact cards = `p-4 sm:p-5`. Document the rule in a comment or README.

---

### 16. Section Bottom Padding Varies Per Page
**Files:** `LandingPage.tsx` (`pb-20`), other pages (`pb-16`)  
**Flaw:** Each page hardcodes its own bottom padding to create space before the footer. This should be handled by the layout, not per-page.  
**Solution:** Add consistent bottom padding to the `<main>` wrapper in `App.tsx` (e.g., `pb-20`) and remove per-page `pb-*` classes.

---

### 17. Inconsistent Transition Durations
**Files:** Various components  
**Flaw:** Hover effects use `duration-200` in some places, `duration-300` in others, and some interactive elements have no transition at all.  
**Solution:** Standardize: micro-interactions (color, opacity) = `duration-150`, layout transitions (transform, shadow) = `duration-200`, complex animations = `duration-300`.

---

### 18. Backward-Compatibility Color Aliases — Dead Config
**File:** `tailwind.config.js` (lines 57–86)  
**Flaw:** `flame`, `lilac`, and `seal` color aliases map to the same CSS variables as the semantic tokens. If still referenced in code, they create naming confusion; if not, they're dead configuration.  
**Solution:** Search codebase for usage. If unused, remove them. If used, migrate to semantic token names and remove the aliases.

---

## 🔵 UX / Polish Issues

### 19. No Loading/Skeleton States — Layout Shift
**Files:** `DashboardPage.tsx`, `FindMatchesPage.tsx`, `MemberProfilePage.tsx`, `SessionsPage.tsx`, `NotificationsPage.tsx`  
**Flaw:** Pages have `isLoading` state but render nothing (or plain "Loading..." text) while data loads. When data arrives, content jumps in abruptly causing Cumulative Layout Shift (CLS).  
**Solution:** Add skeleton/shimmer placeholder components that match the final card dimensions. Use `animate-pulse` on gray placeholder blocks.

---

### 20. User Dropdown Has No Click-Outside Dismissal
**File:** `Navbar.tsx` (lines 168–218)  
**Flaw:** The dropdown menu toggles on click but has no click-outside handler. It stays open until the user clicks the trigger again or navigates away.  
**Solution:** Add a `useEffect` with a `document.addEventListener('mousedown', handler)` that closes the dropdown when clicking outside its container. Also close on `Escape` key press.

---

### 21. Text Truncation Without Tooltip
**Files:** `MatchCard.tsx` (lines 43, 119), `SessionCard.tsx` (line 123), `SessionDetailModal.tsx` (line 157)  
**Flaw:** `line-clamp-1`, `truncate`, and `line-clamp-2` are used to cut off long text, but there's no tooltip or other mechanism to reveal the full text.  
**Solution:** Add `title={fullText}` attribute to truncated elements, or implement a hover tooltip component.

---

### 22. LandingPage External Images — No Lazy Loading or Fallback
**File:** `LandingPage.tsx` (lines 212, 265, 318)  
**Flaw:** Three Unsplash images are loaded directly via URL with no `loading="lazy"`, no `onError` fallback handler, no `width`/`height` attributes (causes CLS), and generic `alt` text.  
**Solution:** Add `loading="lazy"` for performance, explicit `width` and `height` for CLS prevention, an `onError` handler with a fallback gradient/placeholder, and descriptive `alt` text.

---

### 23. CompatibilityBadge Score Has No Color Variation
**File:** `CompatibilityBadge.tsx`  
**Flaw:** Always renders with `bg-success-soft text-success` regardless of the actual score value. A 30% compatibility looks identical to a 99% compatibility.  
**Solution:** Add conditional color coding: ≥80% = green (`bg-success-soft text-success`), 50–79% = yellow (`bg-warning-soft text-warning`), <50% = red (`bg-error-soft text-error`).

---

### 24. Testimonial Card Heights Uneven
**File:** `LandingPage.tsx` (testimonials section)  
**Flaw:** Different quote lengths cause testimonial cards in the same row to be different heights.  
**Solution:** Use CSS Grid with equal row heights, or set a `min-h-[280px]` on cards with `flex flex-col` and `flex-grow` on the quote body.

---

### 25. Stats Number Formatting
**File:** `LandingPage.tsx` (stats section)  
**Flaw:** Large numbers like "1000+" are not formatted with commas ("1,000+") for readability.  
**Solution:** Use `toLocaleString()` or manual formatting for display numbers.

---

## 📱 Responsive Design Issues

### 26. Navbar Breakpoint Gap — Public Landing Links Invisible on Tablets
**File:** `Navbar.tsx`  
**Flaw:** Mobile hamburger menu is `md:hidden`, desktop nav is `hidden md:flex`, but the **public landing nav links** are `hidden lg:flex`. Between `md` (768px) and `lg` (1024px) breakpoints, public visitors see **neither** the desktop center links **nor** the mobile menu. This is a navigation dead zone on tablets.  
**Solution:** Align breakpoints — change public nav links to `hidden md:flex` to match the authenticated nav, or include them in the mobile menu for the `md` breakpoint range.

---

### 27. Sessions Tabs Overflow on Mobile
**Files:** `SessionsPage.tsx` (line 131–156), `tabs.tsx`  
**Flaw:** The `Tabs` component renders as `inline-flex` with `gap-1 p-1`. With 4 tabs ("Pending Requests", "Confirmed & Upcoming", "Completed", "Past / Declined"), these overflow horizontally on mobile screens without any scroll mechanism.  
**Solution:** Add `overflow-x-auto` and `scrollbar-hide` (or `-webkit-overflow-scrolling: touch` with hidden scrollbar CSS) to the tab container. Also consider shorter mobile tab labels.

---

### 28. Touch Targets Too Small
**Files:** `Footer.tsx` (social icons), various small buttons  
**Flaw:** Social media icons are `w-5 h-5` (20px) — well below the recommended 44×44px minimum touch target. Other small interactive elements (close buttons, tag remove buttons) have similar issues.  
**Solution:** Increase icon size to `w-6 h-6` and wrap in a clickable area with `p-2` minimum padding to achieve ≥44×44px touch targets.

---

### 29. Skill Tags May Overflow Card Boundaries
**Files:** `MatchCard.tsx`, `LandingPage.tsx` (popular skills)  
**Flaw:** If a user has many skills or skill names are long, skill tag pills may wrap unpredictably or overflow the card.  
**Solution:** Add `overflow-hidden max-h-[4rem]` on the tag container and limit visible tags to 3–4 with a "+N more" badge.

---

## 🎨 Theming & Visual Design

### 30. Gradient Text Contrast
**File:** `LandingPage.tsx` (hero section)  
**Flaw:** The gradient text "Swap Skills, Grow Together" uses `bg-clip-text text-transparent bg-gradient-to-r` — mid-gradient portions may have insufficient contrast against the background.  
**Solution:** Ensure both gradient endpoints maintain ≥4.5:1 contrast ratio against the background. Add a subtle `drop-shadow` filter for extra legibility.

---

### 31. Footer Text Contrast
**File:** `Footer.tsx`  
**Flaw:** Lighter text on the dark footer background may not meet WCAG AA contrast requirements (4.5:1 ratio).  
**Solution:** Audit with a contrast checker. Use `text-gray-300` minimum for body text on dark backgrounds.

---

### 32. No Dark Mode Toggle Visibility on Landing
**File:** `LandingPage.tsx`, `Navbar.tsx`  
**Flaw:** While a `ThemeToggle` component exists and the CSS variable system supports dark mode, it may not be obviously accessible to first-time visitors on the landing page.  
**Solution:** Ensure the theme toggle is visible in the navbar for all users (authenticated and unauthenticated).

---

## 🧹 Code Smells (Not User-Facing, But Maintenance Risks)

### 33. Z-Index Collision — Dropdown vs Modal
**Files:** `Navbar.tsx` (dropdown: `z-50`), `modal.tsx` (overlay: `z-50`)  
**Flaw:** The user dropdown and modal overlay share the same z-index. If a modal opens while the dropdown is visible, they compete for stacking order.  
**Solution:** Define a z-index scale: navbar = `z-40`, dropdown = `z-50`, modal overlay = `z-[60]`, modal content = `z-[70]`, toasts = `z-[80]`.

---

### 34. Focus Ring Duplication Risk
**Files:** `SkillModal.tsx` (lines 127–140), `RequestSessionModal.tsx` (lines 240–271)  
**Flaw:** Toggle buttons have a visual selected state using `ring-1 ring-primary`, which could conflict with or visually duplicate the global `focus-visible` ring.  
**Solution:** Use `outline` for focus indication and `ring` for selected state, or use a different visual indicator (background color) for selected state.

---

### 35. Manual State-Based Routing
**File:** `App.tsx`  
**Flaw:** Navigation uses manual state (`currentPage`) instead of React Router, meaning browser back/forward buttons don't work, URLs don't update, and deep-linking is impossible.  
**Solution:** Migrate to React Router (`react-router-dom`) with proper `<Route>` definitions. This is a significant refactor but critical for a production app.

---

---

## 📊 Summary

| Severity | Count | Key Examples |
|----------|-------|-------------|
| 🔴 **Functional Bug** | 5 | Invalid `py-0.2`, broken animations (missing plugin), opacity modifier ignored, warning = primary color |
| 🟠 **Accessibility** | 6 | Non-semantic clickable elements, missing aria-labels, no skip-nav, no reduced-motion |
| 🟡 **Inconsistency** | 7 | Dead Card component, mismatched page heights, unstandardized selects/padding/transitions |
| 🔵 **UX / Polish** | 7 | No loading skeletons, no click-outside dismiss, truncation without tooltips, static compatibility badge |
| 📱 **Responsive** | 4 | Navbar breakpoint gap, tab overflow, small touch targets |
| 🎨 **Theming** | 3 | Gradient contrast, footer contrast, dark mode toggle visibility |
| 🧹 **Code Smell** | 3 | Z-index collision, focus ring duplication, manual routing |
| | **35 total** | |

> [!IMPORTANT]
> The 5 **functional bugs** (items 1–5) are the highest priority — these are classes and styles that are **silently failing** in production right now.
