/**
 * Data Validation Tests — Accuracy
 * Spot-checks JSON data against validated research (research/validated-tree.md).
 * Targets high-confidence (🟢) data points that would indicate
 * systematic transcription errors if wrong.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 5.3
 */

const fs = require('fs');
const path = require('path');

describe('Data Accuracy vs. Validated Research', () => {

  let people;
  let lookup;
  let families;

  beforeAll(() => {
    const peopleRaw = fs.readFileSync(path.resolve(__dirname, '../../data/people.json'), 'utf-8');
    const peopleData = JSON.parse(peopleRaw);
    lookup = peopleData.people;
    people = Object.values(lookup);

    const ftRaw = fs.readFileSync(path.resolve(__dirname, '../../data/family-tree.json'), 'utf-8');
    const ftData = JSON.parse(ftRaw);
    families = ftData.families;
  });

  describe('Montgomery Family Core Facts', () => {

    test('Donald Malcom Montgomery born ~1912', () => { // P0
      // Source: validated-tree.md Section 5 — 🟢 HIGH confidence
      const donald = lookup['donald-montgomery'];
      expect(donald).toBeDefined();
      expect(donald.birthDate).toMatch(/1912/);
    });

    test('Donald Montgomery death: 1990', () => { // P0
      const donald = lookup['donald-montgomery'];
      expect(donald).toBeDefined();
      expect(donald.deathDate).toMatch(/1990/);
    });

    test('Millicent Betts Thompson birth: 1911-08-23', () => { // P0
      // Source: validated-tree.md Section 4 — 🟢 HIGH confidence
      const millicent = lookup['millicent-betts-thompson'];
      expect(millicent).toBeDefined();
      expect(millicent.birthDate).toBe('1911-08-23');
    });

    test('Millicent Betts Thompson death: 2003', () => { // P0
      const millicent = lookup['millicent-betts-thompson'];
      expect(millicent).toBeDefined();
      expect(millicent.deathDate).toMatch(/2003/);
    });
  });

  describe('Thompson Line Core Facts', () => {

    test('Fred Eugene Thompson M.D. born ~1871', () => { // P0
      // Source: validated-tree.md Section 1, Gen 4b — 🟢 HIGH
      const fred = lookup['fred-e-thompson-1871'];
      expect(fred).toBeDefined();
      expect(fred.birthDate).toMatch(/1871/);
    });

    test('Fred Thompson occupation includes physician', () => { // P0
      // Source: validated-tree.md — Homeopathic physician, Detroit
      const fred = lookup['fred-e-thompson-1871'];
      expect(fred).toBeDefined();
      const occ = JSON.stringify(fred.occupation || '');
      expect(occ.toLowerCase()).toMatch(/physician|m\.d\./i);
    });

    test('Calvin Thompson died 1914', () => { // P0
      const calvin = lookup['calvin-thompson-1822'];
      expect(calvin).toBeDefined();
      expect(calvin.deathDate).toMatch(/1914/);
    });

    test('Calvin Thompson (1822) has 2 spouse families', () => { // P0
      // Source: validated-tree.md Section 1, Gen 3 — 🟢
      const calvin = lookup['calvin-thompson-1822'];
      expect(calvin).toBeDefined();
      expect(calvin.spouseFamilyIds.length).toBe(2);
    });

    test('Thompson patriarch has unknown first name', () => { // P0
      // Source: validated-tree.md Section 1, Gen 1 — first name unknown
      const patriarch = lookup['thompson-patriarch'];
      expect(patriarch).toBeDefined();
      expect(
        patriarch.firstName === null ||
        patriarch.firstName === '' ||
        patriarch.firstName === 'Unknown'
      ).toBe(true);
    });
  });

  describe('Holmes Line Core Facts', () => {

    test('Isabella Edna Holmes born 1879 (NOT 1878)', () => { // P0
      // Source: validated-tree.md Section 3 — 🟢 HIGH
      const isabella = lookup['isabella-edna-holmes-1879'];
      expect(isabella).toBeDefined();
      expect(isabella.birthDate).toMatch(/1879/);
    });

    test('Isabella Edna Holmes death: 1937', () => { // P0
      const isabella = lookup['isabella-edna-holmes-1879'];
      expect(isabella).toBeDefined();
      expect(isabella.deathDate).toMatch(/1937/);
    });

    test('Thomas Holmes death year 1896 or 1892 (accept either)', () => { // P0
      // Source: Find a Grave says 1896, family records say 1892 — accept either
      const thomas = lookup['thomas-holmes-1817'];
      expect(thomas).toBeDefined();
      expect(thomas.deathDate).toMatch(/1896|1892/);
    });

    test('Thomas Holmes occupation includes Mayor', () => { // P1
      // Source: validated-tree.md Section 3 — 6th Mayor of Chatham
      const thomas = lookup['thomas-holmes-1817'];
      expect(thomas).toBeDefined();
      const data = JSON.stringify(thomas);
      expect(data.toLowerCase()).toMatch(/mayor/i);
    });
  });

  describe('Newly Discovered People', () => {

    test('George H. Rowe exists', () => { // P0
      // Search by partial ID since exact ID may vary
      const george = Object.values(lookup).find(
        p => p.firstName === 'George' && p.lastName === 'Rowe'
      );
      expect(george).toBeDefined();
    });

    test('Sarah Melinda Holmes exists', () => { // P0
      const sarah = lookup['sarah-melinda-holmes'];
      expect(sarah).toBeDefined();
      expect(sarah.firstName).toBe('Sarah');
      expect(sarah.lastName).toBe('Holmes');
    });

    test('Edgar Burton Northwood exists', () => { // P0
      const edgar = lookup['edgar-burton-northwood'];
      expect(edgar).toBeDefined();
      expect(edgar.firstName).toBe('Edgar');
      expect(edgar.lastName).toBe('Northwood');
    });
  });

  describe('Counts & Completeness', () => {

    test('total people count >= 118', () => { // P0
      // Source: validated-tree.md Master Person Index — at least 118 people
      expect(people.length).toBeGreaterThanOrEqual(118);
    });

    test('total families count >= 50', () => { // P0
      expect(families.length).toBeGreaterThanOrEqual(50);
    });
  });
});
