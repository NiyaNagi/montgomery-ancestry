# Mobile Layout Findings — Montgomery Family Heritage

**Date:** Screenshot analysis from Playwright across 5 viewports
**Screenshots:** `tests/screenshots/`

---

## Screenshots Inventory

| File | Viewport | View | Description |
|------|----------|------|-------------|
| `mobile-se-home.png` | 375×667 (iPhone SE) | Home/Tree | Tree with person cards in single column |
| `mobile-se-person.png` | 375×667 | Person Panel | Full-screen slide-in panel |
| `mobile-se-search.png` | 375×667 | Search Overlay | Bottom-sheet style search dialog |
| `mobile-plus-home.png` | 414×896 (iPhone Plus) | Home/Tree | Tree with person cards, slightly wider |
| `mobile-plus-person.png` | 414×896 | Person Panel | Full-screen slide-in panel |
| `mobile-plus-search.png` | 414×896 | Search Overlay | Bottom-sheet style search dialog |
| `tablet-home.png` | 768×1024 (iPad) | Home/Tree | Tree with wider cards, all tabs visible |
| `tablet-person.png` | 768×1024 | Person Panel | Panel overlays ~half the screen |
| `tablet-search.png` | 768×1024 | Search Overlay | Centered dialog, well-proportioned |
| `laptop-home.png` | 1024×768 | Home/Tree | Full tab bar, tree occupies center |
| `laptop-person.png` | 1024×768 | Person Panel | 420px side panel, tree still visible |
| `laptop-search.png` | 1024×768 | Search Overlay | Centered dialog |
| `desktop-home.png` | 1440×900 | Home/Tree | Wide layout, tree centered, lots of whitespace |
| `desktop-person.png` | 1440×900 | Person Panel | 420px side panel, tree fully visible |
| `desktop-search.png` | 1440×900 | Search Overlay | Centered dialog |

---

## Per-Viewport Analysis

### 375px — iPhone SE (`mobile-se`)

**Home view:**
- ✅ Header adapts: title wraps to two lines ("Montgomery Family / Heritage"), subtitle hidden — good.
- ⚠️ **Family tab bar overflows horizontally.** "Northwood" is partially visible; "Montgomery" and "Smith-Rowe-Jones" are completely off-screen. No visual scroll indicator (scrollbar hidden via CSS). Users have no way to know more tabs exist.
- ⚠️ **Person names truncated with ellipsis** — e.g. "Charlotte Thomp…", "Millicent Thomp…". Acceptable at this width but could be improved.
- ⚠️ **Tree is a flat vertical list** — no visible tree structure (connecting lines, hierarchy). All nodes appear stacked in a single column with no generational context.
- ✅ Tree hint banner visible at bottom.

**Person panel:**
- ✅ Full-width takeover (100vw) works well on small screens.
- ✅ Close button (×) clearly visible top-right.
- ✅ Content is readable — name, immigration, marriage, family sections all well-formatted.
- ✅ Children list readable with birth years.
- ⚠️ Panel covers entire screen — no way to see the tree behind it. Acceptable for this size.

**Search overlay:**
- ✅ Bottom-sheet pattern works — search input and filters visible at bottom of screen.
- ⚠️ **Search input placeholder text truncated** — reads "Search names, places, occupati…" (cut off).
- ⚠️ **Family line filter checkboxes wrap to 3 rows** — works but takes significant vertical space.
- ✅ "Type a name, place, or occupation to search" helper text visible.

---

### 414px — iPhone Plus (`mobile-plus`)

**Home view:**
- ✅ Header fits on one line — "Montgomery Family Heritage" with search and zoom icons.
- ⚠️ **Family tab bar overflow** — same issue as SE. "Montgomery" tab partially visible ("Mo…" cut off at right edge). No scroll affordance.
- ⚠️ Same flat-list tree display, no hierarchy visible.
- ✅ Person cards slightly wider, names like "Charlotte Thomp…" still truncated.

**Person panel:**
- ✅ Full-width takeover, all content readable.
- ✅ Life Details section (Military Service) visible when scrolled — good content density.

**Search overlay:**
- ✅ Bottom-sheet style, search input fully visible with "Esc" badge.
- ✅ Filter checkboxes wrap to 2 rows — better than SE.
- ✅ Helper text fully readable.

---

### 768px — iPad Tablet (`tablet`)

**Home view:**
- ✅ **All 7 family tabs visible in a single row** — "All Lines", "Thompson", "Holmes", "Smyth-Gies", "Northwood", "Montgomery", "Smith-Rowe-Jones". This is the first viewport where all tabs fit.
- ✅ Header shows subtitle: "7+ generations · 174 people · 6 family lines".
- ⚠️ Additional icon visible in header (pen/edit icon) — not present at smaller sizes. Possibly a theme toggle?
- ⚠️ **Tree still appears as a flat vertical list** of cards — no visible tree structure or connecting lines between generations. This is a significant UX issue at tablet size where there's enough room for a proper tree layout.
- ⚠️ **Name truncation persists** — "Charlotte Thomp…", "Millicent Thomp…" still ellipsized even though cards are wider and there's room to show full names.
- ⚠️ **Excessive vertical spacing between cards** — large gaps waste screen real estate.

**Person panel:**
- ✅ Panel overlays roughly half the screen width (~420px), with tree partially visible behind.
- ⚠️ **Header title truncated** — "Montgomery Family Heritag…" gets cut by the panel. Panel pushes content but doesn't resize the header.
- ✅ Content well-organized — Immigration, Marriage, Family, Life Details, Research Notes sections all visible.
- ✅ Children list is a good density — 10 children with birth years.

**Search overlay:**
- ✅ Centered modal dialog, well-proportioned.
- ✅ All 6 family line filters fit on 2 rows comfortably.
- ✅ "Smith-Rowe-Jones" wraps to second row alone — minor visual imbalance.

---

### 1024px — Laptop (`laptop`)

**Home view:**
- ✅ All tabs visible with comfortable spacing.
- ✅ Header complete with subtitle.
- ⚠️ **Tree is still a flat vertical stack** — same as mobile/tablet. At 1024px wide, users expect a horizontal tree layout showing parent-child relationships.
- ⚠️ **Names still truncated** — "Charlotte Thomp…", "Millicent Thomp…" despite plenty of horizontal space.
- ⚠️ **Cards clustered in center** — no use of horizontal space for tree branching.
- ✅ Tree hint banner visible at bottom.

**Person panel:**
- ✅ 420px side panel works well — tree still visible on the left.
- ✅ Panel content fully readable, all sections accessible.
- ⚠️ Family tab "Smith-Rowe-Jones" gets clipped by the panel overlay.

**Search overlay:**
- ✅ Clean centered dialog.
- ✅ All filters on one row plus "Smith-Rowe-Jones" on second.

---

### 1440px — Desktop (`desktop`)

**Home view:**
- ✅ Full header with all controls.
- ✅ All family tabs well-spaced.
- ⚠️ **Vast empty whitespace on both sides** — tree is clustered in a narrow center column (~200px wide cards) with 600+ px of unused space on each side.
- ⚠️ **Names STILL truncated** — "Charlotte Thomp…" at 1440px wide is not acceptable. Card width is clearly insufficient.
- ⚠️ **No tree structure visible** — at the widest viewport, users should see a full genealogical tree with branches. Instead, it's the same flat vertical list.

**Person panel:**
- ✅ 420px side panel works perfectly — tree fully visible alongside.
- ✅ All content readable, good typography.

**Search overlay:**
- ✅ Well-centered, proportional dialog.
- ✅ All filters on one row (with "Smith-Rowe-Jones" wrapping to second).

---

## Prioritized Fix List

### P0 — Broken / Major Usability Issues

1. **Family tab bar has no scroll affordance on mobile (375–414px)**
   - Users cannot discover "Montgomery" or "Smith-Rowe-Jones" tabs
   - The scrollbar is hidden (`scrollbar-width: none`), and there are no fade edges or arrows
   - **Fix:** Add gradient fade-out on the right edge when tabs overflow, or add left/right scroll arrows. Consider a `scroll-snap` behavior.
   - **CSS:** Add `::after` pseudo-element gradient on `.family-nav` when content overflows

2. **Tree displays as flat vertical list at all viewports — no hierarchy visible**
   - The tree SVG renders nodes in a vertical column with no connecting lines visible in the viewport
   - At wider viewports (768px+), there is plenty of room for a proper tree layout
   - **Root cause:** Likely the SVG viewBox / initial zoom is wrong — the tree is rendered wide but the viewport only shows a narrow slice. The "fit to screen" button exists but the initial auto-fit may not be working.
   - **Fix:** Investigate `js/tree.js` initial zoom/fit behavior. The tree should auto-fit to show the root + first generation on load.

### P1 — Ugly / Significant Visual Issues

3. **Person names truncated with ellipsis even at wide viewports**
   - "Charlotte Thomp…" and "Millicent Thomp…" are truncated at ALL viewports including 1440px
   - The tree node cards have a fixed max-width that's too narrow
   - **Fix:** Increase node card width or use dynamic sizing. At minimum, show full names at ≥768px.
   - **CSS:** Increase the width of tree node `<rect>` elements or the `foreignObject` containing names.

4. **Tablet (768px) — header title clipped when person panel is open**
   - "Montgomery Family Heritag…" gets cut off
   - Panel overlays the header area
   - **Fix:** Either reduce header title font-size when panel is active, or ensure the panel starts below the header.
   - **CSS:** Add `top: var(--header-h)` to `.person-panel` at tablet breakpoint, or use `body.panel-open .header-title { font-size: smaller }`

5. **Excessive vertical spacing between tree nodes on all viewports**
   - Large gaps between person cards waste screen space and require more scrolling
   - **Fix:** Reduce vertical gap between tree nodes in the SVG layout.

6. **Desktop (1440px) — massive unused whitespace on both sides**
   - Tree cards are narrow (~200px) and centered, leaving 600px+ empty on each side
   - **Fix:** Related to issue #2 — if the tree renders with proper branching, horizontal space would be used. Also consider wider node cards.

### P2 — Polish / Minor Issues

7. **Search placeholder truncated on iPhone SE (375px)**
   - "Search names, places, occupati…" — minor since the meaning is clear
   - **Fix:** Shorten placeholder to "Search names, places…" at small widths, or use a shorter default: "Search people…"
   - **CSS/JS:** Use media query to swap placeholder text, or just shorten it globally.

8. **Family line filter checkboxes wrap to 3 rows on iPhone SE**
   - Functional but uses a lot of vertical space
   - **Fix:** Consider a horizontal scrollable chip row, or a collapsible "Filters" section.
   - **CSS:** `.search-filters { overflow-x: auto; flex-wrap: nowrap; }`

9. **No visual feedback that tree is pannable/zoomable**
   - The hint banner says "Scroll to zoom · Drag to pan" but it's at the bottom and easy to miss
   - **Fix:** Show the hint more prominently on first visit, or add a subtle animation.

10. **Person panel at 768px — no visible way to return to tree without close button**
    - The panel takes ~half the screen; the visible tree portion behind it is not clearly interactive
    - **Fix:** Add a visible "Back to tree" link or make the dimmed backdrop clickable to close.

---

## Recommended CSS Changes

### Fix #1 — Tab bar scroll affordance
```css
.family-nav {
  position: relative;
}
.family-nav::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to right, transparent, var(--c-surface));
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.2s;
}
/* Hide gradient when scrolled to end (requires JS to toggle class) */
.family-nav.scrolled-end::after {
  opacity: 0;
}
```

### Fix #3 — Wider tree node cards
```css
/* In tree.js SVG generation, increase node width from ~150px to ~200px */
/* Or in CSS if foreignObject is used: */
@media (min-width: 768px) {
  .tree-node text { /* or foreignObject */ 
    /* Allow more characters before truncation */
  }
}
```

### Fix #4 — Panel below header on tablet
```css
@media (min-width: 481px) and (max-width: 1024px) {
  .person-panel {
    top: calc(var(--header-h) + var(--nav-h, 42px));
  }
}
```

### Fix #7 — Shorter search placeholder
```css
/* In HTML or JS, use a shorter placeholder: */
/* placeholder="Search people…" */
```

### Fix #8 — Scrollable filter chips
```css
@media (max-width: 480px) {
  .search-filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: var(--sp-2);
  }
}
```
