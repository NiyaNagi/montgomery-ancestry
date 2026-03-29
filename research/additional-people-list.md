# Additional People List — Montgomery Ancestry Project

> **Source:** Analysis of three additional photos (IMG_3164, IMG_4933, IMG_4934).
> This document provides a structured list of corrections, new people, and new
> family units to be integrated into `people.json` and `families.json`.

---

## 1. Corrections to Existing People

These corrections are derived from **IMG_3164.jpg**, a clearer copy of the Thompson
Paternal Line typed document. All corrections below are **HIGH confidence** unless
otherwise noted.

### Correction 1: Belinda → Melinda Thompson (b. 1820)

| Field | Current Value | New Value |
|-------|--------------|-----------|
| **ID** | `belinda-thompson-1820` | Should be renamed to `melinda-thompson-1820` |
| `firstName` | "Belinda" | **"Melinda"** |
| `notes` | null | "Corrected from 'Belinda' per clearer photo IMG_3164" |
| `confidence` | "LOW" | "MEDIUM" (now confirmed by clearer source) |
| `sources` | ["Family photos"] | ["Family photos", "Additional photo IMG_3164 (clearer copy)"] |

**Impact**: ID slug should change from `belinda-thompson-1820` to `melinda-thompson-1820`.
All references to this ID in `families.json` must be updated.

---

### Correction 2: Harriette → Mariette Thompson (b. 1824, d. 1888)

| Field | Current Value | New Value |
|-------|--------------|-----------|
| **ID** | `harriette-thompson-1824` | Should be renamed to `mariette-thompson-1824` |
| `firstName` | "Harriette" | **"Mariette"** |
| `notes` | "m. H. Shedd" | "m. H. Shedd. Corrected from 'Harriette' per IMG_3164." |
| `confidence` | "LOW" | "MEDIUM" |
| `sources` | ["Family photos"] | ["Family photos", "Additional photo IMG_3164 (clearer copy)"] |

**Impact**: ID slug change. Family ID `family-harriette-thompson-h-shedd` should
become `family-mariette-thompson-h-shedd`. Update all references.

---

### Correction 3: Charles F. → Charles P. Thompson (b. 1827)

| Field | Current Value | New Value |
|-------|--------------|-----------|
| **ID** | `charles-f-thompson-1827` | Should be renamed to `charles-p-thompson-1827` |
| `middleName` | "F." | **"P."** |
| `notes` | "m. Wm. Bones (?)" | "m. Wm. Bowes. Middle initial corrected from 'F.' to 'P.' per IMG_3164." |
| `confidence` | "LOW" | "MEDIUM" |
| `sources` | ["Family photos"] | ["Family photos", "Additional photo IMG_3164 (clearer copy)"] |

**Impact**: ID slug change. Update all references.

---

### Correction 4: Spouse of Charles P. Thompson — Wm. Bones → Wm. Bowes

| Field | Current Value | New Value |
|-------|--------------|-----------|
| Person affected | `charles-f-thompson-1827` (→ `charles-p-thompson-1827`) | |
| `notes` (spouse reference) | "m. Wm. Bones (?)" | **"m. Wm. Bowes"** |

**Note**: If a separate person record exists for "Wm. Bones", the surname field
should be updated to **"Bowes"**. This resolves **Unresolved Question #6** from
`preliminary-tree.md`.

---

### Correction 5: Lucinda Thompson (b. 1817) Death Year

| Field | Current Value | New Value |
|-------|--------------|-----------|
| Person | `lucinda-thompson-1817` | |
| `deathDate` | null | **"1892"** |
| `notes` | "Death year uncertain: 1892 or 1902. m. B. Bennett" | "Death year confirmed as 1892 per IMG_3164. m. B. Bennett" |
| `confidence` | "LOW" | "MEDIUM" |

**Note**: The clearer photo definitively shows "1817-1892", resolving the earlier
ambiguity between 1892 and 1902.

---

### Correction 6: Jonathan Thompson Spelling Variant (b. 1785)

| Field | Current Value | New Value |
|-------|--------------|-----------|
| Person | `jonathan-thompson-1785` | |
| `notes` | null | "Document variant spelling: 'Jonathoan'. Likely a period spelling or typo in the original typed source." |

**Note**: This is a **MEDIUM confidence** correction. The standard spelling "Jonathan"
should be retained as the primary `firstName`, but the variant "Jonathoan" should be
noted. This is not a correction per se, but a documentation enhancement.

---

### Correction 7: Emeline → Emmaline Thompson (b. 1813, d. 1895)

| Field | Current Value | New Value |
|-------|--------------|-----------|
| Person | `emeline-thompson-1813` | |
| `firstName` | "Emeline" | **"Emmaline"** (or note as variant) |
| `notes` | "m. J. Hill; m. L. McGuinness" | "May also be 'Emeline' or 'Emma'. Clearer photo (IMG_3164) shows 'Emmaline'. m. J. Hill; m. L. McGuinness" |

**Note**: This is a **MEDIUM confidence** correction. "Emeline" and "Emmaline" are
both period-appropriate spellings. The clearer photo shows "Emmaline" but the original
may have been an abbreviation. Consider updating `firstName` to "Emmaline" or adding
both as variants.

---

### Discrepancy to Note (NOT a correction)

| Item | Detail |
|------|--------|
| **Calvin Thompson (Gen 3) birth year** | IMG_3164 shows **1820**; our validated DB has **1822** from Find a Grave #21578807 and census records |
| **Resolution** | Retain **1822** as the authoritative birth year. Note the 1820 appearance in the typed document as a discrepancy. The Find a Grave/census date (1822-11-30) is more precisely sourced. |

---

## 2. New People to Add

These people are identified from the poster-board photos (IMG_4933, IMG_4934).
Confidence levels are generally lower due to handwritten text and photo quality.

### From the Stevens Branch (IMG_4933, left side)

#### Person: James Stevens

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `james-stevens` | — |
| `firstName` | "James" | MEDIUM-HIGH |
| `lastName` | "Stevens" | MEDIUM-HIGH |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | ~1929 (possibly 5/05/1929) | LOW |
| `familyLine` | "northwood-stevens" (tentative) | LOW |
| `confidence` | "LOW" | — |
| `notes` | "Visible on poster-board family tree (IMG_4933). Possible descendant of Hattie Northwood & Doug Stevens." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

**Possible connection**: Son or grandson of **Hattie Northwood** (`hattie-northwood`)
& **Doug Stevens** — the only Stevens in our existing database.

---

#### Person: Betty Jane [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `betty-jane-unknown` | — |
| `firstName` | "Betty Jane" | MEDIUM |
| `lastName` | Unknown | — |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | ~1927 (possibly 3/15/1927) | LOW |
| `confidence` | "LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933, left side). Connected to unreadable male note. Marriage date possibly 5/1/1943." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

#### Person: Charlotte [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `charlotte-unknown-1926` | — |
| `firstName` | "Charlotte" | LOW-MEDIUM |
| `lastName` | Unknown | — |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | ~1926 (possibly 3/15/1926) | LOW |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933, left side). Connected to male note possibly reading 'Charles'. NOT the same as Charlotte Brown (1840-1894)." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

### From the Central/Boxed Family Unit (IMG_4933, center)

#### Person: Karen Anne [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `karen-anne-unknown` | — |
| `firstName` | "Karen Anne" | MEDIUM-HIGH |
| `lastName` | Unknown (possibly Stevens or Montgomery married name) | — |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown (date visible but unreadable) | — |
| `confidence` | "LOW" | — |
| `notes` | "Central figure on poster-board (IMG_4933), highlighted inside a drawn rectangle. Connected to husband (name unreadable) and children including Lauren. Marriage date possibly ~4/15/1965." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

#### Person: Lauren [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `lauren-unknown` | — |
| `firstName` | "Lauren" | MEDIUM |
| `lastName` | Unknown | — |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown (date visible, possibly 1960s-1970s) | — |
| `confidence` | "LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933), positioned below the boxed Karen Anne family unit. Likely daughter of Karen Anne." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

### From the Stewart(?) Cluster (IMG_4933, center-right)

#### Person: Oliver [Possibly "Oliver Stewart"]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `oliver-unknown` | — |
| `firstName` | "Oliver" | LOW-MEDIUM |
| `lastName` | Possibly "Stewart" | LOW |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933, center-right). Connected to female note possibly reading 'Diane/Diana'." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

#### Person: Diane/Diana [Possibly "Diane Stewart"]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `diane-unknown` | — |
| `firstName` | "Diane" (or "Diana") | LOW |
| `lastName` | Possibly "Stewart" (or "Scott") | LOW |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown (possibly ~1966 from date "9/4/66") | LOW |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933). Connected to Oliver." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

#### Person: Kimberly [Possibly "Kimberly Sue"]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `kimberly-unknown` | — |
| `firstName` | "Kimberly" | LOW |
| `lastName` | Unknown | — |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown (possibly 1960s) | LOW |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933, upper area)." |
| `sources` | ["Additional photo IMG_4933 (poster board)"] | — |

---

### From the Right Side (IMG_4933 / IMG_4934 overlap)

#### Person: Margaret Blanch (or Blanche) [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `margaret-blanch-unknown` | — |
| `firstName` | "Margaret" | MEDIUM |
| `middleName` | "Blanch" (or "Blanche") | MEDIUM |
| `lastName` | Unknown | — |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Partially readable (possibly includes "/17") | LOW |
| `confidence` | "LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933 lower-right and IMG_4934 upper-right). Prominent position suggests family matriarch in this branch. Connected to Marshall below." |
| `sources` | ["Additional photos IMG_4933 and IMG_4934 (poster board)"] | — |

---

#### Person: Marshall [Possibly "Marshall Elton"]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `marshall-unknown` | — |
| `firstName` | "Marshall" | LOW-MEDIUM |
| `middleName` | Possibly "Elton" (or "Ellen") | LOW |
| `lastName` | Unknown | — |
| `gender` | Unknown (note color ambiguous) | — |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933/4934). Connected below Margaret Blanch." |
| `sources` | ["Additional photos IMG_4933 and IMG_4934 (poster board)"] | — |

---

### From the Jones Branch (IMG_4934, left side)

#### Person: Alonzo (or Alfonso) [Possibly Jones]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `alonzo-unknown` | — |
| `firstName` | "Alonzo" (or "Alfonso") | LOW-MEDIUM |
| `lastName` | Possibly "Jones" | LOW |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | ~1926 (possibly 3/13/1926) | LOW |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, upper-left). Part of a column of male family members. If a Jones, could be a sibling of Clyde Edward Jones or from an earlier generation." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Jonathan [Possibly Jones]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `jonathan-unknown-jones` | — |
| `firstName` | "Jonathan" | LOW-MEDIUM |
| `lastName` | Possibly "Jones" | LOW |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | Unknown (1920s range) | LOW |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, left side). Below Alonzo in the same column." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Daniel Jones

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `daniel-jones-unknown` | — |
| `firstName` | "Daniel" | MEDIUM |
| `lastName` | "Jones" | MEDIUM |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | Unknown (possibly 1950s based on position in tree) | LOW |
| `confidence` | "LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, center-left). The Jones surname is readable. May be a descendant of Clyde Edward Jones & Margaret Marie Crissey." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Dorothy [Possibly Jones]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `dorothy-unknown-jones` | — |
| `firstName` | "Dorothy" | LOW |
| `lastName` | Possibly "Jones" | LOW |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, upper-left). May appear more than once (multiple Dorothys or same person in different context). Possibly 'Dorothy Christine' or 'Dorothy Jones'." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Constance [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `constance-unknown` | — |
| `firstName` | "Constance" | LOW |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, left). Part of the same family cluster as Alonzo, Jonathan, Dorothy." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

### From the Center of IMG_4934

#### Person: Kathleen Ann [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `kathleen-ann-unknown` | — |
| `firstName` | "Kathleen Ann" | LOW-MEDIUM |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, center). Connected to Daniel Jones cluster." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Evelyn Bertha [Surname Unknown]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `evelyn-bertha-unknown` | — |
| `firstName` | "Evelyn" | LOW |
| `middleName` | Possibly "Bertha" | LOW |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, center). Part of a descendant cluster." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Jordan Frances (or Jordon Frances)

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `jordan-frances-unknown` | — |
| `firstName` | "Jordan" (or "Jordon") | LOW-MEDIUM |
| `middleName` | "Frances" | LOW |
| `gender` | "female" (pink note) or possibly male | LOW |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, center-lower). Positioned as a descendant in the tree." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

### From the Lower-Right of IMG_4934 (Possible Frost Connection)

#### Person: Dorene (or Doreen) [Possibly Frost]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `dorene-unknown` | — |
| `firstName` | "Dorene" (or "Doreen") | LOW |
| `lastName` | Possibly "Frost" | LOW |
| `gender` | "female" | HIGH (pink note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, lower-right). If surname is 'Frost', may connect to Edward Frost Rowe family line." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: Steve [Possibly Frost]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `steve-unknown` | — |
| `firstName` | "Steve" | LOW |
| `lastName` | Possibly "Frost" | LOW |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4934, lower-right). Near Dorene; possibly same family." |
| `sources` | ["Additional photo IMG_4934 (poster board)"] | — |

---

#### Person: David [Surname partially readable]

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `david-unknown-poster` | — |
| `firstName` | "David" | LOW-MEDIUM |
| `lastName` | Possibly "Singer" or "Senger" | LOW |
| `gender` | "male" | HIGH (blue/green note) |
| `birthDate` | Unknown | — |
| `confidence` | "VERY LOW" | — |
| `notes` | "Visible on poster-board (IMG_4933/4934). Appears in right-side cluster near Margaret Blanch. NOT the same as David Michael Montgomery." |
| `sources` | ["Additional photos IMG_4933/4934 (poster board)"] | — |

---

### People Visible But Unreadable

The poster board contains approximately **40-60 additional people** whose sticky notes
are visible but whose names and dates cannot be read from these photos. These include:

- ~15-20 females (pink notes) scattered throughout both photos
- ~8-12 males (blue/green notes)
- Several notes at the top and bottom edges that are cut off by the photo frame
- Notes in the center that are partially obscured by shadows or angle

**Recommendation**: Photograph the poster board at higher resolution (ideally section by
section with a close-up lens) to capture all remaining people. Based on the density of
notes, this could yield **40-60 additional named individuals** with dates.

---

## 3. New Family Units

Based on the connection lines visible on the poster board, the following family units
can be identified:

### Family Unit 1: James Stevens & Wife

| Role | Person | Confidence |
|------|--------|------------|
| Husband | James Stevens | MEDIUM-HIGH |
| Wife | [Name unreadable — possibly "Madison E."] | VERY LOW |
| Marriage date | ~1960s (yellow note visible) | LOW |
| Children | Possibly Karen Anne and/or others (connected by lines below) | LOW |

---

### Family Unit 2: Karen Anne & Husband (Boxed Unit)

| Role | Person | Confidence |
|------|--------|------------|
| Wife | Karen Anne [surname unknown] | MEDIUM-HIGH |
| Husband | [Name unreadable] | VERY LOW |
| Marriage date | ~4/15/1965 or similar (yellow note) | LOW |
| Children | Lauren (MEDIUM confidence), possibly others | LOW-MEDIUM |

---

### Family Unit 3: Betty Jane & Husband

| Role | Person | Confidence |
|------|--------|------------|
| Wife | Betty Jane [surname unknown] | MEDIUM |
| Husband | [Name unreadable] | VERY LOW |
| Marriage date | ~5/1/1943 (yellow note) | LOW |
| Children | [Connected notes below — names unreadable] | VERY LOW |

---

### Family Unit 4: Oliver & Diane/Diana

| Role | Person | Confidence |
|------|--------|------------|
| Husband | Oliver [possibly Stewart] | LOW-MEDIUM |
| Wife | Diane/Diana [possibly Stewart/Scott] | LOW |
| Marriage date | Unknown | — |
| Children | [Connected notes below — possibly "Kimberly", "April"] | VERY LOW |

---

### Family Unit 5: Daniel Jones & Kathleen Ann

| Role | Person | Confidence |
|------|--------|------------|
| Husband/Partner | Daniel Jones | MEDIUM |
| Wife/Partner | Kathleen Ann [surname unknown] | LOW-MEDIUM |
| Marriage date | Yellow note visible, date unreadable | LOW |
| Children | Possibly Evelyn Bertha, Jordan Frances, others | VERY LOW |

---

### Family Unit 6: Margaret Blanch & Spouse

| Role | Person | Confidence |
|------|--------|------------|
| Wife/Mother | Margaret Blanch (or Blanche) | MEDIUM |
| Husband | [Name unreadable] | VERY LOW |
| Marriage date | Yellow note visible | LOW |
| Children | Marshall [Elton?], possibly David, others | LOW |

---

### Family Unit 7: Alonzo/Alfonso & Partner (Jones Branch?)

| Role | Person | Confidence |
|------|--------|------------|
| Husband | Alonzo (or Alfonso) [possibly Jones] | LOW-MEDIUM |
| Wife | [Possibly "Alice Jane"] | LOW |
| Children | [Connected notes below] | VERY LOW |

---

## 4. Unresolved Questions Updated

The new photos help resolve some existing questions and raise new ones:

### Questions Resolved

| # | Original Question | Resolution | Source |
|---|------------------|------------|--------|
| 6 | Charles F. Thompson (b. 1827) spouse — "Wm. Bones" suspicious | **Resolved**: Spouse is "Wm. Bowes" (a known surname) | IMG_3164 |
| — | Lucinda Thompson (b. 1817) death year — 1892 or 1902? | **Resolved**: Death year is **1892** | IMG_3164 |

### Questions Partially Addressed

| # | Original Question | Update | Source |
|---|------------------|--------|--------|
| — | Melinda vs Belinda | **Resolved**: Name is **Melinda** | IMG_3164 |
| — | Mariette vs Harriette | **Resolved**: Name is **Mariette** | IMG_3164 |

### New Questions Raised

| # | Question | Source |
|---|----------|--------|
| 17 | **Who is James Stevens?** Is he a descendant of Hattie Northwood & Doug Stevens from the Northwood line? | IMG_4933 poster board |
| 18 | **Who is Karen Anne?** She is highlighted (boxed) on the poster as a central figure. What is her surname and which family line does she belong to? | IMG_4933 poster board |
| 19 | **What is the relationship between the Jones branch on the poster and our existing Jones data?** Daniel Jones appears prominently — is he a son of one of the known Jones children (Richard Allen, Marie Louise, Marilyn Sue, Sharon)? | IMG_4934 poster board |
| 20 | **Is "Frost" a surname on the poster?** If Dorene Frost and Steve Frost are correctly read, does this connect to Edward **Frost** Rowe? | IMG_4934 poster board |
| 21 | **What is the Stewart family connection?** Oliver and Diane (possibly Stewart) appear on the poster but have no obvious link to existing family lines. | IMG_4933 poster board |
| 22 | **Full poster content**: The poster board contains ~70-90 people total, of which only ~25-30 could be read from these photos. What data exists on the remaining ~40-60 individuals? | IMG_4933 + IMG_4934 |

---

## 5. Priority Actions

### Immediate (can be done now)
1. ✅ Apply the 7 corrections from IMG_3164 to `people.json`
2. ✅ Update ID slugs for renamed people (Melinda, Mariette, Charles P.)
3. ✅ Update `families.json` references for renamed IDs
4. ✅ Mark Unresolved Questions #6 as resolved in `preliminary-tree.md`
5. ✅ Add IMG_3164 as a source to the Thompson Paternal Line entries

### Requires Further Investigation
6. 🔍 Photograph the poster board at higher resolution (section by section)
7. 🔍 Interview family member who created the poster to identify all people
8. 🔍 Determine James Stevens' relationship to the Northwood/Stevens line
9. 🔍 Determine Karen Anne's surname and family line placement
10. 🔍 Investigate the Frost surname connection to Edward Frost Rowe

### After Higher-Resolution Photos Obtained
11. 📝 Add all newly identified people to `people.json`
12. 📝 Create family unit records in `families.json`
13. 📝 Update `preliminary-tree.md` with new branches
14. 📝 Re-count total unique persons (currently 107; likely to exceed 150+)
