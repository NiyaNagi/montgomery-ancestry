/**
 * Test helper: re-implements all pure functions from js/data.js in CommonJS
 * so they can be tested under Jest (which doesn't support ESM with transform: {}).
 *
 * Loads the actual JSON data files and builds the same indexes as the production code.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const peopleData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'people.json'), 'utf-8'));
const familyData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'family-tree.json'), 'utf-8'));

const people = peopleData.people || {};
const families = familyData.families || [];
const meta = familyData.meta || {};

// Build family lookup index
const familyIndex = {};
for (const fam of families) {
  familyIndex[fam.id] = fam;
}

function getPerson(id) {
  return people[id] || null;
}

function getFamily(id) {
  return familyIndex[id] || null;
}

function getAllPeople() {
  return Object.values(people);
}

function getMeta() {
  return meta;
}

function getParents(personId) {
  const person = people[personId];
  if (!person || !person.parentFamilyId) return null;
  const fam = familyIndex[person.parentFamilyId];
  if (!fam) return null;
  return {
    father: fam.husband ? people[fam.husband] || null : null,
    mother: fam.wife ? people[fam.wife] || null : null,
    family: fam
  };
}

function getChildren(personId) {
  const person = people[personId];
  if (!person) return [];
  const childIds = new Set();
  const results = [];
  for (const famId of (person.spouseFamilyIds || [])) {
    const fam = familyIndex[famId];
    if (!fam) continue;
    for (const childId of (fam.children || [])) {
      if (!childIds.has(childId)) {
        childIds.add(childId);
        const child = people[childId];
        if (child) results.push(child);
      }
    }
  }
  return results;
}

function getSiblings(personId) {
  const person = people[personId];
  if (!person || !person.parentFamilyId) return [];
  const fam = familyIndex[person.parentFamilyId];
  if (!fam) return [];
  return (fam.children || [])
    .filter(id => id !== personId)
    .map(id => people[id])
    .filter(Boolean);
}

function getSpouses(personId) {
  const person = people[personId];
  if (!person) return [];
  const results = [];
  for (const famId of (person.spouseFamilyIds || [])) {
    const fam = familyIndex[famId];
    if (!fam) continue;
    const spouseId = fam.husband === personId ? fam.wife : fam.husband;
    const spouse = spouseId ? people[spouseId] || null : null;
    results.push({
      spouse,
      marriageDate: fam.marriageDate,
      marriagePlace: fam.marriagePlace,
      familyId: fam.id,
      children: (fam.children || []).map(id => people[id]).filter(Boolean)
    });
  }
  return results;
}

function getAncestors(personId, generations = 5) {
  const person = people[personId];
  if (!person || generations <= 0) return null;
  const node = { person, parents: null };
  const parentInfo = getParents(personId);
  if (parentInfo) {
    node.parents = {
      father: parentInfo.father
        ? getAncestors(parentInfo.father.id, generations - 1)
        : null,
      mother: parentInfo.mother
        ? getAncestors(parentInfo.mother.id, generations - 1)
        : null
    };
  }
  return node;
}

function getDescendants(personId, generations = 5) {
  const person = people[personId];
  if (!person || generations <= 0) return null;
  const node = { person, spouseFamilies: [] };
  for (const famId of (person.spouseFamilyIds || [])) {
    const fam = familyIndex[famId];
    if (!fam) continue;
    const spouseId = fam.husband === personId ? fam.wife : fam.husband;
    const spouse = spouseId ? people[spouseId] || null : null;
    const childNodes = (fam.children || [])
      .map(childId => getDescendants(childId, generations - 1))
      .filter(Boolean);
    node.spouseFamilies.push({
      spouse,
      marriageDate: fam.marriageDate,
      marriagePlace: fam.marriagePlace,
      children: childNodes
    });
  }
  return node;
}

function getAllByFamilyLine(line) {
  return Object.values(people).filter(p =>
    p.familyLine && p.familyLine.toLowerCase() === line.toLowerCase()
  );
}

function getFamilyLines() {
  return meta.familyLines || [...new Set(Object.values(people).map(p => p.familyLine).filter(Boolean))];
}

function searchPeople(query, filters = {}) {
  if (!query || !query.trim()) {
    let results = Object.values(people);
    if (filters.familyLines && filters.familyLines.length > 0) {
      results = results.filter(p => filters.familyLines.includes(p.familyLine));
    }
    return results;
  }
  const terms = query.toLowerCase().trim().split(/\s+/);
  const scored = [];
  for (const person of Object.values(people)) {
    if (filters.familyLines && filters.familyLines.length > 0) {
      if (!filters.familyLines.includes(person.familyLine)) continue;
    }
    let score = 0;
    const searchFields = buildSearchFields(person);
    for (const term of terms) {
      const fullName = getFullName(person).toLowerCase();
      if (fullName.includes(term)) {
        score += 10;
        if (fullName.startsWith(term)) score += 5;
      }
      if (person.maidenName && person.maidenName.toLowerCase().includes(term)) {
        score += 8;
      }
      for (const loc of searchFields.locations) {
        if (loc.includes(term)) score += 3;
      }
      if (searchFields.occupation && searchFields.occupation.includes(term)) {
        score += 4;
      }
      if (searchFields.notes && searchFields.notes.includes(term)) {
        score += 1;
      }
      if (person.familyLine && person.familyLine.toLowerCase().includes(term)) {
        score += 2;
      }
    }
    if (score > 0) {
      scored.push({ person, score });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.person);
}

function buildSearchFields(person) {
  const locations = [];
  if (person.birthPlace) locations.push(person.birthPlace.toLowerCase());
  if (person.deathPlace) locations.push(person.deathPlace.toLowerCase());
  if (person.burialPlace) locations.push(person.burialPlace.toLowerCase());
  if (person.residences) {
    for (const r of person.residences) {
      if (r.place) locations.push(r.place.toLowerCase());
    }
  }
  if (person.immigration) {
    if (person.immigration.from) locations.push(person.immigration.from.toLowerCase());
    if (person.immigration.to) locations.push(person.immigration.to.toLowerCase());
  }
  let occupation = '';
  if (typeof person.occupation === 'string') {
    occupation = person.occupation.toLowerCase();
  } else if (Array.isArray(person.occupation)) {
    occupation = person.occupation.join(' ').toLowerCase();
  }
  const notes = person.notes ? person.notes.toLowerCase() : '';
  return { locations, occupation, notes };
}

function getFullName(person) {
  if (!person) return 'Unknown';
  const parts = [];
  const first = person.firstName === 'Unknown' ? '(Unknown)' : (person.firstName || '(Unknown)');
  parts.push(first);
  if (person.middleName) parts.push(person.middleName);
  parts.push(person.lastName || '');
  if (person.maidenName) {
    parts.push(`(née ${person.maidenName})`);
  }
  return parts.filter(Boolean).join(' ').trim();
}

function getShortName(person) {
  if (!person) return 'Unknown';
  const first = person.firstName === 'Unknown' ? '?' : (person.firstName || '?');
  return `${first} ${person.lastName || ''}`.trim();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  if (/^\d{4}$/.test(str)) return str;
  if (/^\d{4}-\d{2}$/.test(str)) {
    const [y, m] = str.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(m, 10) - 1]} ${y}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [y, m, d] = str.split('-');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = parseInt(d, 10);
    return `${day} ${monthNames[parseInt(m, 10) - 1]} ${y}`;
  }
  return str;
}

function formatLifespan(person) {
  if (!person) return '';
  const birth = extractYear(person.birthDate);
  const death = extractYear(person.deathDate);
  if (birth && death) return `${birth}–${death}`;
  if (birth && isLiving(person)) return `b. ${birth}`;
  if (birth) return `b. ${birth}`;
  if (death) return `d. ${death}`;
  return '';
}

function extractYear(dateStr) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/(\d{4})/);
  return match ? match[1] : null;
}

function isLiving(person) {
  if (!person) return false;
  if (person.deathDate) return false;
  const birthYear = extractYear(person.birthDate);
  if (!birthYear) return false;
  return parseInt(birthYear, 10) >= 1920;
}

function getFamilyLineInfo(line) {
  const lines = {
    'thompson':        { label: 'Thompson',        color: '#1B2A4A', bg: '#E8EDF5' },
    'holmes':          { label: 'Holmes',           color: '#2D5016', bg: '#E5F0DB' },
    'smyth-gies':      { label: 'Smyth-Gies',      color: '#8B4557', bg: '#F5E0E6' },
    'northwood':       { label: 'Northwood',        color: '#7B5B2D', bg: '#F5EDDD' },
    'montgomery':      { label: 'Montgomery',       color: '#B8860B', bg: '#FFF5DB' },
    'smith-rowe-jones': { label: 'Smith-Rowe-Jones', color: '#4A6B8A', bg: '#E0EBF5' }
  };
  return lines[line] || { label: line || 'Unknown', color: '#666', bg: '#EEE' };
}

function getAge(person) {
  if (!person) return null;
  const birth = extractYear(person.birthDate);
  if (!birth) return null;
  const birthNum = parseInt(birth, 10);
  if (person.deathDate) {
    const death = extractYear(person.deathDate);
    if (!death) return null;
    return parseInt(death, 10) - birthNum;
  }
  if (isLiving(person)) {
    return new Date().getFullYear() - birthNum;
  }
  return null;
}

function getRootAncestors() {
  return Object.values(people).filter(p => !p.parentFamilyId);
}

function getRootFamilies() {
  return families.filter(fam => {
    const husband = fam.husband ? people[fam.husband] : null;
    const wife = fam.wife ? people[fam.wife] : null;
    const hNoParent = !husband || !husband.parentFamilyId;
    const wNoParent = !wife || !wife.parentFamilyId;
    return hNoParent && wNoParent;
  });
}

module.exports = {
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
};
