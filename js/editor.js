/**
 * Edit Mode module for Montgomery Ancestry Browser.
 * Provides drag-and-drop tree editing, inline person editing,
 * add-person, and JSON diff export for the repo owner to review.
 */

import {
  getPerson, getFullName, getAllFamilies, getAllPeople,
  getFamilyLines, getFamilyLineInfo, getFamily
} from './data.js';

// ─── State ──────────────────────────────────────────────────────────
let editModeActive = false;
let changes = [];
let dragState = null;
let previousFocusElement = null;

// Callbacks set during init
let onPersonSelectCb = null;

// ─── Public API ─────────────────────────────────────────────────────

/** Wire up edit-mode UI after DOM is ready. */
export function initEditMode(onPersonSelect) {
  onPersonSelectCb = onPersonSelect;

  const toggle = document.getElementById('edit-mode-toggle');
  if (toggle) toggle.addEventListener('click', toggleEditMode);

  const downloadBtn = document.getElementById('edit-download');
  if (downloadBtn) downloadBtn.addEventListener('click', exportChanges);

  const discardBtn = document.getElementById('edit-discard');
  if (discardBtn) discardBtn.addEventListener('click', discardChanges);

  const fab = document.getElementById('add-person-fab');
  if (fab) fab.addEventListener('click', openAddPersonForm);

  const cancelAdd = document.getElementById('add-person-cancel');
  if (cancelAdd) cancelAdd.addEventListener('click', closeAddPersonForm);

  const addForm = document.getElementById('add-person-form');
  if (addForm) addForm.addEventListener('submit', handleAddPerson);

  // Keyboard shortcut: E to toggle edit mode (outside inputs)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'e' && !e.target.matches('input, textarea, select, [contenteditable]') && !e.ctrlKey && !e.metaKey) {
      toggleEditMode();
    }
  });
}

/** Toggle edit mode on/off. */
export function toggleEditMode() {
  if (editModeActive) {
    deactivateEditMode();
  } else {
    activateEditMode();
  }
}

/** Whether edit mode is currently on. */
export function isEditMode() {
  return editModeActive;
}

/** Return the current change list (read-only copy). */
export function getChanges() {
  return [...changes];
}

/** Download changes as a JSON file. */
export function exportChanges() {
  if (changes.length === 0) {
    announceToScreenReader('No changes to export.');
    return;
  }

  const payload = {
    meta: {
      exportDate: new Date().toISOString(),
      baseDataVersion: '1.0.0',
      totalChanges: changes.length
    },
    changes
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `montgomery-tree-changes-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  announceToScreenReader(`Downloaded ${changes.length} change(s).`);
}

/** Discard all pending changes (with confirmation). */
export function discardChanges() {
  if (changes.length === 0) {
    announceToScreenReader('No changes to discard.');
    return;
  }

  if (!confirm(`Discard ${changes.length} pending change(s)? This cannot be undone.`)) return;

  changes = [];
  updateBadge();
  announceToScreenReader('All changes discarded.');
}

// ─── Activate / Deactivate ──────────────────────────────────────────

function activateEditMode() {
  editModeActive = true;
  document.body.classList.add('edit-mode');

  const toggle = document.getElementById('edit-mode-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', 'true');
    toggle.classList.add('active');
  }

  enableTreeDragDrop();
  updateBadge();
  populateFamilyDropdown();

  announceToScreenReader('Edit mode activated. Tree nodes are draggable. Click a person to edit details.');
}

function deactivateEditMode() {
  if (changes.length > 0) {
    if (!confirm('You have unsaved changes. Leave edit mode? (Changes stay in memory — download or discard them.)')) {
      return;
    }
  }

  editModeActive = false;
  document.body.classList.remove('edit-mode');

  const toggle = document.getElementById('edit-mode-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', 'false');
    toggle.classList.remove('active');
  }

  disableTreeDragDrop();
  closeAddPersonForm();

  announceToScreenReader('Edit mode deactivated.');
}

// ─── Change Tracking ────────────────────────────────────────────────

function recordChange(change) {
  changes.push(change);
  updateBadge();
  announceToScreenReader(`Change recorded. ${changes.length} total change(s).`);
}

function updateBadge() {
  const badge = document.getElementById('edit-change-count');
  if (!badge) return;

  if (changes.length === 0) {
    badge.textContent = '';
    badge.hidden = true;
  } else {
    badge.textContent = changes.length;
    badge.hidden = false;
  }

  // Enable/disable download & discard buttons
  const dl = document.getElementById('edit-download');
  const dc = document.getElementById('edit-discard');
  if (dl) dl.disabled = changes.length === 0;
  if (dc) dc.disabled = changes.length === 0;
}

// ─── Drag & Drop (Tree Nodes) ───────────────────────────────────────

function enableTreeDragDrop() {
  const treeNodes = document.querySelectorAll('.tree-node');

  treeNodes.forEach(node => {
    // SVG elements don't natively support HTML drag & drop,
    // so we use a foreignObject overlay technique:
    // attach pointer events and manage our own drag state.
    node.classList.add('edit-draggable');
    node.setAttribute('data-edit-draggable', 'true');

    node.addEventListener('pointerdown', onDragStart);
  });

  // Family group drop targets
  document.addEventListener('pointermove', onDragMove);
  document.addEventListener('pointerup', onDragEnd);
}

function disableTreeDragDrop() {
  const treeNodes = document.querySelectorAll('.tree-node');
  treeNodes.forEach(node => {
    node.classList.remove('edit-draggable');
    node.removeAttribute('data-edit-draggable');
    node.removeEventListener('pointerdown', onDragStart);
  });

  document.removeEventListener('pointermove', onDragMove);
  document.removeEventListener('pointerup', onDragEnd);

  clearDragGhost();
}

function onDragStart(e) {
  if (!editModeActive) return;

  const node = e.currentTarget;
  const personId = node.getAttribute('data-person-id');
  if (!personId) return;

  const person = getPerson(personId);
  if (!person) return;

  // Need to determine the source family
  const sourceFamily = person.parentFamilyId || null;

  e.preventDefault();
  e.stopPropagation();
  node.setPointerCapture(e.pointerId);

  dragState = {
    personId,
    sourceFamily,
    startX: e.clientX,
    startY: e.clientY,
    active: false,
    pointerId: e.pointerId,
    node
  };
}

function onDragMove(e) {
  if (!dragState) return;

  const dx = e.clientX - dragState.startX;
  const dy = e.clientY - dragState.startY;

  // Activate drag after a small threshold
  if (!dragState.active && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
    dragState.active = true;
    createDragGhost(dragState.personId, e.clientX, e.clientY);
    dragState.node.classList.add('edit-dragging');
    highlightDropTargets(dragState.personId);
  }

  if (dragState.active) {
    moveDragGhost(e.clientX, e.clientY);
    updateDropTargetHighlight(e.clientX, e.clientY);
  }
}

function onDragEnd(e) {
  if (!dragState) return;

  if (dragState.active) {
    const target = findDropTarget(e.clientX, e.clientY);
    if (target && target !== dragState.sourceFamily) {
      // Confirm move
      const person = getPerson(dragState.personId);
      const personName = person ? getFullName(person) : dragState.personId;
      if (confirm(`Move "${personName}" to family "${target}"?`)) {
        recordChange({
          type: 'move',
          personId: dragState.personId,
          fromFamily: dragState.sourceFamily,
          toFamily: target
        });
      }
    }
    dragState.node.classList.remove('edit-dragging');
    clearDragGhost();
    clearDropTargetHighlights();
  }

  if (dragState.node && dragState.pointerId !== undefined) {
    try { dragState.node.releasePointerCapture(dragState.pointerId); } catch (_) { /* ok */ }
  }

  dragState = null;
}

function createDragGhost(personId, x, y) {
  clearDragGhost();
  const person = getPerson(personId);
  if (!person) return;

  const ghost = document.createElement('div');
  ghost.id = 'edit-drag-ghost';
  ghost.className = 'edit-drag-ghost';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.textContent = getFullName(person);
  ghost.style.left = x + 'px';
  ghost.style.top = y + 'px';
  document.body.appendChild(ghost);
}

function moveDragGhost(x, y) {
  const ghost = document.getElementById('edit-drag-ghost');
  if (!ghost) return;
  ghost.style.left = (x + 12) + 'px';
  ghost.style.top = (y + 12) + 'px';
}

function clearDragGhost() {
  const ghost = document.getElementById('edit-drag-ghost');
  if (ghost) ghost.remove();
}

function highlightDropTargets(excludePersonId) {
  // Highlight all family groups (tree-node groups representing couples)
  const allNodes = document.querySelectorAll('.tree-node');
  allNodes.forEach(node => {
    const pid = node.getAttribute('data-person-id');
    if (pid === excludePersonId) return;

    const person = getPerson(pid);
    if (!person) return;

    // Only highlight nodes that are parents (have spouseFamilyIds)
    if (person.spouseFamilyIds && person.spouseFamilyIds.length > 0) {
      node.classList.add('edit-drop-target');
    }
  });
}

function updateDropTargetHighlight(x, y) {
  const targets = document.querySelectorAll('.edit-drop-target');
  targets.forEach(t => t.classList.remove('edit-drop-hover'));

  const el = document.elementFromPoint(x, y);
  if (!el) return;
  const treeNode = el.closest('.tree-node.edit-drop-target');
  if (treeNode) {
    treeNode.classList.add('edit-drop-hover');
  }
}

function findDropTarget(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;

  const treeNode = el.closest('.tree-node.edit-drop-target');
  if (!treeNode) return null;

  const personId = treeNode.getAttribute('data-person-id');
  const person = getPerson(personId);
  if (!person || !person.spouseFamilyIds || person.spouseFamilyIds.length === 0) return null;

  // Return the first spouse family as the target
  return person.spouseFamilyIds[0];
}

function clearDropTargetHighlights() {
  document.querySelectorAll('.edit-drop-target').forEach(el => {
    el.classList.remove('edit-drop-target', 'edit-drop-hover');
  });
}

// ─── Keyboard Alternative for Drag & Drop ───────────────────────────

/** Open a keyboard-accessible move dialog (called from person panel). */
export function openMoveDialog(personId) {
  const person = getPerson(personId);
  if (!person) return;

  const families = getAllFamilies();
  const options = families
    .filter(f => f.id !== person.parentFamilyId)
    .map(f => {
      const h = f.husband ? getPerson(f.husband) : null;
      const w = f.wife ? getPerson(f.wife) : null;
      const label = [h ? getFullName(h) : '', w ? getFullName(w) : ''].filter(Boolean).join(' & ');
      return { id: f.id, label: label || f.id };
    });

  if (options.length === 0) {
    alert('No target families available.');
    return;
  }

  const overlay = document.getElementById('move-dialog-overlay');
  const select = document.getElementById('move-target-select');
  const nameEl = document.getElementById('move-person-name');
  if (!overlay || !select || !nameEl) return;

  nameEl.textContent = getFullName(person);
  select.innerHTML = '<option value="">— Select target family —</option>';
  for (const opt of options) {
    const o = document.createElement('option');
    o.value = opt.id;
    o.textContent = opt.label;
    select.appendChild(o);
  }

  overlay.dataset.personId = personId;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  select.focus();

  const confirmBtn = document.getElementById('move-dialog-confirm');
  const cancelBtn = document.getElementById('move-dialog-cancel');

  // Remove old listeners by cloning
  const newConfirm = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
  const newCancel = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

  newConfirm.addEventListener('click', () => {
    const targetFamily = select.value;
    if (!targetFamily) { select.focus(); return; }

    recordChange({
      type: 'move',
      personId,
      fromFamily: person.parentFamilyId || null,
      toFamily: targetFamily
    });

    closeMoveDialog();
  });

  newCancel.addEventListener('click', closeMoveDialog);
}

function closeMoveDialog() {
  const overlay = document.getElementById('move-dialog-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

// ─── Edit Person Details (in-panel) ─────────────────────────────────

const EDITABLE_FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'middleName', label: 'Middle Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'birthDate', label: 'Birth Date' },
  { key: 'birthPlace', label: 'Birth Place' },
  { key: 'deathDate', label: 'Death Date' },
  { key: 'deathPlace', label: 'Death Place' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'notes', label: 'Notes' }
];

/**
 * Build edit-mode controls to inject into the person panel.
 * Returns an HTML string with edit buttons for each field.
 */
export function buildEditControls(personId) {
  if (!editModeActive) return '';

  const person = getPerson(personId);
  if (!person) return '';

  let html = `
    <section class="person-section edit-section" aria-label="Edit person">
      <h3>✏️ Edit Details</h3>
      <div class="edit-fields">`;

  for (const field of EDITABLE_FIELDS) {
    const currentVal = field.key === 'occupation'
      ? (Array.isArray(person[field.key]) ? person[field.key].join(', ') : (person[field.key] || ''))
      : (person[field.key] || '');

    const escapedVal = escapeAttr(currentVal);

    html += `
        <div class="edit-field-row" data-field="${field.key}">
          <label class="edit-field-label" for="edit-${field.key}">${field.label}</label>
          <div class="edit-field-input-wrap">
            <input
              id="edit-${field.key}"
              type="text"
              class="edit-field-input"
              value="${escapedVal}"
              data-original="${escapedVal}"
              data-field="${field.key}"
              data-person-id="${personId}"
              aria-label="Edit ${field.label}"
            >
          </div>
        </div>`;
  }

  html += `
      </div>
      <div class="edit-actions">
        <button type="button" class="edit-save-btn" data-person-id="${personId}">💾 Save Changes</button>
        <button type="button" class="edit-reset-btn" data-person-id="${personId}">↩ Reset</button>
      </div>
      <div class="edit-actions" style="margin-top: var(--sp-2)">
        <button type="button" class="edit-move-btn" data-person-id="${personId}" aria-label="Move person to different family">🔀 Move to Family…</button>
      </div>
    </section>`;

  return html;
}

/** Bind event listeners to the edit controls inside the panel. */
export function bindEditControls(container, personId) {
  if (!editModeActive || !container) return;

  const saveBtn = container.querySelector('.edit-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => savePersonEdits(container, personId));
  }

  const resetBtn = container.querySelector('.edit-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => resetPersonEdits(container));
  }

  const moveBtn = container.querySelector('.edit-move-btn');
  if (moveBtn) {
    moveBtn.addEventListener('click', () => openMoveDialog(personId));
  }
}

function savePersonEdits(container, personId) {
  const inputs = container.querySelectorAll('.edit-field-input');
  let savedCount = 0;

  inputs.forEach(input => {
    const field = input.dataset.field;
    const original = input.dataset.original;
    const newVal = input.value.trim();

    if (newVal !== original) {
      recordChange({
        type: 'edit',
        personId,
        field,
        oldValue: original,
        newValue: newVal
      });
      input.dataset.original = newVal;
      savedCount++;
    }
  });

  if (savedCount === 0) {
    announceToScreenReader('No changes to save.');
  }
}

function resetPersonEdits(container) {
  const inputs = container.querySelectorAll('.edit-field-input');
  inputs.forEach(input => {
    input.value = input.dataset.original;
  });
  announceToScreenReader('Fields reset to original values.');
}

// ─── Add Person ─────────────────────────────────────────────────────

function populateFamilyDropdown() {
  const select = document.getElementById('add-person-family');
  if (!select) return;

  const families = getAllFamilies();
  select.innerHTML = '<option value="">— Select parent family —</option>';

  for (const fam of families) {
    const h = fam.husband ? getPerson(fam.husband) : null;
    const w = fam.wife ? getPerson(fam.wife) : null;
    const label = [h ? getFullName(h) : '', w ? getFullName(w) : ''].filter(Boolean).join(' & ');

    const opt = document.createElement('option');
    opt.value = fam.id;
    opt.textContent = label || fam.id;
    select.appendChild(opt);
  }
}

function openAddPersonForm() {
  const overlay = document.getElementById('add-person-overlay');
  if (!overlay) return;

  previousFocusElement = document.activeElement;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  const firstInput = overlay.querySelector('input');
  if (firstInput) firstInput.focus();
}

function closeAddPersonForm() {
  const overlay = document.getElementById('add-person-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');

  // Clear form
  const form = document.getElementById('add-person-form');
  if (form) form.reset();

  if (previousFocusElement && previousFocusElement.focus) {
    previousFocusElement.focus();
    previousFocusElement = null;
  }
}

function handleAddPerson(e) {
  e.preventDefault();

  const form = e.target;
  const firstName = form.querySelector('#add-first-name').value.trim();
  const middleName = form.querySelector('#add-middle-name').value.trim() || null;
  const lastName = form.querySelector('#add-last-name').value.trim();
  const gender = form.querySelector('#add-gender').value;
  const birthDate = form.querySelector('#add-birth-date').value.trim() || null;
  const deathDate = form.querySelector('#add-death-date').value.trim() || null;
  const familyId = form.querySelector('#add-person-family').value;

  if (!firstName || !lastName) {
    alert('First name and last name are required.');
    return;
  }
  if (!familyId) {
    alert('Please select a parent family.');
    return;
  }

  const id = generatePersonId(firstName, middleName, lastName);

  const person = {
    id,
    firstName,
    middleName,
    lastName,
    gender: gender || 'unknown',
    birthDate,
    deathDate,
    familyLine: determineFamilyLine(familyId)
  };

  recordChange({
    type: 'add',
    person,
    familyId
  });

  closeAddPersonForm();
}

function generatePersonId(first, middle, last) {
  const parts = [first, middle, last].filter(Boolean).map(s => s.toLowerCase().replace(/\s+/g, '-'));
  const base = parts.join('-');
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}

function determineFamilyLine(familyId) {
  const fam = getFamily(familyId);
  if (!fam) return null;

  const h = fam.husband ? getPerson(fam.husband) : null;
  const w = fam.wife ? getPerson(fam.wife) : null;
  return (h && h.familyLine) || (w && w.familyLine) || null;
}

// ─── Utilities ──────────────────────────────────────────────────────

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function announceToScreenReader(message) {
  const region = document.getElementById('edit-live-region');
  if (region) {
    region.textContent = message;
  }
}
