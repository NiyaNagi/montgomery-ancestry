# Feature Proposal: Montgomery Ancestry Browser

<!--
  Stage 01 — Feature Proposal
  Agent: @FeaturePlanner
  Date: 2026-03-29
  Pipeline: Montgomery Ancestry Browser

  DATA ADAPTATION NOTE:
  This is a greenfield personal project, not an enterprise feature.
  - 🔬 sections reference photo analysis data and competitive research (not Kusto/ADO)
  - 💭 sections use inference grounded in the project's research documents
  - No telemetry, IcM, or ADO work items exist — data comes from source photo analysis
-->

---

## 1. Executive Summary
<!-- 💭 Inference OK — high-level pitch -->

The Montgomery family's genealogical records — spanning 7+ generations, 7 family lines, and 107+ documented individuals — exist only as six photographed documents with no interactive way to browse, explore, or share this heritage. This proposal defines the Montgomery Ancestry Browser: a beautiful, interactive, mobile-friendly static website (HTML/CSS/JS) deployed to GitHub Pages that transforms raw genealogical data into an explorable family tree experience. The site will serve the Montgomery family and extended relatives as a permanent, shareable digital archive of their heritage.

---

## 2. Problem Statement
<!-- 🔬 VERIFIED DATA REQUIRED — adapted for greenfield project -->

### The Problem

The Montgomery family's genealogical knowledge is locked inside six physical documents (typed and handwritten family tree charts captured as photographs). These documents are:

- **Inaccessible** — only available to whoever possesses the photos
- **Fragile** — physical documents degrade; photos can be lost
- **Non-navigable** — no way to search, filter, or trace relationships interactively
- **Incomplete** — contain 16 unresolved questions and ambiguities that are hard to communicate or collaborate on
- **Non-shareable** — no URL to send to a family member who wants to explore their ancestry

### Evidence

**Source: Photo analysis** ([`research/preliminary-tree.md`](../research/preliminary-tree.md))

| Metric | Value | Source |
|--------|-------|--------|
| Total unique persons documented | 107+ | Master Person Index, Section 8 |
| Additional spouses (surname-only) | ~28 | Footnote to Master Person Index |
| Family lines identified | 7 | Thompson, Holmes, Smyth, Gies, Northwood, Smith-Rowe-Jones, Montgomery |
| Generations spanned | 7+ | ~1740s (Rev. War patriarch) to present |
| Unresolved questions | 16 | Section 9 of preliminary tree |
| Source documents | 6 photographs | Typed and handwritten charts |
| Countries of origin represented | 4 | Scotland, Ireland, Germany (Hessen), England (Lancashire) |
| Geographic span | 3 countries | Germany → Canada (Ontario) → USA (NY, MI, NM) |

**Source: Competitive analysis** ([`research/competitive-analysis.md`](../research/competitive-analysis.md))

Every major genealogy platform (Ancestry.com 25M+ users, FamilySearch millions of users, MyHeritage 80M+ users, Geni 200M+ profiles) provides interactive tree visualization, person-centric navigation, and mobile-responsive design as baseline features. The Montgomery family data has **none of these capabilities** today.

**Signal strength:** 🔴 **Strong signal** — The gap between "6 photos" and "interactive browsable tree" is total. There is zero digital interactivity for this family's records.

---

## 3. Proposed Feature
<!-- 💭 Inference OK — describe the solution behaviorally -->

Build a **static website** (HTML/CSS/JS, no server required) that provides:

### Core Behaviors

1. **Visual Family Tree** — An interactive pedigree chart showing ancestors branching outward from any selected person. Users click through the tree person-by-person, expanding and collapsing branches. Minimum 5 generations visible with zoom/pan controls.

2. **Person Profile Pages** — Detailed profile for each of the 107+ people showing all known metadata: name, dates, locations, occupations, military service, immigration history, marriages, family relationships, and biographical notes. Organized as a life event timeline.

3. **Family Group View** — Nuclear family display (parents + children + spouses) with click-through navigation to any related person.

4. **Search & Discovery** — Full-text search across all people by name with auto-suggest, returning results with context (dates, relationship to focal person).

5. **Responsive Design** — Fully functional on desktop (1440px+), tablet (768px), and mobile (375px) with touch-friendly interactions (pinch-to-zoom, swipe navigation).

6. **Deep Linking** — Every person and view has a shareable URL. Family members can send links like `https://niyanagi.github.io/montgomery-ancestry/person/fred-e-thompson-1871` to each other.

7. **Seven Family Lines** — All 7 documented lineages browsable as a unified tree: Thompson (paternal), Holmes (English), Smyth (Irish), Gies Hessen (German), Northwood, Smith-Rowe-Jones, and Montgomery (focal family).

### User Journeys

- **"Who was Great-Grandma Isabella?"** → Search "Isabella" → See Isabella Edna Holmes (1878–1937) → Read her profile (born Chatham, ON; married Dr. Fred Thompson 1903; lived in Detroit) → Click to see her parents (Thomas Holmes, 6th Mayor of Chatham + Isabella Smyth) → Trace her maternal line back to Germany (Henry Gies of Hessen, 1834 immigration to Detroit)
- **"Show me the whole tree"** → Open pedigree chart → Zoom out to see 7 generations → Click any person to recenter → Expand branches to explore collateral lines
- **"Share this with Cousin Dan"** → Copy URL for any person or view → Send via text/email → Dan opens on his phone → Mobile-optimized view loads instantly

---

## 4. Data Rationale
<!-- 🔬 VERIFIED DATA REQUIRED — adapted: references photo analysis, not Kusto -->

### Analysis 1: Data Richness Assessment

**Source:** [`research/preliminary-tree.md`](../research/preliminary-tree.md) — Master Person Index (Section 8)

The six source photographs yielded a remarkably rich dataset suitable for interactive exploration:

| Data Category | Coverage | Examples from Tree |
|--------------|----------|-------------------|
| Birth dates | ~60 of 107 people | Exact dates and year-only entries |
| Death dates | ~30 of 107 people | Including cause/circumstance where known |
| Locations | 40+ distinct places | Hessen Germany, Salford England, Chatham ON, Flushing MI, Detroit MI, Wagon Mound NM |
| Marriages | 35+ marriages documented | Including multiple marriages (Calvin Thompson: 2, Thomas Holmes: 2, Isabella Smyth: 2) |
| Occupations | 5+ occupations | M.D. (×2), Miller/grain merchant, Mayor, Snare drummer |
| Military service | 2+ records | Revolutionary War (patriarch + Samuel Thompson as snare drummer) |
| Immigration | 4+ immigration events | Scotland→NY, Ireland→Ontario, Germany→Detroit (1834), England→Ontario (1850) |
| Biographical details | Dozens of narrative notes | "Damned the Queen" (William Smyth), will records, cottage history at Lake of Bays |

**Conclusion:** The data is rich enough to populate meaningful person profiles for the majority of individuals, with especially deep records for the core Thompson-Holmes-Montgomery line. [why?](#data-richness-reasoning)

### Analysis 2: Competitive Gap Analysis

**Source:** [`research/competitive-analysis.md`](../research/competitive-analysis.md) — Cross-Platform Comparison (Section 6)

| Capability | Industry Standard | Montgomery Today | Gap |
|-----------|-------------------|------------------|-----|
| Interactive tree visualization | All 5 platforms offer it | ❌ None | Total |
| Person profile pages | All 5 platforms offer it | ❌ None | Total |
| Search within tree | All 5 platforms offer it | ❌ None | Total |
| Mobile-responsive design | All 5 platforms offer it | ❌ None | Total |
| Deep-linkable URLs | 4 of 5 platforms offer it | ❌ None | Total |
| Multiple visualization types | 3+ platforms offer 5+ views | ❌ None | Total |

**Conclusion:** The Montgomery family data currently has zero digital presence. Even a basic implementation would represent a leap from "6 photos in someone's camera roll" to "shareable, browsable family heritage site." [why?](#competitive-gap-reasoning)

### Analysis 3: Structural Complexity Justification

**Source:** [`research/preliminary-tree.md`](../research/preliminary-tree.md) — Family structure analysis

The tree's structure is non-trivial and benefits significantly from interactive navigation:

- **Multiple marriages:** Calvin Thompson (2 wives, 2 sets of children), Thomas Holmes (2 wives, 13+ children across both marriages), Isabella Smyth (2 husbands — Mr. Kitchen then Thomas Holmes)
- **Cross-line convergences:** The Thompson-Holmes marriage (Fred Eugene Thompson + Isabella Edna Holmes) merges 4 ancestral lines (Thompson, Holmes, Smyth, Gies)
- **Geographic migrations:** Scotland → New York → Michigan; Ireland → Ontario; Germany → Detroit → Ontario; England → Ontario. These paths cross and converge.
- **7 semi-independent family lines** that connect at specific marriage points — impossible to see in a flat document, natural to explore in an interactive tree

**Conclusion:** This family tree is complex enough that static documents fail to convey the relationships. Interactive navigation is not a luxury — it's the minimum viable way to make this data comprehensible. [why?](#structural-complexity-reasoning)

---

## 5. Affected Components
<!-- 💭 Inference OK — greenfield project, so these are components to BUILD, not modify -->

This is a **greenfield project** — all components are new. No existing codebase is being modified.

### Components to Build

| Component | Description | Complexity |
|-----------|-------------|------------|
| **Family tree data model** | JSON schema + data file for 107+ people with full metadata | Medium |
| **Tree visualization engine** | SVG-based interactive pedigree chart with zoom/pan/click | High |
| **Person profile view** | Detail page with timeline, family panel, facts, notes | Medium |
| **Family group view** | Nuclear family display with navigation | Low |
| **Search system** | Client-side full-text search with auto-suggest | Medium |
| **Navigation shell** | App layout, routing, responsive header/footer | Medium |
| **Landing page** | Hero section, family overview, quick stats, entry points | Low |
| **Responsive CSS system** | Design tokens, breakpoints, component styles | Medium |
| **GitHub Pages deployment** | Repository config, CI/CD (optional), custom domain | Low |

### Technology Stack (Proposed)

- **Rendering:** SVG for tree visualization (preferred over Canvas for accessibility [why?](#svg-reasoning))
- **CSS:** Modern CSS with custom properties, Grid, Flexbox
- **JavaScript:** Vanilla JS or lightweight framework (no heavy dependencies per requirements)
- **Data:** JSON with structured schema (per [`research/design-requirements.md`](../research/design-requirements.md), Section 10.4)
- **Hosting:** GitHub Pages at `https://niyanagi.github.io/montgomery-ancestry/`

---

## 6. Complexity Estimate
<!-- 💭 Inference OK -->

**Size:** L [why?](#effort-reasoning)

**Justification:**

| Factor | Assessment | Impact on Size |
|--------|-----------|----------------|
| Number of components | 9 distinct components to build | ↑ Pushes toward L |
| New vs. modified code | 100% new (greenfield) | ↑ No existing patterns to follow |
| Tree visualization | SVG interactive chart with zoom/pan is the hardest component | ↑ High complexity single component |
| Data modeling | 107+ people with rich relational data, 7 family lines | ↑ Non-trivial schema design |
| Responsive design | Must work beautifully from 375px to 1920px+ | ↑ Significant CSS effort |
| Accessibility | WCAG 2.1 AA target with tree-specific ARIA requirements | ↑ Adds to every component |
| No cross-repo coordination | Single repo, single deployment target | ↓ No coordination overhead |
| No backend | Static site, no API contracts | ↓ Simpler architecture |
| Well-defined data | All 107 people already extracted and structured | ↓ No data discovery needed |

**Calibration reference:** This is comparable to a "new flow with connector + hooks + views" (the L reference from the Forge Effort Scale) — multiple interconnected components forming a complete user experience, with the tree visualization engine being the most complex single piece. It does not reach XL because it's a single-repo project with no cross-team dependencies.

**Decomposition into sub-features:**

| Sub-Feature | Size | Notes |
|------------|------|-------|
| Data model + JSON schema | S | 1-3 files, well-defined by research docs |
| Data entry (107+ people) | M | Repetitive but voluminous; could be AI-assisted |
| Landing page + navigation shell | S | Standard responsive layout |
| Person profile view | M | Multiple sections, timeline, family panel |
| Tree visualization (pedigree chart) | L | The hardest single component — SVG, zoom/pan, responsive |
| Family group view | S | Simpler subset of tree visualization |
| Search system | S | Client-side search over ~107 records is straightforward |
| Responsive CSS + design system | M | Design tokens, breakpoints, component styles |
| GitHub Pages deployment | XS | Config change |

---

## 7. Dependencies
<!-- 💭 Inference OK -->

| Dependency | Owner | Status | Blocking? |
|-----------|-------|--------|-----------|
| GitHub Pages hosting | GitHub / `niyanagi` account | ✅ Account confirmed authenticated | No |
| Source photo data accuracy | Project owner | ⚠️ 16 unresolved questions remain ([Section 9, preliminary-tree.md](../research/preliminary-tree.md#9-unresolved-questions)) | No — build with known data, flag unknowns in UI |
| Google Fonts (Playfair Display, Inter) | Google | ✅ Publicly available | No |
| Family photos for profiles | Project owner | ⬜ Not yet collected | No — use silhouette placeholders, add photos later |
| Custom domain (f128.info) | Project owner / Dreamhost | ⬜ Secondary deployment target | No — GitHub Pages is primary |

### Data Quality Risks

The 16 unresolved questions ([`research/preliminary-tree.md`, Section 9](../research/preliminary-tree.md#9-unresolved-questions)) include:

- 🔴 **Donald Malcom Montgomery's ancestry** — No parental information for the family's namesake. The tree will show him with "Unknown" parents.
- 🟡 **Norine Eva Rowe's connection to Edward Frost Rowe** — The Rowe surname link between the Montgomery and Smith-Rowe-Jones lines is suspected but unconfirmed.
- 🟡 **Isabella Edna Holmes birth year** — 1878 or 1879? The site should display this ambiguity transparently.
- 🔵 **Various minor ambiguities** — Nickname vs. legal names ("Fritz", "Jimbo"), spouse name uncertainties, cropped data from photos.

**Mitigation:** The site should visually flag uncertain data (e.g., "~1878/1879", "Unknown", question mark icons) rather than hiding gaps. This is consistent with how FamilySearch and Ancestry handle data quality — transparency over false precision. [why?](#data-quality-reasoning)

---

## 8. Priority Recommendation
<!-- 💭 Inference OK — based on data from sections 2 and 4 -->

**Recommended Priority:** P0

**Reasoning:**

1. **This is the only feature** — there is no competing backlog. The entire project exists to build this one thing.
2. **Total gap** — The family currently has zero digital interactivity for their genealogical data. Any implementation is infinitely more than what exists today.
3. **Data is ready** — The research phase is complete: 107+ people extracted, 7 family lines mapped, competitive analysis done, design requirements written. The only thing missing is the build.
4. **Time sensitivity** — Family knowledge degrades over time. Older relatives who could verify the 16 unresolved questions won't be available indefinitely. Having a shareable site enables collaborative verification.
5. **Low risk** — Static site with no backend, no user data, no authentication. The worst case is a site that needs design iteration, not a production outage.

---

## 9. Scope Boundaries

### In Scope (V1)

- Interactive pedigree chart (ancestor view) with zoom/pan/click navigation
- Person profile pages with full metadata display
- Family group view
- Search with auto-suggest
- Responsive design (mobile/tablet/desktop)
- Deep-linkable URLs for every person and view
- All 7 family lines represented
- Landing page with family overview
- GitHub Pages deployment
- WCAG 2.1 AA accessibility target
- SVG-based tree rendering

### Out of Scope (Future Enhancements)

These features are documented in [`research/design-requirements.md`](../research/design-requirements.md) as Nice-to-Have (Section 2) and should be considered for V2+:

| Feature | Priority | Rationale for Deferral |
|---------|----------|----------------------|
| Fan chart visualization | P1 | High dev effort; pedigree chart covers the core need first |
| Timeline view (standalone) | P1 | Person profile already includes a timeline section |
| Descendant chart | P1 | Can be added after pedigree chart engine is built |
| Map/geography view | P2 | Requires map library integration (Leaflet/Mapbox) |
| Statistics dashboard | P2 | Nice-to-have, not core navigation |
| Relationship path calculator | P2 | Complex algorithm, high effort |
| Print-friendly views | P2 | CSS print styles can be added incrementally |
| Dark mode | P3 | CSS custom properties make this easy to add later |
| GEDCOM export | P3 | Niche use case |
| Offline support (Service Worker) | P3 | GitHub Pages is already fast; offline is a luxury |
| Photo colorization/enhancement | P3 | Requires external AI services |

---

## 10. Success Criteria

Since this is a personal project without production telemetry, success is measured by:

| Criterion | Target | How to Verify |
|-----------|--------|---------------|
| **All 107+ people browsable** | 100% of Master Person Index represented | Manual count against preliminary-tree.md |
| **All 7 family lines navigable** | Thompson, Holmes, Smyth, Gies, Northwood, Smith-Rowe-Jones, Montgomery | Manual navigation test |
| **Mobile-functional** | Usable on iPhone SE (375px) through desktop (1920px) | Chrome DevTools responsive testing |
| **Page load performance** | LCP < 2.5s on 3G | Lighthouse audit |
| **Accessibility** | Lighthouse Accessibility ≥ 95 | Lighthouse audit |
| **Deep linking works** | Every person has a unique, shareable URL | Automated URL test |
| **Search finds everyone** | Search for any person by name returns correct result | Manual testing of 10+ sample searches |
| **Deployed and accessible** | Live at `https://niyanagi.github.io/montgomery-ancestry/` | HTTP 200 response |

---

## 11. Next Steps
<!-- 💭 Inference OK -->

If this proposal is approved:

- [ ] **Stage 02: Design Spec** → `@SpecWriter` drafts a detailed design spec covering data schema, component architecture, interaction design, and visual specifications. Grounded in [`research/design-requirements.md`](../research/design-requirements.md).
- [ ] **Stage 03: Spec Review** → `@SpecReviewer` + `@Designer` review the spec for completeness, feasibility, accessibility compliance, and UX quality.
- [ ] **Stage 04: Implementation Plan** → `@ImplementationPlanner` produces file-level implementation plan with build order and dependency graph.
- [ ] **Stage 05: Implementation** → Engineer+Copilot build the site.
- [ ] **Stage 06: Code Review** → `@CodeReviewer` reviews for quality, patterns, and accessibility.
- [ ] **Stage 07: Test Plan** → `@TestPlanner` generates test cases for cross-browser, responsive, and accessibility testing.
- [ ] **Stage 08: Ship** → Deploy to GitHub Pages.

---

## Appendix: Reasoning Links

#### data-richness-reasoning
The 107-person dataset includes birth dates for ~60% of individuals, death dates for ~30%, and rich biographical metadata (occupations, military service, immigration events) for the core lineage. This exceeds the minimum data density needed for meaningful person profiles. Platforms like Ancestry.com display profiles with far less data per person — even a name + two dates creates a useful tree node. The Montgomery dataset has sufficient depth for the core Thompson-Holmes-Montgomery line and sufficient breadth across all 7 family lines to justify a full interactive tree rather than a simple list.

#### competitive-gap-reasoning
The competitive analysis ([Section 6](../research/competitive-analysis.md#6-cross-platform-comparison-matrix)) shows that every successful genealogy platform provides interactive tree visualization, person profiles, and search as baseline features. The Montgomery family data currently has none of these. The gap is not "we're missing some advanced features" — it's "we have zero digital interactivity." Even a V1 implementation with just pedigree chart + person profiles + search would bring the family from 0% to ~60% of competitive feature coverage for the core use case (browsing a known, fixed family tree).

#### structural-complexity-reasoning
Three factors make this tree structurally complex enough to demand interactive navigation: (1) **Multiple marriages** create branching family lines that are confusing in a flat document (Calvin Thompson had 2 wives with 2 distinct sets of children; Thomas Holmes had 2 wives with 9+ and 4 children respectively). (2) **Cross-line convergences** — the Thompson-Holmes marriage merges 4 ancestral streams (Thompson from Scotland/NY, Holmes from England/Ontario, Smyth from Ireland, Gies from Germany). (3) **Geographic migrations** across 3 countries and 10+ locations create a spatial dimension that flat documents cannot convey. Interactive zoom/click/search makes these relationships navigable rather than overwhelming.

#### svg-reasoning
SVG is preferred over Canvas for the tree visualization because: (1) SVG elements are part of the DOM, making them inherently accessible to screen readers and keyboard navigation (critical for WCAG 2.1 AA compliance). (2) SVG supports CSS styling, enabling responsive design and theme customization via CSS custom properties. (3) For a tree of ~107 people (not thousands), SVG performance is excellent — Canvas optimization would be premature. (4) SVG text rendering is crisp at all zoom levels. The design requirements ([Section 10.3](../research/design-requirements.md#103-technology-preferences)) explicitly state "SVG preferred for accessibility."

#### effort-reasoning
**Size: L** — Estimated using the Forge Effort Scale (10-20 files, new architecture). This project requires building 9 distinct components from scratch with no existing patterns to follow. The tree visualization engine alone is an M-to-L effort (SVG interactive chart with zoom, pan, click navigation, responsive layout, and accessibility). Combined with the data modeling, person profiles, search system, responsive CSS, and deployment pipeline, the total effort is solidly L. It does not reach XL because there is no cross-repo coordination, no API contracts, and no backend — it's a self-contained static site. **Calibration:** Comparable to "new flow with connector + hooks + views" from the effort scale reference, or slightly larger than the Account Switcher reference (M, 16 files, 684 insertions, 2 repos) since this involves more components but fewer coordination constraints.

#### data-quality-reasoning
Displaying data quality transparently (with "Unknown", "~circa dates", and question mark indicators) follows the established pattern from both FamilySearch and Ancestry.com, which show "Unknown" ancestor cards and estimated dates rather than hiding gaps. For the Montgomery tree specifically, the 16 unresolved questions should be visible in the UI because: (1) family members viewing the site may have answers, (2) hiding gaps would create a false sense of completeness, and (3) the site itself can serve as a research coordination tool if unknowns are clearly flagged.
