/**
 * Unit Tests — Editor Module
 * Tests for edit-mode change tracking, export format, and state management.
 * Since editor.js is ESM with heavy DOM dependencies, we test the pure logic
 * via a CJS helper that mirrors the core state management.
 *
 * Source: Phase 2 — Edit Mode feature (js/editor.js)
 */

const { getPerson, getFullName, getFamily } = require('./helpers/dataModule.cjs');

// ─── Editor State Helper (mirrors editor.js pure logic) ─────────────

function createEditorState() {
  let editModeActive = false;
  let changes = [];

  return {
    isEditMode: () => editModeActive,

    activateEditMode: () => { editModeActive = true; },
    deactivateEditMode: () => { editModeActive = false; },

    toggleEditMode: () => { editModeActive = !editModeActive; },

    getChanges: () => [...changes],

    recordChange: (change) => { changes.push(change); },

    discardChanges: () => { changes = []; },

    exportPayload: () => ({
      meta: {
        exportDate: new Date().toISOString(),
        baseDataVersion: '1.0.0',
        totalChanges: changes.length
      },
      changes: [...changes]
    }),

    /** Mirrors generatePersonId from editor.js */
    generatePersonId: (first, middle, last) => {
      const parts = [first, middle, last].filter(Boolean).map(s => s.toLowerCase().replace(/\s+/g, '-'));
      return parts.join('-');
    },

    /** Mirrors determineFamilyLine from editor.js */
    determineFamilyLine: (familyId) => {
      const fam = getFamily(familyId);
      if (!fam) return null;
      const h = fam.husband ? getPerson(fam.husband) : null;
      const w = fam.wife ? getPerson(fam.wife) : null;
      return (h && h.familyLine) || (w && w.familyLine) || null;
    },

    /** Mirrors escapeAttr from editor.js */
    escapeAttr: (str) => {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  };
}

describe('Editor Module', () => {

  let editor;

  beforeEach(() => {
    editor = createEditorState();
  });

  // ─── Edit Mode Toggle ───────────────────────────────────────────

  describe('Edit Mode Toggle', () => {

    test('edit mode is off by default', () => {
      expect(editor.isEditMode()).toBe(false);
    });

    test('toggleEditMode activates edit mode', () => {
      editor.toggleEditMode();
      expect(editor.isEditMode()).toBe(true);
    });

    test('toggleEditMode twice returns to off', () => {
      editor.toggleEditMode();
      editor.toggleEditMode();
      expect(editor.isEditMode()).toBe(false);
    });

    test('activateEditMode explicitly sets on', () => {
      editor.activateEditMode();
      expect(editor.isEditMode()).toBe(true);
    });

    test('deactivateEditMode explicitly sets off', () => {
      editor.activateEditMode();
      editor.deactivateEditMode();
      expect(editor.isEditMode()).toBe(false);
    });

    test('multiple activations are idempotent', () => {
      editor.activateEditMode();
      editor.activateEditMode();
      expect(editor.isEditMode()).toBe(true);
    });
  });

  // ─── Change Tracking ────────────────────────────────────────────

  describe('Change Tracking', () => {

    test('starts with no changes', () => {
      expect(editor.getChanges()).toEqual([]);
      expect(editor.getChanges().length).toBe(0);
    });

    test('recordChange adds an edit change', () => {
      editor.recordChange({
        type: 'edit',
        personId: 'fred-e-thompson-1871',
        field: 'birthPlace',
        oldValue: 'Chatham, Ontario',
        newValue: 'Chatham, Kent, Ontario, Canada'
      });
      expect(editor.getChanges().length).toBe(1);
      expect(editor.getChanges()[0].type).toBe('edit');
    });

    test('recordChange adds a move change', () => {
      editor.recordChange({
        type: 'move',
        personId: 'melinda-thompson-1820',
        fromFamily: 'family-charles-thompson-millicent-betts',
        toFamily: 'family-calvin-thompson-serene-steves'
      });
      const changes = editor.getChanges();
      expect(changes.length).toBe(1);
      expect(changes[0].type).toBe('move');
      expect(changes[0].fromFamily).toBe('family-charles-thompson-millicent-betts');
      expect(changes[0].toFamily).toBe('family-calvin-thompson-serene-steves');
    });

    test('recordChange adds an add-person change', () => {
      editor.recordChange({
        type: 'add',
        person: {
          id: 'test-person-1850',
          firstName: 'Test',
          lastName: 'Person',
          gender: 'male',
          birthDate: '1850',
          familyLine: 'thompson'
        },
        familyId: 'family-thompson-patriarch'
      });
      const changes = editor.getChanges();
      expect(changes.length).toBe(1);
      expect(changes[0].type).toBe('add');
      expect(changes[0].person.firstName).toBe('Test');
      expect(changes[0].familyId).toBe('family-thompson-patriarch');
    });

    test('multiple changes accumulate in order', () => {
      editor.recordChange({ type: 'edit', personId: 'a', field: 'firstName', oldValue: 'X', newValue: 'Y' });
      editor.recordChange({ type: 'move', personId: 'b', fromFamily: 'f1', toFamily: 'f2' });
      editor.recordChange({ type: 'add', person: { id: 'c' }, familyId: 'f3' });
      const changes = editor.getChanges();
      expect(changes.length).toBe(3);
      expect(changes[0].type).toBe('edit');
      expect(changes[1].type).toBe('move');
      expect(changes[2].type).toBe('add');
    });

    test('getChanges returns a copy (not a reference)', () => {
      editor.recordChange({ type: 'edit', personId: 'x', field: 'notes', oldValue: '', newValue: 'test' });
      const copy = editor.getChanges();
      copy.push({ type: 'fake' });
      expect(editor.getChanges().length).toBe(1);
    });
  });

  // ─── Discard Changes ────────────────────────────────────────────

  describe('Discard Changes', () => {

    test('discardChanges clears all changes', () => {
      editor.recordChange({ type: 'edit', personId: 'a', field: 'x', oldValue: '', newValue: 'y' });
      editor.recordChange({ type: 'move', personId: 'b', fromFamily: 'f1', toFamily: 'f2' });
      expect(editor.getChanges().length).toBe(2);
      editor.discardChanges();
      expect(editor.getChanges().length).toBe(0);
    });

    test('discardChanges on empty is a no-op', () => {
      editor.discardChanges();
      expect(editor.getChanges()).toEqual([]);
    });

    test('changes can be added again after discard', () => {
      editor.recordChange({ type: 'edit', personId: 'x', field: 'a', oldValue: '', newValue: 'b' });
      editor.discardChanges();
      editor.recordChange({ type: 'move', personId: 'y', fromFamily: 'f1', toFamily: 'f2' });
      expect(editor.getChanges().length).toBe(1);
      expect(editor.getChanges()[0].type).toBe('move');
    });
  });

  // ─── Export Format ──────────────────────────────────────────────

  describe('Export Format', () => {

    test('export payload has meta and changes fields', () => {
      const payload = editor.exportPayload();
      expect(payload).toHaveProperty('meta');
      expect(payload).toHaveProperty('changes');
    });

    test('export meta contains required fields', () => {
      const { meta } = editor.exportPayload();
      expect(meta).toHaveProperty('exportDate');
      expect(meta).toHaveProperty('baseDataVersion');
      expect(meta).toHaveProperty('totalChanges');
    });

    test('export meta.totalChanges matches change count', () => {
      editor.recordChange({ type: 'edit', personId: 'a', field: 'x', oldValue: '', newValue: 'y' });
      editor.recordChange({ type: 'edit', personId: 'b', field: 'z', oldValue: '', newValue: 'w' });
      const { meta } = editor.exportPayload();
      expect(meta.totalChanges).toBe(2);
    });

    test('export meta.exportDate is a valid ISO date string', () => {
      const { meta } = editor.exportPayload();
      expect(new Date(meta.exportDate).toISOString()).toBe(meta.exportDate);
    });

    test('export meta.baseDataVersion is "1.0.0"', () => {
      const { meta } = editor.exportPayload();
      expect(meta.baseDataVersion).toBe('1.0.0');
    });

    test('export changes array contains all recorded changes', () => {
      editor.recordChange({ type: 'edit', personId: 'a', field: 'firstName', oldValue: 'A', newValue: 'B' });
      editor.recordChange({ type: 'move', personId: 'b', fromFamily: 'f1', toFamily: 'f2' });
      const { changes } = editor.exportPayload();
      expect(changes.length).toBe(2);
      expect(changes[0]).toEqual({ type: 'edit', personId: 'a', field: 'firstName', oldValue: 'A', newValue: 'B' });
    });

    test('empty export has zero changes', () => {
      const payload = editor.exportPayload();
      expect(payload.meta.totalChanges).toBe(0);
      expect(payload.changes).toEqual([]);
    });

    test('export payload is valid JSON', () => {
      editor.recordChange({ type: 'add', person: { id: 'test', firstName: 'T' }, familyId: 'f1' });
      const json = JSON.stringify(editor.exportPayload(), null, 2);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    test('export returns a copy (not internal reference)', () => {
      editor.recordChange({ type: 'edit', personId: 'x', field: 'a', oldValue: '', newValue: 'b' });
      const payload = editor.exportPayload();
      payload.changes.push({ type: 'fake' });
      expect(editor.exportPayload().changes.length).toBe(1);
    });
  });

  // ─── Change Types ───────────────────────────────────────────────

  describe('Change Types', () => {

    test('edit change has required fields', () => {
      const change = {
        type: 'edit',
        personId: 'fred-e-thompson-1871',
        field: 'occupation',
        oldValue: 'Homeopathic physician',
        newValue: 'Physician, Homeopath'
      };
      editor.recordChange(change);
      const recorded = editor.getChanges()[0];
      expect(recorded.type).toBe('edit');
      expect(recorded.personId).toBe('fred-e-thompson-1871');
      expect(recorded.field).toBe('occupation');
      expect(recorded.oldValue).toBeDefined();
      expect(recorded.newValue).toBeDefined();
    });

    test('move change has required fields', () => {
      const change = {
        type: 'move',
        personId: 'melinda-thompson-1820',
        fromFamily: 'family-charles-thompson-millicent-betts',
        toFamily: 'family-thompson-patriarch'
      };
      editor.recordChange(change);
      const recorded = editor.getChanges()[0];
      expect(recorded.type).toBe('move');
      expect(recorded.personId).toBeDefined();
      expect(recorded.fromFamily).toBeDefined();
      expect(recorded.toFamily).toBeDefined();
    });

    test('add change has person object and familyId', () => {
      const change = {
        type: 'add',
        person: {
          id: 'new-person-1855',
          firstName: 'New',
          middleName: null,
          lastName: 'Person',
          gender: 'female',
          birthDate: '1855',
          deathDate: null,
          familyLine: 'thompson'
        },
        familyId: 'family-thompson-patriarch'
      };
      editor.recordChange(change);
      const recorded = editor.getChanges()[0];
      expect(recorded.type).toBe('add');
      expect(recorded.person).toHaveProperty('id');
      expect(recorded.person).toHaveProperty('firstName');
      expect(recorded.person).toHaveProperty('lastName');
      expect(recorded.familyId).toBe('family-thompson-patriarch');
    });

    test('mixed change types in single session', () => {
      editor.recordChange({ type: 'edit', personId: 'a', field: 'notes', oldValue: '', newValue: 'updated' });
      editor.recordChange({ type: 'move', personId: 'b', fromFamily: 'f1', toFamily: 'f2' });
      editor.recordChange({ type: 'add', person: { id: 'c', firstName: 'C', lastName: 'D' }, familyId: 'f3' });
      editor.recordChange({ type: 'edit', personId: 'a', field: 'birthDate', oldValue: '1820', newValue: '1821' });

      const changes = editor.getChanges();
      expect(changes.length).toBe(4);
      expect(changes.filter(c => c.type === 'edit').length).toBe(2);
      expect(changes.filter(c => c.type === 'move').length).toBe(1);
      expect(changes.filter(c => c.type === 'add').length).toBe(1);
    });
  });

  // ─── Person ID Generation ──────────────────────────────────────

  describe('Person ID Generation', () => {

    test('generates ID from first + last', () => {
      const id = editor.generatePersonId('John', null, 'Smith');
      expect(id).toBe('john-smith');
    });

    test('generates ID from first + middle + last', () => {
      const id = editor.generatePersonId('Fred', 'Eugene', 'Thompson');
      expect(id).toBe('fred-eugene-thompson');
    });

    test('lowercases all parts', () => {
      const id = editor.generatePersonId('MARY', 'ANN', 'JONES');
      expect(id).toBe('mary-ann-jones');
    });

    test('replaces spaces with hyphens', () => {
      const id = editor.generatePersonId('Mary Jane', null, 'Van Der Berg');
      expect(id).toBe('mary-jane-van-der-berg');
    });
  });

  // ─── Family Line Detection ─────────────────────────────────────

  describe('Family Line Detection', () => {

    test('determines thompson family line from patriarch family', () => {
      const line = editor.determineFamilyLine('family-thompson-patriarch');
      expect(line).toBe('thompson');
    });

    test('returns null for nonexistent family', () => {
      const line = editor.determineFamilyLine('nonexistent-family');
      expect(line).toBeNull();
    });
  });

  // ─── Escape Attribute ──────────────────────────────────────────

  describe('Escape Attribute', () => {

    test('escapes ampersand', () => {
      expect(editor.escapeAttr('A & B')).toBe('A &amp; B');
    });

    test('escapes double quotes', () => {
      expect(editor.escapeAttr('He said "hi"')).toBe('He said &quot;hi&quot;');
    });

    test('escapes angle brackets', () => {
      expect(editor.escapeAttr('<script>')).toBe('&lt;script&gt;');
    });

    test('returns empty string for null', () => {
      expect(editor.escapeAttr(null)).toBe('');
    });

    test('returns empty string for empty string', () => {
      expect(editor.escapeAttr('')).toBe('');
    });

    test('passes through safe strings unchanged', () => {
      expect(editor.escapeAttr('Hello World')).toBe('Hello World');
    });
  });
});
