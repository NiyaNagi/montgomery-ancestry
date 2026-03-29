/**
 * Unit Tests — Data Module
 * Tests for data loading, parsing, graph construction, traversal, and formatting
 * of the 174-person Montgomery family tree.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 3.1
 */

const {
  people, families, familyIndex, meta,
  getPerson, getFamily, getAllPeople, getMeta,
  getParents, getChildren, getSiblings, getSpouses,
  getAncestors, getDescendants,
  getAllByFamilyLine, getFamilyLines,
  searchPeople,
  getFullName, getShortName,
  formatDate, formatLifespan, extractYear, isLiving,
  getFamilyLineInfo, getAge,
  getRootAncestors, getRootFamilies
} = require('./helpers/dataModule.cjs');

describe('Data Module', () => {

  // ─── Loading & Parsing ───────────────────────────────────────

  describe('Loading & Parsing', () => {

    test('people object contains 174 entries', () => {
      expect(Object.keys(people).length).toBe(174);
    });

    test('families array is non-empty', () => {
      expect(families.length).toBeGreaterThan(0);
    });

    test('meta contains expected fields', () => {
      const m = getMeta();
      expect(m.title).toBe('Montgomery Family Tree');
      expect(m.totalPeople).toBe(174);
      expect(m.familyLines).toEqual(expect.arrayContaining(['thompson', 'holmes', 'montgomery']));
    });

    test('familyIndex is keyed correctly', () => {
      expect(familyIndex['family-thompson-patriarch']).toBeDefined();
      expect(familyIndex['family-thompson-patriarch'].id).toBe('family-thompson-patriarch');
    });

    test('every person has an id matching its key', () => {
      for (const [key, person] of Object.entries(people)) {
        expect(person.id).toBe(key);
      }
    });
  });

  // ─── getPerson ───────────────────────────────────────────────

  describe('getPerson()', () => {

    test('returns person for valid ID', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(fred).not.toBeNull();
      expect(fred.firstName).toBe('Fred');
      expect(fred.lastName).toBe('Thompson');
    });

    test('returns null for invalid ID', () => {
      expect(getPerson('does-not-exist')).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(getPerson('')).toBeNull();
    });

    test('returns null for undefined', () => {
      expect(getPerson(undefined)).toBeNull();
    });

    test('returns thompson-patriarch with unknown first name', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(patriarch).not.toBeNull();
      expect(patriarch.firstName).toBe('Unknown');
      expect(patriarch.lastName).toBe('Thompson');
    });
  });

  // ─── getParents ──────────────────────────────────────────────

  describe('getParents()', () => {

    test('returns parents for Isabella Edna Holmes', () => {
      const parents = getParents('isabella-edna-holmes-1879');
      expect(parents).not.toBeNull();
      expect(parents.father.id).toBe('thomas-holmes-1817');
      expect(parents.mother.id).toBe('isabella-smyth-1838');
    });

    test('returns null for thompson-patriarch (no parents)', () => {
      expect(getParents('thompson-patriarch')).toBeNull();
    });

    test('returns null for non-existent person', () => {
      expect(getParents('nonexistent')).toBeNull();
    });

    test('returns father-only when wife is null', () => {
      // thompson-patriarch family has no wife
      const parents = getParents('samuel-thompson-1767');
      expect(parents).not.toBeNull();
      expect(parents.father.id).toBe('thompson-patriarch');
      expect(parents.mother).toBeNull();
    });
  });

  // ─── getChildren ─────────────────────────────────────────────

  describe('getChildren()', () => {

    test('Fred Thompson has 4 children', () => {
      const children = getChildren('fred-e-thompson-1871');
      expect(children.length).toBe(4);
      const ids = children.map(c => c.id);
      expect(ids).toContain('charlotte-isabel-thompson');
      expect(ids).toContain('millicent-betts-thompson');
    });

    test('Calvin Thompson (1822) has 6 children across 2 marriages', () => {
      const children = getChildren('calvin-thompson-1822');
      expect(children.length).toBe(6);
      const ids = children.map(c => c.id);
      // 1st marriage children
      expect(ids).toContain('charles-e-thompson-1850');
      // 2nd marriage children
      expect(ids).toContain('fred-e-thompson-1871');
    });

    test('Belinda Thompson has 0 children', () => {
      const children = getChildren('belinda-thompson-1820');
      expect(children.length).toBe(0);
    });

    test('returns empty for non-existent person', () => {
      expect(getChildren('nonexistent')).toEqual([]);
    });

    test('thompson-patriarch has 10 children', () => {
      const children = getChildren('thompson-patriarch');
      expect(children.length).toBe(10);
    });
  });

  // ─── getSiblings ─────────────────────────────────────────────

  describe('getSiblings()', () => {

    test('Fred Thompson has 2 siblings (Nettie, James)', () => {
      const siblings = getSiblings('fred-e-thompson-1871');
      expect(siblings.length).toBe(2);
      const ids = siblings.map(s => s.id);
      expect(ids).toContain('nettie-thompson-1864');
      expect(ids).toContain('james-h-thompson-1866');
    });

    test('thompson-patriarch has no siblings (no parentFamilyId)', () => {
      expect(getSiblings('thompson-patriarch')).toEqual([]);
    });

    test('person with no parentFamilyId returns empty', () => {
      expect(getSiblings('millicent-ann-betts')).toEqual([]);
    });

    test('Samuel Thompson has 9 siblings', () => {
      const siblings = getSiblings('samuel-thompson-1767');
      expect(siblings.length).toBe(9);
    });
  });

  // ─── getSpouses ──────────────────────────────────────────────

  describe('getSpouses()', () => {

    test('Calvin Thompson (1822) has 2 spouses', () => {
      const spouses = getSpouses('calvin-thompson-1822');
      expect(spouses.length).toBe(2);
      expect(spouses[0].spouse.id).toBe('serene-chamberlain-1823');
      expect(spouses[1].spouse.id).toBe('charlotte-brown-1840');
    });

    test('Belinda Thompson has 0 spouses', () => {
      const spouses = getSpouses('belinda-thompson-1820');
      expect(spouses.length).toBe(0);
    });

    test('each spouse entry has marriage info and children', () => {
      const spouses = getSpouses('calvin-thompson-1822');
      const first = spouses[0];
      expect(first.marriageDate).toBe('1849');
      expect(first.familyId).toBe('family-calvin-thompson-serene-chamberlain');
      expect(first.children.length).toBe(3);
    });

    test('returns empty for non-existent person', () => {
      expect(getSpouses('nonexistent')).toEqual([]);
    });

    test('Thomas Holmes has 2 spouses with correct children counts', () => {
      const spouses = getSpouses('thomas-holmes-1817');
      expect(spouses.length).toBe(2);
      expect(spouses[0].children.length).toBe(10);
      expect(spouses[1].children.length).toBe(4);
    });
  });

  // ─── getAncestors ───────────────────────────────────────────

  describe('getAncestors()', () => {

    test('returns null for non-existent person', () => {
      expect(getAncestors('nonexistent')).toBeNull();
    });

    test('returns single node for depth 1', () => {
      const tree = getAncestors('fred-e-thompson-1871', 1);
      expect(tree).not.toBeNull();
      expect(tree.person.id).toBe('fred-e-thompson-1871');
      // depth 1 means parents are looked up but NOT recursed further
      // (parent nodes are null because recursion with generations=0 returns null)
      if (tree.parents) {
        expect(tree.parents.father).toBeNull();
        expect(tree.parents.mother).toBeNull();
      }
    });

    test('returns 2 generations with depth 2', () => {
      const tree = getAncestors('fred-e-thompson-1871', 2);
      expect(tree.parents).not.toBeNull();
      expect(tree.parents.father.person.id).toBe('calvin-thompson-1822');
      expect(tree.parents.mother.person.id).toBe('charlotte-brown-1840');
    });

    test('returns 3+ generations for millicent-betts-thompson', () => {
      const tree = getAncestors('millicent-betts-thompson', 3);
      expect(tree.person.id).toBe('millicent-betts-thompson');
      expect(tree.parents.father.person.id).toBe('fred-e-thompson-1871');
      expect(tree.parents.mother.person.id).toBe('isabella-edna-holmes-1879');
      // Grandparents
      expect(tree.parents.father.parents.father.person.id).toBe('calvin-thompson-1822');
    });

    test('stops at root (thompson-patriarch has no parents)', () => {
      const tree = getAncestors('thompson-patriarch', 5);
      expect(tree.person.id).toBe('thompson-patriarch');
      expect(tree.parents).toBeNull();
    });

    test('returns null for generations <= 0', () => {
      expect(getAncestors('fred-e-thompson-1871', 0)).toBeNull();
    });
  });

  // ─── getDescendants ──────────────────────────────────────────

  describe('getDescendants()', () => {

    test('returns null for non-existent person', () => {
      expect(getDescendants('nonexistent')).toBeNull();
    });

    test('Charles Thompson (1783) has descendants across generations', () => {
      const tree = getDescendants('charles-thompson-1783', 3);
      expect(tree).not.toBeNull();
      expect(tree.spouseFamilies.length).toBe(1); // one wife: Millicent Betts
      const children = tree.spouseFamilies[0].children;
      expect(children.length).toBeGreaterThan(5);
    });

    test('depth 1 returns person with no descendant expansion', () => {
      const tree = getDescendants('fred-e-thompson-1871', 1);
      expect(tree.person.id).toBe('fred-e-thompson-1871');
      // spouseFamilies listed but children are null (depth exhausted)
      for (const sf of tree.spouseFamilies) {
        for (const child of sf.children) {
          expect(child.spouseFamilies).toEqual([]);
        }
      }
    });

    test('person with no children returns empty spouseFamilies', () => {
      const tree = getDescendants('belinda-thompson-1820', 3);
      expect(tree.spouseFamilies.length).toBe(0);
    });

    test('Calvin Thompson descendants include children from both marriages', () => {
      const tree = getDescendants('calvin-thompson-1822', 2);
      expect(tree.spouseFamilies.length).toBe(2);
      const allChildren = tree.spouseFamilies.flatMap(sf => sf.children);
      expect(allChildren.length).toBe(6);
    });
  });

  // ─── getAllByFamilyLine ──────────────────────────────────────

  describe('getAllByFamilyLine()', () => {

    test('returns all Thompson line members', () => {
      const thompsons = getAllByFamilyLine('thompson');
      expect(thompsons.length).toBe(59);
      thompsons.forEach(p => expect(p.familyLine).toBe('thompson'));
    });

    test('returns all Holmes line members', () => {
      const holmes = getAllByFamilyLine('holmes');
      expect(holmes.length).toBe(39);
    });

    test('case-insensitive: "Thompson" vs "thompson"', () => {
      const upper = getAllByFamilyLine('Thompson');
      const lower = getAllByFamilyLine('thompson');
      expect(upper.length).toBe(lower.length);
    });

    test('returns empty for nonexistent line', () => {
      expect(getAllByFamilyLine('nonexistent').length).toBe(0);
    });

    test('returns all 6 known family lines', () => {
      const lines = ['thompson', 'holmes', 'smyth-gies', 'northwood', 'montgomery', 'smith-rowe-jones'];
      for (const line of lines) {
        expect(getAllByFamilyLine(line).length).toBeGreaterThan(0);
      }
    });
  });

  // ─── searchPeople ────────────────────────────────────────────

  describe('searchPeople()', () => {

    test('empty query returns all people (no filter)', () => {
      const results = searchPeople('');
      expect(results.length).toBe(174);
    });

    test('whitespace-only query returns all people', () => {
      const results = searchPeople('   ');
      expect(results.length).toBe(174);
    });

    test('partial name "Isa" returns both Isabellas', () => {
      const results = searchPeople('Isa');
      const ids = results.map(r => r.id);
      expect(ids).toContain('isabella-smyth-1838');
      expect(ids).toContain('isabella-edna-holmes-1879');
    });

    test('surname "Thompson" returns many results', () => {
      const results = searchPeople('Thompson');
      expect(results.length).toBeGreaterThanOrEqual(20);
    });

    test('case-insensitive search', () => {
      const lower = searchPeople('thompson');
      const upper = searchPeople('THOMPSON');
      const mixed = searchPeople('tHoMpSoN');
      expect(lower.length).toBe(upper.length);
      expect(lower.length).toBe(mixed.length);
    });

    test('no results for gibberish query', () => {
      const results = searchPeople('Zzyzzyva');
      expect(results.length).toBe(0);
    });

    test('location search finds birthPlace matches', () => {
      const results = searchPeople('Michigan');
      expect(results.length).toBeGreaterThan(0);
    });

    test('occupation search finds results', () => {
      const results = searchPeople('physician');
      expect(results.length).toBeGreaterThan(0);
      expect(results.map(r => r.id)).toContain('fred-e-thompson-1871');
    });

    test('family line filter restricts results', () => {
      const results = searchPeople('Thomas', { familyLines: ['holmes'] });
      const ids = results.map(r => r.id);
      expect(ids).toContain('thomas-holmes-1817');
      // No Thompson line members
      results.forEach(r => {
        expect(r.familyLine).toBe('holmes');
      });
    });

    test('empty query with family line filter returns only that line', () => {
      const results = searchPeople('', { familyLines: ['holmes'] });
      expect(results.length).toBe(39);
      results.forEach(r => expect(r.familyLine).toBe('holmes'));
    });

    test('search results are ranked by relevance (name > location > notes)', () => {
      const results = searchPeople('Fred');
      // Fred Thompson should be near the top due to name match
      const fredIndex = results.findIndex(r => r.id === 'fred-e-thompson-1871');
      expect(fredIndex).toBeLessThan(5);
    });

    test('search for "Scotland" finds thompson-patriarch via immigration', () => {
      const results = searchPeople('Scotland');
      const ids = results.map(r => r.id);
      expect(ids).toContain('thompson-patriarch');
    });

    test('search handles special characters gracefully', () => {
      // Should not throw
      expect(() => searchPeople("O'Brien")).not.toThrow();
      expect(() => searchPeople('foo[bar')).not.toThrow();
      expect(() => searchPeople('regex.*test')).not.toThrow();
    });

    test('search performance: completes within 100ms', () => {
      const start = performance.now();
      searchPeople('th');
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });

  // ─── getFullName ─────────────────────────────────────────────

  describe('getFullName()', () => {

    test('formats full name with middle name', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(getFullName(fred)).toBe('Fred Eugene Thompson');
    });

    test('formats name without middle name', () => {
      const calvin = getPerson('calvin-thompson-1822');
      expect(getFullName(calvin)).toBe('Calvin Thompson');
    });

    test('formats unknown first name with parenthetical', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(getFullName(patriarch)).toBe('(Unknown) Thompson');
    });

    test('returns "Unknown" for null person', () => {
      expect(getFullName(null)).toBe('Unknown');
    });

    test('returns "Unknown" for undefined', () => {
      expect(getFullName(undefined)).toBe('Unknown');
    });

    test('includes maiden name with née', () => {
      const person = { firstName: 'Jane', lastName: 'Smith', maidenName: 'Doe' };
      expect(getFullName(person)).toBe('Jane Smith (née Doe)');
    });
  });

  // ─── getShortName ────────────────────────────────────────────

  describe('getShortName()', () => {

    test('returns first + last', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(getShortName(fred)).toBe('Fred Thompson');
    });

    test('returns "?" for unknown first name', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(getShortName(patriarch)).toBe('? Thompson');
    });

    test('returns "Unknown" for null', () => {
      expect(getShortName(null)).toBe('Unknown');
    });
  });

  // ─── formatDate ──────────────────────────────────────────────

  describe('formatDate()', () => {

    test('formats full ISO date', () => {
      expect(formatDate('1871-11-08')).toBe('8 November 1871');
    });

    test('formats year-only date', () => {
      expect(formatDate('1822')).toBe('1822');
    });

    test('formats year-month date', () => {
      expect(formatDate('1822-03')).toBe('Mar 1822');
    });

    test('returns null for null input', () => {
      expect(formatDate(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
      expect(formatDate(undefined)).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(formatDate('')).toBeNull();
    });

    test('handles January (month 01)', () => {
      expect(formatDate('2000-01-15')).toBe('15 January 2000');
    });

    test('handles December (month 12)', () => {
      expect(formatDate('1900-12-25')).toBe('25 December 1900');
    });

    test('handles leading zeros in day', () => {
      expect(formatDate('1822-03-01')).toBe('1 March 1822');
    });

    test('returns raw string for unknown format', () => {
      expect(formatDate('circa 1850')).toBe('circa 1850');
    });
  });

  // ─── formatLifespan ──────────────────────────────────────────

  describe('formatLifespan()', () => {

    test('formats full lifespan (birth–death)', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(formatLifespan(fred)).toBe('1871–1940');
    });

    test('formats birth-only for old person with no death date', () => {
      const belinda = getPerson('belinda-thompson-1820');
      expect(formatLifespan(belinda)).toBe('b. 1820');
    });

    test('formats "b. YEAR" for living person', () => {
      const person = { birthDate: '1950', deathDate: null };
      expect(formatLifespan(person)).toBe('b. 1950');
    });

    test('returns empty for person with no dates', () => {
      expect(formatLifespan({ birthDate: null, deathDate: null })).toBe('');
    });

    test('returns empty for null person', () => {
      expect(formatLifespan(null)).toBe('');
    });

    test('formats death-only', () => {
      expect(formatLifespan({ birthDate: null, deathDate: '1900' })).toBe('d. 1900');
    });
  });

  // ─── extractYear ─────────────────────────────────────────────

  describe('extractYear()', () => {

    test('extracts year from full ISO date', () => {
      expect(extractYear('1871-11-08')).toBe('1871');
    });

    test('extracts year from year-only', () => {
      expect(extractYear('1822')).toBe('1822');
    });

    test('extracts year from approximate date', () => {
      expect(extractYear('~1850')).toBe('1850');
    });

    test('returns null for null', () => {
      expect(extractYear(null)).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(extractYear('')).toBeNull();
    });
  });

  // ─── isLiving ────────────────────────────────────────────────

  describe('isLiving()', () => {

    test('returns false for person with death date', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(isLiving(fred)).toBe(false);
    });

    test('returns false for 1800s person without death date (Belinda)', () => {
      const belinda = getPerson('belinda-thompson-1820');
      expect(isLiving(belinda)).toBe(false);
    });

    test('returns true for person born after 1920 with no death date', () => {
      expect(isLiving({ birthDate: '1950', deathDate: null })).toBe(true);
    });

    test('returns false for person with no birth date', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(isLiving(patriarch)).toBe(false);
    });

    test('returns false for null', () => {
      expect(isLiving(null)).toBe(false);
    });

    test('returns false for person born in 1919', () => {
      expect(isLiving({ birthDate: '1919', deathDate: null })).toBe(false);
    });

    test('returns true for person born in 1920', () => {
      expect(isLiving({ birthDate: '1920', deathDate: null })).toBe(true);
    });
  });

  // ─── getFamilyLineInfo ───────────────────────────────────────

  describe('getFamilyLineInfo()', () => {

    test('returns correct info for thompson', () => {
      const info = getFamilyLineInfo('thompson');
      expect(info.label).toBe('Thompson');
      expect(info.color).toBe('#1B2A4A');
    });

    test('returns correct info for holmes', () => {
      const info = getFamilyLineInfo('holmes');
      expect(info.label).toBe('Holmes');
    });

    test('returns fallback for unknown line', () => {
      const info = getFamilyLineInfo('unknown-line');
      expect(info.label).toBe('unknown-line');
      expect(info.color).toBe('#666');
    });

    test('returns fallback for null', () => {
      const info = getFamilyLineInfo(null);
      expect(info.label).toBe('Unknown');
    });
  });

  // ─── getAge ──────────────────────────────────────────────────

  describe('getAge()', () => {

    test('computes age at death for Fred Thompson (69)', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(getAge(fred)).toBe(69); // 1940 - 1871
    });

    test('computes age at death for Calvin Thompson (92)', () => {
      const calvin = getPerson('calvin-thompson-1822');
      expect(getAge(calvin)).toBe(92); // 1914 - 1822
    });

    test('returns null for person with no birth date', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(getAge(patriarch)).toBeNull();
    });

    test('returns null for null person', () => {
      expect(getAge(null)).toBeNull();
    });

    test('returns current age for living person', () => {
      const person = { birthDate: '1950', deathDate: null };
      const expectedAge = new Date().getFullYear() - 1950;
      expect(getAge(person)).toBe(expectedAge);
    });

    test('returns null for historical person with no death date (not living)', () => {
      const belinda = getPerson('belinda-thompson-1820');
      expect(getAge(belinda)).toBeNull();
    });
  });

  // ─── getFamilyLines ──────────────────────────────────────────

  describe('getFamilyLines()', () => {

    test('returns all 6 family lines', () => {
      const lines = getFamilyLines();
      expect(lines.length).toBe(6);
      expect(lines).toContain('thompson');
      expect(lines).toContain('holmes');
      expect(lines).toContain('montgomery');
    });
  });

  // ─── getRootAncestors / getRootFamilies ──────────────────────

  describe('getRootAncestors()', () => {

    test('returns people with no parentFamilyId', () => {
      const roots = getRootAncestors();
      expect(roots.length).toBeGreaterThan(0);
      roots.forEach(r => expect(r.parentFamilyId).toBeFalsy());
    });

    test('thompson-patriarch is a root ancestor', () => {
      const roots = getRootAncestors();
      expect(roots.map(r => r.id)).toContain('thompson-patriarch');
    });
  });

  describe('getRootFamilies()', () => {

    test('returns families where neither parent has a parentFamilyId', () => {
      const rootFams = getRootFamilies();
      expect(rootFams.length).toBeGreaterThan(0);
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────

  describe('Edge Cases', () => {

    test('thompson-patriarch: unknown first name, LOW confidence', () => {
      const p = getPerson('thompson-patriarch');
      expect(p.firstName).toBe('Unknown');
      expect(p.confidence).toBe('LOW');
      expect(p.immigration).toBeDefined();
    });

    test('charlotte-isabel-thompson: infant death (died in infancy note)', () => {
      const p = getPerson('charlotte-isabel-thompson');
      expect(p.notes).toContain('infancy');
      expect(p.birthDate).toBeNull();
      expect(p.deathDate).toBeNull();
    });

    test('belinda-thompson-1820: sparse person (name, birth year only)', () => {
      const p = getPerson('belinda-thompson-1820');
      expect(p.occupation).toBeNull();
      expect(p.deathDate).toBeNull();
      expect(p.birthPlace).toBeNull();
      expect(p.spouseFamilyIds).toEqual([]);
    });

    test('graph traversal completes in under 50ms', () => {
      const start = performance.now();
      // Traverse all people and their relationships
      for (const person of getAllPeople()) {
        getParents(person.id);
        getChildren(person.id);
        getSiblings(person.id);
        getSpouses(person.id);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(50);
    });

    test('no orphaned references in family data', () => {
      const broken = [];
      for (const fam of families) {
        if (fam.husband && !people[fam.husband]) {
          broken.push(`Family ${fam.id}: husband ${fam.husband} not found`);
        }
        if (fam.wife && !people[fam.wife]) {
          broken.push(`Family ${fam.id}: wife ${fam.wife} not found`);
        }
        for (const childId of (fam.children || [])) {
          if (!people[childId]) {
            broken.push(`Family ${fam.id}: child ${childId} not found`);
          }
        }
      }
      expect(broken).toEqual([]);
    });
  });
});

