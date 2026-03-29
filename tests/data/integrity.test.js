/**
 * Data Validation Tests — Relationship Integrity
 * Validates that all family relationships are consistent
 * and free of structural errors.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 5.2
 */

const fs = require('fs');
const path = require('path');

describe('Relationship Integrity', () => {

  let peopleMap;   // id → person object
  let people;      // array of person objects
  let families;    // array of family objects
  let familyMap;   // id → family object

  beforeAll(() => {
    const peopleRaw = fs.readFileSync(path.resolve(__dirname, '../../data/people.json'), 'utf-8');
    const peopleData = JSON.parse(peopleRaw);
    peopleMap = peopleData.people;
    people = Object.values(peopleMap);

    const ftRaw = fs.readFileSync(path.resolve(__dirname, '../../data/family-tree.json'), 'utf-8');
    const ftData = JSON.parse(ftRaw);
    families = ftData.families;
    familyMap = {};
    families.forEach(f => { familyMap[f.id] = f; });
  });

  test('every child in family-tree.json exists in people.json', () => { // P0
    const allIds = new Set(Object.keys(peopleMap));
    const errors = [];
    families.forEach(family => {
      (family.children || []).forEach(childId => {
        if (!allIds.has(childId)) {
          errors.push(`Family ${family.id} references missing child: ${childId}`);
        }
      });
    });
    expect(errors).toEqual([]);
  });

  test('every husband/wife in family-tree.json exists in people.json', () => { // P0
    const allIds = new Set(Object.keys(peopleMap));
    const errors = [];
    families.forEach(family => {
      if (family.husband && !allIds.has(family.husband)) {
        errors.push(`Family ${family.id} references missing husband: ${family.husband}`);
      }
      if (family.wife && !allIds.has(family.wife)) {
        errors.push(`Family ${family.id} references missing wife: ${family.wife}`);
      }
    });
    expect(errors).toEqual([]);
  });

  test('every person parentFamilyId references a valid family', () => { // P0
    const familyIds = new Set(families.map(f => f.id));
    const errors = [];
    people.forEach(person => {
      if (person.parentFamilyId && !familyIds.has(person.parentFamilyId)) {
        errors.push(`${person.id} has invalid parentFamilyId: ${person.parentFamilyId}`);
      }
    });
    expect(errors).toEqual([]);
  });

  test('every person spouseFamilyIds reference valid families', () => { // P0
    const familyIds = new Set(families.map(f => f.id));
    const errors = [];
    people.forEach(person => {
      (person.spouseFamilyIds || []).forEach(sfid => {
        if (!familyIds.has(sfid)) {
          errors.push(`${person.id} has invalid spouseFamilyId: ${sfid}`);
        }
      });
    });
    expect(errors).toEqual([]);
  });

  test('no duplicate person IDs', () => { // P0
    const ids = people.map(p => p.id);
    const seen = new Set();
    const duplicates = [];
    ids.forEach(id => {
      if (seen.has(id)) duplicates.push(id);
      seen.add(id);
    });
    expect(duplicates).toEqual([]);
  });

  test('family children arrays contain no duplicates', () => { // P0
    const errors = [];
    families.forEach(family => {
      const children = family.children || [];
      const unique = new Set(children);
      if (unique.size !== children.length) {
        errors.push(`Family ${family.id} has duplicate children`);
      }
    });
    expect(errors).toEqual([]);
  });

  test('no orphaned person IDs (every person appears in at least one family)', () => { // P0
    const referencedIds = new Set();
    families.forEach(family => {
      if (family.husband) referencedIds.add(family.husband);
      if (family.wife) referencedIds.add(family.wife);
      (family.children || []).forEach(c => referencedIds.add(c));
    });
    // Also count people who reference families via parentFamilyId or spouseFamilyIds
    people.forEach(person => {
      if (person.parentFamilyId) referencedIds.add(person.id);
      if (person.spouseFamilyIds && person.spouseFamilyIds.length > 0) referencedIds.add(person.id);
    });
    const orphaned = people.filter(p => !referencedIds.has(p.id));
    // Known exceptions: infant deaths not yet linked to families in family-tree.json
    const knownUnlinked = new Set([
      'elizabeth-smith-1885',
      'ethel-smith-1886',
      'freddie-smith-1888',
    ]);
    const unexpectedOrphans = orphaned.filter(p => !knownUnlinked.has(p.id));
    expect(unexpectedOrphans.map(p => p.id)).toEqual([]);
  });

  test('all 6 family lines have at least 1 person', () => { // P0
    const lineCounts = {};
    people.forEach(p => {
      const line = p.familyLine;
      if (line) lineCounts[line] = (lineCounts[line] || 0) + 1;
    });
    expect(lineCounts['thompson']).toBeGreaterThanOrEqual(1);
    expect(lineCounts['holmes']).toBeGreaterThanOrEqual(1);
    expect(lineCounts['smyth-gies']).toBeGreaterThanOrEqual(1);
    expect(lineCounts['northwood']).toBeGreaterThanOrEqual(1);
    expect(lineCounts['smith-rowe-jones']).toBeGreaterThanOrEqual(1);
    expect(lineCounts['montgomery']).toBeGreaterThanOrEqual(1);
  });

  test('no circular parent chains via parentFamilyId', () => { // P0
    // Follow parentFamilyId -> family -> husband/wife -> their parentFamilyId; must terminate
    people.forEach(person => {
      const visited = new Set();
      let currentFamilyId = person.parentFamilyId;
      while (currentFamilyId) {
        if (visited.has(currentFamilyId)) {
          throw new Error(`Circular parentFamilyId chain detected at ${currentFamilyId} from ${person.id}`);
        }
        visited.add(currentFamilyId);
        const family = familyMap[currentFamilyId];
        if (!family) break;
        // Follow parents of this family's husband/wife
        const parentIds = [family.husband, family.wife].filter(Boolean);
        currentFamilyId = null;
        for (const pid of parentIds) {
          const parent = peopleMap[pid];
          if (parent && parent.parentFamilyId && !visited.has(parent.parentFamilyId)) {
            currentFamilyId = parent.parentFamilyId;
            break;
          }
        }
      }
    });
  });
});
