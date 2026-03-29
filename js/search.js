/**
 * Search & filter module for Montgomery Ancestry Browser.
 */

import { searchPeople, getFullName, formatLifespan, getFamilyLineInfo, getFamilyLines, isLiving } from './data.js';

let searchOverlay = null;
let searchInput = null;
let resultsContainer = null;
let filterContainer = null;
let selectedIndex = -1;
let currentResults = [];
let debounceTimer = null;
let onSelectCallback = null;
let activeFilters = [];
let previousFocusElement = null;

/** Initialize the search module. */
export function initSearch(onSelect) {
  onSelectCallback = onSelect;
  searchOverlay = document.getElementById('search-overlay');
  searchInput = document.getElementById('search-input');
  resultsContainer = document.getElementById('search-results');
  filterContainer = document.getElementById('search-filters');

  if (!searchOverlay || !searchInput || !resultsContainer) return;

  buildFilterCheckboxes();
  bindEvents();
}

function buildFilterCheckboxes() {
  if (!filterContainer) return;

  const lines = getFamilyLines();
  filterContainer.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'filter-label';
  label.textContent = 'Family lines:';
  filterContainer.appendChild(label);

  for (const line of lines) {
    const info = getFamilyLineInfo(line);
    const wrapper = document.createElement('label');
    wrapper.className = 'filter-chip';
    wrapper.style.setProperty('--chip-color', info.color);
    wrapper.style.setProperty('--chip-bg', info.bg);

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = line;
    cb.checked = false;
    cb.setAttribute('aria-label', `Filter by ${info.label} family line`);
    cb.addEventListener('change', () => {
      updateActiveFilters();
      performSearch();
    });

    const text = document.createTextNode(info.label);
    wrapper.appendChild(cb);
    wrapper.appendChild(text);
    filterContainer.appendChild(wrapper);
  }
}

function updateActiveFilters() {
  const checkboxes = filterContainer.querySelectorAll('input[type="checkbox"]');
  activeFilters = [];
  checkboxes.forEach(cb => {
    if (cb.checked) activeFilters.push(cb.value);
  });
}

function bindEvents() {
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSearch, 200);
  });

  searchInput.addEventListener('keydown', handleKeyboard);

  // Close overlay on backdrop click
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  // Close button
  const closeBtn = document.getElementById('search-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }
}

function handleKeyboard(e) {
  const resultItems = resultsContainer.querySelectorAll('.search-result-item');

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, resultItems.length - 1);
      updateSelection(resultItems);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection(resultItems);
      break;
    case 'Enter':
      e.preventDefault();
      if (selectedIndex >= 0 && currentResults[selectedIndex]) {
        selectResult(currentResults[selectedIndex]);
      }
      break;
    case 'Escape':
      closeSearch();
      break;
  }
}

function updateSelection(items) {
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === selectedIndex);
    if (i === selectedIndex) {
      item.scrollIntoView({ block: 'nearest' });
      item.setAttribute('aria-selected', 'true');
    } else {
      item.setAttribute('aria-selected', 'false');
    }
  });
}

function performSearch() {
  const query = searchInput.value.trim();
  const filters = activeFilters.length > 0 ? { familyLines: activeFilters } : {};

  if (!query && activeFilters.length === 0) {
    resultsContainer.innerHTML = '<div class="search-empty">Type a name, place, or occupation to search</div>';
    currentResults = [];
    selectedIndex = -1;
    return;
  }

  currentResults = searchPeople(query, filters);
  selectedIndex = -1;
  renderResults(currentResults, query);
}

function renderResults(results, query) {
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-empty" role="status">
        <div class="search-empty-icon" aria-hidden="true">🔍</div>
        <p>No results found${query ? ` for "${query}"` : ''}</p>
        <p class="search-empty-hint">Try a different name, place, or family line</p>
      </div>`;
    return;
  }

  const countEl = document.createElement('div');
  countEl.className = 'search-count';
  countEl.setAttribute('role', 'status');
  countEl.setAttribute('aria-live', 'polite');
  countEl.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
  resultsContainer.appendChild(countEl);

  const list = document.createElement('ul');
  list.className = 'search-results-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Search results');

  // Limit displayed results for performance
  const displayCount = Math.min(results.length, 50);

  for (let i = 0; i < displayCount; i++) {
    const person = results[i];
    const li = document.createElement('li');
    li.className = 'search-result-item';
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    li.setAttribute('tabindex', '-1');

    const living = isLiving(person);
    const lineInfo = getFamilyLineInfo(person.familyLine);
    const lifespan = living ? 'Living' : formatLifespan(person);

    li.innerHTML = `
      <div class="result-avatar ${person.gender || 'unknown'}" aria-hidden="true">
        ${getInitial(person)}
      </div>
      <div class="result-info">
        <div class="result-name">${highlightMatch(getFullName(person), query)}</div>
        <div class="result-meta">
          ${lifespan ? `<span class="result-dates">${lifespan}</span>` : ''}
          ${person.birthPlace ? `<span class="result-place">${highlightMatch(person.birthPlace, query)}</span>` : ''}
        </div>
      </div>
      <span class="result-line-badge" style="background:${lineInfo.bg};color:${lineInfo.color}">${lineInfo.label}</span>
    `;

    li.addEventListener('click', () => selectResult(person));
    list.appendChild(li);
  }

  if (results.length > displayCount) {
    const more = document.createElement('li');
    more.className = 'search-more';
    more.textContent = `+ ${results.length - displayCount} more results`;
    list.appendChild(more);
  }

  resultsContainer.appendChild(list);
}

function getInitial(person) {
  if (!person.firstName || person.firstName === 'Unknown') return '?';
  return person.firstName.charAt(0).toUpperCase();
}

function highlightMatch(text, query) {
  if (!query || !text) return text || '';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function selectResult(person) {
  closeSearch();
  if (onSelectCallback) {
    onSelectCallback(person.id);
  }
}

/** Open the search overlay. */
export function openSearch() {
  if (!searchOverlay) return;
  previousFocusElement = document.activeElement;
  searchOverlay.classList.add('active');
  searchOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('search-open');
  setTimeout(() => {
    searchInput.focus();
  }, 100);
}

/** Close the search overlay. */
export function closeSearch() {
  if (!searchOverlay) return;
  clearTimeout(debounceTimer);
  searchOverlay.classList.remove('active');
  searchOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('search-open');
  searchInput.value = '';
  resultsContainer.innerHTML = '';
  currentResults = [];
  selectedIndex = -1;

  // Restore focus to the element that opened search
  if (previousFocusElement && previousFocusElement.focus) {
    previousFocusElement.focus();
    previousFocusElement = null;
  }
}

/** Check if search overlay is open. */
export function isSearchOpen() {
  return searchOverlay && searchOverlay.classList.contains('active');
}
