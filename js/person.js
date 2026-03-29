/**
 * Person detail panel for Montgomery Ancestry Browser.
 * Shows comprehensive info in a slide-in panel (desktop) or bottom sheet (mobile).
 */

import {
  getPerson, getFullName, getShortName, formatDate, formatLifespan,
  extractYear, isLiving, getFamilyLineInfo, getParents, getSiblings,
  getSpouses, getChildren, getAge
} from './data.js';

let panel = null;
let currentPersonId = null;
let onNavigateCallback = null;
let previousFocusElement = null;

/** Escape HTML special characters to prevent XSS. */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Initialize the person detail panel. */
export function initPersonPanel(onNavigate) {
  onNavigateCallback = onNavigate;
  panel = document.getElementById('person-panel');

  if (!panel) return;

  const closeBtn = panel.querySelector('.panel-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  // Close on backdrop click (mobile overlay)
  panel.addEventListener('click', (e) => {
    if (e.target === panel) closePanel();
  });
}

/** Show person details for a given person ID. */
export function showPerson(personId) {
  const person = getPerson(personId);
  if (!person || !panel) return;

  // Store previous focus for restoration on close
  previousFocusElement = document.activeElement;

  currentPersonId = personId;
  const living = isLiving(person);
  const content = panel.querySelector('.panel-content');
  if (!content) return;

  content.innerHTML = buildPersonHTML(person, living);
  bindPersonLinks(content);

  panel.classList.add('active');
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('panel-open');

  // Focus management for accessibility
  const heading = content.querySelector('h2');
  if (heading) heading.focus();

  // Trap focus within panel
  panel.addEventListener('keydown', trapFocus);
}

/** Close the person panel. */
export function closePanel() {
  if (!panel) return;
  panel.classList.remove('active');
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('panel-open');
  panel.removeEventListener('keydown', trapFocus);
  currentPersonId = null;

  // Restore focus to the element that opened the panel
  if (previousFocusElement && previousFocusElement.focus) {
    previousFocusElement.focus();
    previousFocusElement = null;
  }
}

/** Check if panel is currently showing. */
export function isPanelOpen() {
  return panel && panel.classList.contains('active');
}

/** Get the currently displayed person ID. */
export function getCurrentPersonId() {
  return currentPersonId;
}

function buildPersonHTML(person, living) {
  const lineInfo = getFamilyLineInfo(person.familyLine);
  const lifespan = living ? 'Living' : formatLifespan(person);
  const age = getAge(person);
  const confidence = person.confidence || 'LOW';

  // Determine how much data this person has
  const dataDensity = calcDataDensity(person);

  return `
    <div class="person-header">
      <div class="person-avatar-large ${person.gender || 'unknown'}" aria-hidden="true">
        ${getInitials(person)}
      </div>
      <div class="person-header-info">
        <h2 tabindex="-1">${getFullName(person)}</h2>
        ${lifespan ? `<p class="person-lifespan">${lifespan}${age !== null ? ` (age ${age})` : ''}</p>` : ''}
        <div class="person-badges">
          <span class="family-line-badge" style="background:${lineInfo.bg};color:${lineInfo.color}">
            ${lineInfo.label}
          </span>
          <span class="confidence-badge confidence-${confidence.toLowerCase()}" title="Data confidence: ${confidence}">
            ${confidence === 'HIGH' ? '●●●' : confidence === 'MEDIUM' ? '●●○' : '●○○'} ${confidence}
          </span>
        </div>
      </div>
    </div>

    ${buildQuickFacts(person, living)}
    ${buildImmigration(person)}
    ${buildMarriages(person)}
    ${buildFamilySection(person)}
    ${buildLifeDetails(person)}
    ${buildNotes(person)}
    ${buildSources(person)}

    ${dataDensity < 3 ? `
      <div class="sparse-notice">
        <p>📋 Limited records available for this individual</p>
      </div>` : ''}
  `;
}

function buildQuickFacts(person, living) {
  const facts = [];

  if (person.birthDate || person.birthPlace) {
    const date = living ? '(date hidden for privacy)' : formatDate(person.birthDate);
    facts.push({
      label: 'Born',
      value: [date, person.birthPlace].filter(Boolean).join(' — ')
    });
  }

  if (person.deathDate || person.deathPlace) {
    // Check for infant death
    const birthYear = extractYear(person.birthDate);
    const deathYear = extractYear(person.deathDate);
    const isInfantDeath = birthYear && deathYear && (parseInt(deathYear) - parseInt(birthYear)) <= 1;

    facts.push({
      label: 'Died',
      value: [formatDate(person.deathDate), person.deathPlace].filter(Boolean).join(' — '),
      note: isInfantDeath ? 'Died in infancy' : null
    });
  } else if (!living && !person.deathDate) {
    // Historical person with no death date — don't show "Died: Unknown"
  }

  if (person.burialPlace) {
    facts.push({ label: 'Buried', value: person.burialPlace });
  }

  if (person.religion) {
    facts.push({ label: 'Religion', value: person.religion });
  }

  if (facts.length === 0) return '';

  return `
    <section class="person-section" aria-label="Quick facts">
      <h3>Quick Facts</h3>
      <dl class="facts-grid">
        ${facts.map(f => `
          <div class="fact-row">
            <dt>${f.label}</dt>
            <dd>${f.value}${f.note ? `<span class="fact-note">${f.note}</span>` : ''}</dd>
          </div>
        `).join('')}
      </dl>
    </section>`;
}

function buildImmigration(person) {
  if (!person.immigration) return '';

  const parts = [];
  if (person.immigration.from) parts.push(`from ${person.immigration.from}`);
  if (person.immigration.to) parts.push(`to ${person.immigration.to}`);
  if (person.immigration.date) parts.push(`in ${formatDate(person.immigration.date)}`);
  if (person.immigration.ship) parts.push(`aboard ${person.immigration.ship}`);

  if (parts.length === 0) return '';

  return `
    <section class="person-section" aria-label="Immigration">
      <h3>Immigration</h3>
      <p class="immigration-text">🚢 Immigrated ${parts.join(' ')}</p>
    </section>`;
}

function buildMarriages(person) {
  const spouses = getSpouses(person.id);
  if (spouses.length === 0) return '';

  return `
    <section class="person-section" aria-label="Marriages">
      <h3>Marriage${spouses.length > 1 ? 's' : ''}</h3>
      <div class="marriages-list">
        ${spouses.map((s, i) => {
          const spouseName = s.spouse ? getFullName(s.spouse) : 'Unknown spouse';
          const spouseId = s.spouse ? s.spouse.id : null;
          const date = formatDate(s.marriageDate);
          const place = s.marriagePlace;
          const childCount = s.children.length;

          return `
            <div class="marriage-card">
              <div class="marriage-header">
                <span class="marriage-number" aria-hidden="true">${spouses.length > 1 ? `${i + 1}.` : '💍'}</span>
                ${spouseId
                  ? `<a href="#" class="person-link" data-person-id="${spouseId}">${spouseName}</a>`
                  : `<span>${spouseName}</span>`
                }
              </div>
              <div class="marriage-details">
                ${date ? `<span>Married: ${date}</span>` : ''}
                ${place ? `<span>at ${place}</span>` : ''}
                ${childCount > 0 ? `<span>${childCount} child${childCount !== 1 ? 'ren' : ''}</span>` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>
    </section>`;
}

function buildFamilySection(person) {
  const parents = getParents(person.id);
  const siblings = getSiblings(person.id);
  const children = getChildren(person.id);

  if (!parents && siblings.length === 0 && children.length === 0) return '';

  let html = '<section class="person-section" aria-label="Family"><h3>Family</h3>';

  if (parents) {
    html += '<div class="family-group">';
    html += '<h4>Parents</h4><ul class="family-list">';
    if (parents.father) {
      html += `<li>${personLink(parents.father)} <span class="relation-label">Father</span></li>`;
    }
    if (parents.mother) {
      html += `<li>${personLink(parents.mother)} <span class="relation-label">Mother</span></li>`;
    }
    html += '</ul></div>';
  }

  if (siblings.length > 0) {
    html += '<div class="family-group">';
    html += `<h4>Siblings (${siblings.length})</h4><ul class="family-list">`;
    for (const sib of siblings) {
      html += `<li>${personLink(sib)}</li>`;
    }
    html += '</ul></div>';
  }

  if (children.length > 0) {
    html += '<div class="family-group">';
    html += `<h4>Children (${children.length})</h4><ul class="family-list">`;
    for (const child of children) {
      html += `<li>${personLink(child)}</li>`;
    }
    html += '</ul></div>';
  }

  html += '</section>';
  return html;
}

function buildLifeDetails(person) {
  const sections = [];

  // Occupations
  if (person.occupation) {
    const occ = Array.isArray(person.occupation) ? person.occupation : [person.occupation];
    sections.push(`<div class="life-detail"><h4>Occupation</h4><ul>${occ.map(o => `<li>${escapeHTML(o)}</li>`).join('')}</ul></div>`);
  }

  // Education
  if (person.education) {
    const edu = Array.isArray(person.education) ? person.education : [person.education];
    sections.push(`<div class="life-detail"><h4>Education</h4><ul>${edu.map(e => `<li>${escapeHTML(e)}</li>`).join('')}</ul></div>`);
  }

  // Military service
  if (person.militaryService && person.militaryService.length > 0) {
    sections.push(`<div class="life-detail"><h4>Military Service</h4><ul>${person.militaryService.map(m => `<li>⚔️ ${escapeHTML(m)}</li>`).join('')}</ul></div>`);
  }

  // Residences
  if (person.residences && person.residences.length > 0) {
    sections.push(`<div class="life-detail"><h4>Residences</h4><ul>${person.residences.map(r =>
      `<li>📍 ${escapeHTML(r.place)}${r.period ? ` (${escapeHTML(r.period)})` : ''}</li>`
    ).join('')}</ul></div>`);
  }

  if (sections.length === 0) return '';

  return `
    <section class="person-section" aria-label="Life details">
      <h3>Life Details</h3>
      ${sections.join('')}
    </section>`;
}

function buildNotes(person) {
  if (!person.notes) return '';

  return `
    <section class="person-section" aria-label="Notes">
      <h3>Research Notes</h3>
      <p class="person-notes">${escapeHTML(person.notes)}</p>
    </section>`;
}

function buildSources(person) {
  if (!person.sources || person.sources.length === 0) return '';

  return `
    <section class="person-section" aria-label="Sources">
      <h3>Sources</h3>
      <ul class="sources-list">
        ${person.sources.map(s => `<li>📄 ${escapeHTML(s)}</li>`).join('')}
      </ul>
    </section>`;
}

function personLink(person) {
  if (!person) return '<span>Unknown</span>';
  const living = isLiving(person);
  const lifespan = living ? 'Living' : formatLifespan(person);
  return `<a href="#" class="person-link" data-person-id="${person.id}">
    ${getShortName(person)}${lifespan ? ` <span class="link-dates">(${lifespan})</span>` : ''}
  </a>`;
}

function getInitials(person) {
  if (!person) return '?';
  const first = person.firstName && person.firstName !== 'Unknown' ? person.firstName[0] : '?';
  const last = person.lastName ? person.lastName[0] : '';
  return (first + last).toUpperCase();
}

function calcDataDensity(person) {
  let count = 0;
  if (person.birthDate) count++;
  if (person.birthPlace) count++;
  if (person.deathDate) count++;
  if (person.deathPlace) count++;
  if (person.burialPlace) count++;
  if (person.occupation) count++;
  if (person.education) count++;
  if (person.militaryService && person.militaryService.length > 0) count++;
  if (person.residences && person.residences.length > 0) count++;
  if (person.immigration) count++;
  if (person.notes) count++;
  if (person.religion) count++;
  return count;
}

function bindPersonLinks(container) {
  container.querySelectorAll('.person-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.personId;
      if (id && onNavigateCallback) {
        onNavigateCallback(id);
      }
    });
  });
}

/** Trap focus within the person panel when it is open (accessibility). */
function trapFocus(e) {
  if (e.key !== 'Tab') return;

  const focusable = panel.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), a[data-person-id]'
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
