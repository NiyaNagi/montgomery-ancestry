/**
 * Data Validation Tests — Schema
 * Validates the JSON data files against required schema.
 * Every person must have required fields, valid formats, and unique IDs.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 5.1
 */

const fs = require('fs');
const path = require('path');

describe('Data Schema Validation', () => {

  let peopleData;
  let people; // array of person objects

  beforeAll(() => {
    const raw = fs.readFileSync(path.resolve(__dirname, '../../data/people.json'), 'utf-8');
    peopleData = JSON.parse(raw);
    people = Object.values(peopleData.people);
  });

  test('all 118+ people have required fields (id, firstName, lastName, gender, familyLine, confidence)', () => { // P0
    expect(people.length).toBeGreaterThanOrEqual(118);
    people.forEach((person) => {
      expect(person.id).toBeTruthy();
      expect(typeof person.firstName === 'string').toBe(true);
      expect(person.lastName).toBeTruthy();
      expect(person.gender).toBeDefined();
      expect(person.familyLine).toBeDefined();
      expect(person.confidence).toBeDefined();
    });
  });

  test('all IDs are unique', () => { // P0
    const ids = people.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('all IDs are URL-safe slugs', () => { // P0
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    people.forEach(person => {
      expect(person.id).toMatch(slugPattern);
    });
  });

  test('all dates are valid format', () => { // P0
    // Valid formats: YYYY-MM-DD, YYYY, ~YYYY, null
    const datePattern = /^~?\d{4}(-\d{2}(-\d{2})?)?$/;
    people.forEach(person => {
      if (person.birthDate) {
        expect(person.birthDate).toMatch(datePattern);
      }
      if (person.deathDate) {
        expect(person.deathDate).toMatch(datePattern);
      }
    });
  });

  test('all gender values are valid', () => { // P0
    const validGenders = ['male', 'female'];
    people.forEach(person => {
      expect(validGenders).toContain(person.gender);
    });
  });

  test('all confidence values are valid', () => { // P0
    const validConfidence = ['HIGH', 'MEDIUM', 'LOW'];
    people.forEach(person => {
      expect(validConfidence).toContain(person.confidence);
    });
  });

  test('every person has a family line assignment', () => { // P1
    const validLines = ['thompson', 'holmes', 'smyth-gies', 'northwood', 'smith-rowe-jones', 'montgomery'];
    people.forEach(person => {
      expect(person.familyLine).toBeDefined();
      expect(validLines).toContain(person.familyLine);
    });
  });
});
