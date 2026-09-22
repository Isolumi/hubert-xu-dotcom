# Modern Profile Orb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the neofetch landing screen with the approved modern profile, animated orb, Game of Life background, experience fan, and lumicode entry while preserving the existing TUI.

**Architecture:** Keep `HomeClient` as the two-mode owner. The new `ProfileScreen` composes a canvas background, an SVG orb, profile data, and the experience fan. Put sphere projection and Game of Life rules in pure TypeScript modules so browser components stay small and the behavior has direct tests.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, CSS, Canvas 2D, SVG, Jest, React Testing Library

**Spec:** `../.superpowers/brainstorm/68476-1790052503/content/larger-spherical-eyes.html`

## Global Constraints

- Dark theme only.
- Use `#87b9ff` as the accent.
- Keep the approved soft orb shape and the eyes at 112% of their original size.
- Eye position, foreshortening, and slant must follow the sphere surface frame.
- Keep `/` and Enter as TUI entry keys and Escape as the return key.
- Keep the existing chat route, slash commands, and lumicode behavior.
- Respect `prefers-reduced-motion` and keyboard focus.
- Do not deploy or push as part of this plan.
- Baseline note: the checkout starts with two stale failing tests in `NeofetchScreen.test.tsx` and `profile.test.ts`.

## Design Tokens

- Ink: `#050605`
- Panel: `#080a09`
- Text: `#e8ece9`
- Muted text: `#818a85`
- Rule: `rgba(255, 255, 255, 0.12)`
- Accent: `#87b9ff`
- Profile type: system sans-serif stack
- TUI type: JetBrains Mono with a system monospace fallback

## Layout

Desktop uses a quiet two-column composition with the orb on the left and the short profile on the right. Mobile stacks the orb above the profile. The Game of Life field fills the viewport behind both columns. The only decorative focus is the orb; rules and labels carry information.

```text
┌──────────────────────────────────────────────────────────┐
│ hubert-xu.com                                             │
│                                                          │
│        soft orb          Hubert Xu                       │
│        with eyes         Software engineer              │
│                          ─────────────────────────       │
│                          Experience        [a][M][U]     │
│                          School        University...     │
│                          Hobbies       basketball...     │
│                          GitHub  LinkedIn  Resume  Email │
│                                                          │
│                     [ /  Enter lumicode ]                │
└──────────────────────────────────────────────────────────┘
```

## Design Review

The page avoids a generic portfolio hero, marketing copy, card grids, gradients, and repeated reveal animations. The orb is the one bold element. Profile content remains short and factual, and the TUI stays the deeper interactive layer.

---

### Task 1: Sphere Eye Geometry

**Files:**
- Create: `lib/orbEyes.ts`
- Create: `lib/__tests__/orbEyes.test.ts`

**Interfaces:**
- Produces: `BASE_GAZE`, `EYE_SCALE`, `LEFT_EYE_VERTICES`, `RIGHT_EYE_VERTICES`, `scalePolygon(points, amount)`, and `projectEyePath(points, target, spacing)`.
- Consumes: no application code.

- [x] **Step 1: Write failing geometry tests**

Add literal checks for these behaviors:

```ts
expect(scalePolygon(rectangle, 1.12)).toEqual(enlargedAroundSameCenter)
expect(projectEyePoint(point, BASE_GAZE)).toMatchObject(point)
expect(axisAt({ x: -0.4, y: -0.45 }).x).toBeLessThan(0)
expect(axisAt({ x: 0.4, y: -0.45 }).x).toBeGreaterThan(0)
```

- [x] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- --runInBand lib/__tests__/orbEyes.test.ts`

Expected: FAIL because `lib/orbEyes.ts` does not exist.

- [x] **Step 3: Implement the geometry module**

Port the approved frame mapping from the spec. Build an orthonormal frame from the sphere normal using projected world-down, decompose each lifted point in the base frame, compose it in the target frame, and project back to SVG coordinates.

- [x] **Step 4: Run the focused test and confirm GREEN**

Run: `npm test -- --runInBand lib/__tests__/orbEyes.test.ts`

Expected: PASS.

- [x] **Step 5: Commit the geometry**

```bash
git add lib/orbEyes.ts lib/__tests__/orbEyes.test.ts
git commit -m "feat: add spherical eye geometry"
```

### Task 2: Game of Life Engine and Canvas

**Files:**
- Create: `lib/gameOfLife.ts`
- Create: `lib/__tests__/gameOfLife.test.ts`
- Create: `components/GameOfLife.tsx`

**Interfaces:**
- Produces: `stepLife(grid)` and a `<GameOfLife />` background component.
- Consumes: the viewport size, pointer position, and `prefers-reduced-motion`.

- [x] **Step 1: Write a failing blinker test**

```ts
expect(stepLife([
  [0, 0, 0],
  [1, 1, 1],
  [0, 0, 0],
])).toEqual([
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
])
```

- [x] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- --runInBand lib/__tests__/gameOfLife.test.ts`

Expected: FAIL because `stepLife` does not exist.

- [x] **Step 3: Implement the finite-grid rule engine**

Use ordinary non-wrapping boundaries. A live cell survives with two or three neighbors. A dead cell becomes live with exactly three neighbors.

- [x] **Step 4: Implement the canvas component**

Draw 12 px cells with low-contrast neutral live cells and use `#87b9ff` near the pointer. Resize from the canvas element bounds. Stop simulation intervals when reduced motion is active and remove all listeners and timers on unmount.

- [x] **Step 5: Run the focused test and confirm GREEN**

Run: `npm test -- --runInBand lib/__tests__/gameOfLife.test.ts`

Expected: PASS.

- [x] **Step 6: Commit the background**

```bash
git add lib/gameOfLife.ts lib/__tests__/gameOfLife.test.ts components/GameOfLife.tsx
git commit -m "feat: add Game of Life background"
```

### Task 3: Interactive Orb Character

**Files:**
- Create: `components/OrbCharacter.tsx`
- Test: `lib/__tests__/orbEyes.test.ts`

**Interfaces:**
- Consumes: exports from `lib/orbEyes.ts` and viewport pointer events.
- Produces: an accessible SVG character with spring-smoothed eye motion and periodic blinking.

- [x] **Step 1: Add a failing path test**

Test that the scaled eye path contains more than the original vertices and stays on the visible hemisphere at the side gaze.

- [x] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- --runInBand lib/__tests__/orbEyes.test.ts`

Expected: FAIL until the path helper returns the required projected points.

- [x] **Step 3: Implement the SVG character**

Use the approved body path and two generated eye paths. Listen to pointer movement on `window`, map it to the orb center, clamp gaze to `0.62`, and animate with the approved spring values. Reset to `BASE_GAZE` when the pointer leaves the document. Disable spring and blink animation for reduced motion.

- [x] **Step 4: Run the focused test and confirm GREEN**

Run: `npm test -- --runInBand lib/__tests__/orbEyes.test.ts`

Expected: PASS.

- [x] **Step 5: Commit the character**

```bash
git add components/OrbCharacter.tsx lib/orbEyes.ts lib/__tests__/orbEyes.test.ts
git commit -m "feat: add pointer-tracking orb character"
```

### Task 4: Modern Profile Screen

**Files:**
- Create: `components/ProfileScreen.tsx`
- Create: `components/ProfileScreen.module.css`
- Create: `components/__tests__/ProfileScreen.test.tsx`
- Modify: `lib/profile.ts`
- Modify: `lib/__tests__/profile.test.ts`
- Delete: `components/NeofetchScreen.tsx`
- Delete: `components/__tests__/NeofetchScreen.test.tsx`

**Interfaces:**
- Consumes: `profile`, `<GameOfLife />`, `<OrbCharacter />`, and `onEnterInteractive()`.
- Produces: the complete profile mode and its `/`, Enter, click, hover, and focus interactions.

- [x] **Step 1: Write failing screen tests**

Cover visible name and role, experience company names, school, hobbies, four external links, the Enter lumicode button, `/` and Enter keyboard entry, and company fan keyboard focus.

- [x] **Step 2: Run the focused tests and confirm RED**

Run: `npm test -- --runInBand components/__tests__/ProfileScreen.test.tsx lib/__tests__/profile.test.ts`

Expected: FAIL because `ProfileScreen` and the new typed profile fields do not exist.

- [x] **Step 3: Update profile data**

Add typed `role`, `companies`, and display link labels without removing fields used by commands or the system prompt.

- [x] **Step 4: Build the profile composition**

Use semantic headings, rows, links, and a real button. The company fan uses three overlapping badges at rest and spreads on hover or focus. Keep the page copy short. Use `aria-hidden` for decorative company letters and expose full company names to assistive technology.

- [x] **Step 5: Build responsive styles**

Use the approved tokens, desktop two-column layout, stacked mobile layout, visible focus rings, and reduced-motion rules. Keep line length below 80 characters and do not add a marketing headline.

- [x] **Step 6: Run the focused tests and confirm GREEN**

Run: `npm test -- --runInBand components/__tests__/ProfileScreen.test.tsx lib/__tests__/profile.test.ts`

Expected: PASS.

- [x] **Step 7: Commit the profile screen**

```bash
git add components/ProfileScreen.tsx components/ProfileScreen.module.css components/__tests__/ProfileScreen.test.tsx lib/profile.ts lib/__tests__/profile.test.ts components/NeofetchScreen.tsx components/__tests__/NeofetchScreen.test.tsx
git commit -m "feat: replace neofetch with modern profile"
```

### Task 5: Mode Integration and TUI Theme

**Files:**
- Modify: `components/HomeClient.tsx`
- Create: `components/__tests__/HomeClient.test.tsx`
- Modify: `components/TUIScreen.tsx`
- Modify: `components/InputBar.tsx`
- Modify: `components/MessageList.tsx`
- Modify: `components/CommandPalette.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/loading.tsx`

**Interfaces:**
- Consumes: `ProfileScreen`, the existing `TUIScreen`, and existing callback contracts.
- Produces: a complete profile-to-lumicode flow with a consistent visual system.

- [x] **Step 1: Write a failing integration test**

Render `HomeClient`, click `Enter lumicode`, assert that the lumicode heading appears, send Escape, and assert that the Hubert Xu heading returns.

- [x] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- --runInBand components/__tests__/HomeClient.test.tsx`

Expected: FAIL while `HomeClient` still imports `NeofetchScreen`.

- [x] **Step 3: Connect the new profile mode**

Rename the mode value from `neofetch` to `profile`, import `ProfileScreen`, and preserve the existing callbacks.

- [x] **Step 4: Apply the shared TUI palette**

Change TUI cyan, green, borders, and background to the approved accent, text, rule, and panel tokens. Keep all command behavior unchanged.

- [x] **Step 5: Update global and loading styles**

Set the global dark surface, system sans profile default, monospace utility, selection color, and reduced-motion baseline. Make loading state use the same palette without adding a new visual concept.

- [x] **Step 6: Run the focused and full suites**

Run:

```bash
npm test -- --runInBand components/__tests__/HomeClient.test.tsx
npm test -- --runInBand
```

Expected: all tests PASS, including the two tests that were stale at baseline.

- [x] **Step 7: Commit the integration**

```bash
git add components app
git commit -m "feat: integrate profile and lumicode modes"
```

### Task 6: Build and Browser Verification

**Files:**
- Modify only files needed to fix verified defects.

**Interfaces:**
- Consumes: the complete site.
- Produces: fresh test, lint, build, desktop, mobile, interaction, and console evidence.

- [x] **Step 1: Run automated verification**

```bash
npm test -- --runInBand
npm run lint
npm run build
```

Expected: all commands exit with code 0.

- [x] **Step 2: Start the local application**

Run: `npm run dev`

- [x] **Step 3: Verify desktop behavior in a real browser**

Check the default top-right eye pose, center and opposite-quadrant slant, experience fan hover and focus, links, lumicode entry, Escape return, and a clean console.

- [x] **Step 4: Verify mobile behavior**

Check a viewport at or below 390 px. Confirm the stacked layout fits without horizontal scroll, links wrap cleanly, the fan remains usable, and the lumicode button remains visible.

- [x] **Step 5: Verify reduced motion**

Confirm that the canvas does not continue stepping and that the orb does not blink or spring when reduced motion is enabled.

- [x] **Step 6: Review the final diff**

Run: `git diff development...HEAD --stat && git status --short`

Expected: only the planned site, test, and plan files are present; generated output is absent.
