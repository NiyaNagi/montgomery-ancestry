# Design Requirements: Montgomery Ancestry Browser

> **Purpose:** Comprehensive design requirements and specifications for a beautiful, interactive, mobile-friendly static ancestry website.
> **Date:** 2025
> **Based on:** Competitive analysis of Ancestry.com, FamilySearch.org, MyHeritage.com, FindMyPast.com, and Geni.com.

---

## Table of Contents

1. [Must-Have Features](#1-must-have-features)
2. [Nice-to-Have Features](#2-nice-to-have-features)
3. [Person Metadata Fields](#3-person-metadata-fields)
4. [Visualization Types](#4-visualization-types)
5. [Navigation Patterns](#5-navigation-patterns)
6. [Visual Design Direction](#6-visual-design-direction)
7. [Mobile Design](#7-mobile-design)
8. [Accessibility Requirements](#8-accessibility-requirements)
9. [Performance Requirements](#9-performance-requirements)
10. [Technical Constraints](#10-technical-constraints)

---

## 1. Must-Have Features

These are the core features every ancestry browser needs. They appear universally across all competitive platforms and represent baseline user expectations.

### 1.1 Person Profile Page

- **Comprehensive person detail view** showing all metadata fields (see Section 3)
- **Profile photo display** with fallback to gender-based silhouette/initials avatar
- **Life event timeline** showing chronological progression of birth → education → marriage → residences → death
- **Family relationships panel** showing parents, spouse(s), siblings, and children with clickable navigation
- **Source citations list** with links to evidence/documentation
- **Notes/narrative section** for biographical text and research notes
- **Photo gallery** for person-specific images and documents

### 1.2 Family Tree Visualization

- **Pedigree/ancestor chart:** Horizontal or vertical tree showing direct ancestors (minimum 5 generations)
- **Person-to-person click navigation:** Click on any tree node to make that person the focal point
- **Zoom and pan controls:** Smooth zoom in/out and drag-to-pan on the tree canvas
- **Person cards in tree view:** Each node shows photo thumbnail, full name, and birth–death year range
- **Expand/collapse branches:** Click to show or hide branches of the tree for focused exploration
- **Root person selector:** Ability to change the starting person for any visualization

### 1.3 Search & Discovery

- **Full-text search** across all people in the tree by name
- **Auto-suggest/autocomplete** as the user types a name
- **Search results with context** showing key dates and relationship to root person
- **Direct navigation** to any person from search results

### 1.4 Responsive Layout

- **Fully responsive design** that works on desktop (1920px+), laptop (1366px), tablet (768px), and mobile (375px)
- **Touch-friendly interactions** on all devices
- **Readable typography** at all viewport sizes

### 1.5 Static Site Architecture

- **No server required:** The site must work as a static website (HTML/CSS/JS) hosted on any static file server (GitHub Pages, Netlify, S3, etc.)
- **Data-driven:** Family tree data loaded from JSON/structured data files
- **Client-side rendering:** All tree visualization and navigation handled in the browser

---

## 2. Nice-to-Have Features

Advanced features that would delight users and differentiate the Montgomery Ancestry Browser from basic genealogy viewers.

### 2.1 Enhanced Visualizations

- **Fan chart:** Radial/semicircular ancestor display with color-coded paternal/maternal lines
- **Descendant view:** Top-down chart showing all descendants of a selected ancestor
- **Hourglass view:** Combined ancestors + descendants view centered on one person
- **Timeline view:** Full-width chronological display of a person's life events
- **Map/geography view:** Plot life events (birth, residences, death) on an interactive map
- **Statistics dashboard:** Family statistics (total people, generations span, geographic distribution, common occupations, lifespans)

### 2.2 Enhanced Navigation

- **Relationship path calculator:** Show the exact relationship path between any two people (e.g., "3rd cousin twice removed")
- **Generation navigator:** Quick-jump to a specific generation level
- **Breadcrumb trail:** Show navigation path through the tree (e.g., "You → Father → Grandfather → Great-Grandfather")
- **Recently viewed people:** Quick access to recently visited profiles
- **Bookmarks/favorites:** Mark people of interest for quick return

### 2.3 Content Features

- **Photo viewer with lightbox:** Full-screen photo viewing with zoom and metadata
- **Photo colorization/enhancement:** AI-based enhancement of historical photos
- **Narrative biography auto-generation:** Generate readable life stories from structured data
- **Print-friendly views:** Printable pedigree charts and family group sheets
- **GEDCOM export:** Allow users to export the tree data in GEDCOM format
- **Share links:** Deep-linkable URLs for individual people and views

### 2.4 Engagement Features

- **"On this day" feature:** Show family events that happened on today's date
- **Family statistics and records:** Oldest person, most children, most generations, etc.
- **Theme switching:** Light/dark mode, or heritage/modern theme options
- **Animated transitions:** Smooth animations when navigating between people and views

---

## 3. Person Metadata Fields

A comprehensive list of all metadata fields to support per person, organized by category. Based on the union of all fields found across Ancestry, FamilySearch, MyHeritage, FindMyPast, and Geni.

### 3.1 Identity

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | String | ✅ | Unique identifier |
| `firstName` | String | ✅ | Given name |
| `middleName` | String | | Middle name(s) |
| `lastName` | String | ✅ | Family/surname |
| `maidenName` | String | | Pre-marriage surname |
| `suffix` | String | | Jr., Sr., III, etc. |
| `prefix` | String | | Dr., Rev., Sir, etc. |
| `nickname` | String | | Common nickname |
| `alternateNames` | String[] | | Other known names, aliases |
| `gender` | Enum | ✅ | Male, Female, Other, Unknown |

### 3.2 Vital Events

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `birth.date` | Date | ✅ (if known) | Exact or approximate |
| `birth.place` | Location | | City, county, state, country |
| `christening.date` | Date | | |
| `christening.place` | Location | | |
| `death.date` | Date | | |
| `death.place` | Location | | |
| `death.cause` | String | | Cause of death |
| `burial.date` | Date | | |
| `burial.place` | Location | | |
| `burial.cemetery` | String | | Cemetery name |
| `burial.plot` | String | | Plot/section/lot number |

### 3.3 Marriages & Relationships

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `marriages[]` | Array | | Supports multiple marriages |
| `marriages[].spouseId` | String | | Reference to spouse person |
| `marriages[].date` | Date | | Marriage date |
| `marriages[].place` | Location | | Marriage location |
| `marriages[].endDate` | Date | | Divorce or widowed date |
| `marriages[].endReason` | Enum | | Divorce, Death, Annulment |
| `parents[]` | Array | | Biological, adopted, step, foster |
| `parents[].personId` | String | | Reference to parent |
| `parents[].type` | Enum | | Biological, Adopted, Step, Foster |
| `children[]` | Array | | References to child persons |

### 3.4 Life Events & Facts

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `occupations[]` | Array | | |
| `occupations[].title` | String | | Job title |
| `occupations[].employer` | String | | Employer/company |
| `occupations[].dateRange` | DateRange | | Start/end dates |
| `occupations[].place` | Location | | Work location |
| `education[]` | Array | | |
| `education[].institution` | String | | School/university name |
| `education[].degree` | String | | Degree earned |
| `education[].dateRange` | DateRange | | Attendance dates |
| `military[]` | Array | | |
| `military[].branch` | String | | Army, Navy, etc. |
| `military[].rank` | String | | Highest rank achieved |
| `military[].unit` | String | | Unit/regiment |
| `military[].serviceDate` | DateRange | | Service period |
| `military[].conflict` | String | | War/conflict name |
| `military[].dischargeType` | String | | Honorable, etc. |
| `residences[]` | Array | | |
| `residences[].place` | Location | | Address/location |
| `residences[].dateRange` | DateRange | | Period of residence |
| `immigration` | Object | | |
| `immigration.date` | Date | | Immigration date |
| `immigration.from` | Location | | Origin country/port |
| `immigration.to` | Location | | Destination country/port |
| `immigration.ship` | String | | Ship name |
| `religion` | String | | Religious denomination |
| `nationality` | String | | Citizenship/nationality |

### 3.5 Physical Description (from historical records)

| Field | Type | Notes |
|-------|------|-------|
| `physicalDescription.height` | String | e.g., "5'10"" |
| `physicalDescription.weight` | String | |
| `physicalDescription.hairColor` | String | |
| `physicalDescription.eyeColor` | String | |

### 3.6 Media & Documentation

| Field | Type | Notes |
|-------|------|-------|
| `photos[]` | Array | Photo objects with URL, caption, date, description |
| `photos[].url` | String | Path to image file |
| `photos[].caption` | String | Descriptive caption |
| `photos[].date` | Date | When photo was taken |
| `photos[].type` | Enum | Portrait, Document, Headstone, Group, Other |
| `documents[]` | Array | Scanned documents, certificates, etc. |
| `sources[]` | Array | Source citations |
| `sources[].title` | String | Source name/description |
| `sources[].citation` | String | Full citation text |
| `sources[].url` | String | Link to external source |
| `sources[].type` | Enum | Census, BMD, Military, Church, Newspaper, Other |

### 3.7 Narrative & Notes

| Field | Type | Notes |
|-------|------|-------|
| `biography` | String (Markdown) | Narrative life story |
| `notes` | String | Research notes |
| `stories[]` | Array | Individual story entries with title and text |

### 3.8 Computed/Derived Fields (generated at runtime)

| Field | Type | Notes |
|-------|------|-------|
| `age` | Number | Calculated from birth and death dates |
| `lifespan` | String | e.g., "1845–1923 (78 years)" |
| `generation` | Number | Generation number relative to root person |
| `relationship` | String | Relationship to root person (e.g., "Great-Grandfather") |
| `livingStatus` | Enum | Living, Deceased, Unknown |
| `completeness` | Number | Percentage of known metadata fields filled |

---

## 4. Visualization Types

### 4.1 Primary Views (Must-Have)

#### Pedigree Chart (Ancestor View)
- **Layout:** Horizontal left-to-right OR vertical bottom-to-top
- **Content:** Direct ancestors only (parents → grandparents → great-grandparents → ...)
- **Depth:** Configurable, default 4–5 generations visible
- **Nodes:** Card-based with photo, name, birth–death years
- **Interaction:** Click node to recenter, click expand to go deeper
- **Color coding:** Optional paternal (blue tones) / maternal (pink/red tones) line highlighting
- **Empty placeholders:** Show "Unknown" cards for missing ancestors to indicate gaps

#### Person Detail View
- **Layout:** Full-page profile with sections
- **Sections:** Header (photo + name + dates), Timeline, Family panel, Facts, Sources, Photos, Notes
- **Navigation:** Tabs or scrollable sections with sticky navigation

#### Family Group View
- **Layout:** Nuclear family centered—parents at top, children listed below
- **Content:** Parents, their marriage info, all children with birth dates
- **Navigation:** Click parent to see their parents; click child to see their family

### 4.2 Secondary Views (Nice-to-Have)

#### Fan Chart
- **Layout:** 180° or 360° radial chart with root person at center
- **Depth:** 4–8 generations radiating outward
- **Color coding:** Each generation or each line gets a distinct color
- **Interaction:** Click segment to select person, hover for tooltip with details

#### Descendant Chart
- **Layout:** Top-down tree from a selected ancestor
- **Content:** All descendants with their spouses and children
- **Interaction:** Expandable/collapsible branches

#### Timeline View
- **Layout:** Full-width horizontal or vertical timeline
- **Content:** All life events plotted chronologically
- **Enrichment:** Contextual historical events (wars, migrations, etc.) shown alongside personal events
- **Interaction:** Click events to see details; zoom into date ranges

#### Map View
- **Layout:** Interactive map with markers for life events
- **Content:** Birth, residences, marriages, deaths plotted geographically
- **Enrichment:** Lines connecting locations showing migration/movement
- **Interaction:** Click markers for event details; filter by event type

#### Statistics View
- **Content:** Aggregate family statistics
- **Metrics:** Total people, generations, geographic distribution, common names, common occupations, average lifespan by generation, gender distribution, migration patterns

---

## 5. Navigation Patterns

### 5.1 Primary Navigation

```
┌─────────────────────────────────────────────────────────┐
│  🏠 Home  │  🌳 Tree  │  👤 People  │  🔍 Search  │  ℹ️ About  │
└─────────────────────────────────────────────────────────┘
```

- **Home:** Landing page with family overview, featured photo, and quick stats
- **Tree:** Default to pedigree chart view; secondary tabs for fan chart, descendants, etc.
- **People:** Browse/search all people in the tree; list view with sort/filter
- **Search:** Global search with autocomplete
- **About:** Information about the Montgomery family and the site

### 5.2 Tree Navigation

- **Click-through navigation:** Click any person node to make them the focal point
- **Breadcrumb trail:** Show path from root person to current person
  - Example: `Home > James Montgomery > William Montgomery > Robert Montgomery`
- **Back/forward browser history:** Each person view creates a browser history entry for back-button navigation
- **Keyboard navigation:** Arrow keys to move between family members (up=parents, down=children, left/right=siblings)
- **Mini-map (for large trees):** Small overview map showing current viewport position within the full tree

### 5.3 Person Profile Navigation

- **Sticky header:** Person name and photo remain visible when scrolling
- **Section anchors:** Jump links to Timeline, Family, Facts, Sources, Photos, Notes sections
- **Relationship navigation:** Click any family member's name to navigate to their profile
- **View switcher:** Toggle between profile view and tree view for the same person

### 5.4 URL Structure (Deep Linking)

```
/                           → Home / landing page
/tree                       → Default tree view (pedigree chart)
/tree/fan                   → Fan chart view
/tree/descendants/{id}      → Descendant chart for specific person
/person/{id}                → Person detail/profile page
/person/{id}/timeline       → Person timeline view
/person/{id}/photos         → Person photo gallery
/people                     → Browse all people (list view)
/search?q={query}           → Search results
/statistics                 → Family statistics dashboard
/about                      → About the family / site info
```

---

## 6. Visual Design Direction

### 6.1 Color Palette

Inspired by the warm, heritage-focused aesthetics of successful genealogy platforms, with a unique Montgomery family identity.

#### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Heritage Green** | `#2D5016` | Primary brand color, headers, CTAs |
| **Warm Gold** | `#C5933A` | Accents, highlights, decorative elements |
| **Deep Charcoal** | `#1A1A2E` | Primary text |
| **Parchment Cream** | `#FAF6F0` | Page backgrounds |
| **Warm White** | `#FFFFFF` | Card backgrounds |

#### Secondary / Accent Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Soft Sage** | `#8DB580` | Secondary backgrounds, hover states |
| **Dusty Rose** | `#C4787A` | Maternal line highlights, accents |
| **Steel Blue** | `#5B7F95` | Paternal line highlights, links |
| **Warm Gray** | `#6B6B7B` | Secondary text, borders |
| **Light Gray** | `#E8E4DF` | Dividers, subtle backgrounds |

#### Semantic Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Success** | `#3D8B37` | Confirmed data, complete profiles |
| **Warning** | `#D4A843` | Missing data, incomplete profiles |
| **Info** | `#4A90D9` | Informational badges, links |
| **Muted** | `#9B9B9B` | Placeholder text, unknown data |

### 6.2 Typography

| Element | Font | Weight | Size (Desktop) | Size (Mobile) |
|---------|------|--------|-----------------|---------------|
| **H1 (Page title)** | Playfair Display (serif) | 700 | 36px / 2.25rem | 28px / 1.75rem |
| **H2 (Section title)** | Playfair Display (serif) | 600 | 28px / 1.75rem | 22px / 1.375rem |
| **H3 (Subsection)** | Inter (sans-serif) | 600 | 20px / 1.25rem | 18px / 1.125rem |
| **Body text** | Inter (sans-serif) | 400 | 16px / 1rem | 16px / 1rem |
| **Small text** | Inter (sans-serif) | 400 | 14px / 0.875rem | 14px / 0.875rem |
| **Caption/meta** | Inter (sans-serif) | 400 | 12px / 0.75rem | 12px / 0.75rem |
| **Tree node name** | Inter (sans-serif) | 600 | 14px / 0.875rem | 12px / 0.75rem |
| **Tree node dates** | Inter (sans-serif) | 400 | 12px / 0.75rem | 10px / 0.625rem |

**Line height:** 1.5 for body text, 1.2 for headings
**Letter spacing:** Normal for body, slight tracking (+0.5px) for uppercase labels

### 6.3 Spacing System

Use an 8px base unit spacing system:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps, icon padding |
| `sm` | 8px | Inline spacing, small gaps |
| `md` | 16px | Default component padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large section gaps |
| `2xl` | 48px | Page section spacing |
| `3xl` | 64px | Major layout gaps |

### 6.4 Component Styling

#### Person Card (Tree Node)
```
┌─────────────────────┐
│  ┌─────┐            │
│  │Photo│  Name       │
│  │     │  b. 1845    │
│  └─────┘  d. 1923    │
└─────────────────────┘
```
- **Dimensions:** ~180×80px (desktop), ~140×70px (mobile)
- **Border radius:** 12px
- **Shadow:** Soft drop shadow (`0 2px 8px rgba(0,0,0,0.08)`)
- **Photo:** 48px circle with 2px white border
- **Background:** White with subtle hover elevation
- **Hover state:** Slight lift (+2px shadow), border highlight in Heritage Green
- **Selected state:** Heritage Green left border (4px), slight background tint

#### Connecting Lines (Tree)
- **Style:** Smooth curved lines (bezier curves), not angular
- **Color:** Warm Gray (`#6B6B7B`) at 60% opacity
- **Width:** 2px default, 3px on hover
- **Animation:** Subtle draw-in animation when tree loads

### 6.5 Imagery Direction

- **Historical photos:** Display in sepia-toned frames or with subtle vignette
- **Photo placeholders:** Gender-appropriate silhouette icons in Soft Sage on Parchment background
- **Background textures:** Subtle parchment/linen texture on page backgrounds (very light, not distracting)
- **Decorative elements:** Minimal botanical/tree motifs (leaves, branches) used sparingly as section dividers or background accents
- **Hero imagery:** Large, emotionally resonant family photos on landing page

### 6.6 Iconography

- Use a consistent line-icon set (e.g., Lucide, Heroicons, or Phosphor Icons)
- 24px standard size, 20px for compact views, 16px inline
- Stroke weight: 1.5px
- Color: Match surrounding text color or accent color for interactive elements

---

## 7. Mobile Design

### 7.1 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| **Mobile S** | 320px | Single column, compact cards |
| **Mobile M** | 375px | Single column, standard cards |
| **Mobile L** | 425px | Single column, slightly larger |
| **Tablet** | 768px | Two-column layouts, side panels |
| **Laptop** | 1024px | Full layout with sidebar |
| **Desktop** | 1440px | Full layout, maximum content width |
| **Wide** | 1920px+ | Centered max-width container (1440px) |

### 7.2 Touch Interactions

| Gesture | Action |
|---------|--------|
| **Tap** | Select person, navigate, expand/collapse |
| **Double-tap** | Zoom in on tree area |
| **Pinch** | Zoom in/out on tree canvas |
| **Drag/swipe** | Pan across tree canvas |
| **Long-press** | Show context menu (quick actions for person) |
| **Swipe left/right** | Navigate between siblings (on person profile) |
| **Pull down** | Refresh / return to parent view |

### 7.3 Mobile-Specific UX

- **Bottom navigation bar:** Primary nav moves to bottom on mobile for thumb accessibility
  ```
  ┌──────────────────────────────┐
  │  🏠  │  🌳  │  🔍  │  👤  │  ⋯  │
  │ Home │ Tree │Search│People│ More│
  └──────────────────────────────┘
  ```
- **Simplified tree view:** On small screens, show a vertical pedigree (one branch at a time) with left/right navigation for siblings
- **Sheet-based person detail:** Person profile opens as a bottom sheet overlay (slide up from bottom) rather than full page navigation
- **Search:** Full-screen search overlay triggered from the search tab
- **Touch targets:** All interactive elements minimum 44×44px tap target
- **Compact person cards:** Smaller cards in tree view with abbreviated info (name + year range only)
- **Offline support:** Service worker caching for basic tree browsing without connectivity

### 7.4 Tablet-Specific UX

- **Side panel layout:** Tree on left, person detail on right (iPad-style split view)
- **Landscape optimization:** Take advantage of wider viewport for more tree generations
- **Hover alternatives:** Long-press tooltips replace hover tooltips

---

## 8. Accessibility Requirements

Target: **WCAG 2.1 Level AA** compliance.

### 8.1 Perceivable

| Requirement | Implementation |
|-------------|---------------|
| **Text alternatives** | All images have descriptive `alt` text; decorative images use `alt=""` |
| **Photo alt text** | Person photos: `alt="Portrait of [Name], circa [year]"` |
| **Tree node alt text** | Each tree node is an accessible element with name, dates, and relationship |
| **Color contrast** | Minimum 4.5:1 ratio for normal text, 3:1 for large text (18px+ or 14px+ bold) |
| **Color not sole indicator** | Don't rely on color alone to convey information (e.g., maternal/paternal lines also use patterns or labels) |
| **Text resizing** | Content must remain usable when text is resized up to 200% |
| **Responsive reflow** | Content reflows at 320px width without horizontal scrolling |

### 8.2 Operable

| Requirement | Implementation |
|-------------|---------------|
| **Keyboard navigation** | All interactive elements reachable and operable via keyboard |
| **Tree keyboard nav** | Arrow keys navigate between family members; Enter selects; Escape closes panels |
| **Focus indicators** | Visible focus ring (3px Heritage Green outline) on all focusable elements |
| **Skip navigation** | "Skip to main content" link as first focusable element |
| **No keyboard traps** | Users can always tab out of any component |
| **Sufficient time** | No time-limited interactions |
| **Pause animations** | Respect `prefers-reduced-motion` media query; provide toggle to disable animations |

### 8.3 Understandable

| Requirement | Implementation |
|-------------|---------------|
| **Language** | `lang="en"` on HTML element; `lang` attribute on any non-English content |
| **Consistent navigation** | Navigation appears in the same location on every page |
| **Consistent identification** | Same icons and labels used for the same actions throughout |
| **Clear labels** | All form inputs have visible labels; all buttons have descriptive text |
| **Error identification** | Search with no results provides clear message and suggestions |

### 8.4 Robust

| Requirement | Implementation |
|-------------|---------------|
| **Semantic HTML** | Use `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` |
| **ARIA landmarks** | `role="navigation"`, `role="main"`, `role="search"`, `aria-label` for regions |
| **ARIA for tree** | `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level` for tree components |
| **Live regions** | `aria-live="polite"` for dynamic content updates (search results, tree loading) |
| **Valid HTML** | Pass W3C HTML validation |

### 8.5 Genealogy-Specific Accessibility

| Requirement | Implementation |
|-------------|---------------|
| **Alternative tree representation** | Provide a **list/table view** alternative to all visual tree charts |
| **Screen reader tree navigation** | Linearize tree relationships: "John Montgomery, born 1845, died 1923. Father: William Montgomery. Mother: Mary Smith. Children: 3." |
| **Relationship announcements** | When navigating the tree, announce the relationship context: "Now viewing John Montgomery, your great-grandfather" |
| **Complex chart alternatives** | Fan chart and other complex visualizations have text-based equivalents |
| **High contrast mode** | Support `prefers-contrast: more` with enhanced borders and backgrounds |

---

## 9. Performance Requirements

### 9.1 Loading Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | < 1.5s | Time until first meaningful content appears |
| **Largest Contentful Paint (LCP)** | < 2.5s | Time until largest content element renders |
| **Time to Interactive (TTI)** | < 3.5s | Time until page is fully interactive |
| **Total page weight** | < 500KB initial | Excluding images; gzipped transfer size |
| **Image optimization** | WebP/AVIF with fallbacks | All photos served in modern formats with `<picture>` element |
| **Font loading** | < 100KB total | Use `font-display: swap`; subset fonts to required characters |

### 9.2 Runtime Performance

| Metric | Target | Notes |
|--------|--------|-------|
| **Tree rendering** | < 500ms for 500 nodes | Initial render of visible tree portion |
| **Pan/zoom framerate** | 60fps | Smooth canvas/SVG interactions |
| **Search response** | < 100ms | Client-side search across all people in the tree |
| **Page transitions** | < 300ms | Navigation between views |
| **Animation smoothness** | 60fps | All CSS/JS animations run at 60fps |
| **Scroll performance** | No jank | Timeline and list views scroll smoothly |

### 9.3 Data Performance

| Metric | Target | Notes |
|--------|--------|-------|
| **JSON data file** | < 200KB gzipped | For a tree of ~1,000 people |
| **Lazy loading** | Images below fold | Load images only as they enter viewport |
| **Tree virtualization** | Render only visible nodes | For trees > 200 people, only render visible portion |
| **Caching** | Service worker | Cache static assets and data for offline/repeat visits |
| **Prefetching** | Adjacent person data | Prefetch data for likely next navigation targets |

### 9.4 Lighthouse Scores

| Category | Target |
|----------|--------|
| **Performance** | ≥ 90 |
| **Accessibility** | ≥ 95 |
| **Best Practices** | ≥ 95 |
| **SEO** | ≥ 90 |

---

## 10. Technical Constraints

### 10.1 Static Site Requirements

- **No backend server:** All functionality must work client-side
- **Data format:** Family tree data stored in JSON files (one main data file + optional per-person detail files)
- **Hosting agnostic:** Must work on GitHub Pages, Netlify, Vercel, S3, or any static file server
- **Build tool optional:** Should work without a build step (vanilla HTML/CSS/JS) or with a lightweight build tool

### 10.2 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Chrome Android | 90+ |

### 10.3 Technology Preferences

- **Tree rendering:** SVG or Canvas for tree visualization (SVG preferred for accessibility)
- **CSS:** Modern CSS with custom properties (variables), Grid, Flexbox
- **JavaScript:** Vanilla JS or lightweight framework (no heavy dependencies)
- **Data:** JSON with a clear schema (consider JSON-LD for structured data / SEO)
- **Photos:** WebP with JPEG fallbacks; lazy loaded; responsive `srcset`

### 10.4 Data Schema (Summary)

```json
{
  "meta": {
    "familyName": "Montgomery",
    "lastUpdated": "2025-01-15",
    "totalPeople": 247,
    "generations": 8
  },
  "people": [
    {
      "id": "person-001",
      "firstName": "James",
      "lastName": "Montgomery",
      "gender": "male",
      "birth": { "date": "1845-03-12", "place": "County Donegal, Ireland" },
      "death": { "date": "1923-11-05", "place": "Philadelphia, PA" },
      "marriages": [...],
      "occupations": [...],
      "military": [...],
      "photos": [...],
      "sources": [...],
      "biography": "...",
      "parentIds": ["person-000a", "person-000b"],
      "childIds": ["person-002", "person-003", "person-004"]
    }
  ]
}
```

---

## Appendix A: Design Inspiration Sources

| Source | What to Study |
|--------|--------------|
| **Ancestry.com** | Card-based tree nodes, hint system, warm color palette |
| **FamilySearch.org** | Fan chart design, timeline + map combo, accessible design |
| **MyHeritage.com** | Variety of chart types, AI photo tools, profile page layout |
| **FindMyPast.com** | Editorial heritage aesthetic, newspaper integration, historical maps |
| **Geni.com** | Relationship calculator, collaborative tree model, project system |
| **Apple Human Interface Guidelines** | Touch targets, mobile navigation patterns |
| **Material Design 3** | Card elevation, color system, responsive layouts |
| **GOV.UK Design System** | Accessibility patterns, typography scale, form design |

## Appendix B: Competitive Feature Priority Matrix

| Feature | User Impact | Dev Effort | Priority |
|---------|------------|------------|----------|
| Pedigree chart | ★★★★★ | Medium | **P0** |
| Person profile page | ★★★★★ | Medium | **P0** |
| Search | ★★★★★ | Low | **P0** |
| Responsive layout | ★★★★★ | Medium | **P0** |
| Family group view | ★★★★☆ | Low | **P0** |
| Photo gallery | ★★★★☆ | Low | **P1** |
| Fan chart | ★★★★☆ | High | **P1** |
| Timeline view | ★★★★☆ | Medium | **P1** |
| Descendant chart | ★★★☆☆ | Medium | **P1** |
| Map view | ★★★☆☆ | High | **P2** |
| Statistics dashboard | ★★★☆☆ | Medium | **P2** |
| Relationship calculator | ★★★☆☆ | High | **P2** |
| Print views | ★★☆☆☆ | Medium | **P2** |
| Dark mode | ★★☆☆☆ | Low | **P3** |
| GEDCOM export | ★★☆☆☆ | Medium | **P3** |
| Offline support | ★★☆☆☆ | Medium | **P3** |
