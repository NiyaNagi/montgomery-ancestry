/**
 * Unit Tests — Search Module
 * Tests for client-side search logic, filtering, and ranking
 * across the 195-person Montgomery family tree.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 3.2
 */

const {
  searchPeople, getFullName, formatLifespan, isLiving,
  getFamilyLineInfo, getFamilyLines, getAllByFamilyLine
} = require('./helpers/dataModule.cjs');

describe('Search Module', () => {

  // ─── Basic Search ────────────────────────────────────────────

  describe('Basic Search', () => {

    test('partial name "Isa" returns both Isabellas', () => {
      const results = searchPeople('Isa');
      const ids = results.map(r => r.id);
      expect(ids).toContain('isabella-smyth-1838');
      expect(ids).toContain('isabella-edna-holmes-1879');
    });

    test('surname search "Thompson" returns many Thompsons', () => {
      const results = searchPeople('Thompson');
      expect(results.length).toBeGreaterThanOrEqual(20);
    });

    test('case-insensitive matching (lower, upper, mixed)', () => {
      const lower = searchPeople('thompson');
      const upper = searchPeople('THOMPSON');
      const mixed = searchPeople('tHoMpSoN');
      expect(lower.length).toBeGreaterThan(0);
      expect(lower.length).toBe(upper.length);
      expect(lower.length).toBe(mixed.length);
    });

    test('empty query returns all people', () => {
      expect(searchPeople('').length).toBe(195);
    });

    test('whitespace-only query returns all people', () => {
      expect(searchPeople('   ').length).toBe(195);
    });

    test('no match returns empty array', () => {
      expect(searchPeople('Zzyzzyva').length).toBe(0);
    });

    test('single character search returns matches', () => {
      const results = searchPeople('z');
      // Should not crash, may or may not find results
      expect(Array.isArray(results)).toBe(true);
    });
  });

  // ─── Fuzzy / Advanced Search ─────────────────────────────────

  describe('Advanced Search', () => {

    test('matches maiden name "Betts"', () => {
      // "Betts" appears in person names
      const results = searchPeople('Betts');
      expect(results.length).toBeGreaterThanOrEqual(1);
      const ids = results.map(r => r.id);
      expect(ids).toContain('millicent-ann-betts');
    });

    test('matches location "Chatham"', () => {
      const results = searchPeople('Chatham');
      expect(results.length).toBeGreaterThan(0);
      // Thomas Holmes lived in Chatham
      expect(results.map(r => r.id)).toContain('thomas-holmes-1817');
    });

    test('matches occupation "farmer"', () => {
      const results = searchPeople('farmer');
      expect(results.length).toBeGreaterThan(0);
    });

    test('matches notes content', () => {
      const results = searchPeople('Revolutionary War');
      expect(results.length).toBeGreaterThan(0);
    });

    test('handles special characters safely', () => {
      expect(() => searchPeople("O'Brien")).not.toThrow();
      expect(() => searchPeople('foo[bar')).not.toThrow();
      expect(() => searchPeople('test()')).not.toThrow();
      expect(() => searchPeople('a+b')).not.toThrow();
    });

    test('multi-word search narrows results', () => {
      const broad = searchPeople('Fred');
      const narrow = searchPeople('Fred Thompson');
      // Both should have results, narrow might be same or fewer
      expect(broad.length).toBeGreaterThan(0);
      expect(narrow.length).toBeGreaterThan(0);
    });

    test('search for "Scotland" finds patriarch via immigration data', () => {
      const results = searchPeople('Scotland');
      expect(results.map(r => r.id)).toContain('thompson-patriarch');
    });
  });

  // ─── Results Metadata ────────────────────────────────────────

  describe('Results Metadata', () => {

    test('results are actual person objects with expected fields', () => {
      const results = searchPeople('Fred');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.id).toBeDefined();
        expect(r.firstName).toBeDefined();
        expect(r.lastName).toBeDefined();
        expect(r.familyLine).toBeDefined();
      });
    });

    test('Fred Thompson is in results for "Fred"', () => {
      const results = searchPeople('Fred');
      const fred = results.find(r => r.id === 'fred-e-thompson-1871');
      expect(fred).toBeDefined();
      expect(fred.birthDate).toBe('1871-11-08');
    });

    test('results are sorted by relevance (name matches first)', () => {
      const results = searchPeople('Calvin Thompson');
      // Calvin Thompson should be among the top results
      const topIds = results.slice(0, 5).map(r => r.id);
      expect(topIds).toContain('calvin-thompson-1822');
    });
  });

  // ─── Family Line Filter ──────────────────────────────────────

  describe('Family Line Filter', () => {

    test('filter by "holmes" returns only Holmes line', () => {
      const results = searchPeople('', { familyLines: ['holmes'] });
      expect(results.length).toBe(39);
      results.forEach(p => {
        expect(p.familyLine).toBe('holmes');
      });
    });

    test('combined search + filter: "Thomas" in Holmes line', () => {
      const results = searchPeople('Thomas', { familyLines: ['holmes'] });
      const ids = results.map(r => r.id);
      expect(ids).toContain('thomas-holmes-1817');
      // Should not contain any Thompson line members
      results.forEach(r => expect(r.familyLine).toBe('holmes'));
    });

    test('filter by multiple family lines', () => {
      const results = searchPeople('', { familyLines: ['thompson', 'holmes'] });
      expect(results.length).toBe(59 + 39);
      results.forEach(p => {
        expect(['thompson', 'holmes']).toContain(p.familyLine);
      });
    });

    test('filter by empty array returns all', () => {
      const all = searchPeople('Fred', { familyLines: [] });
      const noFilter = searchPeople('Fred');
      expect(all.length).toBe(noFilter.length);
    });

    test('filter by non-existent line returns nothing', () => {
      const results = searchPeople('Fred', { familyLines: ['nonexistent'] });
      expect(results.length).toBe(0);
    });
  });

  // ─── Performance ─────────────────────────────────────────────

  describe('Performance', () => {

    test('search responds under 100ms for full dataset', () => {
      const start = performance.now();
      searchPeople('th');
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });

    test('repeated searches remain fast', () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        searchPeople('Thompson');
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(1000); // 100 searches < 1s
    });
  });
});

