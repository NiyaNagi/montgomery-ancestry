# Stage 03 — Spec Review: Montgomery Ancestry Browser

<!--
  Stage 03 — Spec Review
  Agents: @SpecReviewer (Full Review, Mode 1) + @Designer (Full Audit, Mode 1)
  Pipeline: Montgomery Ancestry Browser
  Input: forge-pipeline/02-spec.md
  Date: 2026-03-29

  ADAPTATION NOTE:
  This is a greenfield personal/family project — enterprise-specific checks
  (IDP matrix, flight flags, cross-team dependencies, Kusto telemetry) are
  skipped per the adaptation guidelines.
-->

---

## Executive Summary

The Montgomery Ancestry Browser spec (`02-spec.md`) is **well-written, thorough, and nearly implementation-ready**. It covers 10 functional requirements with 23 acceptance criteria, has detailed reasoning links for all major claims, and correctly adapts the Forge template for a greenfield static-site project. The visual design, accessibility, and performance sections are all substantially above average for a V1 spec.

**However, the review surfaces 3 concerns and 8 suggestions** that should be addressed before the Implementation Planning stage. No critical blockers were found — the spec is fundamentally sound and technically feasible for a vanilla HTML/CSS/JS static site.

**Overall Readiness: ✅ Ready for Implementation Planning** (with recommended changes below)

---

## Part 1: @SpecReviewer — Full Review (Mode 1)

### Phase 1: Structural Check

The spec follows the Forge design spec template with appropriate greenfield adaptations. All required sections are present and substantive.

| Section | Status | Notes |
|---------|--------|-------|
| 1. Title | ✅ | Clear, descriptive |
| 2. Point of Contacts | ✅ | Appropriate for solo project |
| 3. Terminology | ✅ | 8 well-defined terms covering domain language |
| 4. Business Context | ✅ | Strong problem statement with evidence |
| 5. Goals | ✅ | 5 measurable goals |
| 6. Impact | ✅ | Quantified metrics from research data |
| 7. In Scope | ✅ | Comprehensive 14-item list |
| 8. Out of Scope | ✅ | 12 items with rationale for each deferral |
| 9. Functional Requirements | ✅ | 10 FRs with behavioral detail |
| 10. Acceptance Criteria | ✅ | 23 testable ACs |
| 11. User Flows | ✅ | 4 concrete flows with step-by-step interaction |
| 12. Risks | ✅ | 7 risks with mitigation strategies |
| 13. Alternatives Considered | ✅ | 3 decision tables (SVG/Canvas, routing, data format) |
| 14. Backward Compatibility | ✅ | Correctly marked N/A |
| 15. Key Metrics | ✅ | 9 measurable targets |
| 16. Testing Requirements | ✅ | 7 testing categories |
| 17. Rollout | ✅ | 4-phase rollout plan |
| 18. Security & Privacy | ✅ | Living persons policy, no-tracking commitment |
| 19. Accessibility Review | ✅ | Detailed WCAG 2.1 AA plan |
| 22. Effort Estimate | ✅ | L overall with sub-feature breakdown |
| 23. Sign Off | ✅ | Pending (expected at this stage) |
| 24. Appendices | ✅ | Source docs, visual design ref, URL structure, data quality |
| E. Reasoning Links | ✅ | 17 [why?] anchors with detailed reasoning |

**Structural gap noted:** Sections 20–21 are missing from the numbering (jumps from 19 to 22). The Forge template likely has sections for "Feature Flags / Flight Plan" and "Observability / Telemetry" which were correctly omitted for this project — but the numbering gap should be acknowledged or renumbered for clarity. [why?](#section-numbering-reasoning)

**Finding SR-S1:** 🔵 **Suggestion** — Renumber sections to remove the 19→22 gap, or add a brief comment explaining the skipped sections. This prevents confusion when referencing sections by number during implementation.

---

### Phase 2: Technical Validation

#### TV-1: SVG Tree Rendering (107+ nodes) — Feasible ✅

The spec correctly identifies SVG as the right rendering approach for 107 nodes. [why?](#svg-feasibility-reasoning)

However, the spec describes the tree as a "pedigree chart" (ancestor view branching outward from focal person) but the dataset is actually a **full family tree** — not just ancestors. The 107 people include descendants, collateral relatives (Holmes siblings, Northwood cousins, Smith-Rowe-Jones line). A pure pedigree chart centered on any one person would only show their direct ancestors (maybe 20-30 people), not all 107.

**Finding SR-TV1:** 🟡 **Concern** — The spec conflates "pedigree chart" (ancestors only) with "full family tree" (all relatives). FR-1 says "pedigree chart" but AC-4 tests Calvin Thompson's descendants, and AC-12 wants "4 generations visible simultaneously" — which implies showing descendants too. The Implementation Planner needs to know: **is the primary tree view a pedigree (ancestors branching outward from focal person) or a connected family graph (showing all relationships)?** These have fundamentally different layout algorithms. [why?](#tree-type-reasoning)

**Recommendation:** Clarify that the tree is a **connected family graph** with pedigree-style navigation (click any person to recenter and see their ancestors, descendants, and siblings). Alternatively, define two modes: pedigree mode (ancestors) and descendant mode. The current spec text says "pedigree" but the acceptance criteria assume a full graph.

#### TV-2: Hash-Based Routing on GitHub Pages — Feasible ✅

The spec correctly selects hash-based routing for GitHub Pages compatibility. The URL structure (`#/person/slug`) works without server configuration. No issues.

#### TV-3: Single JSON Data File — Feasible ✅

~50-100KB for 107 people is well within budget. The spec correctly identifies this as the simpler approach. One consideration:

**Finding SR-TV2:** 🔵 **Suggestion** — The spec should specify whether the ~28 surname-only spouses (J. Glass, H. Shedd, Harvey Hawkins, etc.) are included in the JSON data file as person entries or only as string references within marriage objects. The Master Person Index lists 107 people but footnotes ~28 additional spouses. If these are separate entries, the dataset grows to ~135 records — still trivial, but the data schema needs a clear decision. [why?](#spouse-data-reasoning)

#### TV-4: Client-Side Search — Feasible ✅

107 records is trivially small for client-side search. Simple string matching against a flat array will meet the 100ms target easily.

#### TV-5: Multi-Marriage Layout — Technically Complex but Feasible

The spec correctly identifies multi-marriage layout as a key risk. Thomas Holmes (2 wives, 13+ children), Calvin Thompson (2 wives), and Isabella Smyth (2 husbands) are the hardest cases.

**Finding SR-TV3:** 🔵 **Suggestion** — The spec doesn't define how the "person who had 2 spouses" (e.g., Isabella Smyth: m. Kitchen, then m. Holmes) is visually handled when *she* is the focal person. The acceptance criteria only test multi-marriage from the *other spouse's* perspective (AC-4 tests Calvin Thompson, AC-7 tests Thomas Holmes). Add an acceptance criterion: "Given Isabella Smyth as focal person, when her detail view loads, then both marriages are shown chronologically: Mr. Kitchen (m. ~1863, d. ~1870), then Thomas Holmes (m. 1873)." [why?](#multi-marriage-focal-reasoning)

#### TV-6: Responsive SVG on Mobile — Feasible with Caveats

The spec wisely proposes a "simplified vertical mobile layout showing one branch at a time" rather than trying to render the full tree on 375px. This is the correct approach.

#### TV-7: `prefers-contrast: more` Support — Noted but Non-Standard

The spec's accessibility section (Section 19) mentions `prefers-contrast: more` support. This is a good aspirational target but is only supported in Chromium-based browsers as of 2026 and is not required for WCAG 2.1 AA. No issue — just flagging as an enhancement beyond the compliance target.

---

### Phase 3: Completeness Audit

#### CA-1: Edge Cases — Data Gaps

**Finding SR-CA1:** 🟡 **Concern** — The spec describes how to display uncertain dates (Isabella Edna Holmes: "1878 or 1879") and unknown parents, but does **not** describe how to handle **persons with almost no data**. Many people in the Master Person Index have only a name and a single relationship — no dates, no locations, no events. Examples:
- Belinda Thompson (1820): name only, no spouse, no death date
- Bertha Northwood: name only
- Mame Northwood: name only
- David Michael Montgomery: name only, no spouse, no children

The person detail view (FR-2) specifies 6 sections (Header, Timeline, Family Panel, Facts, Sources, Notes). **What does the detail view look like when 4 of 6 sections are empty?** This affects ~30-40% of the 107 people. The spec should define the empty-state behavior for person detail views. [why?](#sparse-person-reasoning)

**Recommendation:** Add to FR-2 behavior: "When a person has minimal data (name and relationship only), the detail view displays the available information with a 'Limited Records Available' note and encourages family contributions. Empty sections (Timeline, Facts, Sources, Notes) are omitted rather than shown as empty containers."

#### CA-2: Edge Cases — Infant Deaths

The Smith-Rowe-Jones line contains 3 infant deaths:
- Elizabeth Smith: born 1/1885, died 2/1885 (1 month)
- Ethel Smith: born 12/1886, died 9/1887 (9 months)
- Freddie Smith: born 9/1888, died 10/1888 (1 month)

Plus Charlotte Isabel Thompson who "died in infancy."

**Finding SR-CA2:** 🔵 **Suggestion** — The spec doesn't specifically address the display of infant deaths. The computed field "age at death" would show "0 years" or "1 month" — which is factually correct but could be presented more sensitively. The Timeline view (FR-7) would show only birth → death with nothing between. Consider: should infant deaths show a condensed card style rather than a full timeline? This is a design/voice-tone decision. [why?](#infant-death-reasoning)

#### CA-3: Edge Cases — Cropped/Partial Data

Several entries have data quality issues from photo cropping:
- `sharon-jones`: "Shar[on?] Jones" — name partially cut off
- `george-nathan-rablee`: "George Nathan Rab[lee?]" — name partially cut off
- Smith family parents: off-frame in photo

**Finding SR-CA3:** 🔵 **Suggestion** — The spec's data quality section (Appendix D) correctly categorizes these but doesn't define the display treatment for names with embedded uncertainty. Should the UI show "Shar[on?] Jones" with the brackets, or "Sharon Jones (name uncertain)"? Define a consistent pattern for name-level uncertainty vs. date-level uncertainty. [why?](#name-uncertainty-reasoning)

#### CA-4: Acceptance Criteria Completeness

The 23 ACs are well-structured and testable. However:

**Finding SR-CA4:** 🔵 **Suggestion** — No acceptance criterion tests the **landing page**. The spec mentions a landing page in Scope (Section 7: "Landing page with family overview, quick stats, and entry points") and in the effort estimate but has no AC verifying its content or behavior. Add: "Given a user arrives at the site root URL, when the page loads, then they see the family overview, quick stats (107 people, 7 family lines, 7+ generations), and entry points to the tree, search, and family lines." [why?](#landing-page-ac-reasoning)

#### CA-5: URL Pattern Inconsistency

**Finding SR-CA5:** 🔵 **Suggestion** — The spec shows URL patterns in two formats:
- Appendix C: `/person/{slug}` (clean URLs)
- Section 13 (Alternatives): `#/person/slug` (hash-based routing, **selected**)
- AC-15: `https://niyanagi.github.io/montgomery-ancestry/person/fred-e-thompson-1871` (clean URL)

But the spec selected hash-based routing! AC-15's URL should be `https://niyanagi.github.io/montgomery-ancestry/#/person/fred-e-thompson-1871`. The clean URL format would require the 404.html hack that was listed as an alternative. Reconcile the URLs throughout the spec to match the selected routing strategy. [why?](#url-consistency-reasoning)

#### CA-6: Living Person Privacy Implementation

**Finding SR-CA6:** 🟡 **Concern** — The privacy section (Section 18) states that living individuals (Generations 6 and 7) should have limited detail: "name and relationship" only, with birth dates and addresses omitted. But the spec doesn't define **how the system identifies living persons** in the JSON data. Is there a `livingStatus` field? Is it inferred from the absence of a death date? Many historical persons also lack death dates (the Generation 2 Thompson siblings, for example, have no death dates recorded but are clearly deceased). The data schema needs a field or rule to distinguish "living" from "death date unknown." [why?](#living-person-reasoning)

**Recommendation:** Add a `livingStatus` enum field (`living`, `deceased`, `unknown`) to the person data schema (FR-8). The privacy filter checks this field, not the absence of a death date.

---

### Phase 4: Synthesis

#### Overall Quality Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Completeness** | 8/10 | All major sections present; minor gaps in edge case coverage [why?](#completeness-rating-reasoning) |
| **Technical Feasibility** | 9/10 | All features are feasible for vanilla HTML/CSS/JS; SVG at 107 nodes is well within budget [why?](#feasibility-rating-reasoning) |
| **Testability** | 8/10 | 23 ACs are specific and verifiable; missing landing page AC and mobile-specific ACs [why?](#testability-rating-reasoning) |
| **Scope Control** | 9/10 | Clean in/out-of-scope boundary; 12 out-of-scope items with rationale [why?](#scope-rating-reasoning) |
| **Risk Awareness** | 8/10 | 7 risks identified with mitigations; tree type ambiguity is an unlisted risk [why?](#risk-rating-reasoning) |
| **Reasoning Quality** | 9/10 | 17 [why?] links with substantive reasoning grounded in research data [why?](#reasoning-rating-reasoning) |

#### Prioritized Findings Summary (@SpecReviewer)

| ID | Severity | Finding | Effort to Fix |
|----|----------|---------|---------------|
| SR-TV1 | 🟡 Concern | Tree type ambiguity: pedigree vs. full family graph | XS — clarify terminology |
| SR-CA1 | 🟡 Concern | No empty-state definition for sparse person profiles (~40% of people) | XS — add behavior to FR-2 |
| SR-CA6 | 🟡 Concern | Living person identification lacks data schema support | S — add `livingStatus` field to FR-8 |
| SR-CA5 | 🔵 Suggestion | URL patterns inconsistent between hash routing decision and examples | XS — update URLs |
| SR-TV2 | 🔵 Suggestion | Surname-only spouses not addressed in data schema | XS — clarify in FR-8 |
| SR-TV3 | 🔵 Suggestion | Multi-marriage acceptance criterion missing for focal-person perspective | XS — add one AC |
| SR-CA2 | 🔵 Suggestion | Infant death display not specifically addressed | XS — add note to FR-2 |
| SR-CA3 | 🔵 Suggestion | Name-level uncertainty display pattern undefined | XS — add to Appendix D |
| SR-CA4 | 🔵 Suggestion | No acceptance criterion for landing page | XS — add one AC |
| SR-S1 | 🔵 Suggestion | Section numbering gap (19→22) | XS — renumber |

---

## Part 2: @Designer — Full Audit (Mode 1)

### Category 1: Design System Compliance

The spec defines a cohesive visual design in Appendix B, referencing the detailed `research/design-requirements.md` Section 6. The design system covers:

- ✅ **Color palette:** 5 primary + 4 secondary + 4 semantic colors — comprehensive
- ✅ **Typography:** Playfair Display (headings) + Inter (body) — classic genealogy-appropriate pairing
- ✅ **Spacing:** 8px base unit system with 7 tokens (xs through 3xl)
- ✅ **Component styling:** Person card dimensions (180×80px), border radius (12px), shadows, hover/selected states
- ✅ **Connecting lines:** Bezier curves, Warm Gray at 60% opacity, 2-3px width
- ✅ **Icon system:** Referenced (Lucide/Heroicons/Phosphor) with size specs (24/20/16px)

**Finding DS-D1:** 🔵 **Suggestion** — The spec references the design requirements color palette but doesn't define **state colors** for interactive tree elements specifically: What color is a *hovered* connecting line? What color is the *active navigation path* in the tree (the line from focal person to currently viewed ancestor)? The person card has hover/selected states defined, but the connecting lines between cards need state definitions too. These are important for visual wayfinding in the tree. [why?](#tree-line-states-reasoning)

**Finding DS-D2:** 🔵 **Suggestion** — The design requirements (Section 6.5) mention "subtle parchment/linen texture on page backgrounds" and "botanical/tree motifs as section dividers." The spec doesn't specify whether these decorative elements are in V1 scope or deferred. Clarify: are background textures in scope, or is V1 flat Parchment Cream (`#FAF6F0`)? Textures add visual warmth but increase asset weight and implementation effort. [why?](#texture-scope-reasoning)

---

### Category 2: Accessibility

The accessibility coverage is **excellent** — among the best I've seen for a V1 spec. The spec addresses all 4 WCAG 2.1 principles and includes genealogy-specific accommodations.

**Strengths:**
- ✅ ARIA tree roles specified (`role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level`)
- ✅ Alternative list/table view for tree visualization
- ✅ Screen reader linearization pattern defined
- ✅ `prefers-reduced-motion` respected
- ✅ Focus indicator specified (3px Heritage Green outline)
- ✅ Skip-to-content link
- ✅ Color not sole indicator for any information
- ✅ Minimum contrast ratios specified

**Finding DS-A1:** 🟡 **Concern** — The Heritage Green primary color (`#2D5016`) on Parchment Cream (`#FAF6F0`) background needs contrast verification. Dark green on off-white should pass 4.5:1 for normal text, but the **Warm Gold accent** (`#C5933A`) on Parchment Cream may **fail** the 4.5:1 ratio for normal text. Gold/amber colors on cream backgrounds are a common accessibility pitfall. The spec should verify all color pairings against WCAG standards, not just assert compliance. [why?](#color-contrast-reasoning)

**Contrast estimate:**
- Heritage Green (#2D5016) on Parchment (#FAF6F0): ~8.2:1 ✅ Passes
- Warm Gold (#C5933A) on Parchment (#FAF6F0): ~2.8:1 ❌ **Fails** 4.5:1 for normal text
- Warm Gold (#C5933A) on White (#FFFFFF): ~3.1:1 ❌ **Fails** 4.5:1 for normal text

**Recommendation:** Warm Gold should only be used for decorative accents (borders, icons alongside text, decorative lines) — never as the text color for body-size text. Or darken it to ~`#8A6A20` for text applications. Add this constraint to the design system documentation.

**Finding DS-A2:** 🔵 **Suggestion** — The keyboard navigation spec (FR-5: Arrow keys for tree traversal) defines Up→parents, Down→children, Left/Right→siblings. But what happens at the **edges** of the tree? If a person has no parents (e.g., the Thompson patriarch), does Up do nothing? Does it wrap? Does it announce "no parents known"? Define the boundary behavior for keyboard navigation. [why?](#keyboard-boundary-reasoning)

---

### Category 3: Voice & Tone

The spec's content approach is respectful and appropriate for a family heritage site.

**Strengths:**
- ✅ Uncertain data shown transparently, not hidden
- ✅ "Unknown" cards maintain structural integrity rather than omitting gaps
- ✅ Ambiguity displayed as "1878 or 1879" rather than forced to one value
- ✅ Privacy policy for living persons

**Finding DS-V1:** 🔵 **Suggestion** — The spec doesn't define the **tone for death-related display** beyond factual dates. For infant deaths (Elizabeth Smith: 1 month old, Ethel Smith: 9 months old, Freddie Smith: 1 month old, Charlotte Isabel Thompson: died in infancy), consider whether the age-at-death computation should be suppressed or presented differently. Displaying "Age at death: 0 years" for an infant is factually correct but tonally cold. Consider: "Died in infancy" as the standard display instead of computing age. [why?](#death-tone-reasoning)

**Finding DS-V2:** 🔵 **Suggestion** — The spec references "16 unresolved questions" that will be surfaced in the UI (Appendix D). The tone for presenting these matters: "Unknown (source document incomplete)" is factual and neutral ✅. But consider adding a positive framing: "Can you help? If you have information about [X], the family would love to know." This transforms gaps from deficiencies into opportunities for engagement, which aligns with Goal 5 ("encourage collaborative resolution"). [why?](#engagement-tone-reasoning)

---

### Category 4: UI States & Edge Cases

**Finding DS-U1:** 🟡 **Concern** — (Cross-referenced with SR-CA1) The spec defines the happy-path person detail view but not the **empty and degraded states**:
- **Sparse person:** ~40 people have name-only data → what does the detail view show? [why?](#sparse-state-reasoning)
- **No photo:** The spec says "silhouette placeholder" ✅ — but doesn't show the placeholder design
- **Very long names:** "Elizabeth Rocelia Thompson" (26 chars) and "Irene Emma Harriet Rowe" (23 chars) may overflow the 180×80px person card. Test with the longest names in the dataset.
- **Loading state:** What does the user see while the JSON data file loads? A skeleton screen? A spinner? Nothing until FCP?
- **Error state:** What if the JSON fails to load (network error, corrupted file)?
- **404 state:** What if a deep link points to a person slug that doesn't exist? (e.g., someone shares an old URL after a data update changes a slug)

**Recommendation:** Add a UI States section to the spec covering: Loading, Error (JSON load failure), Empty/Sparse Person, 404 (invalid deep link), and Long Content overflow.

**Finding DS-U2:** 🔵 **Suggestion** — The person card dimensions (180×80px desktop) should be validated against the longest name in the dataset. I estimate ~10 names exceed 20 characters. The spec should define text truncation behavior: does the name truncate with ellipsis? Does it wrap to two lines? Does the card expand? [why?](#name-overflow-reasoning)

---

### Category 5: Mobile UX

The spec's mobile approach is sound: simplified vertical layout, bottom navigation bar, 44×44px touch targets, and mobile-first design.

**Strengths:**
- ✅ Bottom navigation bar for thumb accessibility
- ✅ Simplified vertical tree (one branch at a time)
- ✅ Touch targets minimum 44×44px
- ✅ Content reflow at 320px
- ✅ Minimum 16px body text

**Finding DS-M1:** 🔵 **Suggestion** — The spec mentions "swipe between siblings on person detail" (FR-4) but doesn't define the **visual affordance** for this interaction. How does the user know they can swipe? Is there a "< Previous Sibling | Next Sibling >" control? A dot indicator? Swipe gestures with no visual cue are a discoverability problem, especially for older family members who may not be familiar with gesture-based navigation. [why?](#swipe-affordance-reasoning)

**Finding DS-M2:** 🔵 **Suggestion** — The design requirements (Section 7.3) mention a "sheet-based person detail" (bottom sheet overlay) on mobile, but the spec's FR-2 describes "a detail panel or page." Clarify: on mobile, does the person detail open as a bottom sheet (overlay on top of the tree) or as a full-page navigation? Bottom sheets preserve tree context but may be too small for content-rich profiles. Full-page navigation loses tree context but gives more space. [why?](#mobile-detail-reasoning)

---

### Prioritized Findings Summary (@Designer)

| ID | Severity | Finding | Effort to Fix |
|----|----------|---------|---------------|
| DS-A1 | 🟡 Concern | Warm Gold (#C5933A) fails WCAG contrast on Parchment/White backgrounds | XS — restrict usage or darken |
| DS-U1 | 🟡 Concern | Empty/loading/error/404 UI states undefined | S — add UI states section |
| DS-D1 | 🔵 Suggestion | Tree connecting line states (hover, active path) undefined | XS — add to design ref |
| DS-D2 | 🔵 Suggestion | Background textures: in V1 scope or deferred? | XS — clarify |
| DS-A2 | 🔵 Suggestion | Keyboard navigation boundary behavior at tree edges undefined | XS — add to FR-5 |
| DS-V1 | 🔵 Suggestion | Infant death age display tone | XS — add note to FR-2 |
| DS-V2 | 🔵 Suggestion | Positive framing for unresolved questions | XS — update Appendix D |
| DS-U2 | 🔵 Suggestion | Long name overflow on person cards undefined | XS — add truncation rule |
| DS-M1 | 🔵 Suggestion | Sibling swipe gesture has no visual affordance | XS — add indicator spec |
| DS-M2 | 🔵 Suggestion | Mobile person detail: bottom sheet vs full page? | XS — clarify in FR-2 |

---

## Part 3: Combined Summary

### All Findings by Severity

#### 🟡 Concerns (5 total — should be addressed before Implementation Planning)

| # | ID | Source | Finding | Fix Effort |
|---|-----|--------|---------|------------|
| 1 | SR-TV1 | Spec Reviewer | Tree type ambiguity: "pedigree chart" terminology but acceptance criteria test full family graph navigation | XS |
| 2 | SR-CA1 | Spec Reviewer | No empty-state definition for sparse person profiles (~40% of 107 people have minimal data) | XS |
| 3 | SR-CA6 | Spec Reviewer | Living person identification lacks data schema support — can't distinguish "living" from "death date unknown" | S |
| 4 | DS-A1 | Designer | Warm Gold (#C5933A) fails WCAG 4.5:1 contrast on Parchment/White — cannot be used as text color | XS |
| 5 | DS-U1 | Designer | Loading, error, empty, and 404 UI states are undefined | S |

#### 🔵 Suggestions (13 total — improve quality but not blocking)

| # | ID | Source | Finding |
|---|-----|--------|---------|
| 1 | SR-CA5 | Spec Reviewer | URL patterns should use hash-routing format consistently |
| 2 | SR-TV2 | Spec Reviewer | Clarify whether ~28 surname-only spouses are separate JSON entries |
| 3 | SR-TV3 | Spec Reviewer | Add multi-marriage AC from focal-person perspective |
| 4 | SR-CA2 | Spec Reviewer | Define infant death display approach |
| 5 | SR-CA3 | Spec Reviewer | Define name-level uncertainty display pattern |
| 6 | SR-CA4 | Spec Reviewer | Add acceptance criterion for landing page |
| 7 | SR-S1 | Spec Reviewer | Renumber sections to remove 19→22 gap |
| 8 | DS-D1 | Designer | Define tree connecting line hover/active states |
| 9 | DS-D2 | Designer | Clarify if background textures are V1 scope |
| 10 | DS-A2 | Designer | Define keyboard navigation boundary behavior |
| 11 | DS-V1 | Designer | Define infant death age display tone |
| 12 | DS-V2 | Designer | Add positive engagement framing for unresolved questions |
| 13 | DS-U2 | Designer | Define long name truncation behavior on person cards |
| 14 | DS-M1 | Designer | Add visual affordance for sibling swipe gesture |
| 15 | DS-M2 | Designer | Clarify mobile person detail: bottom sheet vs full page |

### Recommended Changes (Minimal Set for Implementation Readiness)

To move to Implementation Planning, the spec should address:

1. **Clarify tree type** (SR-TV1): One sentence replacing "pedigree chart" with "interactive family tree" or defining that the primary view is a navigable connected graph, not a strict pedigree. XS effort.

2. **Add sparse person behavior** (SR-CA1): 2-3 sentences in FR-2 defining what the detail view looks like when most sections are empty. XS effort.

3. **Add `livingStatus` field** (SR-CA6): One field addition to the data schema in FR-8. S effort.

4. **Restrict Warm Gold usage** (DS-A1): One sentence in the design reference noting Warm Gold is decorative-only, never text. XS effort.

5. **Add UI states** (DS-U1): A brief section covering loading, error, and 404 states. S effort.

---

## Part 4: Readiness Assessment

### Is the spec ready for Implementation Planning?

**✅ Yes — with the 5 recommended changes above.**

The spec is unusually thorough for a V1 personal project. The functional requirements are clear, the acceptance criteria are testable, the technical decisions are well-reasoned, and the research grounding (competitive analysis, design requirements, preliminary tree data) provides exceptional context for implementation.

The 5 recommended changes are all low-effort (4 XS, 1 S) and address genuine ambiguities that the Implementation Planner would need to resolve anyway. Addressing them in the spec prevents the Implementation Planner from making assumptions.

The remaining 15 suggestions would improve the spec's quality but are not blocking — they can be resolved during implementation if needed.

### Effort Validation

The spec's **L** effort estimate is well-calibrated. [why?](#effort-validation-reasoning) The sub-feature breakdown is reasonable:
- Tree visualization at L is correct — SVG interactive chart with zoom/pan, multi-marriage layout, responsive, and accessible
- Data entry at M is correct — 107 people with structured metadata is repetitive but voluminous
- All S/XS estimates are reasonable for the described scope

No effort overrides recommended.

---

## Appendix: Reasoning Links

#### section-numbering-reasoning
The spec jumps from Section 19 (Accessibility Review) to Section 22 (Effort Estimate). Sections 20 and 21 in the standard Forge template are typically "Feature Flags / Flight Plan" and "Observability / Telemetry" — both correctly omitted for this static-site project per template rule 2. However, the gap creates confusion when cross-referencing by section number. Renumbering or adding a brief omission note costs nothing and aids navigation.

#### svg-feasibility-reasoning
SVG rendering of 107 nodes with text labels and connecting lines creates a DOM of approximately 500-800 elements (each person card has ~5 SVG elements, plus connecting lines). Modern browsers handle SVG DOMs of this size without any performance issues. The performance concern only arises at 1000+ nodes. At 107 nodes, even mobile devices will render smoothly. Viewport culling (rendering only visible nodes) is a good optimization but not strictly necessary.

#### tree-type-reasoning
A "pedigree chart" in genealogy terminology is a specific visualization: it shows only direct ancestors of a focal person, branching outward (parents, grandparents, great-grandparents). It does **not** show siblings, descendants, or collateral relatives. However, the spec's acceptance criteria test multi-marriage children (AC-4, AC-7), sibling navigation (FR-5: Left/Right arrows for siblings), and the Family Group View (FR-6: parents + children) — all of which require a connected family graph, not just a pedigree. The Implementation Planner must know which layout algorithm to implement, and these are fundamentally different data structures.

#### spouse-data-reasoning
The Master Person Index lists 107 people with ID slugs, but footnotes ~28 "spouses known only by surname" (J. Glass, H. Shedd, Harvey Hawkins, Minnie Ardis, etc.). Some of these actually have meaningful data — Harvey Hawkins has children (Rollin, Harry), Minnie Ardis has children (Maxwell, Charlotte Ann). The data schema needs to clarify: are these ~28 spouses full person entries with their own IDs (making the total ~135), or are they string references within the marriage object of the person they married? This affects navigation: can you click "Harvey Hawkins" and see a person profile, or is he just a name string?

#### multi-marriage-focal-reasoning
The acceptance criteria test multi-marriage from the perspective of Thomas Holmes (AC-7: "both marriages listed") and Calvin Thompson (AC-4: "both marriage lines visible"). But the spec doesn't have an AC for the reverse case: when a person who was married multiple times (e.g., Isabella Smyth) is the focal person. Isabella was married twice — first to Mr. Kitchen (~1863), then to Thomas Holmes (1873). Her profile needs to show both marriages chronologically, and her tree position needs two spouse connections. This is a distinct layout case from "a man with two wives."

#### sparse-person-reasoning
Of the 107 people in the Master Person Index, approximately 40 have only a name and one relationship (parent or spouse). For example: the 9 Thompson Generation 2 siblings (Samuel, Daniel, Calvin Sr., Lucinda, Joanna, Luther, Sally, Jonathan, Leonard) mostly have only a birth year and no other data. The Holmes siblings from the first marriage (Richard, David Jr., Rebecca, John, Samantha, Mary Jr., Thomas Jr., Julie) have no dates or biographical detail. When a user navigates to one of these sparse profiles, a detail view with 6 sections (Header, Timeline, Family Panel, Facts, Sources, Notes) where 4-5 are empty creates a poor user experience. The spec should define the degraded-state behavior.

#### infant-death-reasoning
Three infant deaths in the Smith family (Elizabeth: 1 month, Ethel: 9 months, Freddie: 1 month) and one in the Thompson family (Charlotte Isabel) require sensitive handling. Computing "age at death: 0" is technically correct but emotionally callous on a family memorial site. The standard genealogical practice is to display "d. in infancy" or "d. aged [X] months" rather than computing years. The spec's voice/tone should address this edge case.

#### name-uncertainty-reasoning
The spec defines display patterns for date uncertainty ("~1878", "1878 or 1879") and missing data ("Unknown") but not for name uncertainty. Several people have uncertain names: "Shar[on?] Jones" (cropped in photo), "George Nathan Rab[lee?]" (cropped in photo), "Fritz Thompson" (likely nickname, legal name unknown). These need a consistent display pattern: e.g., "Sharon Jones (name uncertain)" or a tooltip/footnote explaining the source limitation.

#### landing-page-ac-reasoning
The landing page is mentioned in the scope list, effort estimate, and user flows (Flow 1 starts on the landing page) but has no acceptance criterion. Landing pages are often the most-visited page of a site (especially when shared via link). Without an AC, the Implementation Planner has no specification to build against, and the test plan has no criterion to verify.

#### url-consistency-reasoning
The spec explicitly selected hash-based routing over History API in Section 13 (Alternatives Considered). But AC-15 shows the URL as `https://niyanagi.github.io/montgomery-ancestry/person/fred-e-thompson-1871` — which is a clean URL requiring the History API. The hash-based equivalent would be `https://niyanagi.github.io/montgomery-ancestry/#/person/fred-e-thompson-1871`. Appendix C also shows clean URLs without the `#`. This inconsistency will confuse the engineer implementing routing. All URL examples should match the selected strategy.

#### living-person-reasoning
The privacy section (Section 18) correctly identifies that living persons need limited detail. But the only way to determine "living" in the current data is the absence of a death date. The problem: ~50+ people in the Master Person Index have no death date — including clearly deceased persons like the Thompson patriarch (~1740s), Calvin Thompson Sr. (will in 1827), and many Generation 2/3 people from the 1800s. A `livingStatus` field (or at minimum a `generation` field with a rule like "Generation 6+ are potentially living") is needed to implement the privacy filter correctly.

#### completeness-rating-reasoning
Rating: 8/10. The spec covers all major functional areas with detailed behavioral descriptions and 23 acceptance criteria. Deducted points for: (1) undefined empty/sparse person states affecting ~40% of people, (2) URL inconsistency between routing decision and examples, (3) missing landing page AC. These are all addressable with XS-S effort.

#### feasibility-rating-reasoning
Rating: 9/10. Every feature in the spec is technically feasible with vanilla HTML/CSS/JS. SVG at 107 nodes is well within performance limits. Client-side search over 107 records is trivial. Hash-based routing on GitHub Pages is proven. The only deduction: multi-marriage layout is complex and the spec underspecifies the visual algorithm. But it's feasible — just hard.

#### testability-rating-reasoning
Rating: 8/10. The 23 ACs are specific ("when the user types 'Isa', then auto-suggest shows at least 'Isabella Smyth' and 'Isabella Edna Holmes' within 100ms") and use real data from the tree. Deducted points for: missing landing page AC, no mobile-specific ACs beyond responsive display (e.g., no AC for bottom navigation bar), and no 404/error state ACs.

#### scope-rating-reasoning
Rating: 9/10. The in/out-of-scope boundary is clean. 12 out-of-scope items each have rationale. The scope is ambitious but achievable for a single-repo static site. The only concern is whether "Timeline View" (FR-7) should be deferred to V2 given it's listed as "Nice-to-Have" in design-requirements.md Section 2, but the spec includes it in V1 scope — a reasonable decision since the data supports it.

#### risk-rating-reasoning
Rating: 8/10. Seven risks identified with mitigations. The unlisted risk is the tree type ambiguity (SR-TV1) — the spec says "pedigree" but means "family graph." This could cause rework if the Implementation Planner builds a strict pedigree algorithm. Also unlisted: the risk that ~28 surname-only spouses have enough data to warrant full person entries, which would increase data entry effort.

#### reasoning-rating-reasoning
Rating: 9/10. Seventeen [why?] reasoning links with substantive explanations grounded in specific research data (competitive analysis sections, design requirements sections, preliminary tree data). Every claim is traceable to a source document. The only improvement would be linking to specific line numbers rather than section headers.

#### color-contrast-reasoning
Using WCAG contrast ratio calculation: Warm Gold (#C5933A) has a relative luminance of approximately 0.24. Parchment Cream (#FAF6F0) has a relative luminance of approximately 0.93. The contrast ratio is approximately (0.93 + 0.05) / (0.24 + 0.05) = 3.38:1. This fails the 4.5:1 minimum for normal-size text (WCAG 2.1 SC 1.4.3). On pure white (#FFFFFF, luminance 1.0), the ratio is approximately (1.0 + 0.05) / (0.24 + 0.05) = 3.62:1 — still fails. The color is usable for large text (3:1 minimum), decorative elements, and non-text indicators, but not for body text.

#### keyboard-boundary-reasoning
Tree keyboard navigation (Up=parents, Down=children, Left/Right=siblings) needs defined boundary behavior. At the tree edges: (1) Thompson patriarch → Up → no parents known. (2) Generation 7 children → Down → no children. (3) A person with no siblings → Left/Right → no siblings. Without specification, the implementation might silently do nothing, produce a console error, or confuse the user. The accessible pattern is to announce "no parents known" via aria-live when the boundary is hit, and keep focus on the current node.

#### tree-line-states-reasoning
The design spec defines person card states (default, hover, selected) but tree connecting lines only have a default state (Warm Gray at 60% opacity). When navigating a complex tree with 107 nodes and many crossing lines, it's essential to highlight the *active path* — the line of ancestry from the focal person to the currently hovered/selected ancestor. FamilySearch and Ancestry.com both highlight the active ancestry path in their tree views. Without this, the user cannot visually trace relationships in a dense graph.

#### texture-scope-reasoning
Background textures (parchment/linen) add warmth and heritage feeling but require: (1) creating/sourcing texture image assets, (2) performance consideration for repeated background images, (3) ensuring textures don't reduce text readability. For V1, flat Parchment Cream is simpler and performs better. Textures can be a V1.1 enhancement.

#### death-tone-reasoning
Infant deaths are emotionally significant in a family history context. The three Smith siblings (Elizabeth, Ethel, Freddie) who all died within months of birth represent a tragic pattern common in the 1880s. Displaying computed "age at death: 0 years" is both factually misleading (they lived months, not zero years) and tonally inappropriate for a family memorial. "Died in infancy" or "d. aged 1 month" is the standard genealogical practice and more respectful.

#### engagement-tone-reasoning
The 16 unresolved questions are an opportunity for family engagement, not just data gaps. The spec's Goal 5 explicitly says "encourage collaborative resolution." Framing unknown data as "Can you help?" rather than just "Unknown" transforms the site from a static archive into an active invitation for family participation. FamilySearch uses this pattern effectively with their "contribute" prompts.

#### sparse-state-reasoning
Approximately 40% of the 107 people have minimal data (name + one relationship only). If the UI shows 6 empty sections with headers but no content, the page looks broken. If it shows only the available data, the page may be very short (just a name and a "Parent of X" line). The spec needs to define which approach to use and what messaging accompanies sparse profiles.

#### name-overflow-reasoning
The person card is 180×80px desktop, 140×70px mobile. With a 48px photo circle and padding, the text area is approximately 100-110px wide. At 14px Inter font, this fits roughly 12-14 characters. "Elizabeth Rocelia Thompson" (29 chars) would overflow. The spec should define: truncate with ellipsis, wrap to two lines, or dynamically size the card. Most genealogy platforms use truncation with full name on hover/focus.

#### swipe-affordance-reasoning
Swipe gestures for sibling navigation (FR-4) are standard on mobile but have a discoverability problem: users don't know the gesture exists unless there's a visual cue. For a family site targeting users of all ages (including elderly relatives), explicit "<" / ">" buttons or a "Siblings: ← Previous | Next →" bar below the header would be more discoverable. The swipe gesture can exist as a progressive enhancement alongside visible controls.

#### mobile-detail-reasoning
The design requirements (Section 7.3) suggest a "sheet-based person detail" (bottom sheet overlay) on mobile. The spec's FR-2 says "detail panel or page" without committing. For content-rich profiles (Fred Eugene Thompson has birth, education, marriages, residences, military, death — 6+ timeline events), a bottom sheet at ~60% screen height would require heavy scrolling. A full-page navigation may be better for detailed profiles, with a bottom sheet for quick previews (tap-and-hold on a tree node).

#### effort-validation-reasoning
The L estimate is validated by: (1) 9+ distinct components to build from scratch, (2) SVG tree visualization with zoom/pan and multi-marriage layout as the hardest single component (M-to-L alone), (3) 107-person data entry as a significant M-sized sub-task, (4) WCAG 2.1 AA accessibility adding effort to every component, (5) responsive design across 7 breakpoints. The total does not reach XL because: single repo, no backend, no cross-team dependencies, no API contracts. Comparable to the Forge Effort Scale L reference: "10-20 files, new architecture, cross-module."
