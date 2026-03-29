# Pipeline State: Montgomery Ancestry Browser

## Stage Completion
| Stage | Agent | Status | Date | Artifact |
|-------|-------|--------|------|----------|
| Feature Proposal | @FeaturePlanner | ✅ Complete | 2026-03-29 | `forge-pipeline/01-feature-proposal.md` |
| Design Spec | @SpecWriter | ✅ Complete | 2026-03-29 | `forge-pipeline/02-spec.md` |
| Spec Review | @SpecReviewer + @Designer | ✅ Complete | 2026-03-29 | `forge-pipeline/03-spec-review.md` |
| Implementation Plan | @ImplementationPlanner | ⬜ Not Started | | |
| Implementation | Engineer+Copilot | ✅ Complete | 2025-07-17 | `js/*.js`, `css/styles.css`, `index.html` |
| Code Review | @CodeReviewer | ✅ Complete | 2025-07-17 | `forge-pipeline/05-code-review.md` |
| Test Plan | @TestPlanner | ✅ Complete | 2026-03-29 | `forge-pipeline/06-test-plan.md` |
| Ship | GitHub Pages | ⬜ Not Started | | |
| Flight Monitoring | @FlightMonitor | ✅ Complete | 2025-07-15 | `forge-pipeline/07-flight-plan.md` |
| Pipeline Grading | @ForgeGrader | ⬜ Not Started | | |

<!-- Status values: ⬜ Not Started | 🔄 In Progress | ✅ Complete | ⚠️ Blocked | ❌ Failed -->

## Cross-Repo Contracts

N/A — Single-repo static site project.

## Known Issues (accumulated across stages)
| ID | Severity | Stage Found | Description | Status |
|----|----------|-------------|-------------|--------|
| SR-TV1 | 🟡 | Spec Review | Tree type ambiguity: "pedigree chart" vs full family graph — different layout algorithms | Resolved (descendant chart) |
| SR-CA1 | 🟡 | Spec Review | No empty-state definition for sparse person profiles (~40% of 107 people) | Resolved (sparse notice) |
| SR-CA6 | 🟡 | Spec Review | Living person identification lacks `livingStatus` field in data schema | Resolved (isLiving() heuristic) |
| DS-A1 | 🟡 | Spec Review | Warm Gold (#C5933A) fails WCAG 4.5:1 contrast on Parchment/White — restrict to decorative use | Resolved (badge use only) |
| DS-U1 | 🟡 | Spec Review | Loading, error, empty, and 404 UI states undefined | Resolved (all states implemented) |
| CR-01 | 🔴 | Code Review | XSS via innerHTML in person.js and search.js | ✅ Fixed — escapeHTML() added |
| CR-02 | 🔴 | Code Review | XSS in app.js showError() | ✅ Fixed — sanitized + event listener |
| CR-03 | 🔴 | Code Review | Missing focus trap on dialog overlays | ✅ Fixed — trapFocus() added to person panel |
| CC-01 | 🟡 | Code Review | Person panel doesn't restore focus on close | ✅ Fixed |
| CC-02 | 🟡 | Code Review | Search overlay doesn't restore focus on close | ✅ Fixed |
| CC-04 | 🟡 | Code Review | Thomas Holmes confidence HIGH but report says MEDIUM | ✅ Fixed in JSON |
| DS-CR2 | 🔴 | Design Review | Touch targets below 44px minimum | ✅ Fixed — btn-icon and panel-close to 44px |
| DS-CR3 | 🔴 | Design Review | #888 muted text fails AA contrast | ✅ Fixed — darkened to #706B63 |
| CS-04 | 🔵 | Code Review | Search debounce timer not cleared on close | ✅ Fixed |

## Corrections Applied
| ID | Original Error | Corrected By | Stage |
|----|---------------|-------------|-------|
| CR-01 | innerHTML XSS vectors in person.js | @CodeReviewer | Code Review |
| CR-02 | innerHTML XSS in showError() | @CodeReviewer | Code Review |
| CR-03 | Missing focus trap on dialogs | @CodeReviewer | Code Review |
| CC-04 | Thomas Holmes confidence HIGH→MEDIUM | @Researcher | Data Audit |
| DS-CR2 | Touch targets 32-36px→44px | @Designer | Design Review |
| DS-CR3 | Muted text #888→#706B63 | @Designer | Design Review |

## Open Questions
- Photo transcription accuracy — pending AI analysis of 6 source photos
- GitHub account `NiyaNagi` — confirmed authenticated
- Deployment target: GitHub Pages first, Dreamhost f128.info/montgomery-ancestry later
