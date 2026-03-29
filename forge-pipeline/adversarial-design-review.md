# Adversarial Design Review — @Designer (Full Audit Mode)

<!--
  Agent: @Designer (Mode 1: Full Audit)
  Pipeline: Montgomery Ancestry Browser
  Input: index.html, css/styles.css, js/tree.js, js/person.js, js/search.js
  Date: 2025-07-17
  
  CONTEXT: No team design intents file exists. Validating against WCAG 2.1 AA,
  competitive analysis (research/design-requirements.md), and industry-standard
  design system patterns.
-->

---

## Executive Summary

The Montgomery Ancestry Browser has a **cohesive, dignified visual design** that feels appropriate for a heritage/genealogy context. The warm parchment background (`#FAF6F0`), serif headings (Georgia), and navy primary color (`#1B2A4A`) create a sophisticated, library-like aesthetic. The CSS is well-organized with custom properties, mobile-first breakpoints, and print/reduced-motion/high-contrast media queries — significantly above average for a personal project.

**However, the review surfaces 2 critical issues, 5 concerns, and 6 suggestions.** The critical issues involve insufficient touch target sizes and a missing mobile bottom-sheet pattern for the person panel.

---

## 1. Visual Design Audit

### Color Palette

| Token | Value | Usage | Assessment |
|-------|-------|-------|-----------|
| `--c-primary` | `#1B2A4A` | Header, headings, links | ✅ Deep navy — authoritative, heritage feel |
| `--c-background` | `#FAF6F0` | Page background | ✅ Warm parchment — evokes old documents |
| `--c-surface` | `#FFFFFF` | Cards, panels | ✅ Clean white surfaces |
| `--c-surface-alt` | `#F5F0E8` | Alternate backgrounds | ✅ Subtle warm gray |
| `--c-accent` | `#2D5016` | Holmes line | ✅ Forest green |
| `--c-gold` | `#8B6914` | Montgomery line | ✅ Antique gold |
| `--c-rose` | `#8B4557` | Smyth-Gies line, couple lines | ✅ Muted rose |
| `--c-focus` | `#1B6AC9` | Focus indicators | ✅ High-contrast blue |

**Assessment:** The palette is cohesive, warm, and appropriate. The 6 family line colors are well-differentiated and maintain visual harmony. Each line has both a saturated `color` and a light `bg` variant — good for badges and indicators.

🔵 **DS-S1:** The gold (`#8B6914`) and rose (`#8B4557`) family line colors are close in luminance. On a projector or low-quality display, they could be hard to distinguish. Consider increasing hue separation.

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--ff-heading` | Georgia, Times New Roman, Palatino | Headings, section titles |
| `--ff-body` | System font stack | Body text |
| `--ff-mono` | SF Mono, Cascadia Code, Consolas | Keyboard hints |

**Assessment:** ✅ Excellent. Georgia for headings gives a timeless, literary quality that suits genealogy. The system font stack for body text ensures readability across platforms. Font sizes use a well-calibrated scale (11px–34px) with consistent rem-based values.

### Spacing

The 4px base spacing system (`--sp-1` through `--sp-16`) is consistent and generous. Section padding (`--sp-6` = 24px) provides breathing room. Margins between person sections are comfortable.

**Assessment:** ✅ Well-executed spacing system.

---

## 2. Responsiveness Audit

### Breakpoint Coverage

| Viewport | Breakpoint | Status | Notes |
|----------|-----------|--------|-------|
| 375px (iPhone SE) | `max-width: 480px` | 🟡 | Header subtitle hidden, panel goes full-width. Tab text shrinks. |
| 768px (iPad) | `min-width: 768px` | ✅ | Header title grows, panel padding increases |
| 1024px (iPad Pro) | `min-width: 1024px` | ✅ | Header/tab padding increases |
| 1440px (Desktop) | `max-width: 1440px` | ✅ | Content max-width applied |

### 🔴 Finding: DS-CR1 — Person panel on mobile is a full-screen slide-in, not a bottom sheet

**File:** `css/styles.css` (line 1178–1182)

At `max-width: 480px`, the person panel is `width: 100vw; top: 0; border-radius: 0`. This creates a full-screen overlay that covers the tree entirely. The design-requirements.md competitive analysis notes that modern mobile genealogy apps use **bottom sheets** (slide up from bottom, 60-70% height) for person details, allowing the user to still see the tree context behind.

The current implementation is a slide-in from the right that goes full-screen on mobile — there's no visual connection to the tree behind, no peek of the previous context, and no swipe-to-dismiss gesture.

**Fix:** At mobile widths, transform the panel to a bottom sheet: `bottom: 0; top: auto; height: 70vh; border-radius: 16px 16px 0 0;` with a drag handle for swipe-to-dismiss. This is a significant UX improvement for mobile.

**Severity:** 🟡 Concern (functional but poor mobile UX)

### 🔴 Finding: DS-CR2 — Touch targets below 44px minimum

**File:** `css/styles.css` (lines 311–323, 546–555)

Several interactive elements are below the 44×44px minimum touch target size (WCAG 2.5.5, AAA; Apple HIG):

| Element | Actual Size | Minimum | Status |
|---------|------------|---------|--------|
| `.btn-icon` (header buttons) | 36×36px | 44×44px | 🔴 **Below minimum** |
| `.panel-close` | 32×32px | 44×44px | 🔴 **Below minimum** |
| `.filter-chip` checkbox | 12×12px (+label) | 44×44px | 🟡 Label provides target area |
| `.family-tab` | height ~40px | 44px | 🟡 Borderline |
| Search result items | padding: 12px 16px | 44px+ total | ✅ OK |
| Tree nodes | 160×56px | 44px | ✅ OK |

**Fix:** Increase `.btn-icon` to `min-width: 44px; min-height: 44px` and `.panel-close` to `width: 44px; height: 44px`. This is a WCAG requirement.

---

## 3. Accessibility Audit

### Contrast Ratios

| Element | Foreground | Background | Ratio | Required | Status |
|---------|-----------|------------|-------|----------|--------|
| Body text | `#2C2C2C` | `#FAF6F0` | ~12:1 | 4.5:1 | ✅ |
| Light text | `#5A5A5A` | `#FAF6F0` | ~5.5:1 | 4.5:1 | ✅ |
| Muted text | `#888888` | `#FAF6F0` | ~3.5:1 | 4.5:1 | 🔴 **Fails AA** |
| Header text | `#FFFFFF` | `#1B2A4A` | ~12:1 | 4.5:1 | ✅ |
| Node dates text | `#888888` | `#FFFFFF` | ~3.5:1 | 4.5:1 | 🔴 **Fails AA** |
| Focus indicator | `#1B6AC9` | various | 3px solid | 3:1 min | ✅ |

### 🔴 Finding: DS-CR3 — `--c-text-muted` (#888) fails WCAG AA contrast

**File:** `css/styles.css` (line 20)

`--c-text-muted: #888` on `--c-background: #FAF6F0` yields approximately 3.5:1, below the 4.5:1 minimum for AA normal text. This color is used for:
- Date text on tree nodes (`.node-dates`)
- Source citations
- Search count
- Filter labels
- Footer text
- Confidence badge text

**Fix:** Darken to `#706B63` (~4.7:1) or `#666` (~5.5:1) to meet AA compliance.

### Focus Indicators

✅ `:focus-visible` with 3px solid blue outline + 2px offset. Good practice.
✅ `:focus:not(:focus-visible)` suppresses outline for mouse users. Good.

### ARIA Implementation

| Feature | Status | Notes |
|---------|--------|-------|
| Skip link | ✅ | `#skip-to-content` with hidden positioning |
| Loading screen | ✅ | `role="status"`, `aria-live="polite"` |
| Tab navigation | ✅ | `role="tablist"` with `aria-selected` |
| Person panel | ✅ | `role="dialog"`, `aria-hidden` toggled |
| Search overlay | ✅ | `role="dialog"`, `aria-label` present |
| Tree nodes | ✅ | `role="button"`, `tabindex="0"`, `aria-label` |
| Search results | ✅ | `role="listbox"` with `role="option"` items |

🟡 **DS-CC1:** The `role="main"` on `<main>` is redundant — `<main>` has implicit main role. Not harmful, but unnecessary.

---

## 4. UI States Audit

| State | Defined? | Implementation |
|-------|----------|---------------|
| **Loading** | ✅ | Animated loading screen with pulsing tree emoji and progress bar |
| **Error** | ✅ | Error state with icon, message, and retry button |
| **Empty** (no results) | ✅ | "No family members to display" in tree; "No results found" in search |
| **Empty** (no search query) | ✅ | Placeholder text in search |
| **Hover** (buttons) | ✅ | Background change on buttons, brightness on tree nodes |
| **Hover** (tree nodes) | ✅ | Stroke width increase, brightness filter |
| **Selected** (tree node) | ✅ | Thicker stroke, darker brightness |
| **Active** (tab) | ✅ | Color change + bottom border accent |
| **Focus** | ✅ | Blue outline via `:focus-visible` |
| **Panel open** | ✅ | Body overflow hidden, slide-in animation |
| **Search open** | ✅ | Backdrop blur, slide-down animation |
| **Print** | ✅ | Print stylesheet hides nav/header, shows panel inline |
| **Reduced motion** | ✅ | All animations/transitions suppressed |
| **High contrast** | ✅ | `forced-colors` media query for SVG elements |

**Assessment:** ✅ Excellent state coverage. All critical states are defined. The reduced-motion and high-contrast support is particularly noteworthy.

---

## 5. Edge Case Analysis

### Very Long Names

The longest names in the dataset include "Serene Adams Chamberlain", "Millicent Betts Thompson Montgomery", "Isabella Edna Holmes (née Smyth)". Tree node names are truncated via `truncate(getShortName(person), 16)` — this handles long names well. In the person panel, names flow naturally within the flex layout.

🔵 **DS-S2:** The search result `.result-name` has `text-overflow: ellipsis` — good. But the person panel heading (`h2`) has no max-width constraint. A very long name like "Millicent Betts Thompson Montgomery (née Holmes)" could overflow on narrow mobile screens.

### Many Children (Thomas Holmes: 14 children)

Thomas Holmes had 14 children across 2 marriages. In the tree layout, this creates a very wide horizontal span. The zoom/pan controls handle this, but:

🟡 **DS-CC2:** With 14 children side-by-side at 160px + 28px gap each, the Holmes branch spans ~2,632px. On mobile (375px), the user must pan extensively. Consider a "collapsed children" indicator that shows "14 children" with expand-on-tap for families with more than 6 children.

### Compressed Tree Areas

When "All Lines" is selected, all 174 nodes render simultaneously. The bounding box could be very large (estimated 4000×2000px+), making the initial fit-to-screen view very zoomed out with unreadable text.

🟡 **DS-CC3:** At the "All Lines" zoom-to-fit level, node text (11px at ~0.3x scale) becomes ~3px — effectively illegible. Consider showing a simplified view at low zoom levels (name only, no dates) or using semantic zoom (show family line clusters at far zoom, individual nodes at close zoom).

---

## 6. Findings Summary

### 🔴 Critical

| ID | Finding | File | Fix |
|----|---------|------|-----|
| DS-CR2 | Touch targets below 44px | styles.css:311,546 | Increase `.btn-icon` and `.panel-close` to 44×44px |
| DS-CR3 | `#888` muted text fails AA contrast | styles.css:20 | Darken to `#706B63` or `#666` |

### 🟡 Concern

| ID | Finding | File | Notes |
|----|---------|------|-------|
| DS-CR1 | Mobile panel is full-screen, not bottom sheet | styles.css:1178 | Functional but poor mobile UX |
| DS-CC1 | Redundant `role="main"` | index.html:63 | Cosmetic |
| DS-CC2 | 14-child families span too wide on mobile | tree.js layout | UX improvement for V2 |
| DS-CC3 | All-lines view illegible at fit-to-screen zoom | tree.js zoom | Semantic zoom for V2 |

### 🔵 Suggestion

| ID | Finding | Notes |
|----|---------|-------|
| DS-S1 | Gold and rose family colors similar luminance | Increase hue separation |
| DS-S2 | Person panel h2 could overflow on mobile | Add `word-break: break-word` |
| DS-S3 | Search dialog animation (`slideDown`) plays on every open | Consider only on first open |
| DS-S4 | Tree dot-grid background could be more subtle | Reduce dot opacity to 0.3 |
| DS-S5 | No transition on family tab scrolling | Add scroll-snap for touch |
| DS-S6 | Couple connection dashed line very subtle | Increase opacity from 0.5 to 0.7 for visibility |

---

## 7. Overall Design Assessment

| Category | Score | Notes |
|----------|-------|-------|
| Visual cohesion | ✅ Excellent | Warm heritage palette, consistent typography |
| Responsiveness | 🟡 Good | All breakpoints covered; mobile panel needs work |
| Accessibility | 🟡 Good | ARIA, focus, skip link present; contrast issue with muted text |
| State coverage | ✅ Excellent | All states including print, reduced-motion, high-contrast |
| Edge cases | 🟡 Acceptable | Long names handled; wide families and zoom need V2 work |
| Mobile UX | 🟡 Acceptable | Functional but not optimized (no bottom sheet, touch targets small) |

**Overall: The design is polished and appropriate for a V1 launch.** The critical fixes (touch targets, contrast) should be applied before deployment. The mobile bottom sheet and semantic zoom are recommended for V2.

---

*Review conducted by @Designer following Forge Designer Full Audit protocol. Findings validated against WCAG 2.1 AA and competitive analysis.*
