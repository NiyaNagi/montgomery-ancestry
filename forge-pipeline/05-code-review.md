# Stage 05 — Code Review: Montgomery Ancestry Browser

<!--
  Stage 05 — Code Review
  Agent: @CodeReviewer (Full Review, Mode 1)
  Pipeline: Montgomery Ancestry Browser
  Input: index.html, css/styles.css, js/app.js, js/data.js, js/tree.js, js/person.js, js/search.js
  Date: 2025-07-17
-->

---

## Executive Summary

The Montgomery Ancestry Browser is a **well-structured, clean vanilla JS implementation** that delivers on the core spec requirements. The code is modular (5 ES modules), uses no framework overhead, and handles 174 people across 58 families with reasonable SVG performance. Accessibility is above average for a personal project — skip link, ARIA roles, focus management, and keyboard navigation are all present.

**However, the review surfaces 3 critical issues, 6 concerns, and 8 suggestions.** The critical issues involve XSS vectors via `innerHTML`, missing focus trap on dialog overlays, and an error handler that itself introduces an XSS vulnerability.

**Overall Assessment: 🟡 Ready with Required Fixes** — the 3 🔴 critical items must be fixed before deployment.

---

## Findings

### 🔴 Critical

#### CR-01: XSS via innerHTML in person.js and search.js

**Files:** `js/person.js` (line 44), `js/search.js` (line 188, 152, 137)

The `person.js` module builds HTML strings from user-facing data (person names, notes, places, occupations) and injects them via `content.innerHTML = buildPersonHTML(person, living)`. If any JSON field contains a `<script>` tag or event handler attribute, it will execute.

**Specific vectors:**
- `person.notes` → injected raw into `buildNotes()` at line 306: `<p class="person-notes">${person.notes}</p>`
- `person.occupation` → injected via `buildLifeDetails()` at line 270: `<li>${o}</li>`
- `person.sources` → injected via `buildSources()` at line 317: `<li>📄 ${s}</li>`
- `search.js` `highlightMatch()` at line 225: uses regex replace to inject `<mark>` tags, but the query itself is escaped. However, `getFullName(person)` output and `person.birthPlace` are injected raw into `li.innerHTML` at line 188.

**Risk assessment:** The data is self-hosted JSON maintained by the project owner, so the attack surface is low in practice. But if anyone forks this or loads external data, it becomes a real XSS vector.

**Fix:** Sanitize all data-sourced strings before HTML injection. Create a shared `escapeHTML()` utility:
```js
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
```

#### CR-02: XSS in app.js showError()

**File:** `js/app.js` (line 229)

The error handler injects the error message directly into `innerHTML`:
```js
loader.innerHTML = `...
  <p>${message}</p>
  <button onclick="window.location.reload()">Try Again</button>
`;
```

If the error message contains HTML (e.g., from a server response or crafted URL), this is exploitable. Additionally, the `onclick` attribute is inline JS — a CSP violation if Content-Security-Policy is ever added.

**Fix:** Escape the message string, and replace `onclick` with a proper event listener.

#### CR-03: Missing focus trap on dialog overlays

**Files:** `js/person.js`, `js/search.js`

Both the person panel (`role="dialog"`) and search overlay (`role="dialog"`) open as modal-like dialogs but have **no focus trap**. A keyboard user can Tab out of the dialog into the background tree, which violates WCAG 2.1 SC 2.4.3 (Focus Order) for modal dialogs.

**Evidence:** `person.js` sets focus to the heading (line 53, good!) but doesn't trap Tab within the panel. `search.js` focuses the input (line 242) but Tab can escape to the tree behind the overlay.

**Fix:** Add focus trap logic that wraps Tab navigation within the dialog when it's active. At minimum, on keydown Tab, check if focus is leaving the last/first focusable element and loop it.

---

### 🟡 Concern

#### CC-01: Person panel doesn't restore focus on close

**File:** `js/person.js` (line 57–63)

When `closePanel()` is called, focus is not returned to the element that triggered the panel opening. This violates WCAG 2.1 SC 2.4.3 — after closing a dialog, focus should return to the trigger element.

**Fix:** Store the triggering element before opening and restore focus to it in `closePanel()`.

#### CC-02: Search overlay doesn't restore focus on close

**File:** `js/search.js` (line 247–256)

Same issue as CC-01 — when search closes, focus is lost. It should return to the search button or previously focused element.

#### CC-03: `gRoot.innerHTML = ''` clears 174+ SVG nodes via innerHTML

**File:** `js/tree.js` (line 63)

On every `renderTree()` call, all SVG DOM nodes are destroyed and recreated. For 174 nodes + connections, this creates significant GC pressure. When switching family line tabs rapidly, this causes visible lag.

**Alternative:** Consider keeping a reference pool and updating `display: none` on filtered-out nodes, or use `DocumentFragment` for batch insertion.

#### CC-04: Thomas Holmes confidence set to HIGH but validation report says MEDIUM

**File:** `data/people.json` — `thomas-holmes-1817`

The validation report (Section 2, item #2) says the 1896 death year is "MEDIUM confidence" and needs Ontario death registration to fully confirm. But the JSON has `confidence: HIGH`. This overstates the certainty. [why?](#cc04-reasoning)

#### CC-05: No keyboard navigation between tree nodes

**File:** `js/tree.js` (lines 448–528)

Individual tree nodes have `tabindex="0"` and Enter/Space handlers, which is good. But there's no Arrow key navigation between nodes — a keyboard user must Tab through potentially 174 nodes sequentially. This is unusable for keyboard-only users.

**Recommendation:** Implement roving tabindex or arrow-key navigation within the tree SVG (at least within siblings at the same generation level).

#### CC-06: `wheel` event listener is not passive

**File:** `js/tree.js` (line 570)

The wheel event listener uses `{ passive: false }` to call `preventDefault()`. This is correct for preventing page scroll, but it blocks the browser's compositor thread, causing jank on some mobile browsers. Consider using CSS `touch-action: none` on the container instead.

---

### 🔵 Suggestion

#### CS-01: `formatDate()` month array duplicated

**File:** `js/data.js` (lines 337, 344)

Two separate `monthNames` arrays exist in `formatDate()` — one abbreviated, one full. Extract to a module-level constant to reduce allocation per call.

#### CS-02: `highlightMatch()` could produce nested `<mark>` tags

**File:** `js/search.js` (line 221–226)

If the query appears inside a person's name that happens to contain HTML-like characters, the regex could create malformed HTML. The query is escaped for regex, but the input text isn't escaped for HTML first.

#### CS-03: `getAge()` doesn't account for month/day precision

**File:** `js/data.js` (line 409–426)

Age calculation uses year-only math: `parseInt(death, 10) - birthNum`. A person born Dec 31 and dying Jan 1 would show as 1 year old when they were actually days old. For historical genealogy this is acceptable, but documenting the limitation would be helpful.

#### CS-04: Search debounce timer not cleared on close

**File:** `js/search.js` (line 247)

When `closeSearch()` is called, the 200ms debounce timer is not cleared. If a user types quickly and closes before the timer fires, a stale search may execute. Add `clearTimeout(debounceTimer)` in `closeSearch()`.

#### CS-05: `getRootFamilies()` heuristic may miss some roots

**File:** `js/data.js` (line 447–454)

The function finds families where neither parent has a `parentFamilyId`. This misses cases where one parent is a root but the other married into the family. For this specific dataset it works, but the logic could be more robust.

#### CS-06: `layoutFamily()` recursion could stack overflow

**File:** `js/tree.js` (line 259)

The layout algorithm recurses through families without a depth limit. With 174 people across 7+ generations, the maximum recursion depth is ~8-9 levels, well within safe limits. But adding a safety guard (`if (depth > 20) return`) would be prudent.

#### CS-07: Missing `<meta>` for IE/Edge Legacy compatibility

**File:** `index.html`

No `X-UA-Compatible` meta tag. Not critical since the target is modern browsers, but worth noting for completeness.

#### CS-08: Loading screen transition doesn't remove from DOM

**File:** `js/app.js` (line 218–224), `css/styles.css` (line 174–177)

The loading screen is hidden via `opacity: 0; pointer-events: none` but remains in the DOM. For 174 people this is negligible, but removing it after transition would be cleaner.

---

## Spec Compliance Matrix (10 FRs)

| FR | Description | Status | Notes |
|----|------------|--------|-------|
| FR-1 | Family Tree Visualization | ✅ Implemented | SVG descendant chart with zoom/pan/click. Layout is descendant-based, not pedigree (spec was ambiguous — review SR-TV1 noted this). |
| FR-2 | Person Detail View | ✅ Implemented | Slide-in panel with all metadata sections. Missing: Life Event Timeline (spec says chronological timeline). Notes, sources, immigration, marriages all present. |
| FR-3 | Search & Filter | ✅ Implemented | Fuzzy search + family line filter chips. Keyboard navigation (arrows, Enter, Esc). |
| FR-4 | Responsive Design | ✅ Implemented | Breakpoints at 480px, 768px, 1024px. Mobile panel goes full-width. |
| FR-5 | Deep Linking | ✅ Implemented | Hash-based routing: `#person/id`, `#family/line`. |
| FR-6 | Multiple Marriages | ✅ Implemented | 6 multi-marriage persons correctly modeled with separate spouse families. |
| FR-7 | Data Quality Transparency | ✅ Implemented | Confidence badges (HIGH/MEDIUM/LOW), sparse data notices. |
| FR-8 | Accessibility | 🟡 Partial | Skip link, ARIA roles, focus management present. Missing: focus traps (CR-03), focus restore (CC-01/02), keyboard tree navigation (CC-05). |
| FR-9 | Performance | ✅ Implemented | 174 nodes render without visible delay. Search is instant. |
| FR-10 | Living Persons Privacy | ✅ Implemented | Birth dates hidden for living persons (b. 1920+). Birth places omitted from JSON. |

---

## Reasoning Links

#### cc04-reasoning
The validation report explicitly states: "⚠️ **1896 (MEDIUM confidence)**. Find a Grave is more likely from a primary source (gravestone), but both researchers flag this as needing Ontario death registration to fully confirm." Setting this to HIGH in the JSON contradicts the validated research. The JSON should use MEDIUM to accurately reflect the evidence level.

---

*Review conducted by @CodeReviewer following Forge Code Review protocol. All findings reference specific files and line numbers. Critical issues require fixes before deployment.*
