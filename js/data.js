/**
 * Data layer for Montgomery Ancestry Browser.
 * Loads, indexes, and queries people and family data.
 */

let people = {};
let families = [];
let familyIndex = {};
let meta = {};

/**
 * Fetch and parse both JSON data files.
 * @returns {{ people: Object, families: Array, meta: Object }}
 */
export async function loadData() {
  const [peopleRes, familyRes] = await Promise.all([
    fetch('data/people.json'),
    fetch('data/family-tree.json')
  ]);

  if (!peopleRes.ok) throw new Error(`Failed to load people.json: ${peopleRes.status}`);
  if (!familyRes.ok) throw new Error(`Failed to load family-tree.json: ${familyRes.status}`);

  const peopleData = await peopleRes.json();
  const familyData = await familyRes.json();

  people = peopleData.people || {};
  families = familyData.families || [];
  meta = familyData.meta || {};

  // Build family lookup index
  familyIndex = {};
  for (const fam of families) {
    familyIndex[fam.id] = fam;
  }

  return { people, families, meta };
}

/** Get a person by ID. */
export function getPerson(id) {
  return people[id] || null;
}

/** Get a family unit by ID. */
export function getFamily(id) {
  return familyIndex[id] || null;
}

/** Get all people as an array. */
export function getAllPeople() {
  return Object.values(people);
}

/** Get metadata. */
export function getMeta() {
  return meta;
}

/** Find parents of a person. Returns { father, mother, family } or null. */
export function getParents(personId) {
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

/** Find all children of a person across all spouse families. */
export function getChildren(personId) {
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

/** Find siblings of a person (same parent family, excluding self). */
export function getSiblings(personId) {
  const person = people[personId];
  if (!person || !person.parentFamilyId) return [];

  const fam = familyIndex[person.parentFamilyId];
  if (!fam) return [];

  return (fam.children || [])
    .filter(id => id !== personId)
    .map(id => people[id])
    .filter(Boolean);
}

/** Find all spouses of a person with marriage info. */
export function getSpouses(personId) {
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

/** Get ancestor tree up to N generations. Returns nested structure. */
export function getAncestors(personId, generations = 5) {
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

/** Get descendant tree down N generations. Returns nested structure. */
export function getDescendants(personId, generations = 5) {
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

/** Get all people belonging to a specific family line. */
export function getAllByFamilyLine(line) {
  return Object.values(people).filter(p =>
    p.familyLine && p.familyLine.toLowerCase() === line.toLowerCase()
  );
}

/** Get all distinct family lines. */
export function getFamilyLines() {
  return meta.familyLines || [...new Set(Object.values(people).map(p => p.familyLine).filter(Boolean))];
}

/**
 * Fuzzy search across name, location, occupation, notes.
 * @param {string} query - Search term
 * @param {Object} [filters] - Optional filters { familyLines: string[] }
 * @returns {Array} Matching people sorted by relevance
 */
export function searchPeople(query, filters = {}) {
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
      // Name match is highest priority
      const fullName = getFullName(person).toLowerCase();
      if (fullName.includes(term)) {
        score += 10;
        if (fullName.startsWith(term)) score += 5;
      }

      // Maiden name
      if (person.maidenName && person.maidenName.toLowerCase().includes(term)) {
        score += 8;
      }

      // Location matches
      for (const loc of searchFields.locations) {
        if (loc.includes(term)) score += 3;
      }

      // Occupation
      if (searchFields.occupation && searchFields.occupation.includes(term)) {
        score += 4;
      }

      // Notes
      if (searchFields.notes && searchFields.notes.includes(term)) {
        score += 1;
      }

      // Family line
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

// === Formatting Utilities ===

/** Get display-ready full name for a person. */
export function getFullName(person) {
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

/** Get short display name (first + last only). */
export function getShortName(person) {
  if (!person) return 'Unknown';
  const first = person.firstName === 'Unknown' ? '?' : (person.firstName || '?');
  return `${first} ${person.lastName || ''}`.trim();
}

/**
 * Format a date string for display.
 * Handles: full ISO "1822-03-15", year-only "1822", partial "1822-03", null.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;

  const str = String(dateStr).trim();

  // Year only: "1822"
  if (/^\d{4}$/.test(str)) return str;

  // Year-month: "1822-03"
  if (/^\d{4}-\d{2}$/.test(str)) {
    const [y, m] = str.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(m, 10) - 1]} ${y}`;
  }

  // Full ISO date: "1822-03-15"
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

/**
 * Format a lifespan string for display.
 * "1822–1914" or "b. 1911" for living, "b. ~1780?" for uncertain.
 */
export function formatLifespan(person) {
  if (!person) return '';

  const birth = extractYear(person.birthDate);
  const death = extractYear(person.deathDate);

  if (birth && death) return `${birth}–${death}`;
  if (birth && isLiving(person)) return `b. ${birth}`;
  if (birth) return `b. ${birth}`;
  if (death) return `d. ${death}`;
  return '';
}

/** Extract year from a date string. */
export function extractYear(dateStr) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/(\d{4})/);
  return match ? match[1] : null;
}

/**
 * Detect if a person is likely still living.
 * No death date + born after ~1920 = probably living.
 */
export function isLiving(person) {
  if (!person) return false;
  if (person.deathDate) return false;

  const birthYear = extractYear(person.birthDate);
  if (!birthYear) return false;

  return parseInt(birthYear, 10) >= 1920;
}

/**
 * Get the family line display name and color.
 */
export function getFamilyLineInfo(line) {
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

/** Compute age at death or current age if living. */
export function getAge(person) {
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

/** Get families where this person is a child (returns parent family). */
export function getParentFamily(personId) {
  const person = people[personId];
  if (!person || !person.parentFamilyId) return null;
  return familyIndex[person.parentFamilyId] || null;
}

/** Get all families (for tree rendering). */
export function getAllFamilies() {
  return families;
}

/** Find root ancestors (people with no parentFamilyId). */
export function getRootAncestors() {
  return Object.values(people).filter(p => !p.parentFamilyId);
}

/** Find root families (families where neither parent has a parentFamilyId). */
export function getRootFamilies() {
  return families.filter(fam => {
    const husband = fam.husband ? people[fam.husband] : null;
    const wife = fam.wife ? people[fam.wife] : null;
    const hNoParent = !husband || !husband.parentFamilyId;
    const wNoParent = !wife || !wife.parentFamilyId;
    return hNoParent && wNoParent;
  });
}
