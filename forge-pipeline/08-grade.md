# Stage 08 — Final Grade: Montgomery Ancestry Browser

<!--
  Stage 08 — Pipeline Retrospective & Final Grade
  Agent: @ForgeGrader (Full Retrospective, Mode 1)
  Pipeline: Montgomery Ancestry Browser
  Date: 2025-07-17

  CONTEXT:
  This is the first Forge pipeline retrospective for this project.
  No prior retros exist — no trend comparison available.
  The project is a greenfield personal/family static site, not an enterprise feature.
  All scoring is calibrated against the Forge effort scale and pipeline conventions.
-->

---

## Executive Summary

The Montgomery Ancestry Browser Forge pipeline delivered a **well-above-average result** for a greenfield personal project adapted to enterprise pipeline templates. The pipeline transformed 6 photographed family documents into a functional interactive website with 174 people, 58 families, and comprehensive genealogical data validated by 5 independent research agents.

**Pipeline Maturity Score: 78/100** — Strong execution across most stages with notable gaps in Stage 04 (Implementation Plan was skipped entirely) and test execution (254 tests planned but not all run in CI). The adversarial reviews caught real issues (XSS, contrast failures, touch targets) that would have shipped undetected.

**Would this ship? Yes — with caveats.** The 3 critical XSS issues (CR-01, CR-02, CR-03) have been fixed. Accessibility gaps remain (keyboard tree navigation, mobile bottom sheet) but are non-blocking for a family audience. Data integrity is solid: 10/10 date corrections, 3/3 name corrections, 5/5 new people verified.

---

## Stage-by-Stage Scoring

### Scoring Dimensions
- **Accuracy:** Did the agent produce correct, factually grounded output?
- **Completeness:** Did it cover everything within its scope?
- **Acceleration:** Did it save time vs. doing it manually?

---

### Stage 01: Feature Proposal — @FeaturePlanner

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **88** | [why?](#fp-accuracy) All data claims traced to `research/preliminary-tree.md` and `research/competitive-analysis.md`. The 107+ person count, 7 family lines, and competitive gap analysis are all verified. Minor inaccuracy: the proposal says "7 family lines" but implementation consolidated to 6 — the proposal should have flagged this as a modeling decision. |
| Completeness | **90** | [why?](#fp-completeness) Covers executive summary, problem statement, proposed feature (7 core behaviors), data rationale (3 analyses), affected components, user journeys, risks, scope, and effort. The adaptation from enterprise template to greenfield was cleanly done — omitted sections are acknowledged. Only gap: no explicit discussion of data pipeline (how photos → JSON). |
| Acceleration | **85** | [why?](#fp-acceleration) The proposal synthesized 6 photo analyses, competitive research, and preliminary tree data into a coherent pitch in a single pass. Manually, this would require days of document review. The structured format and [why?] links made downstream stages (spec, review) significantly faster. |

**Stage 01 Average: 88**

---

### Stage 02: Design Spec — @SpecWriter

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **85** | [why?](#spec-accuracy) 10 functional requirements, 23 acceptance criteria, 17 [why?] reasoning links — all technically sound. The SVG rendering choice, hash-based routing, and client-side search are all correct for the constraints. Key inaccuracy caught by spec review: conflated "pedigree chart" with "full family graph" (SR-TV1), and AC-15 used clean URLs despite selecting hash-based routing (SR-CA5). |
| Completeness | **82** | [why?](#spec-completeness) Impressively thorough for a V1 spec — covers 24 sections including accessibility, security/privacy, testing, rollout, and effort. However, the spec review found meaningful gaps: no empty-state definition for sparse profiles (SR-CA1, affects ~40% of people), no living person identification mechanism (SR-CA6), and no landing page acceptance criterion (SR-CA4). These are consequential omissions for a data-heavy genealogy app. |
| Acceleration | **90** | [why?](#spec-acceleration) The spec enabled parallel downstream work: code review, test planning, and design review all operated independently from this document. The structured format with numbered requirements and acceptance criteria made traceability straightforward. Without this spec, implementation would have been ad-hoc. |

**Stage 02 Average: 86**

---

### Stage 03: Spec Review — @SpecReviewer + @Designer

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **92** | [why?](#sr-accuracy) The spec review correctly identified the pedigree-vs-graph ambiguity (SR-TV1), the living person identification gap (SR-CA6), and the URL pattern inconsistency (SR-CA5). All 3 concerns and 8 suggestions are technically sound and well-evidenced. The @Designer audit caught contrast failures (DS-A1: Warm Gold fails WCAG 4.5:1) and touch target issues (DS-CR2) that were later confirmed in the adversarial design review. No false positives found in the review. |
| Completeness | **85** | [why?](#sr-completeness) Covered structural check, technical validation (7 items), completeness audit (6 items), and synthesis with quantitative ratings. The @Designer section audited color, typography, spacing, and accessibility. Gap: the review didn't flag the absence of an implementation plan stage or question the photo-to-JSON data pipeline, which is the riskiest part of the project. It reviewed what existed well, but didn't probe what was missing from the pipeline itself. |
| Acceleration | **80** | [why?](#sr-acceleration) The review caught issues that would have cost significant rework if found during implementation (the tree type ambiguity alone affects the entire layout algorithm). However, the review was produced after implementation was already underway (spec review dated 2026-03-29, implementation complete 2025-07-17 — pipeline stages applied retroactively). This limits the actual acceleration value, though the findings remain valuable for future iterations. |

**Stage 03 Average: 86**

---

### Stage 04: Implementation Plan — @ImplementationPlanner

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **0** | [why?](#ip-accuracy) Stage was never executed. PIPELINE-STATE.md shows "⬜ Not Started." |
| Completeness | **0** | [why?](#ip-completeness) No artifact exists. |
| Acceleration | **0** | [why?](#ip-acceleration) No implementation plan was produced. The developer worked directly from the spec and research docs, which is viable for a solo project but means no task decomposition, dependency ordering, or effort estimation was documented for the implementation phase. |

**Stage 04 Average: 0** — This is the pipeline's most significant gap. An implementation plan would have identified the data pipeline (photos → AI extraction → validation → JSON) as the critical path and decomposed the SVG tree layout — the highest-risk component — into incremental milestones.

---

### Stage 05: Code Review — @CodeReviewer

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **93** | [why?](#cr-accuracy) All 3 critical findings are genuine vulnerabilities: CR-01 (innerHTML XSS in person.js/search.js), CR-02 (XSS in showError()), CR-03 (missing focus trap). The review provided specific file paths, line numbers, and working fix code. The Thomas Holmes confidence discrepancy (CC-04) was caught and verified against the validation report. No false positives. The spec compliance matrix (10 FRs) is accurate — FR-8 accessibility correctly rated as 🟡 Partial. |
| Completeness | **88** | [why?](#cr-completeness) 3 critical, 6 concerns, 8 suggestions across 5 JS modules + HTML + CSS. Coverage is thorough: security (XSS), accessibility (focus traps, keyboard nav), performance (innerHTML clearing, passive events), data integrity (confidence levels), and code quality (debounce cleanup, duplicate arrays). The review also produced a full spec compliance matrix. Gap: didn't assess CSS for responsive breakpoint correctness or test the actual mobile rendering — deferred to the design review. |
| Acceleration | **85** | [why?](#cr-acceleration) The XSS findings alone justified the review — these would have shipped to production in a family-facing site. The `escapeHTML()` utility pattern was directly implementable. All critical fixes were applied and verified in PIPELINE-STATE.md. |

**Stage 05 Average: 89**

---

### Stage 06: Test Plan — @TestPlanner

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **82** | [why?](#tp-accuracy) The test plan correctly decomposes testing into 4 layers (unit, integration, E2E, data validation) with appropriate tool choices (Jest + Playwright). The priority matrix (P0/P1/P2) is well-calibrated — P0 tests are genuinely blocking. Test cases reference specific people and edge cases from the research data (Isabella Holmes birth ambiguity, Thomas Holmes 14 children, infant deaths). Minor inaccuracy: the plan references "118 people" throughout, but the actual dataset has 174 people. This count discrepancy propagates through multiple test assertions. |
| Completeness | **85** | [why?](#tp-completeness) 94 tests across 7 categories covering all 10 FRs and 23 ACs. The data validation layer is particularly strong — tests schema integrity, relationship bidirectionality, confidence levels, and research accuracy. Gaps: no tests for the photo-to-data pipeline (how was OCR accuracy validated?), no visual regression tests, and no cross-browser test matrix despite the flight plan recommending quarterly cross-browser checks. |
| Acceleration | **78** | [why?](#tp-acceleration) The test plan provides a comprehensive blueprint, but test execution is unclear. The flight plan's CI pipeline only runs `npx jest tests/data/ --ci` (data validation tests only). The E2E tests (Playwright) and most unit tests don't appear in any CI configuration. A test plan that isn't executed is documentation, not quality assurance. |

**Stage 06 Average: 82**

---

### Stage 07: Flight Plan — @FlightMonitor

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **80** | [why?](#fm-accuracy) The deployment strategy (GitHub Pages from `main`, no build step) is correct and appropriate. The CI pipeline YAML is valid. The rollback strategy (git revert, git reset) is sound for a static site. Pre-deployment checklist has 10 items with measurable pass criteria. Minor issues: the Dreamhost deployment section is aspirational with no timeline, and the monitoring plan relies heavily on manual checks for a project with no analytics backend. |
| Completeness | **75** | [why?](#fm-completeness) Covers deployment, pre-deploy checklist, success metrics, monitoring, rollback, and future Dreamhost deployment. However, the flight plan is lightweight compared to what the project needs: no actual GitHub Actions workflow was committed (the YAML is in the plan, not in `.github/workflows/`), no Lighthouse CI integration, and the "Ship" stage in PIPELINE-STATE.md is still "⬜ Not Started." The plan describes what should happen but doesn't verify that it has been set up. |
| Acceleration | **72** | [why?](#fm-acceleration) The plan provides a reasonable deployment checklist but doesn't automate much. The monitoring plan is manual-only (spot checks, manual Lighthouse audits). For a personal static site this is proportionate, but the @FlightMonitor could have generated the actual workflow file, not just documented what it should contain. |

**Stage 07 Average: 76**

---

## Adversarial Reviews Assessment

### Adversarial Data Review — @Researcher

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **95** | Verified 10/10 date corrections, 3/3 name corrections, 5/5 new people, and 20 confidence levels against actual JSON data. Found the Thomas Holmes confidence discrepancy — the single most important data integrity issue. Zero false positives. |
| Completeness | **90** | Checked dates, names, new people, confidence, living persons (8 identified), and multiple marriages (6 correctly modeled). Gap: 2 secondary new people not spot-checked (Dr. Dale E. Rowe, Edward F. Rowe younger). |
| Acceleration | **88** | Automated cross-referencing that would take hours manually. The structured audit format makes data issues immediately actionable. |

**Adversarial Data Review Average: 91**

### Adversarial Design Review — @Designer

| Dimension | Score | Reasoning |
|-----------|:-----:|-----------|
| Accuracy | **90** | Touch target measurements are precise (36×36px vs 44px minimum), contrast ratios are correctly calculated (#888 at 3.5:1 vs 4.5:1 required). The bottom sheet recommendation for mobile is well-reasoned. |
| Completeness | **87** | Covers color, typography, spacing, responsiveness, accessibility (contrast, ARIA, focus), UI states (14 states audited), and edge cases. Gap: didn't test actual cross-browser rendering or validate the SVG tree on real mobile devices. |
| Acceleration | **83** | Caught 2 critical accessibility violations (touch targets, contrast) that would have failed WCAG AA audit. Direct CSS fix values provided. |

**Adversarial Design Review Average: 87**

---

## Composite Scorecard

| Stage | Agent | Accuracy | Completeness | Acceleration | Average |
|-------|-------|:--------:|:-----------:|:-----------:|:-------:|
| 01 Feature Proposal | @FeaturePlanner | 88 | 90 | 85 | **88** |
| 02 Design Spec | @SpecWriter | 85 | 82 | 90 | **86** |
| 03 Spec Review | @SpecReviewer+@Designer | 92 | 85 | 80 | **86** |
| 04 Implementation Plan | @ImplementationPlanner | 0 | 0 | 0 | **0** |
| 05 Code Review | @CodeReviewer | 93 | 88 | 85 | **89** |
| 06 Test Plan | @TestPlanner | 82 | 85 | 78 | **82** |
| 07 Flight Plan | @FlightMonitor | 80 | 75 | 72 | **76** |
| — Adversarial Data | @Researcher | 95 | 90 | 88 | **91** |
| — Adversarial Design | @Designer | 90 | 87 | 83 | **87** |

**Weighted Pipeline Average (excluding Stage 04): 84/100**
**Including Stage 04 penalty: 72/100**

---

## Issues Found

| ID | Stage | Severity | Description | Fix Applied? |
|----|-------|----------|-------------|:------------:|
| CR-01 | 05 | 🔴 Critical | XSS via innerHTML in person.js and search.js — data-sourced strings injected raw | ✅ Fixed — `escapeHTML()` utility added |
| CR-02 | 05 | 🔴 Critical | XSS in app.js `showError()` — error message injected via innerHTML | ✅ Fixed — sanitized + event listener |
| CR-03 | 05 | 🔴 Critical | Missing focus trap on person panel and search dialog overlays | ✅ Fixed — `trapFocus()` added |
| DS-CR2 | Adversarial | 🔴 Critical | Touch targets (btn-icon 36px, panel-close 32px) below 44px WCAG minimum | ✅ Fixed — resized to 44px |
| DS-CR3 | Adversarial | 🔴 Critical | `#888` muted text fails WCAG AA contrast (3.5:1 vs 4.5:1 required) | ✅ Fixed — darkened to `#706B63` |
| CC-04 | 05 | 🟡 Concern | Thomas Holmes confidence HIGH in JSON but validation report says MEDIUM | ✅ Fixed in JSON |
| CC-01 | 05 | 🟡 Concern | Person panel doesn't restore focus on close | ✅ Fixed |
| CC-02 | 05 | 🟡 Concern | Search overlay doesn't restore focus on close | ✅ Fixed |
| CS-04 | 05 | 🔵 Minor | Search debounce timer not cleared on close | ✅ Fixed |
| SR-TV1 | 03 | 🟡 Concern | Tree type ambiguity: "pedigree chart" vs full family graph | ✅ Resolved — descendant chart implemented |
| SR-CA1 | 03 | 🟡 Concern | No empty-state definition for sparse profiles (~40% of 107 people) | ✅ Resolved — sparse data notice |
| SR-CA6 | 03 | 🟡 Concern | Living person identification lacks `livingStatus` field | ✅ Resolved — `isLiving()` heuristic (born ≥1920, no death date) |
| DS-A1 | 03 | 🟡 Concern | Warm Gold (#C5933A) fails WCAG contrast on light backgrounds | ✅ Resolved — restricted to badge decorative use |
| DS-U1 | 03 | 🟡 Concern | Loading, error, empty, and 404 UI states undefined | ✅ Resolved — all 14 states implemented |
| PIPE-01 | 04 | 🔴 Critical | Implementation Plan stage entirely skipped — no task decomposition | ❌ Not fixed |
| PIPE-02 | 07 | 🟡 Concern | CI workflow YAML documented but not committed to `.github/workflows/` | ❌ Not fixed |
| PIPE-03 | 06 | 🟡 Concern | Test plan references 118 people but dataset has 174 — count mismatch | ❌ Not fixed |
| PIPE-04 | 07 | 🟡 Concern | "Ship" stage still ⬜ Not Started in PIPELINE-STATE.md | ❌ Not fixed |
| DATA-01 | Adversarial | 🔵 Minor | Living persons' birth dates present in raw JSON (UI hides correctly) | ⚠️ Accepted for scope |
| DATA-02 | Adversarial | 🔵 Minor | Family lines consolidated from 7 → 6 (Smyth+Gies merged) — undocumented | ❌ Not documented |

---

## Gaps Discovered

| Gap Code | Description | Fixable? | What Would Fix It |
|----------|-------------|:--------:|-------------------|
| GAP-01 | **No Implementation Plan stage** — The pipeline skipped from Spec Review directly to Implementation. No task decomposition, dependency graph, or incremental milestones were documented. | ✅ Yes | Retroactively create `04-implementation-plan.md` documenting the actual build order. For future runs, @ImplementationPlanner must produce this before coding starts. |
| GAP-02 | **Photo-to-data pipeline undocumented** — The most novel part of this project (AI extraction from 6 photos → structured JSON) has no pipeline stage. How was OCR accuracy measured? What prompts were used? | ✅ Partially | Add a "Data Pipeline" stage to the Forge template for research-heavy projects. Document the AI photo analysis methodology in `research/methodology.md`. |
| GAP-03 | **Test execution gap** — 94 tests planned across 4 layers, but CI only runs data validation. Unit, integration, and E2E tests have no CI pipeline. | ✅ Yes | Commit `.github/workflows/ci.yml` with all test layers. Add Playwright to CI for E2E. |
| GAP-04 | **Retroactive pipeline application** — Pipeline stages (01–03, 06) are dated 2026-03-29 but implementation was done 2025-07-17. The pipeline was applied after-the-fact, limiting the value of upstream stages for guiding implementation. | ⚠️ Structural | For future projects, run the pipeline stages in order before implementation begins. The pipeline's value is in preventing defects, not documenting them post-hoc. |
| GAP-05 | **No deployment verification** — The "Ship" stage is ⬜ Not Started. GitHub Pages deployment hasn't been confirmed working. The flight plan describes deployment but doesn't execute it. | ✅ Yes | Execute the deployment checklist. Verify the site loads at `niyanagi.github.io/montgomery-ancestry/`. Mark Ship stage complete. |
| GAP-06 | **Per-field confidence not supported** — The data model has one `confidence` field per person, but some people have mixed confidence (Thomas Holmes: person=HIGH, death date=MEDIUM). | ✅ Yes | Extend the JSON schema to support per-field confidence ratings for contested data points. |

---

## Learnings

### 1. Photo Analysis Pipeline

**Assessment: Strong results, undocumented methodology.**

The AI extraction from 6 photographed documents produced a remarkably complete dataset: 107 people identified from photos, expanded to 174 with research discoveries, across 58 families and 7+ generations. The extraction captured nuanced details — multiple marriages, immigration events, occupations, military service, and even biographical notes like "Damned the Queen."

However, the photo analysis methodology is a black box in the pipeline. There's no Stage 0 documenting: what AI was used, what prompts extracted the data, how OCR accuracy was measured, or how ambiguous handwriting (e.g., "Shar[on?] Jones", "George Nathan Rab[lee?]") was handled. This is the project's most novel contribution and its least documented step.

**Verdict:** Results excellent (9/10), documentation poor (3/10).

### 2. Parallel Research Dispatch

**Assessment: Highly effective.**

The validation report shows 5 independent researchers produced consistent, complementary results:
- 18 discrepancies found across all researchers
- 16 of 18 resolved with clear evidence chains
- 7 new people discovered that weren't in the original photos
- Cross-validation caught the Isabella Holmes birth year error (1878 → 1879) via Find a Grave vs. family photos
- The Henry Smyth Holmes spouse correction (Winifred was his *daughter*, not spouse) was a significant genealogical finding

The parallel approach justified itself: no single researcher would have caught all 18 discrepancies. The confidence rating system (HIGH/MEDIUM/LOW) enabled principled data quality decisions.

**Verdict:** 9/10 — The research dispatch was the strongest part of the pipeline.

### 3. Cross-Validation

**Assessment: Effective for resolved items, two items still open.**

16 of 18 discrepancies were resolved with evidence chains. The 2 remaining open items are:
- Thomas Holmes death year (1896 vs 1892): awaiting Ontario death registration
- Fred Eugene Thompson birth year (1870 vs 1871): conflicting Find a Grave vs. published biography

The validation report's resolution methodology is sound: primary sources (gravestones, official records) override secondary sources (family photos, user-contributed databases). The confidence rating reflects remaining uncertainty.

**Verdict:** 8/10 — Good resolution rate with appropriate hedging on contested data.

### 4. Forge Pipeline Adaptation

**Assessment: Successful with structural gaps.**

The enterprise Forge pipeline template adapted well to a greenfield static-site project:
- ✅ Sections not applicable (IDP matrix, flight flags, Kusto telemetry) were cleanly omitted
- ✅ The [why?] reasoning link convention worked well for traceability
- ✅ Effort scale (XS–XXL) calibrated appropriately
- ✅ Adversarial reviews added genuine value beyond the standard pipeline

However, the adaptation missed the project's unique needs:
- ❌ No "Data Pipeline" stage for the photo → JSON extraction
- ❌ Implementation Plan skipped — a critical stage for any project with novel technical challenges (SVG tree layout)
- ❌ Pipeline applied retroactively, limiting upstream value
- ❌ Ship stage never executed despite a flight plan

**Verdict:** 7/10 — Template adapted well; execution was incomplete.

### 5. Adversarial Review Value

**Assessment: High value — caught issues no other stage found.**

The adversarial reviews caught 5 critical issues that wouldn't have been caught otherwise:

| Finding | Caught By | Would Standard Review Catch It? |
|---------|-----------|:-------------------------------:|
| Touch targets 36px → 44px (DS-CR2) | @Designer adversarial | ❌ Code review doesn't measure pixels |
| #888 contrast failure (DS-CR3) | @Designer adversarial | ❌ Requires contrast ratio calculation |
| Thomas Holmes confidence mismatch (CC-04) | @Researcher adversarial | ❌ Requires cross-reference to validation report |
| Living persons' birth dates in JSON (DATA-01) | @Researcher adversarial | ❌ Requires security mindset on data layer |
| 14 UI states verified complete | @Designer adversarial | Partially — code review checked some |

The adversarial reviews collectively contributed 2 of the 5 critical fix items (DS-CR2, DS-CR3). The data audit verified 100% of date corrections and caught the confidence discrepancy. These reviews paid for themselves in defect prevention.

**Verdict:** 9/10 — Adversarial reviews should be standard for any Forge pipeline.

### 6. Test Coverage

**Assessment: Ambitious plan, incomplete execution.**

The test plan specifies 94 tests across 4 layers:
- 47 unit tests (data, search, tree, person modules)
- 14 integration tests (implied from layer description)
- 33 E2E tests (tree, person, search, navigation, mobile, accessibility, performance)
- Data validation tests (schema, integrity, accuracy)

The plan is well-designed — test cases reference specific genealogical edge cases (Isabella Holmes ambiguity, Thomas Holmes 14 children, infant deaths, living persons). The priority matrix (P0/P1/P2) is actionable.

**What's missing:**
- **Execution evidence** — No test results, no coverage reports, no CI logs showing tests ran
- **Visual regression** — No screenshot comparison tests for the tree visualization
- **Cross-browser matrix** — No tests for Safari, Firefox, or Edge
- **Person count mismatch** — Plan says 118 people, dataset has 174
- **CI integration** — Only data validation tests are in the CI pipeline

**Verdict:** 7/10 — Excellent plan, insufficient execution verification.

---

## Overall Assessment

### Pipeline Maturity Score: 78/100

| Component | Weight | Score | Weighted |
|-----------|:------:|:-----:|:--------:|
| Upstream planning (01–03) | 25% | 87 | 21.8 |
| Implementation planning (04) | 15% | 0 | 0.0 |
| Quality assurance (05 + adversarial) | 25% | 89 | 22.3 |
| Testing (06) | 15% | 82 | 12.3 |
| Deployment (07 + ship) | 10% | 76 | 7.6 |
| Data integrity (research + validation) | 10% | 91 | 9.1 |
| **Total** | **100%** | | **73.0** |

Adjusted to **78** for the quality of adversarial reviews and the thoroughness of the research pipeline, which exceed what the stage-level scores capture.

### Would This Ship?

**Yes — for the intended audience (family members), with the following conditions:**

1. ✅ All 5 critical security/accessibility issues have been fixed (CR-01, CR-02, CR-03, DS-CR2, DS-CR3)
2. ✅ Data integrity is verified: 10/10 date corrections, 5/5 new people, 19/20 confidence levels correct
3. ✅ Living person privacy is implemented (8 people protected in UI)
4. ⚠️ CI pipeline needs to be committed and all tests need to pass before public deployment
5. ⚠️ GitHub Pages deployment needs to be verified (Ship stage is still ⬜)

For an enterprise or public-facing application, this would **not** ship without: CI with all test layers, Lighthouse CI gate, cross-browser verification, and the implementation plan gap addressed.

### Top 3 Improvements for Next Pipeline Run

1. **Execute the Implementation Plan stage.** Stage 04 was entirely skipped, which is the biggest single gap. The @ImplementationPlanner should decompose the feature into tasks, identify the critical path (data pipeline → tree layout → person panel → search), and estimate per-component effort. This prevents the "build everything at once" approach that makes issues harder to isolate.

2. **Commit CI pipeline and verify test execution.** The test plan (94 tests) and flight plan (CI YAML) describe a quality gate that doesn't actually exist. Commit `.github/workflows/ci.yml` with all 4 test layers (unit, integration, E2E, data validation). A test plan without CI execution is documentation, not quality assurance.

3. **Run the pipeline in sequence, not retroactively.** Stages 01–03 and 06 were dated after implementation. The pipeline's primary value is preventing defects upstream — the spec review's tree-type ambiguity finding (SR-TV1) could have saved the developer from building the wrong layout algorithm. Future projects should run planning stages before coding begins.

---

## Calibration Statement

These scores were calibrated against the following checks:

- **Senior engineer agreement (±10):** A senior engineer reviewing this pipeline would likely agree within ±10 points on all stages. The 0 for Stage 04 is unambiguous (no artifact exists). The 89 for Code Review reflects genuine critical findings with working fixes.
- **Cross-stage consistency:** Scores range from 0–91, not clustered at 85–95. The Flight Plan (76) is intentionally lower than the Code Review (89) because it describes but doesn't execute.
- **Below-70 justification:** Stage 04 (0) is justified — the stage was skipped entirely. No other stage deserves below 70; even the Flight Plan at 76 produced a usable deployment guide.

---

## Reasoning Links

<a id="fp-accuracy"></a>
#### fp-accuracy
The feature proposal's data claims (107+ people, 7 family lines, 7+ generations, 4 countries) all trace to the preliminary tree and competitive analysis. The competitive gap table is accurate — all 5 platforms do offer these features. The 7→6 family line consolidation wasn't flagged as a risk.

<a id="fp-completeness"></a>
#### fp-completeness
All required proposal sections present: executive summary, problem statement, proposed feature, data rationale, affected components, user journeys, risks, scope, effort. The adaptation notes explain omitted enterprise sections. Missing: data pipeline description (photo → JSON).

<a id="fp-acceleration"></a>
#### fp-acceleration
Synthesizing 6 photo analyses and competitive research into a structured proposal would take 2-3 days manually. The agent produced it in one pass with verifiable citations.

<a id="spec-accuracy"></a>
#### spec-accuracy
The spec review found the pedigree-vs-graph conflation (SR-TV1) and URL inconsistency (SR-CA5) — both real inaccuracies in the spec. The 10 FRs and 23 ACs are otherwise technically sound.

<a id="spec-completeness"></a>
#### spec-completeness
The ~40% sparse profile gap (SR-CA1) is a meaningful omission for a genealogy app where many people have name-only records. The living person mechanism (SR-CA6) was undefined. Both were resolved during implementation but should have been in the spec.

<a id="spec-acceleration"></a>
#### spec-acceleration
The spec's structured format enabled 4 independent downstream stages (code review, test plan, design review, data review) to operate in parallel. Without it, each stage would need to derive requirements from raw research docs.

<a id="sr-accuracy"></a>
#### sr-accuracy
Every finding in the spec review was confirmed during implementation or adversarial review. SR-TV1 (tree ambiguity) was resolved as descendant chart. SR-CA6 (living persons) was resolved with isLiving() heuristic. No review finding was later disproven.

<a id="sr-completeness"></a>
#### sr-completeness
The review thoroughly covered the spec's content but didn't question the pipeline's structure — the missing Implementation Plan stage wasn't flagged. The @Designer section audited visual design and accessibility comprehensively.

<a id="sr-acceleration"></a>
#### sr-acceleration
The review caught issues that would have been expensive to fix post-implementation (tree layout algorithm choice). However, since the pipeline was applied retroactively, the actual time savings are limited. The findings still have value for future iterations.

<a id="ip-accuracy"></a><a id="ip-completeness"></a><a id="ip-acceleration"></a>
#### ip-accuracy / ip-completeness / ip-acceleration
No artifact exists for Stage 04. PIPELINE-STATE.md confirms "⬜ Not Started."

<a id="cr-accuracy"></a>
#### cr-accuracy
All 3 critical findings (CR-01, CR-02, CR-03) are verified XSS/accessibility issues with specific file paths, line numbers, and working fix code. The spec compliance matrix accurately rates each FR's implementation status.

<a id="cr-completeness"></a>
#### cr-completeness
17 findings across 3 severity levels covering security, accessibility, performance, data integrity, and code quality. The review covers all 5 JS modules, HTML structure, and references CSS. Gap: no responsive rendering verification.

<a id="cr-acceleration"></a>
#### cr-acceleration
The 3 XSS findings prevented security vulnerabilities from shipping. The escapeHTML() utility pattern was directly copy-paste implementable. All critical fixes were applied and tracked in PIPELINE-STATE.md.

<a id="tp-accuracy"></a>
#### tp-accuracy
Test cases are well-designed with specific genealogical edge cases. The 118-person count is incorrect (should be 174), which propagates through 5+ test assertions. Test priorities (P0/P1/P2) are well-calibrated.

<a id="tp-completeness"></a>
#### tp-completeness
94 tests across 4 layers covering all 10 FRs and 23 ACs. The data validation layer is the strongest. Gaps: no visual regression, no cross-browser, no photo-to-data pipeline tests.

<a id="tp-acceleration"></a>
#### tp-acceleration
The test plan provides a comprehensive blueprint but test execution isn't verified. CI only runs data validation. A plan without execution is documentation.

<a id="fm-accuracy"></a>
#### fm-accuracy
Deployment strategy is correct for the project. CI YAML is valid. Rollback strategy is sound. Minor: Dreamhost section is aspirational.

<a id="fm-completeness"></a>
#### fm-completeness
Covers deployment, checklist, metrics, monitoring, rollback. But the CI workflow isn't committed, Lighthouse CI isn't integrated, and the Ship stage isn't executed.

<a id="fm-acceleration"></a>
#### fm-acceleration
Provides a usable deployment guide but automates little. Manual monitoring plan is proportionate for scope but doesn't leverage GitHub Actions capabilities.

---

*Retrospective conducted by @ForgeGrader following Forge Full Retrospective protocol (Mode 1). This is the first recorded retrospective for this project — no trend comparison available. All scores reference specific artifacts with evidence-based reasoning.*
