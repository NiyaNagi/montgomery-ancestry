/**
 * Main application module for Montgomery Ancestry Browser.
 * Orchestrates data loading, tree rendering, person panel, search, and routing.
 */

import { loadData, getPerson, getFamilyLines, getFamilyLineInfo, getAllPeople } from './data.js';
import { initTree, renderTree, selectPerson, panToNode, resetZoom } from './tree.js';
import { initPersonPanel, showPerson, closePanel, isPanelOpen } from './person.js';
import { initSearch, openSearch, closeSearch, isSearchOpen } from './search.js';

let currentFamilyLine = 'all';

document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  showLoading(true);

  try {
    await loadData();
    setupUI();
    handleInitialRoute();
    showLoading(false);
  } catch (err) {
    console.error('Failed to load data:', err);
    showError(err.message);
  }
}

function setupUI() {
  // Tree
  const treeContainer = document.getElementById('tree-container');
  initTree(treeContainer, handlePersonSelect);

  // Person panel
  initPersonPanel(handlePersonNavigate);

  // Search
  initSearch(handleSearchSelect);

  // Tab navigation
  buildFamilyTabs();

  // Render initial tree
  renderTree(currentFamilyLine);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleGlobalKeyboard);

  // Hash change listener
  window.addEventListener('hashchange', handleHashChange);

  // Zoom controls
  const zoomFit = document.getElementById('zoom-fit');
  if (zoomFit) {
    zoomFit.addEventListener('click', resetZoom);
  }

  // Search button
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  // Skip link
  const skipLink = document.getElementById('skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (main) main.focus();
    });
  }
}

function buildFamilyTabs() {
  const nav = document.getElementById('family-tabs');
  if (!nav) return;

  nav.innerHTML = '';

  // All tab
  const allBtn = createTab('all', 'All Lines');
  allBtn.classList.add('active');
  allBtn.setAttribute('aria-selected', 'true');
  nav.appendChild(allBtn);

  // Per-line tabs
  const lines = getFamilyLines();
  for (const line of lines) {
    const info = getFamilyLineInfo(line);
    const btn = createTab(line, info.label, info.color);
    nav.appendChild(btn);
  }
}

function createTab(line, label, color) {
  const btn = document.createElement('button');
  btn.className = 'family-tab';
  btn.dataset.line = line;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', 'false');
  btn.textContent = label;

  if (color && line !== 'all') {
    btn.style.setProperty('--tab-accent', color);
  }

  btn.addEventListener('click', () => {
    switchFamilyLine(line);
  });

  return btn;
}

function switchFamilyLine(line) {
  currentFamilyLine = line;

  // Update tab states
  document.querySelectorAll('.family-tab').forEach(tab => {
    const isActive = tab.dataset.line === line;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Re-render tree
  renderTree(line);

  // Update URL
  if (line !== 'all') {
    window.location.hash = `family/${line}`;
  } else {
    window.location.hash = '';
  }

  // Close person panel
  closePanel();
}

function handlePersonSelect(personId) {
  if (!personId) return;

  selectPerson(personId);
  showPerson(personId);
  window.location.hash = `person/${personId}`;
}

function handlePersonNavigate(personId) {
  if (!personId) return;

  showPerson(personId);
  selectPerson(personId);
  window.location.hash = `person/${personId}`;
}

function handleSearchSelect(personId) {
  if (!personId) return;

  // Find person's family line and switch to it if needed
  const person = getPerson(personId);
  if (person && person.familyLine && currentFamilyLine !== 'all' && person.familyLine !== currentFamilyLine) {
    switchFamilyLine(person.familyLine);
  }

  handlePersonSelect(personId);
}

function handleGlobalKeyboard(e) {
  // "/" to open search (not when typing in inputs)
  if (e.key === '/' && !e.target.matches('input, textarea, select')) {
    e.preventDefault();
    openSearch();
    return;
  }

  // Escape to close panels
  if (e.key === 'Escape') {
    if (isSearchOpen()) {
      closeSearch();
    } else if (isPanelOpen()) {
      closePanel();
    }
  }
}

function handleHashChange() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const parts = hash.split('/');

  if (parts[0] === 'person' && parts[1]) {
    const personId = parts.slice(1).join('/');
    const person = getPerson(personId);
    if (person) {
      if (person.familyLine && currentFamilyLine !== 'all' && person.familyLine !== currentFamilyLine) {
        switchFamilyLine(person.familyLine);
      }
      selectPerson(personId);
      showPerson(personId);
    }
  } else if (parts[0] === 'family' && parts[1]) {
    switchFamilyLine(parts[1]);
  } else if (parts[0] === 'search' && parts[1]) {
    openSearch();
  }
}

function handleInitialRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  // Defer to let tree render first
  setTimeout(() => handleHashChange(), 100);
}

function showLoading(visible) {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    loader.classList.toggle('hidden', !visible);
    loader.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }
}

function showError(message) {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    // Sanitize error message to prevent XSS
    const safeMsg = String(message).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    loader.innerHTML = `
      <div class="error-state">
        <div class="error-icon" aria-hidden="true">⚠️</div>
        <h2>Unable to load family data</h2>
        <p>${safeMsg}</p>
        <button id="error-retry-btn">Try Again</button>
      </div>`;
    loader.classList.remove('hidden');

    const retryBtn = document.getElementById('error-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => window.location.reload());
    }
  }
}
