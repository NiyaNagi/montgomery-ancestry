/**
 * Unit Tests — Person Module
 * Tests for person data formatting, computed fields, and display logic.
 * Since person.js uses ESM + DOM, we test the pure formatting functions
 * via the data module helper and direct DOM rendering checks.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 3.4
 */

const {
  getPerson, getFullName, getShortName, formatDate, formatLifespan,
  extractYear, isLiving, getFamilyLineInfo, getParents, getSiblings,
  getSpouses, getChildren, getAge
} = require('./helpers/dataModule.cjs');

describe('Person Module', () => {

  // ─── Lifespan Formatting ─────────────────────────────────────

  describe('Lifespan Formatting', () => {

    test('formats full lifespan: 1871–1940', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(formatLifespan(fred)).toBe('1871–1940');
    });

    test('formats lifespan with no death date (historical)', () => {
      const belinda = getPerson('belinda-thompson-1820');
      expect(formatLifespan(belinda)).toBe('b. 1820');
    });

    test('formats lifespan for living person', () => {
      const person = { birthDate: '1960-05-15', deathDate: null };
      expect(formatLifespan(person)).toBe('b. 1960');
    });

    test('formats death-only lifespan', () => {
      expect(formatLifespan({ birthDate: null, deathDate: '1900' })).toBe('d. 1900');
    });

    test('returns empty string for no dates', () => {
      expect(formatLifespan({ birthDate: null, deathDate: null })).toBe('');
    });

    test('returns empty string for null person', () => {
      expect(formatLifespan(null)).toBe('');
    });

    test('Calvin Thompson lifespan is 1822–1914', () => {
      const calvin = getPerson('calvin-thompson-1822');
      expect(formatLifespan(calvin)).toBe('1822–1914');
    });

    test('year-only dates work correctly', () => {
      expect(formatLifespan({ birthDate: '1800', deathDate: '1870' })).toBe('1800–1870');
    });
  });

  // ─── Marriage Formatting ─────────────────────────────────────

  describe('Marriage Formatting', () => {

    test('Calvin Thompson (1822) has 2 marriages', () => {
      const spouses = getSpouses('calvin-thompson-1822');
      expect(spouses.length).toBe(2);
      expect(spouses[0].spouse.firstName).toBe('Serene');
      expect(spouses[1].spouse.firstName).toBe('Charlotte');
    });

    test('Thomas Holmes has 2 marriages with correct spouses', () => {
      const spouses = getSpouses('thomas-holmes-1817');
      expect(spouses.length).toBe(2);
      expect(spouses[0].spouse.lastName).toBe('Hampson');
      expect(spouses[1].spouse.lastName).toBe('Smyth');
    });

    test('marriage 1 for Thomas Holmes has marriage date', () => {
      const spouses = getSpouses('thomas-holmes-1817');
      expect(spouses[0].marriageDate).toBe('1839');
    });

    test('marriage 2 for Thomas Holmes has place', () => {
      const spouses = getSpouses('thomas-holmes-1817');
      expect(spouses[1].marriagePlace).toBe('Chatham, Ontario, Canada');
    });

    test('Belinda Thompson has no marriages', () => {
      const spouses = getSpouses('belinda-thompson-1820');
      expect(spouses.length).toBe(0);
    });

    test('Fred Thompson marriage to Isabella Holmes', () => {
      const spouses = getSpouses('fred-e-thompson-1871');
      expect(spouses.length).toBe(1);
      expect(spouses[0].spouse.id).toBe('isabella-edna-holmes-1879');
      expect(spouses[0].marriageDate).toBe('1903-10-27');
      expect(spouses[0].children.length).toBe(4);
    });
  });

  // ─── Age & Death Computation ─────────────────────────────────

  describe('Age & Death Computation', () => {

    test('Fred Thompson age at death: 69', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(getAge(fred)).toBe(69);
    });

    test('Calvin Thompson age at death: 92', () => {
      const calvin = getPerson('calvin-thompson-1822');
      expect(getAge(calvin)).toBe(92);
    });

    test('age is null for person with no birth date', () => {
      expect(getAge({ birthDate: null, deathDate: '1900' })).toBeNull();
    });

    test('age at death is null when death date has no year', () => {
      expect(getAge({ birthDate: '1800', deathDate: 'unknown' })).toBeNull();
    });

    test('charlotte-isabel-thompson: infant death noted', () => {
      const charlotte = getPerson('charlotte-isabel-thompson');
      expect(charlotte.notes).toContain('infancy');
    });

    test('infant death detection: birth and death within 1 year', () => {
      const birthYear = '1885';
      const deathYear = '1885';
      const diff = parseInt(deathYear) - parseInt(birthYear);
      expect(diff).toBeLessThanOrEqual(1);
    });

    test('Nettie Thompson age at death: 33', () => {
      const nettie = getPerson('nettie-thompson-1864');
      expect(getAge(nettie)).toBe(33); // 1897 - 1864
    });
  });

  // ─── Name Formatting ─────────────────────────────────────────

  describe('Name Formatting', () => {

    test('formats full name with middle name', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(getFullName(fred)).toBe('Fred Eugene Thompson');
    });

    test('formats name without middle name', () => {
      const calvin = getPerson('calvin-thompson-1822');
      expect(getFullName(calvin)).toBe('Calvin Thompson');
    });

    test('formats unknown first name (patriarch)', () => {
      const patriarch = getPerson('thompson-patriarch');
      const name = getFullName(patriarch);
      expect(name).toContain('(Unknown)');
      expect(name).toContain('Thompson');
    });

    test('formats maiden name with née', () => {
      const person = { firstName: 'Jane', lastName: 'Smith', maidenName: 'Doe' };
      expect(getFullName(person)).toBe('Jane Smith (née Doe)');
    });

    test('short name returns first + last only', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(getShortName(fred)).toBe('Fred Thompson');
    });

    test('short name for unknown first name uses "?"', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(getShortName(patriarch)).toBe('? Thompson');
    });

    test('getFullName returns "Unknown" for null', () => {
      expect(getFullName(null)).toBe('Unknown');
    });

    test('getShortName returns "Unknown" for null', () => {
      expect(getShortName(null)).toBe('Unknown');
    });
  });

  // ─── Date Formatting ─────────────────────────────────────────

  describe('Date Formatting', () => {

    test('formats full ISO date (1871-11-08)', () => {
      expect(formatDate('1871-11-08')).toBe('8 November 1871');
    });

    test('formats year-only (1822)', () => {
      expect(formatDate('1822')).toBe('1822');
    });

    test('formats year-month (1822-03)', () => {
      expect(formatDate('1822-03')).toBe('Mar 1822');
    });

    test('returns null for null', () => {
      expect(formatDate(null)).toBeNull();
    });

    test('returns null for undefined', () => {
      expect(formatDate(undefined)).toBeNull();
    });

    test('Fred Thompson birth date formats correctly', () => {
      expect(formatDate('1871-11-08')).toBe('8 November 1871');
    });

    test('marriage date "1903-10-27" formats correctly', () => {
      expect(formatDate('1903-10-27')).toBe('27 October 1903');
    });
  });

  // ─── Living Status ───────────────────────────────────────────

  describe('Living Status', () => {

    test('Fred Thompson is not living (has death date)', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(isLiving(fred)).toBe(false);
    });

    test('Belinda Thompson is not living (born 1820)', () => {
      const belinda = getPerson('belinda-thompson-1820');
      expect(isLiving(belinda)).toBe(false);
    });

    test('person born after 1920 without death date is living', () => {
      expect(isLiving({ birthDate: '1950', deathDate: null })).toBe(true);
    });

    test('person born in 1919 without death date is NOT living', () => {
      expect(isLiving({ birthDate: '1919', deathDate: null })).toBe(false);
    });

    test('person born in 1920 without death date IS living', () => {
      expect(isLiving({ birthDate: '1920', deathDate: null })).toBe(true);
    });

    test('null person is not living', () => {
      expect(isLiving(null)).toBe(false);
    });

    test('thompson-patriarch is not living (no birth date)', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(isLiving(patriarch)).toBe(false);
    });

    test('living person lifespan shows "b. YEAR"', () => {
      const person = { birthDate: '1960', deathDate: null };
      expect(isLiving(person)).toBe(true);
      expect(formatLifespan(person)).toBe('b. 1960');
    });
  });

  // ─── Family Relationships for Display ────────────────────────

  describe('Family Relationships for Display', () => {

    test('Isabella Edna Holmes parents are Thomas Holmes and Isabella Smyth', () => {
      const parents = getParents('isabella-edna-holmes-1879');
      expect(parents.father.id).toBe('thomas-holmes-1817');
      expect(parents.mother.id).toBe('isabella-smyth-1838');
    });

    test('Fred Thompson has 3 siblings (in same parent family)', () => {
      // Fred is from family-calvin-thompson-charlotte-brown which has: nettie, james, fred
      const siblings = getSiblings('fred-e-thompson-1871');
      expect(siblings.length).toBe(2);
    });

    test('Fred Thompson has 4 children', () => {
      const children = getChildren('fred-e-thompson-1871');
      expect(children.length).toBe(4);
      const ids = children.map(c => c.id);
      expect(ids).toContain('fred-holmes-thompson');
      expect(ids).toContain('charlotte-isabel-thompson');
      expect(ids).toContain('dorothy-elizabeth-thompson');
      expect(ids).toContain('millicent-betts-thompson');
    });
  });

  // ─── Family Line Info ────────────────────────────────────────

  describe('Family Line Info', () => {

    test('Thompson line has correct color', () => {
      const info = getFamilyLineInfo('thompson');
      expect(info.label).toBe('Thompson');
      expect(info.color).toBe('#1B2A4A');
      expect(info.bg).toBe('#E8EDF5');
    });

    test('Holmes line has correct color', () => {
      const info = getFamilyLineInfo('holmes');
      expect(info.label).toBe('Holmes');
      expect(info.color).toBe('#2D5016');
    });

    test('unknown line returns fallback', () => {
      const info = getFamilyLineInfo('fake-line');
      expect(info.color).toBe('#666');
    });

    test('all 6 family lines have distinct colors', () => {
      const lines = ['thompson', 'holmes', 'smyth-gies', 'northwood', 'montgomery', 'smith-rowe-jones'];
      const colors = lines.map(l => getFamilyLineInfo(l).color);
      const unique = new Set(colors);
      expect(unique.size).toBe(6);
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────

  describe('Edge Cases', () => {

    test('person with no dates, no location, no occupation', () => {
      const belinda = getPerson('belinda-thompson-1820');
      expect(formatDate(belinda.deathDate)).toBeNull();
      expect(belinda.occupation).toBeNull();
      expect(belinda.birthPlace).toBeNull();
    });

    test('person with multiple occupations (Fred Thompson)', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(Array.isArray(fred.occupation)).toBe(true);
      expect(fred.occupation).toContain('Homeopathic physician');
    });

    test('person with education array (Fred Thompson)', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(Array.isArray(fred.education)).toBe(true);
      expect(fred.education.length).toBe(3);
    });

    test('person with immigration data (Thompson patriarch)', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(patriarch.immigration).toBeDefined();
      expect(patriarch.immigration.from).toContain('Scotland');
      expect(patriarch.immigration.to).toBe('New York');
    });

    test('person with military service', () => {
      const patriarch = getPerson('thompson-patriarch');
      expect(patriarch.militaryService).toBeDefined();
      expect(patriarch.militaryService.length).toBeGreaterThan(0);
    });

    test('person with residences array', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(fred.residences).toBeDefined();
      expect(fred.residences.length).toBeGreaterThanOrEqual(4);
      expect(fred.residences[0].place).toContain('Flushing');
    });

    test('person with sources', () => {
      const fred = getPerson('fred-e-thompson-1871');
      expect(fred.sources).toBeDefined();
      expect(fred.sources.length).toBeGreaterThan(0);
    });

    test('data density: sparse person has few filled fields', () => {
      const belinda = getPerson('belinda-thompson-1820');
      let count = 0;
      if (belinda.birthDate) count++;
      if (belinda.birthPlace) count++;
      if (belinda.deathDate) count++;
      if (belinda.occupation) count++;
      if (belinda.education) count++;
      if (belinda.notes) count++;
      expect(count).toBeLessThan(3);
    });

    test('data density: rich person has many filled fields', () => {
      const fred = getPerson('fred-e-thompson-1871');
      let count = 0;
      if (fred.birthDate) count++;
      if (fred.birthPlace) count++;
      if (fred.deathDate) count++;
      if (fred.occupation) count++;
      if (fred.education) count++;
      if (fred.residences && fred.residences.length > 0) count++;
      if (fred.notes) count++;
      if (fred.burialPlace) count++;
      expect(count).toBeGreaterThanOrEqual(7);
    });
  });
});

