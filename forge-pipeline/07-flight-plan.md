---
title: "Flight Plan — Montgomery Ancestry Browser"
status: complete
author: "Copilot (@FlightMonitor)"
created: 2025-07-15
stage: 07
---

<!--
  Stage 07 — Flight Plan (Deployment & Monitoring)
  Agent: @FlightMonitor (adapted)
  Pipeline: Montgomery Ancestry Browser

  ADAPTATION NOTE:
  This is a static site on GitHub Pages — no Kusto telemetry, A/B testing,
  ring deployment, or feature flags. The Flight Monitor template is adapted
  to define measurable success criteria, a lightweight monitoring plan,
  and a clear rollback strategy appropriate for the project scope.
  All claims include [why?] reasoning links per Forge conventions.
-->

# Flight Plan: Montgomery Ancestry Browser

## 1. Deployment Strategy

**Effort: XS** [why?](#effort-reasoning)

### 1.1 Primary: GitHub Pages from `main` branch

| Setting | Value | Reasoning |
|---------|-------|-----------|
| Source | `main` branch, `/ (root)` | Single-branch workflow for a solo project [why?](#simple-branching) |
| Custom domain | None initially; GitHub `*.github.io` URL | Reduces DNS complexity for initial launch [why?](#incremental-deployment) |
| HTTPS | Enforced (GitHub Pages default) | Required for modern browser features and user trust |
| Build | Static files — no build step needed | Pure HTML/CSS/JS with JSON data; no framework compilation [why?](#no-build-step) |

### 1.2 CI Pipeline: GitHub Actions

```yaml
# .github/workflows/ci.yml — triggered on push to main and on PRs
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx jest tests/data/ --ci
      - name: Validate JSON
        run: |
          node -e "JSON.parse(require('fs').readFileSync('data/people.json'))"
          node -e "JSON.parse(require('fs').readFileSync('data/family-tree.json'))"
```

**Effort: S** [why?](#effort-reasoning) — Single workflow file, existing patterns from GitHub Actions templates.

---

## 2. Pre-deployment Checklist

Every item must pass before merging to `main`. [why?](#pre-deploy-rigor) A static site has no rollback-during-deploy — once pushed, it's live within minutes.

| # | Check | Method | Pass Criteria |
|---|-------|--------|---------------|
| 1 | Data validation tests pass | `npx jest tests/data/ --ci` | 0 failures |
| 2 | All JSON files parse without error | `node -e "JSON.parse(...)"` for each file | No exceptions |
| 3 | Total person count | Automated test | ≥ 174 people rendered [why?](#data-completeness) |
| 4 | Total family count | Automated test | ≥ 58 families present |
| 5 | Lighthouse Performance score | Chrome DevTools Lighthouse | > 90 [why?](#performance-bar) |
| 6 | Lighthouse Accessibility score | Chrome DevTools Lighthouse | > 90 |
| 7 | Lighthouse Best Practices score | Chrome DevTools Lighthouse | > 90 |
| 8 | All internal links resolve | Manual check or link checker script | 0 broken links |
| 9 | Mobile responsiveness | Chrome DevTools device emulation | Usable at 375px width |
| 10 | No console errors | Browser DevTools console | 0 errors on load |

---

## 3. Success Metrics

### 3.1 Quantitative Metrics

Since this is a personal static site with no analytics backend, metrics are measured via manual audit and Lighthouse. [why?](#no-telemetry) No A/B testing or statistical significance — these are absolute thresholds.

| Metric | Target | Measurement Method | Priority |
|--------|--------|--------------------|----------|
| **Page load time** (first contentful paint) | < 2.0s on 4G throttle | Lighthouse Performance audit | P0 |
| **Lighthouse Performance** | ≥ 90 | Chrome Lighthouse | P0 |
| **Lighthouse Accessibility** | ≥ 90 | Chrome Lighthouse | P0 |
| **Lighthouse SEO** | ≥ 90 | Chrome Lighthouse | P1 |
| **Data completeness** | 174/174 people rendered | Automated count in test suite | P0 |
| **Family completeness** | 58/58 families navigable | Manual verification | P0 |
| **Broken links** | 0 | Link checker / manual | P0 |
| **Mobile usability** | All content accessible at 375px | Chrome device emulation | P0 |
| **JavaScript errors** | 0 on page load | Browser console | P0 |
| **JSON validity** | All data files parse | CI pipeline check | P0 |

### 3.2 Qualitative Success Criteria

| Criterion | Evidence | Priority |
|-----------|----------|----------|
| Family tree navigation is intuitive | Can find any person within 3 clicks from home | P0 |
| Person detail pages show all available data | Spot-check 5 people across different family lines | P1 |
| Empty states handled gracefully | Sparse profiles (~40% of people) show meaningful content | P1 [why?](#empty-states) |
| Historical context is preserved | Dates, places, occupations render correctly | P0 |

---

## 4. Monitoring Plan

### 4.1 Automated Monitoring

| What | How | Frequency |
|------|-----|-----------|
| GitHub Pages uptime | GitHub status page + manual spot checks | Weekly initially, then monthly |
| CI pipeline health | GitHub Actions dashboard — green/red on PRs | Every push |
| Data integrity | Jest test suite in CI | Every push |

### 4.2 Manual Monitoring (Post-Launch)

| What | How | When |
|------|-----|------|
| Browser console errors | Open DevTools, check Console tab | After each deployment |
| Visual regression | Quick scroll-through on desktop + mobile | After each deployment |
| Lighthouse re-audit | Run Lighthouse in Chrome DevTools | Monthly or after major changes |
| Cross-browser check | Test in Chrome, Firefox, Safari, Edge | After initial launch, then quarterly |
| Data accuracy spot-check | Compare 5 random people against `research/validated-tree.md` | After each data update |

### 4.3 User Feedback Mechanism

**Effort: XS** [why?](#effort-reasoning) — A single link in the footer.

- Footer link: "Found an error? [Open an issue](https://github.com/NiyaNagi/MontgomeryAncestry/issues)" [why?](#github-issues-feedback)
- GitHub Issues template for data corrections (name, date, relationship errors)
- README section inviting family members to contribute corrections

---

## 5. Rollback Plan

### 5.1 Immediate Rollback (< 5 minutes)

```bash
# If issues found post-deploy, revert the most recent commit
git revert HEAD --no-edit
git push origin main
# GitHub Pages will redeploy within ~2 minutes
```

**Why this works:** GitHub Pages deploys from `main` on every push. Reverting the commit and pushing triggers a redeploy with the previous state. [why?](#simple-rollback)

### 5.2 Emergency Rollback (site completely broken)

```bash
# Reset to last known good commit
git log --oneline -10  # Find the last good commit
git reset --hard <good-commit-sha>
git push --force origin main
```

⚠️ Force-push is destructive — only use if revert doesn't fix the issue.

### 5.3 Data-Only Rollback

```bash
# If only data is broken, restore just the data files
git checkout <good-commit-sha> -- data/people.json data/family-tree.json
git commit -m "Rollback data to known good state"
git push origin main
```

---

## 6. Future: Dreamhost Deployment (f128.info/montgomery-ancestry)

**Effort: S** [why?](#effort-reasoning) — File copy + DNS/path configuration, no server-side logic.

### 6.1 Prerequisites

- [ ] Dreamhost hosting account active with SSH access
- [ ] Domain `f128.info` DNS configured
- [ ] Site tested and stable on GitHub Pages first [why?](#github-pages-first)

### 6.2 Deployment Steps

```bash
# 1. Build the production files (if any build step is added later)
# Currently: no build step needed — ship the repo contents directly

# 2. Copy files to Dreamhost via rsync
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'tests' \
  --exclude 'forge-pipeline' \
  --exclude 'research' \
  ./ user@dreamhost:~/f128.info/montgomery-ancestry/

# 3. Verify deployment
curl -s -o /dev/null -w "%{http_code}" https://f128.info/montgomery-ancestry/
# Expected: 200
```

### 6.3 Dreamhost-Specific Considerations

| Concern | Mitigation |
|---------|------------|
| No CI pipeline on Dreamhost | Run tests locally before rsync; GitHub Pages remains the CI-gated deployment |
| Relative paths must work at `/montgomery-ancestry/` | Use relative paths (`./data/people.json`) not absolute (`/data/people.json`) [why?](#relative-paths) |
| HTTPS certificate | Dreamhost provides free Let's Encrypt certificates |
| Cache invalidation | Static files — cache headers managed by Dreamhost; add `?v=` query params to CSS/JS if needed |

### 6.4 Dual Deployment Workflow

Once Dreamhost is active, the deployment flow becomes:

1. **Develop** on feature branches
2. **Test** via PR → CI runs Jest + JSON validation
3. **Merge to `main`** → GitHub Pages auto-deploys (primary)
4. **Manual rsync** to Dreamhost (secondary) after confirming GitHub Pages is healthy

---

## Effort Reasoning

<a id="effort-reasoning"></a>

| Item | Size | Reasoning |
|------|------|-----------|
| GitHub Pages deployment | XS | Config change in repo settings — no code, no infrastructure |
| GitHub Actions CI | S | Single YAML file, standard Node.js test pattern, 1-3 files |
| Pre-deployment checklist | XS | Documenting existing checks — no new tooling |
| Monitoring plan | XS | Manual process + GitHub built-in features — no new infrastructure |
| User feedback mechanism | XS | Footer link to GitHub Issues — single HTML change |
| Dreamhost deployment | S | rsync command + path verification, 1-3 files to configure |
| **Total flight plan effort** | **S** | Sum of XS + S items; all use existing patterns and tools |

<a id="simple-branching"></a>
**Simple branching:** Solo developer project — trunk-based development on `main` is simpler and equally safe with CI gates. No need for `develop`/`staging` branches.

<a id="incremental-deployment"></a>
**Incremental deployment:** Ship to GitHub Pages first to validate, then add Dreamhost as a second deployment target. Reduces risk of debugging two deployments simultaneously.

<a id="no-build-step"></a>
**No build step:** The project uses vanilla HTML/CSS/JS with JSON data files. No framework compilation, bundling, or transpilation is needed. This simplifies CI and deployment.

<a id="pre-deploy-rigor"></a>
**Pre-deploy rigor:** Unlike enterprise apps, there's no staging environment or canary deployment. The checklist IS the staging gate — every item must pass because there's no gradual rollout to catch issues early.

<a id="data-completeness"></a>
**Data completeness (174):** The validated tree contains 174 people across 7 family lines. Rendering fewer indicates a data loading or parsing failure.

<a id="performance-bar"></a>
**Performance bar (>90):** A static site with JSON data should easily achieve >90. Failing indicates avoidable issues (uncompressed images, render-blocking resources, etc.).

<a id="no-telemetry"></a>
**No telemetry:** Personal family history site — no Google Analytics, no tracking pixels. Privacy-first approach aligns with the project values. Metrics are measured via developer tools, not production telemetry.

<a id="empty-states"></a>
**Empty states:** ~40% of the 174 people have sparse profiles (name and dates only). Per spec review issue SR-CA1, empty states must be handled gracefully.

<a id="github-issues-feedback"></a>
**GitHub Issues feedback:** Family members who discover errors can file an issue without needing technical knowledge. This is simpler than a custom form and leverages existing infrastructure.

<a id="simple-rollback"></a>
**Simple rollback:** GitHub Pages deploys automatically from `main`. A `git revert` creates a new commit with the inverse changes and triggers an automatic redeploy — no manual intervention needed on the hosting side.

<a id="github-pages-first"></a>
**GitHub Pages first:** Validate the site works correctly with CI-gated deployments before adding a manual-rsync deployment target. GitHub Pages provides free HTTPS, CDN, and auto-deployment.

<a id="relative-paths"></a>
**Relative paths:** GitHub Pages serves from root (`/`), but Dreamhost serves from a subdirectory (`/montgomery-ancestry/`). Using relative paths (`./data/people.json`) ensures the site works in both contexts without configuration changes.
