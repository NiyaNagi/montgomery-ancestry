# Stage 04 — Implementation Plan: Montgomery Ancestry Browser

<!--
  Stage 04 — Implementation Plan (RETROACTIVE)
  Agent: @ImplementationPlanner (timed out) → retroactively authored from actual implementation
  Pipeline: Montgomery Ancestry Browser
  Input: forge-pipeline/02-spec.md, forge-pipeline/03-spec-review.md, implemented code
  Date: 2025-07-17
  Generated: Reverse-engineered from shipped implementation

  NOTE: The @ImplementationPlanner agent timed out after 49 minutes.
  This document was created retroactively by analyzing the actual
  implementation artifacts. All architecture, estimates, and design
  decisions are documented as-built, not as-planned.
-->

---

## 1. Component Architecture

The implementation uses 5 ES modules with a clean dependency tree rooted at `app.js`. No build step, no bundler, no framework — pure vanilla JS with `type="module"` imports.

### Module Dependency Graph

```
app.js (orchestrator)
  ├── data.js    (data layer — no dependencies)
  ├── tree.js    (visualization — imports data.js)
  ├── person.js  (detail panel — imports data.js)
  └── search.js  (search overlay — imports data.js)
```

### Module Detail

#### `js/data.js` — Data Layer & Query Engine
- **Responsibility:** Fetch JSON data, build indexes, expose graph traversal queries, provide formatting utilities
- **Exports (22):**
  - Loaders: `loadData()`
  - Accessors: `getPerson()`, `getFamily()`, `getAllPeople()`, `getMeta()`, `getAllFamilies()`, `getAllByFamilyLine()`, `getFamilyLines()`
  - Graph traversal: `getParents()`, `getChildren()`, `getSiblings()`, `getSpouses()`, `getAncestors()`, `getDescendants()`, `getRootAncestors()`, `getRootFamilies()`, `getParentFamily()`
  - Formatting: `getFullName()`, `getShortName()`, `formatDate()`, `formatLifespan()`, `extractYear()`, `isLiving()`, `getFamilyLineInfo()`, `getAge()`
  - Search: `searchPeople()`
- **Dependencies:** None (leaf module)
- **Internal state:** Module-level `people`, `families`, `familyIndex`, `meta` dictionaries
- **Effort: L** [why?](#effort-data) — 455 lines, 22 exports, weighted search scoring, recursive ancestor/descendant tree builders, multi-format date parsing, and living-person heuristic. This is the highest-density module with the most complex logic despite having no UI.

#### `js/tree.js` — SVG Tree Visualization
- **Responsibility:** Compute layout positions for family nodes, render SVG elements, handle zoom/pan/pinch interactions
- **Exports (5):** `initTree()`, `renderTree()`, `selectPerson()`, `panToNode()`, `resetZoom()`
- **Dependencies:** `data.js` (12 imports)
- **Internal state:** SVG element refs, transform state `{x, y, scale}`, drag/pinch state, `nodePositions` Map, `layoutCache`
- **Effort: L** [why?](#effort-tree) — 690 lines. The recursive `layoutFamily()` algorithm is the most complex single function in the codebase. It handles couple placement, child recursion, parent re-centering above children, isolated person fallback, and bounding box computation. Add zoom/pan with mouse wheel + touch pinch + animated transitions = significant interaction surface.

#### `js/person.js` — Person Detail Panel
- **Responsibility:** Render comprehensive person information in a slide-in panel with navigable family links
- **Exports (5):** `initPersonPanel()`, `showPerson()`, `closePanel()`, `isPanelOpen()`, `getCurrentPersonId()`
- **Dependencies:** `data.js` (12 imports)
- **Internal state:** Panel DOM ref, `currentPersonId`, focus restoration ref
- **Effort: M** [why?](#effort-person) — 415 lines. Template-heavy module with 8 section builders (`buildQuickFacts`, `buildImmigration`, `buildMarriages`, `buildFamilySection`, `buildLifeDetails`, `buildNotes`, `buildSources`, plus data density calculation). XSS protection via `escapeHTML()`. Focus trap for accessibility. Navigable person links with callback pattern.

#### `js/search.js` — Search Overlay
- **Responsibility:** Full-text search with family-line filtering, keyboard navigation, result highlighting
- **Exports (4):** `initSearch()`, `openSearch()`, `closeSearch()`, `isSearchOpen()`
- **Dependencies:** `data.js` (6 imports)
- **Internal state:** Overlay/input DOM refs, `selectedIndex`, `currentResults[]`, `activeFilters[]`, debounce timer, focus restoration ref
- **Effort: S** [why?](#effort-search) — 271 lines. Delegates heavy search logic to `data.js`. UI concerns: debounced input (200ms), keyboard arrow navigation with scroll-into-view, result limiting (50 max displayed), query highlighting via regex, family-line filter chips with checkbox state.

#### `js/app.js` — Application Orchestrator
- **Responsibility:** Bootstrap, wire modules together, manage routing, handle global keyboard shortcuts, build family-line tabs
- **Exports (0):** Entry point only (self-executing via `DOMContentLoaded`)
- **Dependencies:** `data.js`, `tree.js`, `person.js`, `search.js` (all 4 modules)
- **Internal state:** `currentFamilyLine`
- **Effort: S** [why?](#effort-app) — 246 lines. Mostly wiring: connects callbacks between modules, manages hash-based routing (`#person/{id}`, `#family/{line}`), builds tab UI, handles global Escape/`/` keyboard shortcuts. Error display with XSS-safe message rendering.

### Aggregate Effort: **L** overall [why?](#effort-overall) — 5 modules, ~2,077 lines of JS, plus 24KB CSS, 5.5KB HTML, and 172KB JSON data. Cross-module concerns (routing, focus management, responsive layout, accessibility) elevate individual S/M modules to collective L complexity.

---

## 2. File Manifest

### Application Files

| Path | Purpose | Key Contents | Size |
|------|---------|-------------|------|
| `index.html` | Single-page app shell | Semantic HTML5 with ARIA landmarks, loading screen, header, tab nav, tree container, person panel, search overlay, footer. Inline SVG icons. | 5.5 KB |
| `css/styles.css` | Complete stylesheet | 45+ custom properties, mobile-first responsive, WCAG AA focus indicators, component styles for all UI elements, 4 CSS animations | 24.0 KB |
| `js/app.js` | App orchestrator | Bootstrap, routing, tab management, global keyboard shortcuts, error handling | 6.4 KB |
| `js/data.js` | Data layer | JSON loading, graph queries, search, formatting utilities, family-line metadata | 13.2 KB |
| `js/tree.js` | Tree visualization | SVG layout algorithm, zoom/pan/pinch, node rendering, connection drawing | 20.4 KB |
| `js/person.js` | Person detail panel | 8 section builders, XSS escaping, focus trap, family navigation links | 13.3 KB |
| `js/search.js` | Search overlay | Debounced search, keyboard nav, filter chips, result highlighting | 8.3 KB |

### Data Files

| Path | Purpose | Key Contents | Size |
|------|---------|-------------|------|
| `data/people.json` | Person records | 174 person objects keyed by slug ID, each with ~20 fields | 155.8 KB |
| `data/family-tree.json` | Family units + metadata | 58 family objects with husband/wife/children refs, plus meta block with 6 family lines | 16.7 KB |

### Infrastructure

| Path | Purpose | Key Contents | Size |
|------|---------|-------------|------|
| `.github/workflows/ci.yml` | CI pipeline | Workflow definition | 253 B |
| `package.json` | Project manifest | Jest + Playwright dev dependencies | 624 B |
| `jest.config.cjs` | Unit test config | CommonJS Jest configuration | 218 B |
| `playwright.config.js` | E2E test config | Playwright configuration | 700 B |
| `README.md` | Project documentation | Setup, usage, architecture overview | 2.9 KB |
| `DEPLOY-DREAMHOST.md` | Deployment guide | Dreamhost deployment instructions | 829 B |

### Test Files (13 files, ~102 KB total)

| Path | Purpose | Size |
|------|---------|------|
| `tests/unit/data.test.js` | data.js unit tests | 27.8 KB |
| `tests/unit/person.test.js` | person.js unit tests | 14.5 KB |
| `tests/unit/tree.test.js` | tree.js unit tests | 10.0 KB |
| `tests/unit/search.test.js` | search.js unit tests | 7.3 KB |
| `tests/unit/helpers/dataModule.cjs` | Test data helper | 10.9 KB |
| `tests/data/schema.test.js` | JSON schema validation | 2.6 KB |
| `tests/data/integrity.test.js` | Referential integrity tests | 6.2 KB |
| `tests/data/accuracy.test.js` | Data accuracy tests | 5.9 KB |
| `tests/e2e/navigation.spec.js` | Navigation E2E tests | 4.0 KB |
| `tests/e2e/tree.spec.js` | Tree rendering E2E tests | 4.7 KB |
| `tests/e2e/person.spec.js` | Person panel E2E tests | 5.1 KB |
| `tests/e2e/search.spec.js` | Search E2E tests | 4.9 KB |
| `tests/e2e/accessibility.spec.js` | WCAG compliance E2E tests | 6.7 KB |
| `tests/e2e/mobile.spec.js` | Mobile responsive E2E tests | 4.7 KB |

### Forge Pipeline Artifacts

| Path | Purpose | Size |
|------|---------|------|
| `forge-pipeline/01-feature-proposal.md` | Feature proposal | 23.8 KB |
| `forge-pipeline/02-spec.md` | Design spec | 50.1 KB |
| `forge-pipeline/03-spec-review.md` | Spec review | 42.5 KB |
| `forge-pipeline/04-impl-plan.md` | This file (retroactive) | — |
| `forge-pipeline/05-code-review.md` | Code review | 10.8 KB |
| `forge-pipeline/06-test-plan.md` | Test plan | 41.4 KB |
| `forge-pipeline/07-flight-plan.md` | Flight monitoring plan | 12.3 KB |
| `forge-pipeline/08-grade.md` | Pipeline grading | 33.0 KB |
| `forge-pipeline/PIPELINE-STATE.md` | Pipeline tracking | 3.8 KB |

---

## 3. Data Layer Design

### JSON Schema

The data layer uses two JSON files with a relational-style architecture:

#### `people.json` — Person Records

```json
{
  "people": {
    "<slug-id>": {
      "id": "string",              // URL-safe slug: "fred-e-thompson-1871"
      "firstName": "string|null",  // "Unknown" for unknown first names
      "middleName": "string|null",
      "lastName": "string",
      "maidenName": "string|null", // née surname for married women
      "gender": "male|female|null",
      "birthDate": "string|null",  // ISO partial: "1871", "1871-03", "1871-03-15"
      "birthPlace": "string|null",
      "deathDate": "string|null",
      "deathPlace": "string|null",
      "burialPlace": "string|null",
      "occupation": "string|string[]|null",
      "education": "string|string[]|null",
      "militaryService": "string[]|null",
      "religion": "string|null",
      "immigration": {             // null if N/A
        "from": "string|null",
        "to": "string|null",
        "date": "string|null",
        "ship": "string|null"
      },
      "residences": [              // null if N/A
        { "place": "string", "period": "string|null" }
      ],
      "familyLine": "string",     // one of 6: thompson|holmes|smyth-gies|northwood|montgomery|smith-rowe-jones
      "confidence": "HIGH|MEDIUM|LOW",
      "notes": "string|null",
      "sources": "string[]|null",
      "parentFamilyId": "string|null",    // FK → family-tree.json family.id
      "spouseFamilyIds": "string[]"       // FK[] → family-tree.json family.id
    }
  }
}
```

**Stats:** 174 person records, ~20 fields each, 155.8 KB total.

#### `family-tree.json` — Family Units + Metadata

```json
{
  "meta": {
    "title": "Montgomery Family Tree",
    "generated": "2025-07-15",
    "totalPeople": 174,
    "familyLines": ["thompson", "holmes", "smyth-gies", "northwood", "montgomery", "smith-rowe-jones"]
  },
  "families": [
    {
      "id": "string",              // e.g., "family-thompson-patriarch"
      "husband": "string|null",    // FK → people.json person.id
      "wife": "string|null",       // FK → people.json person.id
      "marriageDate": "string|null",
      "marriagePlace": "string|null",
      "children": ["string"]       // FK[] → people.json person.id, birth-order
    }
  ]
}
```

**Stats:** 58 family units, 16.7 KB total.

### Graph Traversal Algorithms

All traversal is implemented in `data.js` using the `familyIndex` (family-id → family-object) lookup built at load time.

| Algorithm | Function | Strategy | Complexity |
|-----------|----------|----------|------------|
| **Parent lookup** | `getParents(id)` | `person.parentFamilyId` → `familyIndex` → husband/wife | O(1) |
| **Children lookup** | `getChildren(id)` | Iterate `person.spouseFamilyIds` → collect all `family.children` via Set dedup | O(k) where k = spouse count |
| **Sibling lookup** | `getSiblings(id)` | `person.parentFamilyId` → `family.children` → filter self | O(n) where n = sibling count |
| **Spouse lookup** | `getSpouses(id)` | Iterate `person.spouseFamilyIds` → resolve opposite partner + marriage data | O(k) |
| **Ancestor tree** | `getAncestors(id, depth)` | Recursive: `getParents()` → recurse on father & mother up to `depth` generations | O(2^d) worst case |
| **Descendant tree** | `getDescendants(id, depth)` | Recursive: iterate `spouseFamilyIds` → recurse on each child | O(branching^d) |
| **Root discovery** | `getRootFamilies()` | Filter families where neither husband nor wife has a `parentFamilyId` | O(f) where f = family count |
| **Line-scoped roots** | `findRootsForLine(line)` | Filter families by `familyLine` match + no parent in same line | O(f) |

### Search Index Design

Search uses an **inline scored search** — no pre-built index. [why?](#search-index-reasoning) With 174 records, iterating all people per keystroke is trivially fast (< 1ms).

**Scoring algorithm** (in `searchPeople()`):
1. Split query into whitespace-delimited terms
2. For each person, compute weighted score across fields:
   - Full name match: **+10** (prefix bonus: **+5**)
   - Maiden name match: **+8**
   - Occupation match: **+4**
   - Location match (birth/death/burial/residences/immigration): **+3** each
   - Family line match: **+2**
   - Notes match: **+1**
3. Sort by descending score, return person objects
4. Filter by `familyLines` array if active filters present

**Query processing:** Case-insensitive, multi-term AND (all terms must contribute score > 0 individually — though current implementation scores per-term additively, a person with any term matching passes).

### Edge Case Handling

| Edge Case | Handling |
|-----------|---------|
| **Unknown first names** | `firstName: "Unknown"` → displayed as `(Unknown)` in full name, `?` in short name |
| **Partial dates** | `formatDate()` handles year-only (`"1822"`), year-month (`"1822-03"`), and full ISO (`"1822-03-15"`) |
| **Living persons** | `isLiving()` heuristic: no death date AND birth year ≥ 1920 → suppress birth date in display, show "Living" |
| **Infant deaths** | `buildQuickFacts()` detects death year − birth year ≤ 1 → adds "Died in infancy" note |
| **Sparse profiles** | `calcDataDensity()` counts populated fields; if < 3 → shows "📋 Limited records available" notice |
| **Multi-marriage** | `getSpouses()` iterates all `spouseFamilyIds`; `buildMarriages()` renders numbered marriage cards |
| **Missing spouse** | Family units can have `husband: null` or `wife: null` (e.g., Thompson patriarch — unknown wife) |
| **Isolated people** | Tree layout handles people with no family unit via separate isolated-person placement loop |
| **Null/undefined fields** | Every field accessor uses `||`, `?.`, or explicit null checks throughout |

---

## 4. Tree Visualization Design

### SVG Layout Algorithm

The tree uses a **recursive descendant chart** layout — a top-down vertical tree starting from root families (ancestors at top, descendants flowing downward). [why?](#tree-layout-reasoning)

**Layout constants:**
```
NODE_WIDTH  = 160px    NODE_HEIGHT = 56px
H_GAP       = 28px     V_GAP       = 72px
COUPLE_GAP  = 8px      PADDING     = 40px
```

**Algorithm (`computeLayout` → `layoutFamily`):**

1. **Root discovery:** Find root families for the selected family line (or all root families for "All Lines" view) using `findRootsForLine()` or `getRootFamilies()`
2. **Per-family recursive layout:**
   - Place husband node at `(startX, startY)`, wife at `(startX + NODE_WIDTH + COUPLE_GAP, startY)`
   - Draw couple connector (dashed rose line) between them
   - Collect child families via `getChildFamilies()` — each child may have their own spouse family
   - Recurse for children who have families; place leaf children without recursion
   - Draw parent-to-children connections: vertical drop from parent center → horizontal span → vertical drop to each child
   - **Re-center parents** above children span center (shift parent nodes rightward if children span is wider)
3. **Isolated people:** Anyone not placed by family recursion gets positioned in a vertical column at `globalX`
4. **Bounding box:** Compute min/max extents across all nodes with padding

**Connection geometry:**
- Parent→children: Orthogonal lines (vertical drop, horizontal span, vertical drop per child)
- Couple: Dashed horizontal line between husband and wife nodes
- No Bezier curves — all straight lines for simplicity [why?](#connection-style-reasoning)

### Zoom/Pan Implementation

Three interaction modes, all manipulating a single `{x, y, scale}` transform applied to the SVG root `<g>` element:

| Interaction | Input | Behavior |
|-------------|-------|----------|
| **Zoom** | Mouse wheel | `deltaY > 0` → scale × 0.9 (zoom out), else × 1.1 (zoom in). Zoom anchored to cursor position via `zoomAt(mx, my, delta)`. Clamped to `[0.1, 3.0]`. |
| **Pan** | Mouse drag | `mousedown` (not on node) → track `dragStart`, `mousemove` → update `transform.x/y`, `mouseup` → stop |
| **Pinch zoom** | Two-finger touch | Track pinch distance, compute delta ratio, zoom at pinch center. Single-finger touch → pan. |

**Transform application:** `gRoot.setAttribute('transform', \`translate(${x}, ${y}) scale(${scale})\`)` — direct SVG transform, no CSS transforms. Animated transitions use `gRoot.style.transition` for 400ms on programmatic pans.

**Fit-to-screen:** `resetZoom()` computes scale from `layoutCache.bbox` vs container dimensions, picks `min(scaleX, scaleY, 1)`, centers content.

### Interaction Model

| Action | Effect |
|--------|--------|
| Click person node | Fire `onSelectCallback(personId)` → opens person panel + highlights node |
| Enter/Space on focused node | Same as click (keyboard accessible) |
| Click empty tree area | Start pan drag |
| Scroll wheel | Zoom in/out at cursor |
| Two-finger pinch | Zoom in/out at pinch center |
| Single-finger drag | Pan (mobile) |
| "Fit to screen" button | Reset zoom to show all content |

### Mobile Adaptation

- Touch events: `touchstart`, `touchmove`, `touchend` handlers for both single-finger pan and two-finger pinch
- `passive: true` for `touchstart`, `passive: false` for `touchmove` (to enable `preventDefault()` for pinch)
- Node dimensions (160×56px) are fixed — on mobile, users zoom/pan to navigate rather than having a responsive layout reflow
- The tree hint ("Scroll to zoom · Drag to pan · Click a person for details") auto-fades after 6 seconds via CSS animation

### Multi-Marriage Handling

Multi-marriage is handled structurally via the data model:
- A person with multiple marriages has multiple entries in `spouseFamilyIds`
- `getChildFamilies()` picks the **first** spouse family for tree layout recursion — subsequent marriages are visible in the person detail panel but not all may appear as separate tree branches
- Couple connectors are drawn between husband and wife positions for each rendered family unit
- In the person panel, `buildMarriages()` renders **all** marriages chronologically with numbered cards when count > 1

[why?](#multi-marriage-layout-reasoning) — Full multi-marriage tree layout (showing all spouse branches) was deferred to keep the layout algorithm tractable. The person panel provides complete marriage information as a complement.

---

## 5. CSS Architecture

### Custom Properties System

45+ CSS custom properties defined on `:root`, organized into 6 categories:

| Category | Count | Examples |
|----------|-------|---------|
| **Colors** | 15 | `--c-primary: #1B2A4A`, `--c-background: #FAF6F0`, `--c-focus: #1B6AC9`, `--c-rose: #8B4557` |
| **Typography** | 9 | `--ff-heading` (Georgia/serif), `--ff-body` (system sans-serif), `--fs-xs` through `--fs-2xl` |
| **Spacing** | 10 | `--sp-1` (4px) through `--sp-16` (64px), 4px base unit |
| **Sizing** | 6 | `--header-h: 60px`, `--panel-w: 420px`, `--radius-sm/md/lg/full` |
| **Shadows** | 4 | `--shadow-sm` through `--shadow-xl`, all using primary color tint |
| **Motion** | 3 | `--ease` (cubic-bezier), `--duration-fast/normal/slow` (150/250/400ms) |

### Breakpoints

The CSS uses a **mobile-first** approach. Key responsive boundaries (inferred from the implementation):

| Breakpoint | Target | Key Adaptations |
|------------|--------|----------------|
| Base (< 768px) | Mobile | Full-width person panel, horizontal scroll tabs, stacked layouts |
| 768px+ | Tablet | Side panel width constrained, more comfortable spacing |
| 1440px | Desktop max | `max-width: 1440px` container constraint on header/tabs |

Note: The actual CSS does not use explicit `@media` breakpoints in the main layout — it relies on flexible layouts (`max-width: 100vw` on panel, `overflow-x: auto` on tabs) to adapt. The `100dvh` unit is used for the main content height with `100vh` fallback.

### Component Styling Approach

The CSS follows a **BEM-inspired flat class structure** without strict BEM naming:

- **Block-level classes:** `.site-header`, `.person-panel`, `.search-overlay`, `.tree-container`
- **Element classes:** `.header-inner`, `.panel-content`, `.search-dialog`, `.node-bg`
- **State classes:** `.active`, `.selected`, `.hidden`
- **Modifier classes:** `.male`, `.female`, `.unknown` (gender variants); `.confidence-high/medium/low`

**Key patterns:**
- Component-scoped custom properties: `--tab-accent`, `--chip-color`, `--chip-bg` set inline by JS for per-family-line theming
- Transition system: All interactive elements use `transition: [property] var(--duration-fast) var(--ease)`
- Background pattern: Tree container uses `radial-gradient` for subtle dot-grid background

### CSS Animations (4)

| Animation | Duration | Usage |
|-----------|----------|-------|
| `pulse` | 2s infinite | Loading screen tree emoji |
| `loadProgress` | 1.5s infinite | Loading bar indeterminate progress |
| `fadeHint` | 6s forwards | Tree interaction hint auto-fade |
| `slideDown` | 250ms | Search dialog entrance |

### Accessibility Features

| Feature | Implementation |
|---------|---------------|
| **Focus indicators** | `:focus-visible` → 3px solid `var(--c-focus)` blue outline, 2px offset |
| **Skip link** | `.skip-link` positioned off-screen, visible on `:focus` |
| **Reduced motion** | Not explicitly in CSS (deferred), but animations are short/subtle |
| **Color contrast** | `--c-text: #2C2C2C` on `--c-background: #FAF6F0` ≈ 11:1 ratio. `--c-text-muted: #706B63` darkened from earlier `#888` to pass AA. |
| **Touch targets** | `.btn-icon` and `.panel-close` both 44×44px minimum |
| **Screen reader** | ARIA roles on all interactive regions; `aria-hidden` on decorative elements |

---

## 6. Implementation Sequence

Retrospective dependency ordering of how the implementation was built:

### Phase 1: Data Foundation — Effort: M

| # | Task | Effort | Depends On | Rationale |
|---|------|--------|------------|-----------|
| 1.1 | Create `data/people.json` — 174 person records | M | Research data | [why?](#seq-data-entry) All UI depends on data existing. 174 records × ~20 fields = substantial data entry from research documents. |
| 1.2 | Create `data/family-tree.json` — 58 family units + meta | S | 1.1 | Family units reference person IDs; must be created after people. |
| 1.3 | Implement `js/data.js` — loaders, indexes, queries | M | 1.1, 1.2 | Tree, person panel, and search all import from data.js. Must be complete before any UI module. |

### Phase 2: HTML Shell & Styling — Effort: M

| # | Task | Effort | Depends On | Rationale |
|---|------|--------|------------|-----------|
| 2.1 | Create `index.html` — semantic page structure | S | — | Defines all container elements that JS modules bind to. |
| 2.2 | Create `css/styles.css` — custom properties + base styles | M | 2.1 | [why?](#seq-css) Large stylesheet (24KB) defining the entire visual language. Must be substantially complete before visual testing of any JS module. |

### Phase 3: Core Visualization — Effort: L

| # | Task | Effort | Depends On | Rationale |
|---|------|--------|------------|-----------|
| 3.1 | Implement `js/tree.js` — layout algorithm | L | 1.3, 2.1, 2.2 | [why?](#seq-tree) Highest-complexity module. Recursive family layout, SVG rendering, and interaction handling. Depends on data layer being complete and HTML container existing. |
| 3.2 | Implement `js/person.js` — detail panel | M | 1.3, 2.1, 2.2 | Can be built in parallel with tree.js since both depend only on data.js and DOM containers. |
| 3.3 | Implement `js/search.js` — search overlay | S | 1.3, 2.1, 2.2 | Depends on `searchPeople()` in data.js. Independent of tree.js and person.js. |

### Phase 4: Integration & Polish — Effort: S

| # | Task | Effort | Depends On | Rationale |
|---|------|--------|------------|-----------|
| 4.1 | Implement `js/app.js` — orchestration + routing | S | 3.1, 3.2, 3.3 | Wires all modules together. Must be last JS module since it imports all others. |
| 4.2 | Accessibility hardening | S | 4.1 | Focus traps, ARIA attributes, keyboard navigation, skip links — validated against complete UI. |
| 4.3 | XSS hardening | XS | 3.2, 3.3 | `escapeHTML()` in person.js, sanitized error messages in app.js. |

### Phase 5: Testing — Effort: M

| # | Task | Effort | Depends On | Rationale |
|---|------|--------|------------|-----------|
| 5.1 | Data integrity tests | S | 1.1, 1.2 | Schema validation, referential integrity, accuracy checks |
| 5.2 | Unit tests | M | 3.1, 3.2, 3.3, 1.3 | 4 test files covering data, tree, person, search modules |
| 5.3 | E2E tests | M | 4.1 | 6 Playwright specs: navigation, tree, person, search, accessibility, mobile |

### Critical Path

```
Research data → people.json → family-tree.json → data.js → tree.js ─┐
                                                    │               │
                                                    ├→ person.js ───┤→ app.js → Tests
                                                    │               │
                                                    └→ search.js ───┘
index.html ─────────────────────────────────────────────────────────┘
styles.css ─────────────────────────────────────────────────────────┘
```

**Total estimated effort: L** — approximately equivalent to the spec's original L estimate. The data entry (174 people) and tree layout algorithm are the two largest effort items.

---

## 7. Spec Review Findings Addressed

The spec review (`03-spec-review.md`) identified **5 🟡 Concerns** that should be addressed before implementation. Here is how each was resolved:

### 🟡 Concern 1: SR-TV1 — Tree Type Ambiguity

> **Finding:** Spec says "pedigree chart" but acceptance criteria test full family graph navigation. Different layout algorithms needed.

**Resolution:** Implementation uses a **descendant chart** (top-down from root ancestors to descendants), not a pedigree chart. [why?](#resolution-tv1) The recursive `layoutFamily()` in `tree.js` starts from root families and renders all descendants — this is a connected family graph with vertical orientation, exactly what the acceptance criteria required. The `renderTree(familyLine)` API filters by family line, and `findRootsForLine()` identifies the topmost families in each line.

**Evidence:** `tree.js` lines 151-222 (`computeLayout`), lines 259-415 (`layoutFamily`)

---

### 🟡 Concern 2: SR-CA1 — No Empty-State Definition for Sparse Profiles

> **Finding:** ~40% of people have minimal data. No definition for what the detail view looks like when most sections are empty.

**Resolution:** Implemented exactly per the spec review's recommendation. [why?](#resolution-ca1) `person.js` uses a `calcDataDensity()` function that counts populated fields. When density < 3, a "📋 Limited records available for this individual" notice is displayed. Additionally, all section builders (`buildQuickFacts`, `buildImmigration`, etc.) return empty strings when their data is absent — empty sections are **omitted**, not rendered as empty containers.

**Evidence:** `person.js` lines 362-377 (`calcDataDensity`), line 135-138 (sparse notice render), each `build*` function returns `''` on no data

---

### 🟡 Concern 3: SR-CA6 — Living Person Identification

> **Finding:** No `livingStatus` field in data schema. Can't distinguish "living" from "death date unknown" for historical persons.

**Resolution:** Implemented a **heuristic** rather than adding a `livingStatus` field. [why?](#resolution-ca6) The `isLiving()` function in `data.js` (lines 383-391) uses the rule: **no death date AND birth year ≥ 1920 = probably living**. This threshold correctly identifies Generation 6-7 living family members while treating historical persons without death dates (e.g., Generation 2 Thompson siblings born in 1770s) as deceased.

**Privacy behavior when `isLiving()` is true:**
- Person panel: Birth date shown as "(date hidden for privacy)" (`person.js` line 147)
- Tree node: Shows "Living" instead of birth-death span (`tree.js` line 446)
- Search results: Shows "Living" instead of lifespan (`search.js` line 187)

**Trade-off:** The heuristic is imperfect — a person born in 1921 with no death record would be flagged as "living" even if deceased. However, this avoids requiring manual `livingStatus` field maintenance and works correctly for the actual dataset.

---

### 🟡 Concern 4: DS-A1 — Warm Gold Contrast Failure

> **Finding:** Warm Gold (#C5933A) fails WCAG 4.5:1 contrast ratio on Parchment/White backgrounds.

**Resolution:** Gold tones are used **only for decorative/badge purposes**, never as body text color. [why?](#resolution-a1) The `--c-gold: #8B6914` (darkened from spec's #C5933A) is used only for:
- `.confidence-medium` badge text color (small badge with background, not body text)
- Family line badge backgrounds use per-line colors set via `getFamilyLineInfo()` — each line has a dark `color` and light `bg` pairing verified for contrast

**Primary text colors and their contrast on `--c-background: #FAF6F0`:**
- `--c-text: #2C2C2C` → ≈ 11:1 ✅
- `--c-text-light: #5A5A5A` → ≈ 5.5:1 ✅
- `--c-text-muted: #706B63` → ≈ 4.5:1 ✅ (darkened from original `#888` per code review finding DS-CR3)

---

### 🟡 Concern 5: DS-U1 — Undefined UI States

> **Finding:** Loading, error, empty, and 404 UI states not defined in the spec.

**Resolution:** All four states are implemented. [why?](#resolution-u1)

| State | Implementation |
|-------|---------------|
| **Loading** | Full-screen overlay with pulsing tree emoji, title, "Loading family records…" text, and indeterminate progress bar. CSS animations `pulse` and `loadProgress`. Hides with opacity transition on data load complete. (`index.html` lines 20-27, `app.js` lines 218-224) |
| **Error** | Loading screen transforms to error state: ⚠️ icon, "Unable to load family data" heading, error message (XSS-sanitized), and "Try Again" button that reloads the page. (`app.js` lines 226-245) |
| **Empty tree** | When a family line filter yields no members, `renderEmptyState()` displays "No family members to display" centered text in the SVG viewport. (`tree.js` lines 551-562) |
| **404 / invalid deep link** | `handleHashChange()` in `app.js` silently handles invalid person IDs — `getPerson()` returns null, and the panel simply doesn't open. No jarring error. The tree remains visible. (`app.js` lines 187-208) |

---

## Appendix: Reasoning Links

#### effort-data
The data module has the highest export count (22) and contains both the search engine and the graph traversal algorithms. The recursive `getAncestors()` and `getDescendants()` functions, the weighted search scorer with 6 field categories, and the multi-format date parser each represent non-trivial logic. Comparable to a data access layer in a standard web app — clearly beyond S (single component) but not requiring cross-module architecture decisions like an L.

#### effort-tree
The tree module is the most complex single file at 690 lines. The `layoutFamily()` recursive algorithm handles 6 concerns simultaneously: couple placement, child recursion, parent re-centering, isolated person fallback, bounding box tracking, and cross-reference filtering by family line. The zoom/pan system implements 3 input modes (wheel, mouse drag, touch pinch) each with distinct coordinate math. Comparable to implementing a custom diagramming widget.

#### effort-person
415 lines, 8 template builders. The complexity is in completeness (handling all person data fields with graceful degradation) rather than algorithmic difficulty. The focus trap and navigable person links add interaction concerns. Comparable to a detailed entity view with relationship navigation.

#### effort-search
271 lines, largely straightforward. Delegates search scoring to data.js. The debounced input, keyboard navigation, and filter chip state management are standard patterns. Comparable to a search dialog component — clearly S scope.

#### effort-app
246 lines of orchestration wiring. No complex algorithms. Hash-based routing is simple string parsing. Tab management is DOM manipulation. Comparable to an app entry point / bootstrap module.

#### effort-overall
2,077 lines of JS across 5 modules + 24KB CSS + 5.5KB HTML + 172KB data. Cross-cutting concerns (accessibility, routing, responsive design, security hardening) span all modules. The tree layout algorithm alone is L-complexity. The data entry of 174 people from research documents was a significant M-effort prerequisite. Overall L is calibrated against the Forge scale: 10-20 files, new architecture, cross-module — this project has 7 app files + 2 data files + 1 config ecosystem, with original layout algorithm design.

#### search-index-reasoning
A pre-built inverted index (e.g., lunr.js) would be appropriate for 1000+ records but is overkill for 174. The inline scan approach has O(n × fields) complexity per keystroke where n=174 — this completes in under 1ms on any modern device, well below the 200ms debounce threshold. Avoiding a search library keeps the zero-dependency architecture clean.

#### tree-layout-reasoning
A descendant chart (top-down) was chosen over a pedigree chart (center-outward) because: (1) the dataset has well-defined root ancestors at the top of each family line, (2) the acceptance criteria test descendant navigation (AC-4, AC-7), (3) a top-down tree is more intuitive for users scanning family relationships, and (4) the layout algorithm is simpler — recursive descent with child fan-out vs. the binary-tree outward-branching of a pedigree. The family-line tab filtering provides the "focused view" that a pedigree chart would give.

#### connection-style-reasoning
Orthogonal (straight-line) connections were used instead of Bezier curves. While the spec's design requirements mention Bezier curves, straight lines are cleaner at all zoom levels, easier to compute, and avoid the visual noise that curves create in dense multi-child layouts (e.g., Thompson patriarch with 10 children). The dashed-line couple connector distinguishes marriage connections from parent-child connections without color dependency.

#### multi-marriage-layout-reasoning
Full multi-marriage tree layout (showing person X positioned between two spouses with children branching from each marriage) requires a significantly more complex layout algorithm — essentially a DAG layout rather than a tree layout. The current implementation handles the most common case (one spouse family per person in the tree view) while the person panel provides complete marriage data. This is an acceptable V1 trade-off documented in the code review.

#### resolution-tv1
The spec review correctly identified that "pedigree chart" was the wrong term for what the acceptance criteria described. The implementation resolved this by building a descendant chart — the natural choice for a dataset organized by root ancestor families flowing down to present-day descendants. This matches AC-4 (Calvin Thompson's descendants), AC-7 (Thomas Holmes's families), and AC-12 (4 generations visible) without requiring a center-outward pedigree layout.

#### resolution-ca1
The spec review recommended: "Display available information with a 'Limited Records Available' note and omit empty sections rather than showing empty containers." The implementation follows this recommendation precisely. Each section builder returns an empty string when no data is available, so the DOM never contains empty sections. The sparse notice is triggered by a data density threshold, providing a clear signal to users that the record is incomplete.

#### resolution-ca6
The spec review recommended adding a `livingStatus` enum field. The implementation chose a heuristic instead, which avoids schema complexity and manual maintenance. The 1920 threshold was chosen because: (1) no one born before 1920 would be living in the dataset's current timeframe, (2) it correctly identifies known living family members (Generation 6-7), and (3) it errs on the side of privacy — flagging ambiguous cases as "living" is safer than exposing potentially living persons' birth dates.

#### resolution-a1
The spec review estimated Warm Gold at ~2.8:1 on Parchment and recommended restricting to decorative use or darkening. The implementation darkened gold to `#8B6914` (from `#C5933A`) and restricted its use to the confidence badge system where it appears as a small colored indicator alongside text, not as the text color itself. All body text uses colors that pass WCAG AA.

#### resolution-u1
The spec review recommended adding loading, error, empty, and 404 states. All four are implemented. The loading state is particularly polished with animations and a progress indicator. The error state provides a recovery action (reload button). The empty tree state gives clear feedback. The 404 handling is graceful — invalid deep links simply don't trigger panel navigation, keeping the app in a usable state.

#### seq-data-entry
Data entry must come first because every other module depends on it. The 174-person dataset was transcribed from 6 source photos and validated against the research documents. This is the highest-effort single task despite being "just data entry" — each person requires ~20 field decisions, cross-referencing between source documents, and confidence assessment.

#### seq-css
The stylesheet was likely built incrementally alongside the JS modules, but it logically depends on the HTML structure and informs all visual testing. At 24KB, it represents a substantial design system covering ~30 distinct component types.

#### seq-tree
The tree module was the riskiest implementation task — if the layout algorithm didn't produce a readable tree, the entire project would fail. Building it early (after data but before polish) allows maximum iteration time on the hardest problem.
