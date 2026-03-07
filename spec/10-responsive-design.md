# Spec: Responsive Design

Works on desktop and mobile. Readable, usable layout at every breakpoint.

## Breakpoints

| Name    | Width        |
| ------- | ------------ |
| mobile  | < 640px      |
| tablet  | 640px–1023px |
| desktop | 1024px+      |

---

## Layout Changes by Breakpoint

### Desktop (1024px+) — current layout, no change

- Left panel (upload/recipe view) + right panel (chat, 520px fixed width) side by side
- Both panels scroll independently

### Tablet (640px–1023px)

- Chat panel shrinks to 360px fixed width
- Left panel takes remaining width
- Nav stays the same

### Mobile (< 640px)

- Single column: left panel and chat panel stack vertically
- A sticky bottom tab bar switches between "Recipe" and "Chat" views
- Only one panel visible at a time (tab-based navigation)
- Chat panel takes full screen height when active
- Recipe panel scrolls normally when active

---

## Tab Bar (Mobile Only)

- Fixed to bottom of screen, above the system UI safe area
- Two tabs: "Recipe" (chef hat icon) and "Chat" (message icon)
- Active tab: lavender underline + bold label
- Tab bar background: warmWhite with top border
- Height: 56px + safe area inset

---

## Component Adjustments

### Nav

- Mobile: reduce horizontal padding to 16px
- App name stays visible

### Upload / Drop Zone (Mobile)

- Full-width, reduced padding: `32px 16px`
- Drop zone text size reduces to 18px
- Example recipe cards switch to single column grid

### Recipe Cards (Mobile)

- Single column (`grid-template-columns: 1fr`)
- Reduced padding: `24px 16px`

### Recipe View Panels (Mobile)

- Padding: `16px`
- RecipeHeaderCard: title font 20px, stacks all metadata vertically
- IngredientsList: same layout, font size 13px
- CookingSteps: step cards full width

### Chat Panel (Mobile)

- Full screen width and height when "Chat" tab is active
- Input bar stays fixed at bottom
- Mic button and send button remain accessible

### CookingProgressBar (Mobile)

- Stays sticky at top of the recipe panel view
- Full width

### PageLoadAnimation (Mobile)

- Reduce to 6 ingredients (from 10), smaller font size (8rem instead of 16rem)
- Still spring-physics fall, still covers full screen

---

## Typography Scaling

| Element             | Desktop    | Mobile |
| ------------------- | ---------- | ------ |
| Drop zone heading   | 24px       | 18px   |
| Recipe card title   | 24px       | 18px   |
| Recipe card desc    | 16px       | 13px   |
| RecipeHeaderCard h1 | 24px (2xl) | 20px   |
| Nav app name        | 15px       | 14px   |

---

## Touch & Interaction

- All tap targets minimum 44×44px on mobile
- Mic button stays 32px but surrounded by enough padding for easy tap
- Recipe cards: remove hover-only states (emoji bounce), they trigger on tap instead
- Scrollable areas use `-webkit-overflow-scrolling: touch`

---

## Implementation Approach

- Use a `useBreakpoint()` custom hook that reads `window.innerWidth` with a resize listener
- Returns `'mobile' | 'tablet' | 'desktop'`
- Conditionally render tab bar and swap layout in `page.tsx`
- All style changes applied via inline styles conditioned on breakpoint value (consistent with existing approach)
- No new CSS libraries needed
