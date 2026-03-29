---
title: "Montgomery Ancestry Browser"
status: draft
author: "niyanagi"
coauthors:
  - "Copilot (@SpecWriter)"
work-item: "N/A — personal project"
created: 2026-03-29
updated: 2026-03-29
---

<!--
  Stage 02 — Design Spec
  Agent: @SpecWriter
  Pipeline: Montgomery Ancestry Browser
  Input: forge-pipeline/01-feature-proposal.md

  ADAPTATION NOTE:
  This is a greenfield personal/family project, not an enterprise feature.
  - No ADO work items, Kusto telemetry, flight flags, or IDP matrix
  - Sections not applicable (Deprecation Strategy, Impact on Third Party Dependencies, AI Leverage) are omitted per template rule 2
  - All claims include [why?] reasoning links per Forge conventions
-->

---

## 1. Title

# Montgomery Ancestry Browser

An interactive static website for exploring the Montgomery family tree — 107+ documented individuals across 7 family lines and 7+ generations, from ~1740s Revolutionary War Scotland to the present day.

---

## 2. Point of Contacts

| Role | Name | Alias |
|------|------|-------|
| Project Owner | niyanagi | GitHub: `niyanagi` |
| Engineering Lead | niyanagi + Copilot | — |
| Designer | niyanagi + Copilot (@Designer) | — |

---

## 3. Terminology

| Term | Definition |
|------|-----------|
| **Pedigree chart** | A tree visualization showing direct ancestors branching outward from a focal person (parents → grandparents → great-grandparents) |
| **Family group** | A nuclear family unit: one or two parents plus their children and spouses |
| **Focal person** | The currently selected person around whom the tree view is centered |
| **Family line** | One of the 7 documented ancestral lineages: Thompson, Holmes, Smyth, Gies Hessen, Northwood, Smith-Rowe-Jones, Montgomery |
| **Deep link** | A URL that navigates directly to a specific person or view, shareable via text/email |
| **Person card** | A compact visual element in the tree showing a person's photo, name, and birth-death year range |
| **Uncertain data** | Information flagged with ambiguity markers (~, ?, "Unknown") where source documents conflict or are incomplete |
| **Master Person Index** | The canonical list of all 107+ documented individuals with unique IDs ([`research/preliminary-tree.md`, Section 8](../research/preliminary-tree.md#8-master-person-index)) |

---

## 4. Business Context and Problem Statement

### The Problem

The Montgomery family's genealogical knowledge — spanning 7+ generations, 107+ documented individuals, 4 countries of origin, and 7 converging family lines — exists only as six photographed documents (typed and handwritten charts). These records are:

- **Inaccessible:** Only available to whoever possesses the photos
- **Fragile:** Physical documents degrade; digital photos can be lost or corrupted
- **Non-navigable:** No way to search, filter, or trace relationships interactively; complex multi-marriage families (Calvin Thompson: 2 wives, Thomas Holmes: 2 wives with 13+ children) are impossible to follow in flat documents [why?](#structural-complexity-reasoning)
- **Non-shareable:** No URL to send to a family member exploring their ancestry
- **Ambiguous:** 16 unresolved questions with no collaborative way to flag or resolve them ([`research/preliminary-tree.md`, Section 9](../research/preliminary-tree.md#9-unresolved-questions))

### Evidence

Every major genealogy platform (Ancestry.com, FamilySearch, MyHeritage, FindMyPast, Geni) provides interactive tree visualization, person profiles, search, and mobile-responsive design as baseline features ([`research/competitive-analysis.md`, Section 6](../research/competitive-analysis.md#6-cross-platform-comparison-matrix)). The Montgomery family data has **zero** of these capabilities today. [why?](#competitive-gap-reasoning)

### Who Is Affected

Montgomery family members and extended relatives who want to:
- Explore their ancestry and understand how they connect to the broader family
- Share specific family history with relatives ("Who was Great-Grandma Isabella?")
- Contribute knowledge to resolve the 16 open questions
- Preserve family heritage digitally for future generations

---

## 5. Goals

1. **Make the full family tree browsable:** All 107+ people across 7 family lines navigable through an interactive visual tree with click-to-explore navigation [why?](#goal-browsable-reasoning)
2. **Enable person-level discovery:** Each individual has a rich detail view showing all known metadata — dates, locations, occupations, marriages, military service, immigration, and biographical notes
3. **Support sharing:** Every person and view has a unique, shareable URL so family members can send links to specific ancestors [why?](#goal-sharing-reasoning)
4. **Work everywhere:** The site is fully functional on mobile (375px), tablet (768px), and desktop (1920px+) with touch-friendly interactions
5. **Preserve with integrity:** Data quality is transparent — uncertain data is visually flagged, not hidden; the 16 unresolved questions are visible to encourage collaborative resolution

---

## 6. Impact

| Metric | Value | Source |
|--------|-------|--------|
| People documented | 107+ unique individuals | Master Person Index ([`research/preliminary-tree.md`](../research/preliminary-tree.md#8-master-person-index)) |
| Additional spouses (surname-only) | ~28 | Footnote to Master Person Index |
| Family lines | 7 | Thompson, Holmes, Smyth, Gies, Northwood, Smith-Rowe-Jones, Montgomery |
| Generations spanned | 7+ | ~1740s to present |
| Countries of origin | 4 | Scotland, Ireland, Germany (Hessen), England (Lancashire) |
| Geographic span | 3 countries | Germany → Canada (Ontario) → USA (NY, MI, NM) |
| Target audience | Montgomery extended family | ~20-50 living family members and descendants |
| Current digital interactivity | 0% | Six photos with no browsing, search, or sharing capability |

---

## 7. In Scope

- Interactive pedigree chart (ancestor view) with zoom, pan, and click-to-select navigation
- Person detail view with full metadata display (timeline, family panel, facts, sources, notes)
- Family group view (nuclear family: parents + children + spouses)
- Client-side search with auto-suggest across all 107+ people
- Family line filtering (browse by Thompson, Holmes, Smyth, etc.)
- Responsive design: mobile (375px) → tablet (768px) → desktop (1920px+)
- Deep-linkable URLs for every person and view
- All 7 family lines represented in a unified tree
- Landing page with family overview, quick stats, and entry points
- SVG-based tree rendering [why?](#svg-reasoning)
- WCAG 2.1 AA accessibility compliance
- GitHub Pages deployment at `https://niyanagi.github.io/montgomery-ancestry/`
- JSON data model for all 107+ people with structured metadata schema
- Transparent display of uncertain data (ambiguity markers, "Unknown" cards)
- Timeline view showing key life events for a selected person

---

## 8. Out of Scope

| Feature | Rationale for Deferral |
|---------|----------------------|
| Fan chart visualization | High dev effort; pedigree chart covers the core need first. Candidate for V2. |
| Descendant chart | Can be added once pedigree chart engine is built |
| Map/geography view | Requires map library integration (Leaflet/Mapbox); deferred to V2+ |
| Statistics dashboard | Nice-to-have analytics; not core navigation |
| Relationship path calculator | Complex algorithm (BFS/DFS on graph), high effort |
| Print-friendly views | CSS print styles can be added incrementally |
| Dark mode | CSS custom properties will make this easy to add later |
| GEDCOM export | Niche use case for this family-specific site |
| Offline support (Service Worker) | GitHub Pages is already fast; offline is a luxury |
| Photo colorization / AI enhancement | Requires external AI services |
| Backend / server-side logic | Static site only; no user accounts, no database |
| Custom domain (f128.info) | Secondary deployment target; GitHub Pages is primary |
| Collaborative editing | Read-only site; edits happen in the data files |

---

## 9. Functional Requirements

### FR-1: Family Tree Visualization [why?](#fr1-reasoning)

**Description:** An interactive SVG-based pedigree chart that displays ancestors branching outward from any selected focal person. The chart shows all 107+ people across 7 family lines and supports exploration through direct interaction.

**Behavior:**
- The tree defaults to a horizontal left-to-right pedigree layout centered on a configurable root person (default: Millicent Betts Thompson, the convergence point of the Thompson-Holmes lines)
- Each person is rendered as a card showing: photo thumbnail (or gender-appropriate silhouette placeholder), full name, and birth–death year range
- Connecting lines between family members use smooth bezier curves
- Users can zoom in/out (mouse wheel on desktop, pinch on mobile) with a minimum of 3 and maximum of 10 zoom levels
- Users can pan the tree by click-dragging (desktop) or touch-dragging (mobile)
- Clicking a person card makes that person the new focal point, recentering the tree
- Branches can be expanded/collapsed by clicking expand/collapse controls on nodes with hidden descendants
- The tree displays at least 5 generations when fully expanded
- A "recenter" button returns the view to the current focal person
- Multiple marriages are visually distinguished (e.g., Calvin Thompson's two wives shown as separate branches from the same node)
- Cross-line convergences are visible (e.g., the Thompson-Holmes marriage merging 4 ancestral streams)

### FR-2: Person Detail View [why?](#fr2-reasoning)

**Description:** A comprehensive detail view for any selected person showing all known metadata organized into logical sections.

**Behavior:**
- Activating a person (click in tree, search result, or direct URL) opens a detail panel or page for that person
- The view displays these sections (when data exists): Header (photo + name + lifespan), Life Event Timeline, Family Relationships panel, Facts (occupation, military, immigration, religion), Sources/Citations, Biographical Notes
- The Family Relationships panel shows parents, spouse(s), siblings, and children — each as a clickable link to navigate to that person's detail view
- Multiple marriages are shown chronologically with all children grouped under the correct marriage
- Uncertain data is visually flagged: approximate dates show "~" prefix, unknown values show "Unknown" with a distinctive style, conflicting data shows both values (e.g., "1878 or 1879" for Isabella Edna Holmes)
- The Life Event Timeline shows events in chronological order: birth → education → marriage(s) → residences → military service → death
- Computed fields are derived and displayed: age at death, lifespan string, generation number relative to focal person
- The view is scrollable with section anchors for quick navigation on long profiles

### FR-3: Search & Filter [why?](#fr3-reasoning)

**Description:** Client-side full-text search across all people by name, with filtering by family line, and contextual result display.

**Behavior:**
- A search input is accessible from all views (persistent in the navigation header)
- As the user types, auto-suggest results appear showing matching names with birth-death years and family line
- Search matches against: first name, last name, maiden name, nickname, alternate names
- Search is case-insensitive and tolerates partial matches (typing "Isa" matches "Isabella Smyth" and "Isabella Edna Holmes")
- Results include contextual information: full name, birth-death years, and primary family line
- Selecting a search result navigates to that person's detail view
- A family line filter allows narrowing the entire tree view to a single lineage (Thompson, Holmes, Smyth, Gies Hessen, Northwood, Smith-Rowe-Jones, Montgomery)
- With no results, the search displays a clear "No results found" message with suggestions
- Search responds in under 100ms for the full 107-person dataset [why?](#search-perf-reasoning)

### FR-4: Responsive Design [why?](#fr4-reasoning)

**Description:** The site is fully functional and visually coherent from mobile (320px) through desktop (1920px+), following a mobile-first design approach.

**Behavior:**
- On mobile (< 768px): single-column layout; tree view shows a simplified vertical pedigree (one branch at a time with navigation); person detail opens as a full-screen view; bottom navigation bar for primary navigation; all touch targets are minimum 44×44px
- On tablet (768px–1023px): two-column layout where tree and person detail can coexist as a split view; landscape mode shows more tree generations
- On desktop (1024px+): full multi-column layout; tree visualization shows 4–5 generations; person detail panel alongside tree; hover tooltips on tree nodes
- Touch interactions: tap to select, double-tap to zoom, pinch to zoom, drag to pan, swipe between siblings on person detail
- Content reflows without horizontal scrolling at all breakpoints including 320px
- Typography remains readable at all viewport sizes (minimum 16px body text on mobile)
- Images are responsive using `srcset` and modern formats (WebP with JPEG fallback)

### FR-5: Navigation [why?](#fr5-reasoning)

**Description:** Multi-modal navigation enabling users to move through the family tree via direct interaction, family line selection, search, breadcrumbs, and URL deep linking.

**Behavior:**
- Primary navigation bar includes: Home, Tree, Search, and About
- On mobile, primary navigation moves to a bottom tab bar for thumb accessibility
- A family line selector allows switching the tree's scope to any of the 7 documented lineages
- Breadcrumb trail shows the path from the root person to the currently selected person (e.g., "Home > Calvin Thompson > Fred E. Thompson > Millicent B. Thompson")
- Browser back/forward buttons work correctly — each person navigation creates a history entry
- Every person has a unique, stable URL following the pattern: `/person/{slug}` (e.g., `/person/fred-e-thompson-1871`)
- Every view has a unique URL: `/` (home), `/tree` (tree view), `/person/{slug}` (person detail), `/search?q={query}` (search)
- Keyboard navigation in tree view: Arrow keys move between family members (Up → parents, Down → children, Left/Right → siblings), Enter selects, Escape closes panels
- A "Skip to main content" link is the first focusable element on every page

### FR-6: Family Group View [why?](#fr6-reasoning)

**Description:** A focused view showing a nuclear family unit — parents, their marriage information, and all children — as a navigable card.

**Behavior:**
- The family group view displays: father, mother, marriage date/location, and all children listed with birth dates
- For persons with multiple marriages (e.g., Calvin Thompson, Thomas Holmes, Isabella Smyth), each marriage is shown as a separate family group with its respective children
- Every person name in the family group is clickable, navigating to their person detail view
- Clicking a child navigates to that child's family group (showing them as a parent with their own spouse/children)
- Clicking a parent navigates upward to that parent's family group (showing their parents)
- The family group view is accessible from any person's detail view via a "View Family Group" action
- Empty slots (unknown parents) display "Unknown" placeholder cards to indicate gaps

### FR-7: Timeline View [why?](#fr7-reasoning)

**Description:** A chronological display of key life events for a selected person, providing narrative context for their life story.

**Behavior:**
- The timeline displays all known events for a person in chronological order: birth, education, marriage(s), occupations, military service, residences, immigration events, and death
- Each event shows: date (or approximate date), event type icon, description, and location (when known)
- Events with uncertain dates are positioned approximately and visually marked as uncertain
- The timeline is displayed within the person detail view as a primary section
- Family context events are included where relevant (e.g., spouse's death, child's birth) distinguished visually from the person's own events
- The timeline scrolls vertically and is navigable by keyboard

### FR-8: Data Integrity [why?](#fr8-reasoning)

**Description:** All family tree data conforms to a validated schema with bidirectional relationships, valid dates, and required fields present.

**Behavior:**
- The JSON data schema enforces required fields for every person: `id` (unique slug), `firstName`, `lastName`, `gender`
- All parent-child relationships are bidirectional: if person A lists B as a child, person B lists A as a parent
- All marriage relationships are bidirectional: if person A lists a marriage to B, person B lists a marriage to A
- Dates conform to a consistent format allowing: exact dates (`1871-03-15`), year-only (`1871`), approximate dates (`~1878`), and unknown (`null`)
- The data file covers all 107 people from the Master Person Index ([`research/preliminary-tree.md`, Section 8](../research/preliminary-tree.md#8-master-person-index))
- The 16 unresolved questions are represented in the data with explicit uncertainty markers rather than omitted
- All person ID slugs are stable and URL-safe (lowercase, hyphenated, e.g., `fred-e-thompson-1871`)

### FR-9: Accessibility [why?](#fr9-reasoning)

**Description:** The site meets WCAG 2.1 Level AA compliance, with specific accommodations for tree visualization accessibility.

**Behavior:**
- All text meets minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
- All interactive elements are reachable and operable via keyboard alone
- The tree visualization uses ARIA tree roles: `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level`
- An alternative list/table view is available for all visual tree displays, providing an accessible text-based representation of the same data
- All images have descriptive `alt` text; person photos use format `"Portrait of [Name], circa [year]"`; decorative images use `alt=""`
- A visible focus indicator (3px Heritage Green outline) appears on all focusable elements
- Semantic HTML is used throughout: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- ARIA live regions (`aria-live="polite"`) announce dynamic content updates (search results, tree navigation)
- The site respects `prefers-reduced-motion` by disabling animations when the user has requested reduced motion
- Screen reader navigation of the tree linearizes relationships: "[Name], born [year], died [year]. Father: [name]. Mother: [name]. Children: [count]."
- Color is never the sole means of conveying information (e.g., maternal/paternal line highlighting also uses labels or patterns)
- Content reflows at 320px width without horizontal scrolling
- All form inputs have visible, associated labels

### FR-10: Performance [why?](#fr10-reasoning)

**Description:** The site loads fast and renders smoothly, meeting modern web performance standards.

**Behavior:**
- First Contentful Paint (FCP) < 1.5s on a simulated 4G connection
- Largest Contentful Paint (LCP) < 2.5s on a simulated 4G connection
- Time to Interactive (TTI) < 3.5s
- Total initial page weight < 500KB (excluding images, gzipped)
- Lighthouse Performance score ≥ 90
- Lighthouse Accessibility score ≥ 95
- Lighthouse Best Practices score ≥ 95
- Lighthouse SEO score ≥ 90
- Tree pan/zoom interactions maintain 60fps
- Client-side search responds in < 100ms
- Images below the fold are lazy-loaded
- Fonts use `font-display: swap` and are subset to required character ranges (< 100KB total)

---

## 10. Acceptance Criteria

### Tree Visualization
- [ ] **AC-1:** Given the site is loaded, when the user views the tree page, then a pedigree chart is displayed centered on the default focal person with at least 3 generations visible
- [ ] **AC-2:** Given the tree is displayed, when the user scrolls the mouse wheel (desktop) or pinches (mobile), then the tree zooms smoothly in or out
- [ ] **AC-3:** Given the tree is displayed, when the user clicks/taps a person card, then that person becomes the new focal point and the tree recenters
- [ ] **AC-4:** Given the tree shows Calvin Thompson (who had 2 wives), when the user expands his branch, then both marriage lines are visible with their respective children separated

### Person Detail
- [ ] **AC-5:** Given the user has navigated to Isabella Edna Holmes's detail view, when the page renders, then her birth year ambiguity is displayed as "1878 or 1879" (not silently choosing one)
- [ ] **AC-6:** Given a person with complete data (e.g., Fred Eugene Thompson, M.D.), when their detail view loads, then all sections are populated: header, timeline, family panel, occupation ("M.D."), and biographical notes
- [ ] **AC-7:** Given the person detail view for Thomas Holmes, when the user views the family panel, then both marriages (Jane Hampson and Isabella Smyth) are listed with their respective children

### Search
- [ ] **AC-8:** Given the search input is focused, when the user types "Isa", then auto-suggest shows at least "Isabella Smyth" and "Isabella Edna Holmes" within 100ms
- [ ] **AC-9:** Given the user searches for "Thompson", when results are displayed, then all Thompson family members appear with their birth-death years and family line context
- [ ] **AC-10:** Given the user selects a search result, when they click it, then they are navigated directly to that person's detail view

### Responsive Design
- [ ] **AC-11:** Given the site is viewed on an iPhone SE (375px width), when the user navigates the tree, then the tree displays in a simplified vertical layout with no horizontal scrolling required
- [ ] **AC-12:** Given the site is viewed on a desktop (1440px), when the user views the tree, then at least 4 generations are visible simultaneously
- [ ] **AC-13:** Given any viewport size, when the user interacts with any control, then all touch/click targets are at minimum 44×44px

### Navigation
- [ ] **AC-14:** Given the user is viewing Fred Eugene Thompson's detail, when they click the browser back button, then they return to their previous view
- [ ] **AC-15:** Given the URL `https://niyanagi.github.io/montgomery-ancestry/person/fred-e-thompson-1871`, when a user opens this URL directly, then Fred Eugene Thompson's detail view loads correctly
- [ ] **AC-16:** Given the user selects the "Holmes" family line filter, when the tree redraws, then only Holmes family members and their direct connections are highlighted or focused

### Data Integrity
- [ ] **AC-17:** Given the complete JSON data file, when validated against the schema, then all 107 people from the Master Person Index are present with unique IDs
- [ ] **AC-18:** Given person A lists person B as a child, when person B's data is checked, then person B lists person A as a parent (bidirectional verification for all relationships)

### Accessibility
- [ ] **AC-19:** Given a screen reader user navigating the tree, when they reach a person node, then the screen reader announces: "[Name], born [year], died [year], [relationship context]"
- [ ] **AC-20:** Given a keyboard-only user on the tree page, when they press Tab, then focus moves through all interactive elements in a logical order with visible focus indicators
- [ ] **AC-21:** Given the site HTML, when checked with a contrast analyzer, then all text meets WCAG 2.1 AA minimum contrast ratios (4.5:1 normal text, 3:1 large text)

### Performance
- [ ] **AC-22:** Given the deployed site on GitHub Pages, when tested with Lighthouse, then Performance score ≥ 90, Accessibility score ≥ 95, Best Practices ≥ 95, SEO ≥ 90
- [ ] **AC-23:** Given the tree is fully loaded, when the user pans or zooms, then the interaction renders at 60fps with no visible jank

---

## 11. User Flows

### Flow 1: "Who was Great-Grandma Isabella?"

1. User arrives at the landing page
2. User types "Isabella" in the search bar
3. Auto-suggest shows: "Isabella Smyth (1838–1930)" and "Isabella Edna Holmes (1878–1937)"
4. User selects "Isabella Edna Holmes"
5. Person detail view opens showing: born Chatham, ON; married Dr. Fred Thompson 1903; lived in Detroit
6. User clicks "Thomas Holmes" in the Family panel (her father)
7. Thomas Holmes detail view shows: 6th Mayor of Chatham, miller/grain merchant, 2 marriages, 13+ children
8. User clicks "Isabella Smyth" (Thomas's 2nd wife / Isabella Edna's mother)
9. Isabella Smyth's detail shows: Irish-German ancestry, connection to William Smyth and the Gies Hessen family

### Flow 2: "Show me the whole tree"

1. User clicks "Tree" in the navigation
2. Pedigree chart loads centered on default focal person
3. User scrolls out (zoom) to see 5+ generations
4. User clicks a person card in the tree → person becomes new focal point, tree recenters
5. User clicks expand on a collapsed branch → branch opens showing additional descendants
6. User clicks "Recenter" → tree returns to focal person

### Flow 3: "Share this with Cousin Dan"

1. User navigates to Fred Eugene Thompson's profile
2. URL bar shows `https://niyanagi.github.io/montgomery-ancestry/person/fred-e-thompson-1871`
3. User copies the URL and sends it via text message
4. Cousin Dan opens the link on his phone
5. Mobile-optimized person detail view loads showing Fred's full profile

### Flow 4: "Explore the German line"

1. User opens the family line selector dropdown
2. User selects "Gies Hessen"
3. Tree redraws focused on Henry Gies of Hessen → Mary Elizabeth Gies → marriage to William Smyth → Isabella Smyth → Isabella Edna Holmes
4. User traces the German immigration story: Hessen, Germany → Detroit, MI (1834) → Chatham, ON

---

## 12. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **SVG tree performance at scale** — With 107+ nodes, zoom/pan may become sluggish on low-end mobile devices | Medium | Medium | Render only visible nodes (viewport culling); test on low-end devices early; degrade gracefully on older hardware [why?](#risk-svg-perf-reasoning) |
| **Data ambiguity** — 16 unresolved questions may confuse users or create misleading impressions | High | Low | Display uncertainty transparently with visual markers; include a "Data Quality" note explaining the 16 open questions [why?](#risk-data-ambiguity-reasoning) |
| **Complex multi-marriage layouts** — Calvin Thompson (2 wives), Thomas Holmes (2 wives, 13+ children), Isabella Smyth (2 husbands) create non-standard tree structures | Medium | High | Design multi-marriage layout specifically; test with the hardest cases first (Thomas Holmes with 13+ children across 2 marriages) [why?](#risk-multi-marriage-reasoning) |
| **Mobile tree usability** — Pedigree charts are inherently wide; mobile screens are narrow | High | Medium | Use a simplified vertical mobile layout showing one branch at a time with navigation to siblings/parents; don't try to show the full desktop tree on mobile [why?](#risk-mobile-tree-reasoning) |
| **Photo availability** — Person photos may not be available for many of the 107 individuals | High | Low | Design with silhouette placeholder as the default; photos are an enhancement, not a requirement |
| **GitHub Pages limitations** — No server-side routing; all navigation must use hash-based or client-side routing | Low | Medium | Use hash-based routing (`#/person/slug`) or configure `404.html` redirect for client-side routing on GitHub Pages |
| **Font loading** — Google Fonts (Playfair Display, Inter) add external dependency and latency | Low | Low | Use `font-display: swap`; subset fonts; provide system font fallback stack |

---

## 13. Alternatives Considered

### Tree Rendering: SVG vs Canvas vs DOM-only

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **SVG (chosen)** | DOM-native → accessible to screen readers; CSS-styleable; crisp text at all zoom levels; responsive | Performance ceiling with thousands of nodes (not a concern at 107) | ✅ Selected [why?](#svg-reasoning) |
| **Canvas** | Best raw performance for very large trees (1000+) | Not accessible without parallel DOM structure; text blurry on zoom; no CSS styling | ❌ Rejected — accessibility cost too high for 107-node tree |
| **DOM-only (CSS)** | Simplest to implement; fully accessible | Limited zoom/pan capability; hard to render complex branching | ❌ Rejected — insufficient for interactive tree navigation |

### Routing: Hash-based vs HTML5 History API

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Hash-based (`#/person/slug`)** | Works on any static host; no server configuration | Less clean URLs; older pattern | ✅ Selected — guaranteed GitHub Pages compatibility |
| **History API + 404.html** | Clean URLs (`/person/slug`) | Requires `404.html` hack; may confuse search engines | Considered — viable if clean URLs are strongly preferred |

### Data Format: Single JSON vs Per-person Files

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Single JSON file (chosen)** | One HTTP request; simple client logic; easy to validate wholistically | Larger initial payload (~50-100KB for 107 people) | ✅ Selected — 107 people is small enough for a single file [why?](#data-format-reasoning) |
| **Per-person JSON files** | Lazy loading; smaller initial payload | 107+ HTTP requests; complex loading logic; harder to validate relationships | ❌ Rejected — network overhead exceeds data size savings |

---

## 14. Backward Compatibility

Not applicable — greenfield project with no existing codebase or users.

---

## 15. Key Metrics to Measure Success

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **All people browsable** | 100% of 107 Master Person Index entries represented | Automated count of person entries in JSON vs. preliminary-tree.md |
| **All family lines navigable** | 7/7 lines (Thompson, Holmes, Smyth, Gies, Northwood, Smith-Rowe-Jones, Montgomery) | Manual navigation test through each line |
| **Mobile functional** | Usable on 375px (iPhone SE) through 1920px+ | Chrome DevTools responsive testing at all breakpoints |
| **Lighthouse Performance** | ≥ 90 | Lighthouse CLI audit on deployed site |
| **Lighthouse Accessibility** | ≥ 95 | Lighthouse CLI audit on deployed site |
| **Deep links work** | Every person has a unique, functional URL | Automated test: navigate to each `/person/{slug}` and verify content loads |
| **Search accuracy** | Search for any person by name returns correct result | Manual testing of 20+ sample searches covering all family lines |
| **Deployed and live** | HTTP 200 at `https://niyanagi.github.io/montgomery-ancestry/` | HTTP health check |
| **Page load speed** | FCP < 1.5s, LCP < 2.5s | Lighthouse + WebPageTest on deployed site |

---

## 16. Testing Requirements

- **Data validation tests:** Automated schema validation of the JSON data file — all 107 people present, all relationships bidirectional, all required fields populated, all dates in valid format. Can be run as a Node.js script or simple JS test.

- **Cross-browser manual testing:** Verify core flows (tree navigation, person detail, search, deep links) on Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, iOS Safari 14+, Chrome Android 90+.

- **Responsive testing:** Test at all breakpoints (320px, 375px, 425px, 768px, 1024px, 1440px, 1920px) using Chrome DevTools. Verify no horizontal scrolling, readable typography, functional touch targets.

- **Accessibility testing:** Run Lighthouse accessibility audit (target ≥ 95); test keyboard navigation through entire tree and all interactive elements; test with VoiceOver (macOS/iOS) and NVDA (Windows) screen readers; verify ARIA roles on tree elements; check color contrast ratios with an analyzer tool.

- **Performance testing:** Lighthouse audit on deployed GitHub Pages site (target: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90). Test tree zoom/pan framerate on low-end mobile device. Verify search response < 100ms.

- **Deep link testing:** Automated or manual test of all 107 person URLs — navigate directly to each URL and verify the correct person loads.

- **Visual regression:** Manual comparison of key screens (landing page, tree view, person detail, search results, mobile views) against design mockups.

---

## 17. Rollout and Validation

| Phase | Actions | Success Criteria |
|-------|---------|-----------------|
| **Dev (local)** | Build and test locally with live-server | All acceptance criteria pass in Chrome; Lighthouse scores on target |
| **Staging (GitHub Pages, draft)** | Deploy to GitHub Pages from `main` branch | Site loads at the public URL; deep links work; all 7 family lines navigable |
| **Family Beta** | Share URL with 3-5 family members | Collect feedback on: data accuracy, navigation ease, mobile usability, missing information |
| **Public Launch** | Announce to extended family | Site stable, feedback from beta addressed, all known data issues documented |

---

## 18. Security Review and Privacy

### Privacy Considerations

- The site displays genealogical information about real people, many of whom are deceased. For living individuals (Montgomery Generation 6 and 7), personal details should be limited to: name and relationship. Birth dates, addresses, and other specific personal information for living persons should be omitted or generalized. [why?](#privacy-reasoning)
- No Personally Identifiable Information (PII) beyond names and historical dates for deceased persons
- No user accounts, authentication, or session data
- No cookies, analytics, or tracking scripts in V1
- No user-submitted content; the site is read-only
- The site is publicly accessible — family members should be aware that the content is viewable by anyone

### Data Handling

- All data is static JSON served from GitHub Pages — no server-side processing
- No external API calls to third-party services (except Google Fonts CDN)
- Source documents (original photographs) are NOT published to the site — only extracted/structured data

---

## 19. Accessibility Review

### WCAG 2.1 AA Compliance Plan

**Perceivable:**
- All images have descriptive `alt` text; person photos: `"Portrait of [Name], circa [year]"`
- Color contrast minimum 4.5:1 for normal text, 3:1 for large text
- Color is never the sole indicator of meaning (maternal/paternal lines use labels + patterns, not just color)
- Text resizable up to 200% without loss of functionality
- Content reflows at 320px without horizontal scrolling

**Operable:**
- All interactive elements reachable via keyboard
- Tree keyboard navigation: Arrow keys for family traversal, Enter to select, Escape to close
- Visible focus indicators (3px Heritage Green outline) on all focusable elements
- "Skip to main content" link as first focusable element
- No keyboard traps; no time-limited interactions
- Respects `prefers-reduced-motion` — disables animations when requested

**Understandable:**
- `lang="en"` on HTML element
- Consistent navigation placement across all pages
- Clear labels on all form inputs
- Search with no results provides clear feedback and suggestions

**Robust:**
- Semantic HTML5 landmarks: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- ARIA tree roles: `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level`
- `aria-live="polite"` for dynamic content (search results, tree navigation)
- Valid HTML (pass W3C validation)

**Genealogy-Specific:**
- Alternative list/table view for all visual tree charts [why?](#a11y-alt-view-reasoning)
- Screen reader linearization of tree relationships
- Relationship context announced during tree navigation
- `prefers-contrast: more` supported with enhanced borders

---

## 22. Effort Estimate

**Overall Size: L** [why?](#effort-reasoning)

| Sub-Feature | Size | Rationale |
|-------------|------|-----------|
| Data model + JSON schema design | S | 1-3 files; well-defined by `research/design-requirements.md` Section 10.4 and `research/preliminary-tree.md` Section 8 |
| Data entry (107+ people) | M | Repetitive but voluminous; structured by Master Person Index |
| Landing page + navigation shell | S | Standard responsive layout with routing |
| Person detail view | M | Multiple sections (timeline, family panel, facts, notes), responsive |
| Tree visualization (pedigree chart) | L | SVG interactive chart with zoom/pan, multi-marriage layouts, responsive, a11y |
| Family group view | S | Simpler card-based display derived from tree data |
| Timeline view (per-person) | S | Chronological rendering of person's events within detail view |
| Search system | S | Client-side search over ~107 records is straightforward |
| Responsive CSS + design system | M | Design tokens, 7 breakpoints, component styles per `research/design-requirements.md` Section 6 |
| Accessibility implementation | M | ARIA roles for tree, keyboard navigation, alt views, screen reader testing |
| GitHub Pages deployment | XS | Repository config, `404.html` for routing |

---

## 23. Sign Off

| Role | Name | Date | Approved? |
|------|------|------|-----------|
| Project Owner | niyanagi | | ⬜ |
| Engineering Lead | niyanagi + Copilot | | ⬜ |
| Designer | niyanagi + Copilot (@Designer) | | ⬜ |

---

## 24. Appendices

### A. Source Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Feature Proposal (Stage 01) | [`forge-pipeline/01-feature-proposal.md`](01-feature-proposal.md) | Problem statement, scope, complexity estimate |
| Competitive Analysis | [`research/competitive-analysis.md`](../research/competitive-analysis.md) | UX analysis of Ancestry.com, FamilySearch, MyHeritage, FindMyPast, Geni |
| Design Requirements | [`research/design-requirements.md`](../research/design-requirements.md) | Feature requirements, visual design, accessibility, performance targets |
| Preliminary Family Tree | [`research/preliminary-tree.md`](../research/preliminary-tree.md) | All 107+ people, 7 family lines, Master Person Index, 16 unresolved questions |
| Pipeline State | [`forge-pipeline/PIPELINE-STATE.md`](PIPELINE-STATE.md) | Current pipeline progress |

### B. Visual Design Reference

The visual design direction is fully specified in [`research/design-requirements.md`, Section 6](../research/design-requirements.md#6-visual-design-direction) and includes:

- **Color palette:** Heritage Green (#2D5016), Warm Gold (#C5933A), Parchment Cream (#FAF6F0), Steel Blue (#5B7F95), Dusty Rose (#C4787A)
- **Typography:** Playfair Display (serif) for headings, Inter (sans-serif) for body
- **Spacing:** 8px base unit system
- **Person card styling:** 180×80px desktop, 12px border radius, 48px circle photo, soft shadow
- **Connecting lines:** Smooth bezier curves, Warm Gray at 60% opacity

### C. URL Structure

```
/                           → Home / landing page
/tree                       → Default tree view (pedigree chart)
/person/{slug}              → Person detail page
/search?q={query}           → Search results (or #/search?q={query} with hash routing)
/about                      → About the family / site info
```

### D. Data Quality Transparency

The 16 unresolved questions from [`research/preliminary-tree.md`, Section 9](../research/preliminary-tree.md#9-unresolved-questions) will be surfaced in the UI:

| Category | Count | Example | UI Treatment |
|----------|-------|---------|-------------|
| Missing ancestry | 2 | Donald Malcom Montgomery — no parents | "Unknown" placeholder cards in tree |
| Date ambiguity | 3 | Isabella Edna Holmes — 1878 or 1879 | Display both values: "b. 1878 or 1879" |
| Name uncertainty | 3 | "Fritz" and "Jimbo" — likely nicknames | Display known name with note: "Nickname; legal name unknown" |
| Relationship uncertainty | 2 | Norine Eva Rowe's connection to Edward Frost Rowe | Note on person profile: "Relationship to Edward Frost Rowe suspected but unconfirmed" |
| Cropped/missing data | 4 | Smith family parents — photo cropped | "Parents: Unknown (source document incomplete)" |
| Miscellaneous | 2 | Dorothy Northwood asterisk; Irish rebellion timing | Footnotes on relevant profiles |

---

## Appendix E: Reasoning Links

#### structural-complexity-reasoning
Three factors make this tree structurally complex: (1) Multiple marriages create branching lines — Calvin Thompson had 2 wives with distinct child sets, Thomas Holmes had 2 wives with 9+ and 4 children respectively, Isabella Smyth had 2 husbands. (2) Cross-line convergences — the Thompson-Holmes marriage merges 4 ancestral streams. (3) Geographic migrations across 3 countries and 10+ locations. Static documents cannot convey these relationships; interactive navigation is required. Source: [`research/preliminary-tree.md`](../research/preliminary-tree.md), Sections 1-4.

#### competitive-gap-reasoning
The competitive analysis ([`research/competitive-analysis.md`, Section 6](../research/competitive-analysis.md#6-cross-platform-comparison-matrix)) shows all 5 major platforms provide interactive trees, person profiles, search, and mobile design as baseline. The Montgomery data has 0% of these capabilities — the gap is total, not incremental.

#### goal-browsable-reasoning
The 107-person dataset across 7 family lines with multiple marriages and cross-line convergences is structurally too complex for static documents. Competitive analysis shows interactive tree navigation is the universal baseline for genealogy platforms. Even a basic implementation moves from 0% to ~60% of competitive feature coverage.

#### goal-sharing-reasoning
Deep-linkable URLs enable the core social use case: a family member texting "look at Great-Grandpa's profile" to a relative. All 5 competitive platforms support shareable person links. Without deep links, every person must be found via search — a barrier for non-technical family members.

#### svg-reasoning
SVG is preferred over Canvas because: (1) SVG elements are DOM-native, making them accessible to screen readers and keyboard navigation — critical for WCAG 2.1 AA. (2) SVG supports CSS styling, enabling responsive design and theme customization. (3) For 107 people (not thousands), SVG performance is excellent. (4) SVG text is crisp at all zoom levels. Source: [`research/design-requirements.md`, Section 10.3](../research/design-requirements.md#103-technology-preferences).

#### fr1-reasoning
Interactive tree visualization is the #1 feature across all competitive platforms ([`research/competitive-analysis.md`, Section 7](../research/competitive-analysis.md#7-key-takeaways)). The pedigree chart is the most requested and universally used view type. The Montgomery tree's structural complexity (multi-marriage, cross-line convergences) makes interactive visualization not a luxury but a necessity.

#### fr2-reasoning
Person-centric navigation is the hub of every successful genealogy platform ([`research/competitive-analysis.md`, Section 7](../research/competitive-analysis.md#7-key-takeaways)): "The person profile is the hub. Everything radiates from a person." The Montgomery dataset has rich metadata for core individuals (occupations, military service, immigration, biographical notes) that deserve comprehensive display.

#### fr3-reasoning
Search is the fastest way to find a specific person in a 107-person tree. All 5 competitive platforms provide name search with auto-suggest. For the Montgomery tree, search is especially important because the 7 family lines span different surnames — a user looking for "Holmes" may not know to navigate through the Thompson line first.

#### fr4-reasoning
All leading genealogy platforms offer responsive or native mobile experiences ([`research/competitive-analysis.md`, Section 7](../research/competitive-analysis.md#7-key-takeaways)). The primary sharing use case (texting a link to a relative) means the recipient will likely open the link on a phone. Mobile-first is not optional for this project.

#### fr5-reasoning
The 7 family lines (Thompson, Holmes, Smyth, Gies, Northwood, Smith-Rowe-Jones, Montgomery) represent distinct ancestral paths that converge at specific marriage points. Family line selection and breadcrumb navigation let users orient themselves within this complex structure. Deep linking is the enabler for the sharing use case (Goal #3).

#### fr6-reasoning
Family group view is a baseline feature on Ancestry.com, FamilySearch, and MyHeritage ([`research/competitive-analysis.md`, Section 6](../research/competitive-analysis.md#6-cross-platform-comparison-matrix)). It provides a focused view of one nuclear family, which is the natural unit of exploration when tracing ancestry. Especially valuable for families with multiple marriages (Thomas Holmes: 2 marriages, 13+ children).

#### fr7-reasoning
Timeline views appear on 3 of 5 competitive platforms ([`research/competitive-analysis.md`, Section 6](../research/competitive-analysis.md#6-cross-platform-comparison-matrix)). They add narrative context to raw data — seeing "born 1871 → married 1903 → M.D. in Detroit → died 1940" tells a life story that disconnected facts cannot. The Montgomery dataset has enough event data (immigration, military service, marriages) to populate meaningful timelines for core individuals.

#### fr8-reasoning
Bidirectional relationship validation prevents broken navigation: if clicking "Father: Thomas Holmes" on Isabella Edna Holmes's profile takes the user to Thomas, but Thomas's children list doesn't include Isabella, the tree is inconsistent. Data integrity is foundational for trust and correct navigation. The 107-person dataset is small enough to validate completely.

#### fr9-reasoning
WCAG 2.1 AA is the target because: (1) Tree visualizations are inherently challenging for accessibility — without deliberate effort, they become inaccessible. (2) Family members span all ages, including elderly relatives who may use assistive technology. (3) SVG was specifically chosen over Canvas to enable accessibility. Source: [`research/design-requirements.md`, Section 8](../research/design-requirements.md#8-accessibility-requirements).

#### fr10-reasoning
Performance targets are based on [`research/design-requirements.md`, Section 9](../research/design-requirements.md#9-performance-requirements). FCP < 1.5s ensures the site feels fast when opened from a shared link on mobile. For a static site with ~50-100KB of JSON data and SVG rendering, these targets are achievable without complex optimization. Lighthouse score ≥ 90 is the standard quality bar for modern web performance.

#### search-perf-reasoning
With only 107 records, client-side search is trivially fast. A simple array filter over 107 objects with string matching completes in < 1ms on modern hardware. The 100ms target includes rendering the results list with contextual information.

#### risk-svg-perf-reasoning
107 SVG nodes with text, photos, and connecting lines creates a moderately complex DOM. On modern desktop browsers this is no issue, but low-end mobile devices (< 2GB RAM) may struggle with simultaneous zoom animations on a 107-node SVG. Viewport culling (only rendering visible nodes) is the standard mitigation, reducing the active DOM to ~20-30 nodes at typical zoom levels.

#### risk-data-ambiguity-reasoning
16 of the 107+ people have unresolved questions. Hiding ambiguity creates false confidence; displaying it transparently follows the pattern established by FamilySearch and Ancestry.com, which show "Unknown" ancestor cards and estimated dates. For the Montgomery project specifically, transparency enables family members to contribute corrections.

#### risk-multi-marriage-reasoning
Multi-marriage layouts are the hardest tree visualization problem in the Montgomery dataset. Thomas Holmes alone has 2 wives and 13+ children. Standard pedigree chart algorithms assume one marriage per person; multi-marriage requires custom layout logic to avoid overlapping lines and maintain visual clarity.

#### risk-mobile-tree-reasoning
Pedigree charts are inherently wide — showing 5 generations requires significant horizontal space. On a 375px screen, the standard approach is to switch from a spatial tree to a navigational tree: show one focal person with their parents above and children below, with left/right navigation for siblings. This matches FamilySearch's mobile approach and avoids tiny, unreadable tree nodes.

#### effort-reasoning
**Size: L** — This project requires building 9+ distinct components from scratch (greenfield) with no existing patterns to follow. The tree visualization engine alone is an M-to-L effort (SVG with zoom/pan, multi-marriage layout, responsive, accessible). Combined with data modeling (107 people), person profiles, search, responsive CSS system across 7 breakpoints, and accessibility implementation, the total is solidly L. It does not reach XL because: single repo, no cross-team dependencies, no backend, no API contracts. **Calibration:** Comparable to the "new flow with connector + hooks + views" L reference from the Forge Effort Scale — multiple interconnected components forming a complete UX, with tree visualization as the most complex piece.

#### data-format-reasoning
The full Montgomery dataset (107 people with metadata) will be approximately 50-100KB as minified JSON. This is well within a single HTTP request budget. Per-person files would require 107+ network requests with HTTP overhead exceeding the data itself. A single file also enables client-side search across all people without lazy-loading complexity.

#### privacy-reasoning
Living individuals (roughly Generations 6 and 7 of the Montgomery family) have reasonable privacy expectations. Genealogy platforms like Ancestry.com and FamilySearch both restrict detail for living persons. The site should display names and relationship position for living family members but omit specific dates and addresses. Source: Standard genealogy privacy practice.

#### a11y-alt-view-reasoning
An alternative list/table view for tree charts ensures that users who cannot perceive the spatial tree layout (blind users, screen reader users) can still access all relationship data. This is a genealogy-specific WCAG recommendation from [`research/design-requirements.md`, Section 8.5](../research/design-requirements.md#85-genealogy-specific-accessibility).
