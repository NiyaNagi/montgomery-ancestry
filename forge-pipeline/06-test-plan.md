# Stage 06 — Test Plan: Montgomery Ancestry Browser

<!--
  Stage 06 — Test Plan
  Agent: @TestPlanner (Full Test Plan, Mode 1)
  Pipeline: Montgomery Ancestry Browser
  Input: forge-pipeline/02-spec.md, forge-pipeline/03-spec-review.md
  Date: 2026-03-29

  ADAPTATION NOTE:
  This is a greenfield static-site project (vanilla HTML/CSS/JS).
  - No IDP matrix, flight flags, Kusto telemetry, or ring deployment
  - Testing stack: Jest (unit + data validation), Playwright (E2E)
  - Data validation is a distinct test layer due to genealogical accuracy requirements
-->

---

## Phase 1: Test Strategy Overview

### 1.1 Test Layers

The Montgomery Ancestry Browser uses 4 testing layers aligned with the project's static-site architecture [why?](#four-layers-reasoning):

| Layer | Tool | Scope | Coverage Target | Effort |
|-------|------|-------|----------------|--------|
| **Unit** | Jest | Pure JS modules: data loading, search, tree layout, person formatting | ≥ 90% line coverage | M [why?](#unit-effort-reasoning) |
| **Integration** | Jest + jsdom | Data + DOM interactions: rendering person cards, populating detail views, search UI binding | ≥ 70% of component render paths | S [why?](#integration-effort-reasoning) |
| **E2E** | Playwright | Full user flows in real browser: navigation, tree interaction, search, mobile, accessibility | All 23 ACs verified + all 4 user flows | M [why?](#e2e-effort-reasoning) |
| **Data Validation** | Jest | JSON schema, relationship integrity, accuracy vs. validated research | 100% of 118 people validated | S [why?](#data-effort-reasoning) |

### 1.2 Priority Matrix

| Priority | Definition | Gate | Count |
|----------|-----------|------|-------|
| **P0** | Must pass before deploy — blocks GitHub Pages launch | Pre-deploy CI gate | 47 tests |
| **P1** | Should pass before family beta — blocks sharing with relatives | Pre-beta gate | 29 tests |
| **P2** | Nice to have — improves quality but doesn't block launch | Post-launch backlog | 18 tests |

### 1.3 Known Issues from Spec Review

These 5 open findings from Stage 03 affect test planning [why?](#known-issues-reasoning):

| ID | Finding | Test Impact |
|----|---------|-------------|
| SR-TV1 | Tree type ambiguity (pedigree vs. full graph) | Tree layout tests must cover both ancestor and descendant navigation — test the *graph* behavior, not just pedigree |
| SR-CA1 | No empty-state for sparse profiles (~40% of 118 people) | Add explicit tests for persons with minimal data (e.g., Belinda Thompson: name only) |
| SR-CA6 | Living person identification lacks `livingStatus` field | Test that living persons (Generation 6+) show limited data; test that deceased persons without death dates still show full data |
| DS-A1 | Warm Gold (#C5933A) fails WCAG contrast | Add contrast validation test for all color pairings in the design system |
| DS-U1 | Loading/error/empty/404 states undefined | Add E2E tests for error and 404 states; use placeholder assertions until spec clarifies |

---

## Phase 2: Coverage Matrix

### 2.1 Functional Requirements Coverage

| Req | Description | Unit | Integration | E2E | Data | Priority |
|-----|-------------|:----:|:-----------:|:---:|:----:|:--------:|
| **FR-1** | Tree Visualization | ✅ tree layout algorithms | ✅ SVG render | ✅ zoom/pan/click | — | P0 |
| **FR-2** | Person Detail View | ✅ person formatting | ✅ detail render | ✅ detail interaction | — | P0 |
| **FR-3** | Search & Filter | ✅ search logic | ✅ auto-suggest render | ✅ search flow | — | P0 |
| **FR-4** | Responsive Design | — | ✅ breakpoint CSS | ✅ mobile/tablet/desktop | — | P0 |
| **FR-5** | Navigation | ✅ routing logic | ✅ breadcrumb render | ✅ deep links, back/forward | — | P0 |
| **FR-6** | Family Group View | ✅ family grouping | ✅ group render | ✅ group interaction | — | P1 |
| **FR-7** | Timeline View | ✅ event sorting | ✅ timeline render | ✅ timeline scroll | — | P1 |
| **FR-8** | Data Integrity | — | — | — | ✅ schema + relationships | P0 |
| **FR-9** | Accessibility | — | ✅ ARIA roles | ✅ keyboard nav, screen reader | — | P0 |
| **FR-10** | Performance | — | — | ✅ Lighthouse audit | — | P1 |

### 2.2 Acceptance Criteria Coverage

| AC | Description | Test Layer | Test ID(s) | Priority |
|----|-------------|-----------|------------|:--------:|
| AC-1 | Tree loads with 3+ generations visible | E2E | `e2e-tree-01` | P0 |
| AC-2 | Zoom via scroll/pinch | E2E | `e2e-tree-02` | P0 |
| AC-3 | Click person → recenter tree | E2E | `e2e-tree-03` | P0 |
| AC-4 | Calvin Thompson 2 wives visible | E2E + Unit | `e2e-tree-04`, `unit-tree-06` | P0 |
| AC-5 | Isabella Holmes birth ambiguity "1878 or 1879" | E2E + Unit | `e2e-person-01`, `unit-person-03` | P0 |
| AC-6 | Fred Thompson M.D. full detail populated | E2E | `e2e-person-02` | P0 |
| AC-7 | Thomas Holmes 2 marriages in family panel | E2E + Unit | `e2e-person-03`, `unit-person-05` | P0 |
| AC-8 | Search "Isa" → auto-suggest within 100ms | E2E + Unit | `e2e-search-01`, `unit-search-01` | P0 |
| AC-9 | Search "Thompson" → all Thompsons with context | E2E + Unit | `e2e-search-02`, `unit-search-02` | P0 |
| AC-10 | Click search result → navigate to detail | E2E | `e2e-search-03` | P0 |
| AC-11 | iPhone SE (375px) — vertical layout, no h-scroll | E2E | `e2e-mobile-01` | P0 |
| AC-12 | Desktop (1440px) — 4+ generations visible | E2E | `e2e-tree-05` | P0 |
| AC-13 | All touch targets ≥ 44×44px | E2E | `e2e-mobile-02` | P0 |
| AC-14 | Browser back button works | E2E | `e2e-nav-01` | P0 |
| AC-15 | Deep link to Fred Thompson loads correctly | E2E | `e2e-nav-02` | P0 |
| AC-16 | Holmes family line filter | E2E | `e2e-nav-03` | P1 |
| AC-17 | All 118 people present with unique IDs | Data | `data-schema-01` | P0 |
| AC-18 | Bidirectional relationships | Data | `data-integrity-01` | P0 |
| AC-19 | Screen reader announcement format | E2E | `e2e-a11y-01` | P1 |
| AC-20 | Keyboard tab order with focus indicators | E2E | `e2e-a11y-02` | P0 |
| AC-21 | WCAG AA contrast ratios | E2E | `e2e-a11y-03` | P0 |
| AC-22 | Lighthouse scores ≥ targets | E2E | `e2e-perf-01` | P1 |
| AC-23 | Tree pan/zoom at 60fps | E2E | `e2e-perf-02` | P1 |

---

## Phase 3: Test Cases — Unit Tests

### 3.1 Data Module (`tests/unit/data.test.js`)

Tests for data loading, parsing, graph construction, and traversal of the 118-person family tree.

| ID | Test Name | Input | Expected Output | Edge Case | Priority |
|----|-----------|-------|-----------------|-----------|:--------:|
| `unit-data-01` | loads and parses JSON data file | Valid JSON path | Parsed object with `people` array (118 entries) | — | P0 |
| `unit-data-02` | rejects malformed JSON | Truncated JSON | Throws parse error with descriptive message | Empty file, null bytes | P0 |
| `unit-data-03` | builds person lookup by ID | Parsed data | Map with 118 entries, keyed by slug ID | Duplicate IDs detected | P0 |
| `unit-data-04` | resolves parent-child relationships | Person `isabella-edna-holmes-1879` | Parents: `thomas-holmes-1817`, `isabella-smyth-1838`; Children: 4 (Fred Holmes, Charlotte Isabel, Dorothy, Millicent) | Person with no parents (`thompson-patriarch`) | P0 |
| `unit-data-05` | resolves spouse relationships | `calvin-thompson-1822` | 2 spouses: `serene-chamberlain-1823`, `charlotte-brown-1840` in chronological order | Person with 0 spouses (`belinda-thompson-1820`) | P0 |
| `unit-data-06` | resolves sibling relationships | `fred-e-thompson-1871` | Siblings: `nettie-thompson-1864`, `james-h-thompson-1866` (half-siblings from 1st marriage: `charles-e-thompson-1850`, `albert-h-thompson-1852`, `elizabeth-r-thompson-1855`) | Only child, half-siblings across marriages | P1 |
| `unit-data-07` | computes ancestor path from person to root | `millicent-betts-thompson` → root | Path through Fred Thompson → Calvin Thompson → Charles Thompson → Patriarch | Circular reference detection, path for root person (empty) | P1 |
| `unit-data-08` | computes descendants list | `charles-thompson-1783` | All descendants across 5 generations | Person with no children | P1 |
| `unit-data-09` | identifies family line for each person | `isabella-edna-holmes-1879` | `Holmes` (primary), cross-references `Smyth`, `Gies Hessen` | Person at convergence point (Millicent Betts Thompson: Thompson + Holmes) | P1 |
| `unit-data-10` | handles 118-person graph traversal under 50ms | Full dataset | Complete graph traversal ≤ 50ms | — [why?](#perf-traversal-reasoning) | P0 |
| `unit-data-11` | detects orphaned person references | Data with broken reference | Returns list of IDs referenced but not defined | All references valid (empty list) | P0 |
| `unit-data-12` | groups children by marriage | `thomas-holmes-1817` | Marriage 1 (Jane Hampson): 10 children; Marriage 2 (Isabella Smyth): 4 children | Person with 1 marriage, person with 0 marriages | P0 |

### 3.2 Search Module (`tests/unit/search.test.js`)

Tests for client-side search logic, filtering, and ranking.

| ID | Test Name | Input | Expected Output | Edge Case | Priority |
|----|-----------|-------|-----------------|-----------|:--------:|
| `unit-search-01` | partial name match "Isa" | Query: `"Isa"` | Returns `isabella-smyth-1838` and `isabella-edna-holmes-1879` (at minimum) | — | P0 |
| `unit-search-02` | surname search "Thompson" | Query: `"Thompson"` | Returns all 25+ Thompson line members | — | P0 |
| `unit-search-03` | case-insensitive matching | Query: `"mccrory"` | Returns `julia-ann-holmes` (m. Rev. James McCrory) | ALL CAPS input, mIxEd CaSe | P0 |
| `unit-search-04` | empty query returns no results | Query: `""` | Returns empty array, not full dataset | Whitespace-only query `"   "` | P0 |
| `unit-search-05` | no match found | Query: `"Zzyzzyva"` | Returns empty array | — | P0 |
| `unit-search-06` | matches maiden name | Query: `"Betts"` | Returns `millicent-ann-betts` and `millicent-betts-thompson` | — | P1 |
| `unit-search-07` | matches nickname | Query: `"Gyps"` | Returns `meda-gyps-king` | — | P1 |
| `unit-search-08` | search responds under 100ms for full dataset | Full 118-person dataset, query: `"th"` | Results returned in < 100ms | — [why?](#search-perf-test-reasoning) | P0 |
| `unit-search-09` | special characters in query | Query: `"O'Brien"` | Returns Henry Smyth's spouse Julia O'Brien context | Apostrophes, hyphens, periods | P1 |
| `unit-search-10` | family line filter "Holmes" | Filter: `"Holmes"` | Returns only Holmes line members | Filter with no matching results | P1 |
| `unit-search-11` | combined search + filter | Query: `"Thomas"`, Filter: `"Holmes"` | Returns `thomas-holmes-1817` and `thomas-holmes-jr`, not `thomas` from other lines | — | P1 |
| `unit-search-12` | results include contextual metadata | Query: `"Fred"` | Each result includes: full name, birth-death years, family line | Person with no dates (`fritz-thompson`) | P0 |
| `unit-search-13` | partial name with uncertain characters | Query: `"Shar"` | Returns `sharon-jones` (Shar[on?] Jones) | — | P2 |

### 3.3 Tree Layout Module (`tests/unit/tree.test.js`)

Tests for tree layout calculation algorithms (position computation, not DOM rendering).

| ID | Test Name | Input | Expected Output | Edge Case | Priority |
|----|-----------|-------|-----------------|-----------|:--------:|
| `unit-tree-01` | computes positions for 3-generation pedigree | Focal: `millicent-betts-thompson` | Parents, grandparents positioned correctly; no overlapping nodes | — | P0 |
| `unit-tree-02` | computes positions for 5-generation tree | Focal: `millicent-betts-thompson` | 5 generations laid out left-to-right with increasing vertical spread | — | P0 |
| `unit-tree-03` | handles person with no ancestors | Focal: `thompson-patriarch` | Only the focal node displayed; no parent branches | — | P0 |
| `unit-tree-04` | handles person with no descendants | Focal: `charlotte-isabel-thompson` (died in infancy) | Only the focal node with parents above | — | P1 |
| `unit-tree-05` | computes connecting line bezier control points | Two adjacent generations | Array of bezier curve coordinates connecting parent to child cards | Single child, many children (Thomas Holmes: 14) | P1 |
| `unit-tree-06` | multi-marriage layout: 2 spouse branches | `calvin-thompson-1822` as focal | Two distinct spouse nodes with respective children grouped separately | — | P0 |
| `unit-tree-07` | multi-marriage layout: 14 children (Thomas Holmes) | `thomas-holmes-1817` as focal | 10 children from Jane Hampson + 4 from Isabella Smyth, no overlaps | — [why?](#thomas-holmes-reasoning) | P0 |
| `unit-tree-08` | multi-marriage from focal-person perspective | `isabella-smyth-1838` as focal | 2 husbands (Mr. Kitchen, Thomas Holmes) shown chronologically | — [why?](#focal-multi-marriage-reasoning) | P1 |
| `unit-tree-09` | cross-line convergence visible | `isabella-edna-holmes-1879` as focal | Thompson (paternal) and Holmes→Smyth→Gies (maternal) lines visible | — | P1 |
| `unit-tree-10` | viewport culling: nodes outside viewport excluded | Viewport: 800×600, zoom level showing 2 generations | Only visible nodes returned; hidden nodes excluded from render list | Zoom level showing entire tree (no culling) | P2 |
| `unit-tree-11` | collapse/expand branch state | Collapse `charles-thompson-1783` branch | Branch descendants excluded from layout; expand restores them | Collapse root node, collapse leaf node | P1 |
| `unit-tree-12` | no node overlap at any zoom level | Full 118-person tree | All node bounding boxes non-overlapping | Zoom min and zoom max | P0 |

### 3.4 Person Module (`tests/unit/person.test.js`)

Tests for person data formatting, computed fields, and display logic.

| ID | Test Name | Input | Expected Output | Edge Case | Priority |
|----|-----------|-------|-----------------|-----------|:--------:|
| `unit-person-01` | formats full lifespan string | `fred-e-thompson-1871` (b. 1871, d. 1940) | `"1871–1940"` | — | P0 |
| `unit-person-02` | formats lifespan with no death date | `belinda-thompson-1820` (b. 1820, d. unknown) | `"b. 1820"` | — | P0 |
| `unit-person-03` | formats ambiguous birth year | `isabella-edna-holmes-1879` | `"1878 or 1879"` or `"b. 1878/1879"` (per spec AC-5) | — | P0 |
| `unit-person-04` | formats approximate date | `charles-e-thompson-1850` (b. ~1850) | `"~1850"` with tilde prefix | — | P0 |
| `unit-person-05` | lists multiple marriages chronologically | `thomas-holmes-1817` | Marriage 1: Jane Hampson (m. 1839); Marriage 2: Isabella Smyth (m. 1873) | Person with 0 marriages | P0 |
| `unit-person-06` | computes age at death | `fred-e-thompson-1871` (1871–1940) | `68` or `69` (depending on month) | — | P0 |
| `unit-person-07` | handles infant death display | `charlotte-isabel-thompson` (died in infancy) | `"Died in infancy"` — NOT "Age at death: 0" [why?](#infant-death-test-reasoning) | Elizabeth Smith (1 month), Ethel Smith (9 months) | P0 |
| `unit-person-08` | formats unknown first name | `thompson-patriarch` | `"—— Thompson"` or `"[Unknown] Thompson"` with visual distinction | — | P0 |
| `unit-person-09` | formats partial/uncertain name | `sharon-jones` | Preserves uncertainty marker: `"Sharon(?) Jones"` or equivalent | — | P1 |
| `unit-person-10` | generates URL-safe slug | `"Fred Eugene Thompson, M.D."`, born 1871 | `"fred-e-thompson-1871"` | Names with apostrophes (O'Brien), names with no birth year | P0 |
| `unit-person-11` | determines living status | Person with `livingStatus: "living"` | Returns true; restricts visible fields to name + relationship only | Person with no death date but `livingStatus: "deceased"` [why?](#living-status-test-reasoning) | P0 |
| `unit-person-12` | builds life event timeline | `fred-e-thompson-1871` | Chronological events: birth (1871) → education (Reed City HS, Michigan State Normal, Hahnemann Medical) → marriage (1903) → death (1940) | Person with no events (`bertha-northwood`: name only) | P1 |
| `unit-person-13` | handles very long display name | `"Elizabeth Rocelia Thompson"` (29 chars) | Returns truncated display name with full name available | — | P1 |
| `unit-person-14` | formats occupation with title | `fred-e-thompson-1871` | `"M.D. — Homeopathic Physician"` | Person with no occupation | P2 |
| `unit-person-15` | computes generation number relative to focal | `thompson-patriarch` relative to `millicent-betts-thompson` | Generation -6 (6 generations above focal) | Same person as focal (generation 0) | P2 |

---

## Phase 4: Test Cases — E2E Tests

### 4.1 Tree Visualization (`tests/e2e/tree.spec.js`)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-tree-01` | Tree loads with default focal person | 1. Navigate to `/tree` (or `#/tree`) 2. Wait for render | Pedigree chart visible; default focal person centered; ≥ 3 generations displayed | P0 |
| `e2e-tree-02` | Zoom in/out via mouse wheel | 1. Load tree 2. Scroll mouse wheel up 3. Scroll down | Tree zooms smoothly; node text remains readable at zoom levels | P0 |
| `e2e-tree-03` | Click person → recenter | 1. Load tree 2. Click `fred-e-thompson-1871` card | Tree recenters on Fred Thompson; his ancestors/descendants visible | P0 |
| `e2e-tree-04` | Calvin Thompson: 2 wives visible | 1. Navigate to Calvin Thompson (1822) in tree 2. Expand his branch | Two marriage branches visible: Serene Adams Chamberlain (3 children) and Charlotte Brown (3 children) | P0 |
| `e2e-tree-05` | Desktop: 4+ generations visible | 1. Set viewport to 1440px 2. Load tree | At least 4 generations simultaneously visible without scrolling | P0 |
| `e2e-tree-06` | Expand/collapse branches | 1. Load tree 2. Click collapse on a branch 3. Click expand | Branch hides/shows descendants; layout adjusts without overlap | P1 |
| `e2e-tree-07` | Recenter button | 1. Pan tree away from focal 2. Click "Recenter" | Tree returns to focal person position | P1 |
| `e2e-tree-08` | Pan via click-drag | 1. Load tree 2. Click and drag | Tree viewport moves with drag; smooth, no jank | P0 |

### 4.2 Person Detail (`tests/e2e/person.spec.js`)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-person-01` | Isabella Holmes birth ambiguity displayed | 1. Navigate to `isabella-edna-holmes-1879` | Birth year shown as "1878 or 1879" — not one or the other | P0 |
| `e2e-person-02` | Fred Thompson full detail populated | 1. Navigate to `fred-e-thompson-1871` | All sections populated: header (name + M.D.), timeline (birth→education→marriage→death), family panel (parents, spouse, 4 children), occupation, biographical notes | P0 |
| `e2e-person-03` | Thomas Holmes 2 marriages | 1. Navigate to `thomas-holmes-1817` | Family panel lists: Marriage 1 (Jane Hampson, 10 children) and Marriage 2 (Isabella Smyth, 4 children) | P0 |
| `e2e-person-04` | Sparse person profile | 1. Navigate to `belinda-thompson-1820` | Shows name and family relationship; empty sections omitted; "Limited Records Available" note displayed | P1 |
| `e2e-person-05` | Click family member → navigate | 1. View Isabella Edna Holmes 2. Click "Thomas Holmes" in family panel | Navigates to Thomas Holmes detail view | P0 |
| `e2e-person-06` | Thompson patriarch with unknown name | 1. Navigate to `thompson-patriarch` | Name displays unknown first name with visual marker; Scotland origin and Rev. War note visible | P1 |
| `e2e-person-07` | Infant death display | 1. Navigate to `charlotte-isabel-thompson` | Shows "Died in infancy" — not "Age: 0" | P1 |
| `e2e-person-08` | Living person: limited data | 1. Navigate to a Generation 7 person (e.g., `haley-montgomery`) | Only name and relationship shown; no birth date, no address | P0 |

### 4.3 Search (`tests/e2e/search.spec.js`)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-search-01` | Auto-suggest for "Isa" | 1. Focus search input 2. Type "Isa" | Dropdown shows "Isabella Smyth (1838–1930)" and "Isabella Edna Holmes (1878/1879–1937)" within 100ms | P0 |
| `e2e-search-02` | Search "Thompson" shows all Thompsons | 1. Type "Thompson" 2. View results | All Thompson family members listed with birth-death years and "Thompson" family line context | P0 |
| `e2e-search-03` | Select search result → navigate | 1. Search "Fred" 2. Click "Fred Eugene Thompson" result | Person detail view for Fred Thompson loads | P0 |
| `e2e-search-04` | No results message | 1. Search "Zzyzzyva" | "No results found" message with suggestions | P1 |
| `e2e-search-05` | Family line filter | 1. Select "Holmes" from family line dropdown 2. View filtered results | Only Holmes line members shown in tree/results | P1 |
| `e2e-search-06` | Search clears and resets | 1. Search "Thompson" 2. Clear search input | Results dismissed; tree returns to default view | P2 |

### 4.4 Navigation (`tests/e2e/navigation.spec.js`)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-nav-01` | Browser back/forward | 1. View person A 2. Click to person B 3. Click browser Back | Returns to person A's view | P0 |
| `e2e-nav-02` | Deep link to person | 1. Navigate directly to `#/person/fred-e-thompson-1871` | Fred Thompson detail view loads correctly with all data | P0 |
| `e2e-nav-03` | Family line filter navigation | 1. Select "Holmes" line filter | Tree redraws focused on Holmes line members | P1 |
| `e2e-nav-04` | Breadcrumb trail | 1. Navigate from root to person deep in tree | Breadcrumb shows path: Home > Calvin Thompson > Fred E. Thompson > Millicent B. Thompson | P1 |
| `e2e-nav-05` | Deep link to non-existent person | 1. Navigate to `#/person/does-not-exist` | 404-style message displayed, not a blank page or error | P1 |
| `e2e-nav-06` | Primary navigation links | 1. Click each nav item: Home, Tree, Search, About | Each navigates to correct view | P0 |
| `e2e-nav-07` | Landing page loads with entry points | 1. Navigate to root URL `/` | Landing page with family overview, quick stats (118 people, 7 lines, 7+ generations), and entry points visible | P0 |

### 4.5 Mobile & Responsive (`tests/e2e/mobile.spec.js`)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-mobile-01` | iPhone SE layout (375px) | 1. Set viewport to 375×667 2. Load tree | Vertical simplified layout; no horizontal scrolling; single-column | P0 |
| `e2e-mobile-02` | Touch targets ≥ 44×44px | 1. Set viewport to 375px 2. Query all interactive elements | Every clickable element has bounding box ≥ 44×44px | P0 |
| `e2e-mobile-03` | Bottom navigation bar on mobile | 1. Set viewport to 375px | Bottom tab bar visible with Home, Tree, Search, About | P1 |
| `e2e-mobile-04` | Tablet split view (768px) | 1. Set viewport to 768×1024 | Tree and person detail coexist in split layout | P1 |
| `e2e-mobile-05` | Desktop full layout (1440px) | 1. Set viewport to 1440×900 | Multi-column layout with tree + detail panel side by side | P1 |
| `e2e-mobile-06` | Content reflow at 320px | 1. Set viewport to 320px | All content visible; no horizontal overflow; text readable (≥ 16px body) | P0 |
| `e2e-mobile-07` | Touch: pinch to zoom tree | 1. Mobile viewport 2. Pinch gesture on tree | Tree zooms in/out smoothly | P2 |

### 4.6 Accessibility (`tests/e2e/accessibility.spec.js`)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-a11y-01` | Screen reader announcements | 1. Navigate tree with screen reader 2. Focus a person node | Announces: "[Name], born [year], died [year], [relationship context]" | P1 |
| `e2e-a11y-02` | Keyboard tab order | 1. Press Tab repeatedly from page load | Focus moves through all interactive elements in logical order; visible focus indicator (3px Heritage Green outline) on each | P0 |
| `e2e-a11y-03` | WCAG contrast ratios | 1. Run axe accessibility audit on all pages | No contrast violations for text content; Warm Gold (#C5933A) not used as text color [why?](#contrast-test-reasoning) | P0 |
| `e2e-a11y-04` | ARIA tree roles present | 1. Inspect tree DOM | Tree container has `role="tree"`; person nodes have `role="treeitem"`, `aria-expanded`, `aria-level` | P0 |
| `e2e-a11y-05` | Skip to main content | 1. Tab into page | First focusable element is "Skip to main content" link; activating it moves focus to `<main>` | P1 |
| `e2e-a11y-06` | Keyboard tree navigation | 1. Focus a person in tree 2. Press Up/Down/Left/Right arrows | Up → parents, Down → children, Left/Right → siblings; Enter selects | P0 |
| `e2e-a11y-07` | Alternative table/list view | 1. Activate alternative view toggle | All tree data displayed as accessible table/list | P1 |
| `e2e-a11y-08` | prefers-reduced-motion respected | 1. Set `prefers-reduced-motion: reduce` 2. Navigate tree | No animations; transitions are instant | P2 |
| `e2e-a11y-09` | Keyboard boundary behavior | 1. Focus `thompson-patriarch` 2. Press Up (no parents) | Focus stays on current node; screen reader announces "No parents known" via aria-live | P2 |
| `e2e-a11y-10` | Color not sole indicator | 1. View tree with grayscale filter | Family line distinctions still visible via labels/patterns, not just color | P1 |

### 4.7 Performance (`tests/e2e/performance.spec.js` — run separately)

| ID | Test Name | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `e2e-perf-01` | Lighthouse audit scores | 1. Deploy to local server 2. Run Lighthouse CI | Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90 | P1 |
| `e2e-perf-02` | Tree pan/zoom framerate | 1. Load full tree 2. Continuous pan for 3s | Average framerate ≥ 55fps (targeting 60fps) | P1 |
| `e2e-perf-03` | FCP and LCP | 1. Load page with throttled 4G | FCP < 1.5s, LCP < 2.5s | P1 |
| `e2e-perf-04` | Total page weight | 1. Load page 2. Measure transferred size | < 500KB gzipped (excluding images) | P2 |

---

## Phase 5: Test Cases — Data Validation

### 5.1 Schema Validation (`tests/data/schema.test.js`)

| ID | Test Name | Input | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `data-schema-01` | All 118 people have required fields | Full JSON | Every person has: `id` (non-empty string), `firstName` (string), `lastName` (string), `gender` (male/female/unknown) | P0 |
| `data-schema-02` | All IDs are unique | Full JSON | No duplicate `id` values across all 118 entries | P0 |
| `data-schema-03` | All IDs are URL-safe slugs | Full JSON | Every `id` matches pattern: `/^[a-z0-9]+(-[a-z0-9]+)*$/` | P0 |
| `data-schema-04` | Date format validation | Full JSON | All dates match one of: `YYYY-MM-DD`, `YYYY`, `~YYYY`, `null`; no free-form strings | P0 |
| `data-schema-05` | Gender values valid | Full JSON | All `gender` values are `"male"`, `"female"`, or `"unknown"` | P0 |
| `data-schema-06` | Family line assignment | Full JSON | Every person belongs to at least one family line from: Thompson, Holmes, Smyth, Gies Hessen, Northwood, Smith-Rowe-Jones, Montgomery | P1 |
| `data-schema-07` | Living status field present | Full JSON | Every person has `livingStatus`: `"living"`, `"deceased"`, or `"unknown"` [why?](#living-schema-reasoning) | P0 |

### 5.2 Relationship Integrity (`tests/data/integrity.test.js`)

| ID | Test Name | Input | Expected Result | Priority |
|----|-----------|-------|-----------------|:--------:|
| `data-integrity-01` | Bidirectional parent-child | Full JSON | For every person A listing B as child, B lists A as parent (and vice versa) | P0 |
| `data-integrity-02` | Bidirectional spouse/marriage | Full JSON | For every person A listing marriage to B, B lists marriage to A | P0 |
| `data-integrity-03` | No orphaned person references | Full JSON | Every person ID referenced in relationships exists in the people array | P0 |
| `data-integrity-04` | No self-referential relationships | Full JSON | No person lists themselves as parent, child, or spouse | P0 |
| `data-integrity-05` | Marriage children grouped correctly | `thomas-holmes-1817` | 10 children linked to marriage 1 (Jane Hampson); 4 children to marriage 2 (Isabella Smyth) | P0 |
| `data-integrity-06` | No circular parent chains | Full JSON | Following parent links from any person eventually terminates (doesn't loop) | P0 |
| `data-integrity-07` | Convergence point integrity | `isabella-edna-holmes-1879` | Has exactly 2 parents (`thomas-holmes-1817` + `isabella-smyth-1838`); is spouse of `fred-e-thompson-1871` | P1 |
| `data-integrity-08` | All 7 family lines represented | Full JSON | At least 1 person assigned to each line: Thompson (25+), Holmes (19+), Smyth (6+), Gies Hessen (5+), Northwood (9+), Smith-Rowe-Jones (17+), Montgomery (8+) | P0 |

### 5.3 Data Accuracy (`tests/data/accuracy.test.js`)

Spot-checks against the validated research data (`research/validated-tree.md`). These are high-confidence data points (🟢) that must be exactly correct [why?](#accuracy-test-reasoning).

| ID | Test Name | Person | Field | Expected Value | Priority |
|----|-----------|--------|-------|---------------|:--------:|
| `data-accuracy-01` | Donald Montgomery birth year | `donald-montgomery` | birthYear | `1912` | P0 |
| `data-accuracy-02` | Donald Montgomery death | `donald-montgomery` | deathDate | `1990-11-19` (or `1990`) | P0 |
| `data-accuracy-03` | Isabella Edna Holmes birth | `isabella-edna-holmes-1879` | birthDate | `1879-03-10` | P0 |
| `data-accuracy-04` | Isabella Edna Holmes death | `isabella-edna-holmes-1879` | deathDate | `1937-09-11` | P0 |
| `data-accuracy-05` | Fred Thompson M.D. birth | `fred-e-thompson-1871` | birthDate | `1871-11-08` | P0 |
| `data-accuracy-06` | Fred Thompson occupation | `fred-e-thompson-1871` | occupation | Contains `"physician"` or `"M.D."` | P0 |
| `data-accuracy-07` | Millicent Betts Thompson birth | `millicent-betts-thompson` | birthDate | `1911-08-23` | P0 |
| `data-accuracy-08` | Millicent Betts Thompson death | `millicent-betts-thompson` | deathDate | `2003-08-25` | P0 |
| `data-accuracy-09` | Calvin Thompson (1822) 2 marriages | `calvin-thompson-1822` | marriages.length | `2` | P0 |
| `data-accuracy-10` | Thomas Holmes mayor title | `thomas-holmes-1817` | occupation or facts | Contains `"Mayor"` or `"6th Mayor of Chatham"` | P1 |
| `data-accuracy-11` | Henry Smyth MP title | `henry-smyth-1841` | occupation or facts | Contains `"MP"` or `"Member of Parliament"` | P1 |
| `data-accuracy-12` | William Smyth Irish origin | `william-smyth` | origin | Contains `"Ireland"` or `"Irish"` | P1 |
| `data-accuracy-13` | Henry Gies immigration | `henry-gies-hessen` | events | Contains Detroit and ~1834 | P1 |
| `data-accuracy-14` | Charlotte Brown burial | `charlotte-brown-1840` | burial | Contains `"Woodland Cemetery"` and `"Reed City"` | P2 |
| `data-accuracy-15` | Total person count | Full JSON | `people.length >= 118` | P0 |
| `data-accuracy-16` | Thompson patriarch unknown name | `thompson-patriarch` | firstName | `null` or `"Unknown"` or `""` — not a guessed name | P0 |
| `data-accuracy-17` | Infant deaths flagged | `elizabeth-smith-1885`, `ethel-smith-1886`, `freddie-smith-1888` | deathType or computed | Identifiable as infant deaths | P1 |
| `data-accuracy-18` | Henry Smyth Holmes spouse correction | `henry-smyth-holmes` | spouse | `"Elizabeth Armstrong"` — NOT `"Winifred"` (corrected from original tree) | P0 |

---

## Phase 6: Test Scaffolding

Test stubs have been generated at:

- `tests/unit/data.test.js` — 12 test cases for data loading, parsing, graph traversal
- `tests/unit/search.test.js` — 13 test cases for search logic
- `tests/unit/tree.test.js` — 12 test cases for tree layout algorithms
- `tests/unit/person.test.js` — 15 test cases for person formatting
- `tests/data/schema.test.js` — 7 test cases for JSON schema validation
- `tests/data/integrity.test.js` — 8 test cases for relationship integrity
- `tests/data/accuracy.test.js` — 18 test cases for data accuracy
- `tests/e2e/navigation.spec.js` — 7 test cases for page navigation
- `tests/e2e/tree.spec.js` — 8 test cases for tree interactions
- `tests/e2e/person.spec.js` — 8 test cases for person detail view
- `tests/e2e/search.spec.js` — 6 test cases for search UI
- `tests/e2e/mobile.spec.js` — 7 test cases for responsive behavior
- `tests/e2e/accessibility.spec.js` — 10 test cases for WCAG compliance

Each stub includes:
- Import placeholders for the module under test
- `describe` blocks organized by test category
- Individual `test`/`it` signatures with descriptive names
- `// TODO:` comments with input/output expectations from this plan
- Priority annotations (`// P0`, `// P1`, `// P2`)

Engineers can immediately start implementing tests by filling in the `// TODO:` blocks.

### Implementation Effort Summary

| Test File | Test Count | Effort | Priority Mix |
|-----------|-----------|--------|-------------|
| `tests/unit/data.test.js` | 12 | S [why?](#unit-data-impl-reasoning) | 8 P0, 3 P1, 1 P2 |
| `tests/unit/search.test.js` | 13 | S [why?](#unit-search-impl-reasoning) | 7 P0, 5 P1, 1 P2 |
| `tests/unit/tree.test.js` | 12 | M [why?](#unit-tree-impl-reasoning) | 5 P0, 5 P1, 2 P2 |
| `tests/unit/person.test.js` | 15 | S [why?](#unit-person-impl-reasoning) | 7 P0, 4 P1, 4 P2 |
| `tests/data/schema.test.js` | 7 | XS [why?](#data-schema-impl-reasoning) | 5 P0, 2 P1 |
| `tests/data/integrity.test.js` | 8 | S [why?](#data-integrity-impl-reasoning) | 6 P0, 2 P1 |
| `tests/data/accuracy.test.js` | 18 | XS [why?](#data-accuracy-impl-reasoning) | 9 P0, 5 P1, 4 P2 |
| `tests/e2e/*` (6 files) | 46 | M [why?](#e2e-impl-reasoning) | 22 P0, 17 P1, 7 P2 |
| **Total** | **131** | **M overall** | **69 P0, 41 P1, 21 P2** |

### Overall Test Plan Effort: M [why?](#overall-effort-reasoning)

---

## Appendix: Reasoning Links

#### four-layers-reasoning
Four layers because: (1) **Unit** — the data model, search, and tree layout are pure JS logic that can be tested without a browser; this is the fastest feedback loop. (2) **Integration** — rendering person cards and populating views requires jsdom to verify DOM output without full browser overhead. (3) **E2E** — user flows, responsive behavior, and accessibility require real browser testing (Playwright). (4) **Data validation** — genealogical data accuracy is a separate concern from code correctness; a person's birth date being wrong is a data bug, not a code bug. This 4-layer approach matches the project's architecture: JSON data → JS modules → DOM rendering → user interaction.

#### unit-effort-reasoning
**M** — 52 unit tests across 4 modules. The data and tree modules require constructing test fixtures that model the 118-person graph with multi-marriage relationships. Comparable to the Forge scale M reference: "5-10 files, may need new patterns."

#### integration-effort-reasoning
**S** — Integration tests are implicit in the unit tests that verify DOM output (via jsdom). No separate integration test files needed for V1; unit tests that render components serve this purpose.

#### e2e-effort-reasoning
**M** — 46 E2E tests across 6 spec files. Requires Playwright setup, fixture management, and mobile viewport emulation. The accessibility tests need axe integration. Comparable effort to unit tests but slower to write due to browser automation complexity.

#### data-effort-reasoning
**S** — 33 data validation tests. Most are straightforward schema checks (required fields, valid formats) and relationship traversals. The accuracy spot-checks are simple field comparisons against known values.

#### known-issues-reasoning
The 5 open spec review findings directly affect test design: (1) SR-TV1 means tree tests must be flexible about whether the view is a strict pedigree or full graph. (2) SR-CA1 means we need explicit sparse-profile tests since ~40% of people have minimal data. (3) SR-CA6 means `livingStatus` tests must exist to prevent privacy leaks. (4) DS-A1 means contrast tests should verify Warm Gold usage. (5) DS-U1 means error-state tests need placeholder assertions.

#### perf-traversal-reasoning
The 118-person graph is small enough that traversal should be near-instant. The 50ms budget is generous — this test exists to catch accidental O(n²) or recursive algorithms that would be unnoticeable at 118 nodes but dangerous if the dataset grows. A well-implemented BFS/DFS over 118 nodes should complete in < 1ms.

#### search-perf-test-reasoning
AC-8 requires search results within 100ms. With 118 records, this is trivially fast — the test exists to catch accidental expensive operations (e.g., regex compilation per keystroke, DOM manipulation in the search path). The 100ms budget includes rendering the suggestion dropdown.

#### thomas-holmes-reasoning
Thomas Holmes with 14 children across 2 marriages is the hardest layout case in the entire dataset. If the tree algorithm can handle Thomas Holmes without overlapping nodes, it can handle any person in the tree. This is the canonical stress test for the multi-marriage layout engine.

#### focal-multi-marriage-reasoning
Spec review finding SR-TV3 noted that multi-marriage was only tested from the male perspective (Calvin Thompson: AC-4, Thomas Holmes: AC-7). Isabella Smyth married twice — first to Mr. Kitchen, then to Thomas Holmes. Testing her as focal person validates the reverse layout case where the *focal person* has multiple spouses, not just a spouse who had multiple marriages.

#### infant-death-test-reasoning
Spec review findings SR-CA2 and DS-V1 both flagged that infant death display needs sensitivity. "Age at death: 0" for Elizabeth Smith (lived 1 month) or Charlotte Isabel Thompson (died in infancy) is both factually misleading and tonally inappropriate for a family heritage site. The test verifies that the display says "Died in infancy" or "Died aged X months" per standard genealogical practice.

#### living-status-test-reasoning
Spec review finding SR-CA6 identified that `livingStatus` is needed because many deceased persons also lack death dates (e.g., Thompson Generation 2 siblings from the 1700s). The test verifies that the privacy filter uses the explicit `livingStatus` field, not the absence of a death date, to determine data visibility.

#### accuracy-test-reasoning
Data accuracy tests are spot-checks, not exhaustive verification of all 118 people. They target high-confidence (🟢) data points from the validated research that would indicate systematic data entry errors if wrong. For example, if Donald Montgomery's birth year is wrong, the entire Montgomery family section may have been incorrectly transcribed.

#### contrast-test-reasoning
Spec review finding DS-A1 identified that Warm Gold (#C5933A) has only ~2.8:1 contrast on Parchment Cream — failing WCAG 4.5:1. The accessibility test verifies this color is never used as text color for body-size text, only for decorative accents.

#### living-schema-reasoning
Spec review finding SR-CA6 requires a `livingStatus` field to distinguish "living" from "death date unknown." Without this, the privacy filter would incorrectly hide data for ~50 deceased persons who simply have no recorded death date (e.g., Thompson patriarch from the 1740s, Calvin Thompson Sr. who died in 1827 but whose death date may not be in the data).

#### unit-data-impl-reasoning
**S** — 12 tests with straightforward graph traversal assertions. Main effort is building the test fixture (a subset of the 118-person tree) for each test. The fixture can be shared across tests, reducing per-test effort.

#### unit-search-impl-reasoning
**S** — 13 tests. Search logic is simple string matching over a flat array. Tests are input→output style with minimal setup. The 100ms performance test just needs a timer wrapper.

#### unit-tree-impl-reasoning
**M** — 12 tests. Tree layout algorithms are the most complex code in the project. Tests need to verify spatial positions (no overlaps), which requires constructing expected coordinate ranges. The multi-marriage layout tests (Thomas Holmes: 14 children) need the most fixture setup.

#### unit-person-impl-reasoning
**S** — 15 tests but most are simple formatting assertions (input date → output string). The timeline builder and living-status tests are slightly more complex.

#### data-schema-impl-reasoning
**XS** — 7 tests. Each test is a loop over all people checking a single field constraint. No complex logic; just iteration + assertion.

#### data-integrity-impl-reasoning
**S** — 8 tests. Relationship integrity checks require bidirectional traversal (for each parent→child link, verify child→parent exists). The cycle detection test needs a DFS implementation, but the graph is small.

#### data-accuracy-impl-reasoning
**XS** — 18 tests but each is a single field lookup + value comparison. No logic to write; just load the JSON, find the person, check the field.

#### e2e-impl-reasoning
**M** — 46 E2E tests across 6 files. Playwright setup, page object patterns, mobile viewport emulation, and axe integration add upfront effort. Each test is small once the framework is in place. The accessibility and performance tests are the most complex.

#### overall-effort-reasoning
**M overall** — 131 tests across 13 files. The testing infrastructure (Jest config, Playwright config, fixtures, page objects) is the largest upfront effort. Individual tests are mostly small once patterns are established. This is comparable to the Forge scale M reference: "5-10 files, may need new patterns, moderate complexity." It doesn't reach L because tests follow well-known patterns (Jest + Playwright) and don't require novel architecture.
