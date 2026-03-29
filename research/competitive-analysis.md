# Competitive Analysis: Ancestry & Genealogy Services

> **Purpose:** Comprehensive UX analysis of the top 5 genealogy platforms to inform the design of the Montgomery Ancestry Browser.
> **Date:** 2025
> **Methodology:** Website analysis, feature audits, and secondary research across all platforms.

---

## Table of Contents

1. [Ancestry.com](#1-ancestrycom)
2. [FamilySearch.org](#2-familysearchorg)
3. [MyHeritage.com](#3-myheritagecom)
4. [FindMyPast.com](#4-findmypastcom)
5. [Geni.com](#5-genicom)
6. [Cross-Platform Comparison Matrix](#6-cross-platform-comparison-matrix)
7. [Key Takeaways](#7-key-takeaways)

---

## 1. Ancestry.com

**Type:** For-profit, subscription-based | **Owner:** Blackstone Inc. | **Users:** 25M+ | **Records:** 30B+

### 1.1 Information Architecture

- **Primary navigation:** Family Tree, Search, DNA, Extras, Help
- **Tree-centric model:** Users create one or more personal trees; each tree is the hub for all activity
- **Hierarchy:** Tree → Person → Facts/Events → Sources → Media
- **Record categories:** Census, birth/marriage/death (BMD), military, immigration, newspapers, photos, stories, maps
- **Search is deeply integrated:** Every fact on a person can be cross-referenced with Ancestry's record database
- **Ancestry Hints ("Leaves"):** Green leaf icons appear on person nodes when the system identifies potential matching records—this gamification mechanic drives engagement

### 1.2 Person Profile Metadata

Ancestry displays the most comprehensive per-person metadata of any platform:

| Category | Fields |
|----------|--------|
| **Identity** | Full name, suffix, prefix, alternate/maiden names, nicknames, aliases |
| **Birth** | Date (exact or estimated), location (city, county, state, country) |
| **Christening/Baptism** | Date, location, denomination |
| **Death** | Date, location, cause of death (when in records) |
| **Burial** | Date, location, cemetery name, plot number |
| **Marriage(s)** | Date, location, spouse name (supports multiple marriages) |
| **Divorce** | Date, location |
| **Occupation(s)** | Job title, employer, date range |
| **Military Service** | Branch, rank, service dates, conflict/war, unit, discharge type |
| **Education** | Institution, degree, dates attended |
| **Religion** | Denomination, congregation |
| **Residences** | Multiple addresses with date ranges (sourced from census/directories) |
| **Immigration/Emigration** | Date, port of departure, port of arrival, ship name, destination |
| **Naturalization** | Date, court, location |
| **Physical Description** | Height, weight, hair color, eye color (from military/passport records) |
| **Social Security** | SSN (last 4), issue date, issue state |
| **Relationships** | Parents, siblings, spouses, children (with relationship type: biological, adopted, step, foster) |
| **Sources** | Unlimited attached citations per fact, linking to digitized records |
| **Photos & Media** | Uploaded photos, scanned documents, audio recordings, stories (narrative text) |
| **Notes** | Free-text notes per person or per fact |
| **Timeline** | Auto-generated chronological timeline of all life events, including contextual family events |

### 1.3 Tree Visualization

- **Pedigree View (default):** Left-to-right horizontal chart showing direct ancestors. Expandable to 5+ generations. Clean card-based nodes showing name, birth/death dates, and photo thumbnail.
- **Family View:** Shows a nuclear family unit—person, spouse, children, and parents. Allows sideways navigation through siblings.
- **Fan Chart:** Radial/semicircular display of ancestors fanning out from the root person. Color-coded by paternal/maternal lines.
- **Descendant View:** Top-down chart showing all descendants of a selected ancestor.
- **Timeline View:** Linear chronological display of life events with contextual events (e.g., sibling births, parent deaths).
- **Story View:** Narrative auto-generated biography combining known facts.
- **Map View:** Geographic visualization of life events and migration patterns.

### 1.4 Search & Filter

- **Global search bar:** Search across all records, all trees, or within a specific tree
- **Person search within tree:** Name-based search with auto-suggest
- **Advanced search:** Filter by record type, date range, location, keywords
- **Ancestry Hints filter:** Filter people by those with pending hints vs. no hints
- **Record category browsing:** Hierarchical browsing by record collection, geography, and time period

### 1.5 Mobile Experience

- **Native iOS and Android apps** (launched 2011, continuously updated)
- **Responsive web:** Full responsive design with mobile-optimized layouts
- **Mobile features:** Photo capture for documents, tree browsing, hint review, basic editing
- **Touch-optimized:** Swipe navigation through tree, pinch-to-zoom on charts
- **Simplified navigation:** Bottom tab bar (Tree, Search, DNA, Notifications, More)

### 1.6 Visual Design

- **Color palette:** Deep green (#3B6E34) as primary brand color, warm gold accents, cream/off-white backgrounds, charcoal text
- **Typography:** Clean sans-serif body text (system fonts), serif for headings to evoke heritage/tradition
- **Layout:** Card-based UI with generous whitespace. Person cards are rounded rectangles with photo circles.
- **Imagery:** Sepia-toned historical photos, hand-drawn leaf motifs, warm nostalgic color grading
- **Emotional tone:** Warm, inviting, discovery-oriented. Emphasizes the journey of exploration.
- **Tree nodes:** Rounded cards with photo avatar, name, birth–death year range. Green leaf badge for hints.

### 1.7 Unique Features

- **Ancestry Hints (Leaf system):** Automated record matching with gamification; the iconic green leaf drives user engagement
- **ThruLines™:** DNA-based relationship visualization showing how DNA matches connect to your tree
- **AncestryDNA integration:** Ethnicity estimates across 3,600+ regions, DNA matching, SideView™ technology (maternal/paternal ethnicity split)
- **Story creation tools:** Auto-generated life stories from facts and records
- **Collaborative trees:** Multiple editors can work on the same tree
- **30B+ record database:** By far the largest commercial genealogical database

---

## 2. FamilySearch.org

**Type:** Non-profit (Church of Jesus Christ of Latter-day Saints) | **Users:** Millions | **Records:** 5.7B+ digital images | **Cost:** Completely free

### 2.1 Information Architecture

- **Primary navigation:** Family Tree, Search (Records), Memories, Indexing, Activities
- **"One World Tree" model:** Single collaborative tree where all users contribute to the same global database (1.5B+ individuals)
- **Hierarchy:** Person → Details (Vital/Other Info) → Sources → Memories → Collaborate
- **Tab-based person page:** About, Details, Sources, Memories, Collaborate
- **Record integration:** Attached sources link to digitized records, indexed documents, and user-submitted content

### 2.2 Person Profile Metadata

| Category | Fields |
|----------|--------|
| **Identity** | Full name, alternate names, titles, suffixes |
| **Sex/Gender** | Male, Female, Unknown |
| **Birth** | Date, location |
| **Christening** | Date, location |
| **Death** | Date, location |
| **Burial** | Date, location |
| **Marriage(s)** | Date, location, spouse (supports multiple) |
| **Residences** | Multiple locations with dates |
| **Occupation(s)** | Job titles with dates |
| **Other Events** | Immigration, emigration, naturalization, military service, education, religion, custom facts |
| **Other Relationships** | Godparent, employer/employee, neighbor, household member, enslavement, apprenticeship |
| **Brief Life History** | Auto-generated or manually written narrative biography |
| **Sources** | Attached source citations with links to digitized records |
| **Memories** | Photos, stories, documents, audio files |
| **Notes** | Research notes, alert notes |
| **Discussion** | Collaborative discussion threads per person |
| **Timeline** | Chronological life events with interactive map overlay |

### 2.3 Tree Visualization

- **Landscape View:** Traditional left-to-right pedigree chart (default)
- **Portrait View:** Vertical layout with person centered, ancestors above, descendants below; includes siblings and collateral lines
- **Fan Chart View:** Colorful radial chart with focal individual at center, generations fanning outward. Color-coded by generation or line.
- **Descendancy View:** Vertical list/tree of all descendants
- **Charts (printable):** Pedigree charts and family group sheets for print
- **Timeline + Map:** Combined chronological and geographic display of life events

### 2.4 Search & Filter

- **Global record search:** Search across all indexed records by name, date, location
- **Tree search:** Find people in the collaborative tree by name, ID, or relationship
- **Advanced search filters:** Event type, date range, location, relationship, record collection
- **Find feature:** Locate duplicates and potential merges in the global tree

### 2.5 Mobile Experience

- **Native mobile apps** (iOS and Android) with full tree browsing, memories upload, and record search
- **Responsive web design** adapts to tablet and phone screens
- **Photo capture:** Scan documents and photos directly from mobile
- **Simplified mobile navigation** with bottom tab bar

### 2.6 Visual Design

- **Color palette:** Teal/forest green (#3FAE2A) as primary, white backgrounds, light gray accents, charcoal text
- **Typography:** Clean, modern sans-serif throughout (system fonts)
- **Layout:** Spacious, airy design with generous padding. Card-based person display.
- **Imagery:** Focus on historical documents and family photos. Nature motifs (trees, leaves).
- **Tone:** Warm, community-oriented, scholarly yet accessible.

### 2.7 Unique Features

- **Completely free:** No paywall—all records, tree features, and tools are free
- **Global collaborative tree:** Single shared tree avoids duplication; all users contribute to one dataset
- **Memories feature:** Attach photos, audio, stories, and documents directly to people
- **Indexing volunteers:** Crowdsourced indexing of historical records (massive community effort)
- **Temple ordinance integration:** Features specific to LDS members for religious ordinance work
- **6,400+ FamilySearch Centers worldwide** for in-person research assistance
- **Portrait View:** Innovative vertical view showing ancestors, descendants, and siblings in one visualization
- **Discussion threads:** Collaborative research discussions attached to each person

---

## 3. MyHeritage.com

**Type:** For-profit, freemium | **Owner:** Francisco Partners | **Users:** 80M+ | **Records:** 19.9B+ | **Trees:** 27M+

### 3.1 Information Architecture

- **Primary navigation:** Family Tree, Discoveries, DNA, Research, Photo Tools
- **Individual tree model:** Each user builds their own tree; trees can be matched/merged via Smart Matches
- **Hierarchy:** Tree → Person → Profile Page (Facts, Family, Timeline, Matches, Journey, Biography, Photos, Sources, Notes)
- **Smart Matches™:** Automated cross-referencing between user trees and records
- **Record Matches™:** Automated matching of tree profiles to historical records
- **Consistency Checker:** Automated validation of data quality

### 3.2 Person Profile Metadata

| Category | Fields |
|----------|--------|
| **Identity** | Full name, alternate names, maiden name, nicknames |
| **Birth** | Date, location |
| **Death** | Date, location |
| **Marriage(s)** | Date, location, spouse |
| **Divorce** | Date, location |
| **Occupation(s)** | Job title with dates |
| **Residences** | Multiple addresses with dates |
| **Immigration/Emigration** | Date, location |
| **Military Service** | Dates, details |
| **Education** | Institution, dates |
| **Religion** | Denomination |
| **Custom Events** | User-defined events with dates and locations |
| **Immediate Family** | Quick-view panel of parents, siblings, spouse, children |
| **Timeline** | Chronological life events |
| **Journey/Map** | Geographic visualization of life events and migration paths |
| **Biography** | AI-generated or manually written life narrative |
| **Smart Matches** | Links to matching profiles in other users' trees |
| **Record Matches** | Links to matching historical records |
| **Consistency Issues** | Automated data quality warnings |
| **Photos** | Upload, colorize, enhance, repair, animate (Deep Nostalgia™) |
| **Sources** | Source citations and attached documents |
| **Notes** | Free-text research notes |

### 3.3 Tree Visualization

MyHeritage offers the most visualization options of any platform:

**Interactive Views (4):**
- **Family View:** Horizontal branching view showing all connected family members. Card-based nodes with vertical card option for compactness.
- **Pedigree View:** Direct ancestral line only (no siblings/cousins). Clean, focused display.
- **Fan View:** Radial ancestor chart color-coded by maternal/paternal lines.
- **List View:** Tabular, sortable, searchable list of all individuals.

**Printable Charts (8):**
- **Bowtie Chart:** Person centered, ancestors on both sides, children below
- **Close Family Chart:** Grandparents and all descendants (includes cousins)
- **Ancestor Chart:** Direct ancestors only
- **Descendants Chart:** All descendants of a chosen person
- **Hourglass Chart:** Both ancestors and descendants
- **Sun Chart:** Radial display with person at center
- **Fan Chart:** Fan-shaped ancestor display
- **All-in-One Chart:** Comprehensive chart of all relatives

**Chart customization:** 18+ visual templates, customizable backgrounds, colors, fonts, adjustable number of generations.

### 3.4 Search & Filter

- **SuperSearch:** Unified search across all 19.9B records
- **Tree search:** Name search within personal tree with auto-suggest
- **Record Detective:** Automatically finds connections between different historical records
- **Global Name Translation:** Translates names across languages for cross-cultural searching
- **Smart Matches filter:** View pending matches, confirmed matches, rejected matches

### 3.5 Mobile Experience

- **Native iOS and Android apps** (award-winning)
- **Full tree browsing and editing** on mobile
- **Photo tools on mobile:** Colorize, animate, enhance photos
- **Sync between desktop software, web, and mobile**
- **Responsive web design** with mobile-optimized layouts
- **Cross-device continuity:** Start on desktop, continue on mobile

### 3.6 Visual Design

- **Color palette:** Purple/violet (#6A2C8B) as primary, white backgrounds, warm grays, green accents for matches
- **Typography:** Modern sans-serif, clean and readable. Slight playfulness in heading weights.
- **Layout:** Card-based UI with rounded corners. Tree nodes are rectangular cards with photo circles.
- **Imagery:** Warm, family-oriented photography. Sepia/colorized historical photos featured prominently.
- **Tone:** Emotional, discovery-focused. "Amaze yourself" tagline. Emphasis on visual storytelling.

### 3.7 Unique Features

- **Deep Nostalgia™:** AI-powered animation of historical photos (119M+ animations created)—viral sensation
- **Photo colorization:** AI colorization of black-and-white photos
- **Photo enhancement & repair:** AI-based upscaling and damage repair
- **AI biography generation:** Auto-generated life stories from available data
- **Instant Discoveries:** Add entire branches of relatives at once from matched records
- **Time Machine™:** Photo filter that applies historical era styling
- **Global Name Translation:** Cross-language name matching for international research
- **Consistency Checker:** 28+ types of automated data validation
- **Owned by same parent as Geni.com:** Cross-platform matching between MyHeritage trees and Geni's collaborative World Family Tree

---

## 4. FindMyPast.com

**Type:** For-profit, subscription-based | **Owner:** DC Thomson | **Focus:** British & Irish genealogy

### 4.1 Information Architecture

- **Primary navigation:** Search, Family Tree, DNA, Newspapers, Projects, Help
- **UK/Ireland-centric:** Positioned as "the home of British and Irish family history"
- **Record-first approach:** Search is the primary entry point, with tree building as secondary
- **Hierarchy:** Records → Person → Tree → Sources
- **Partnerships:** The National Archives (UK), British Library, British Newspaper Archive, Family History Federation
- **Hint-based discovery:** Tree hints connecting people to matching records

### 4.2 Person Profile Metadata

| Category | Fields |
|----------|--------|
| **Identity** | Full name, alternate names |
| **Birth** | Date, location |
| **Christening/Baptism** | Date, location |
| **Death** | Date, location |
| **Burial** | Date, location |
| **Marriage(s)** | Date, location, spouse |
| **Occupation** | From census and directory records |
| **Residences** | Multiple addresses with dates (census-sourced) |
| **Military Service** | Service details from military records |
| **Immigration/Emigration** | Travel records, passenger lists |
| **Relationships** | Parents, siblings, spouse, children |
| **Sources** | Attached record citations |
| **Photos/Documents** | Uploaded media |
| **Notes** | Research notes |

### 4.3 Tree Visualization

- **Pedigree View:** Standard ancestor chart (default)
- **Family View:** Nuclear family view with navigation to extended relations
- **Person-centric navigation:** Click-through from person to person
- **Limited chart options** compared to Ancestry/MyHeritage—focused on functional tree-building over visual variety

### 4.4 Search & Filter

- **Advanced record search:** Search by name, date, location, keyword, record type
- **Newspaper archive search:** Full-text search across millions of digitized newspaper pages
- **Category browsing:** Browse records by type (BMD, census, military, migration, parish records, directories, newspapers)
- **Transcription search:** Search both index entries and original document transcriptions
- **Historical maps:** Geographic exploration of ancestor locations through historical map layers

### 4.5 Mobile Experience

- **Responsive web design** (no dedicated native app as prominent as competitors)
- **Mobile-optimized search** and tree browsing
- **Touch-friendly navigation** on tablets and phones

### 4.6 Visual Design

- **Color palette:** Deep teal/green as primary, cream/off-white backgrounds, warm sepia tones for imagery
- **Typography:** Mix of serif (headings) and sans-serif (body) for a heritage feel
- **Layout:** Editorial, magazine-style layout with large hero images. Card-based record results.
- **Imagery:** Sepia-toned vintage photographs, historical document reproductions, British heritage aesthetic
- **Tone:** Scholarly, authoritative, heritage-focused. "Discover Gran's real story" messaging.

### 4.7 Unique Features

- **British Newspaper Archive:** Exclusive partnership with the British Library for the largest online archive of UK and Irish newspapers
- **Historical Maps:** Interactive maps with historical overlays for geographic exploration
- **Collections feature:** Curate and share newspaper clippings to visually tell ancestor stories
- **The National Archives partnership:** Exclusive access to the UK's official national archive
- **1921 Census:** Exclusive online access to the England & Wales 1921 Census
- **Migration story maps:** Follow ancestors through time with milestones plotted on maps
- **GEDCOM upload with instant hints:** Import existing trees for immediate record matching

---

## 5. Geni.com

**Type:** Freemium, collaborative | **Owner:** MyHeritage | **Profiles:** 200M+ | **Model:** "World Family Tree"

### 5.1 Information Architecture

- **Primary navigation:** Tree, People, Projects, Discussions, DNA
- **"World Family Tree" model:** Single collaborative tree (similar to FamilySearch but community-driven)
- **Hierarchy:** World Tree → Person → Profile → Sources → Projects → Discussions
- **Social networking model:** Family tree building combined with social features (invitations, discussions, collaboration)
- **Project system:** Special-interest groups organized around topics, places, occupations, historical events
- **130+ languages** natively translated by volunteers

### 5.2 Person Profile Metadata

| Category | Fields |
|----------|--------|
| **Identity** | Full name, display name, maiden name, nicknames, alternate names |
| **Birth** | Date, location |
| **Death** | Date, location |
| **Marriage(s)** | Date, location, spouse |
| **Occupation** | Job titles |
| **Residences** | Locations |
| **About Me** | Free-text biography |
| **Relationships** | Parents, siblings, spouse, children (biological, adopted, step, etc.) |
| **Sources/Citations** | Attached source documentation (emphasized after community push for documentation) |
| **Photos/Media** | Up to 1GB (Basic) or unlimited (Pro) |
| **DNA Results** | Autosomal, Y-DNA, mtDNA test results; haplogroup propagation through family lines |
| **Projects** | Links to relevant genealogy projects |
| **Discussions** | Profile-specific discussion threads |
| **Blood/In-Law Relationship Paths** | Calculated relationship paths between any two people |

### 5.3 Tree Visualization

- **Interactive Tree View (primary):** Graphical tree builder where users drag-and-drop to add/connect people. Horizontal branching with zoom/pan.
- **Relationship Path Diagrams:** Visual path showing how two people are related (Pro feature)
- **Blood and In-Law Paths:** Calculated paths showing familial connections through blood or marriage
- **List View:** Searchable, sortable list of profiles
- **No fan chart or printable chart options** natively (relies on MyHeritage for advanced visualizations)

### 5.4 Search & Filter

- **Site-wide search (Pro):** Search all 200M+ profiles
- **Tree search (Basic):** Search within your connected tree
- **Tree Matches:** Automated matching with other users' trees
- **SmartCopy (third-party):** Browser extension for importing data from other genealogy sites
- **Project search:** Browse 80,000+ genealogy projects by topic

### 5.5 Mobile Experience

- **Responsive web** (no dedicated native app as prominent as competitors)
- **Mobile-friendly tree navigation** with touch gestures
- **Simplified editing** on mobile devices

### 5.6 Visual Design

- **Color palette:** Blue (#2E86C1) as primary, white backgrounds, light gray accents
- **Typography:** Clean sans-serif throughout. Functional, straightforward design.
- **Layout:** Tree-centric UI with most screen real estate dedicated to the interactive tree. Minimal chrome.
- **Imagery:** Profile photos are prominent. Historical photos for popular profiles (celebrities, historical figures).
- **Tone:** Community-focused, collaborative. "Join the World Family Tree" messaging.

### 5.7 Unique Features

- **World Family Tree:** Single collaborative tree aiming to connect all humanity—208M+ profiles connected
- **Collaborative editing:** Any user can contribute to any public profile (wiki-style)
- **Consistency Checker:** 28 types of automated data quality checks (born after death, parent too young, etc.)
- **Genealogy Projects:** 80,000+ special-interest research projects (by topic, place, era, occupation)
- **DNA haplogroup propagation:** Import DNA test results and auto-propagate haplogroups through family lines
- **Relationship calculator:** Calculate exact relationship between any two people in the tree
- **Curator system:** Volunteer curators help resolve conflicts, maintain quality, and assist users
- **Celebrity/historical profiles:** Popular profiles of famous people drive engagement and discoverability
- **Completely free basic tier:** Unlimited profiles, no paywall on core features

---

## 6. Cross-Platform Comparison Matrix

| Feature | Ancestry | FamilySearch | MyHeritage | FindMyPast | Geni |
|---------|----------|--------------|------------|------------|------|
| **Pricing** | Subscription ($) | Free | Freemium | Subscription ($) | Freemium |
| **Records** | 30B+ | 5.7B+ images | 19.9B+ | Billions (UK/IE focus) | Relies on MyHeritage |
| **Tree Model** | Individual | Collaborative (One World) | Individual | Individual | Collaborative (One World) |
| **Person Fields** | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| **Tree Views** | 5+ types | 5+ types | 12+ types | 2–3 types | 2–3 types |
| **Fan Chart** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Pedigree Chart** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Descendant View** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Timeline** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Map/Geography** | ✅ | ✅ | ✅ | ✅ (historical maps) | ❌ |
| **Photo Tools** | Basic upload | Upload + memories | AI enhance/colorize/animate | Basic upload | Basic upload |
| **DNA Integration** | AncestryDNA | ❌ (no native DNA) | MyHeritage DNA | Living DNA partner | Import from other services |
| **Mobile Apps** | ✅ Native | ✅ Native | ✅ Native | Responsive web | Responsive web |
| **Auto-Hints** | ✅ (Leaves) | ✅ | ✅ (Smart Matches) | ✅ (Hints) | ✅ (Tree Matches) |
| **Collaboration** | Multi-editor trees | Global collaborative | Via Smart Matches | Via hints | Global collaborative |
| **Narrative Bio** | ✅ Auto-generated | ✅ Brief Life History | ✅ AI-generated | ❌ | ✅ About section |
| **Printable Charts** | Limited | ✅ | ✅ (8 types) | Limited | ❌ |
| **GEDCOM Import** | ✅ | ✅ | ✅ | ✅ | ✅ (limited) |
| **Accessibility** | Good | Best (published policy) | Good | Fair | Fair |
| **Newspaper Archive** | Via Newspapers.com | ❌ | ❌ | ✅ (Largest UK/IE) | ❌ |
| **Relationship Calc** | Via DNA matches | ❌ | ❌ | ❌ | ✅ |

---

## 7. Key Takeaways

### What Every Successful Genealogy Platform Does Well

1. **Person-centric navigation:** The person profile is the hub. Everything radiates from a person: their facts, relationships, sources, media, and timeline.
2. **Progressive disclosure:** Start with essential info (name, dates, photo), then drill down to detailed facts, sources, and media.
3. **Visual tree navigation:** Users expect to see and interact with a visual tree, not just lists. The ability to click through the tree person-by-person is fundamental.
4. **Timeline views:** Chronological life event displays are universally valued for understanding a person's story.
5. **Card-based UI:** Every platform uses card-based person nodes in tree views—photo thumbnail, name, and birth/death year range.
6. **Warm, heritage-inspired aesthetics:** Earth tones, sepia imagery, serif fonts for headings, and generous whitespace create an emotional, dignified tone.
7. **Mobile-first consideration:** All leading platforms offer responsive or native mobile experiences.

### Differentiators Worth Emulating

1. **MyHeritage's visualization variety:** 12+ chart/view types gives users flexibility for different use cases.
2. **FamilySearch's fan chart:** Beautiful, colorful, and immediately engaging—great for presentations.
3. **Ancestry's hint system (leaves):** Gamification drives engagement and makes the tree feel alive.
4. **Geni's relationship calculator:** Showing the exact path between two people is delightful and informative.
5. **MyHeritage's AI photo tools:** Colorization, animation, and enhancement make old photos come alive.
6. **FamilySearch's collaborative model:** A single shared tree eliminates duplication and fosters community.
7. **FindMyPast's historical maps:** Geographic visualization with historical map layers adds context.
8. **Timeline + map combination:** FamilySearch and MyHeritage both combine chronological and geographic views effectively.

### Common Metadata Fields Across All Platforms

The union of all person metadata fields found across all five platforms:

- Name (full, alternate, maiden, nickname, alias, prefix, suffix)
- Sex/Gender
- Birth (date, location)
- Christening/Baptism (date, location)
- Death (date, location, cause)
- Burial (date, location, cemetery, plot)
- Marriage(s) (date, location, spouse)
- Divorce (date, location)
- Occupation(s) (title, employer, dates)
- Military service (branch, rank, dates, conflict, unit)
- Education (institution, degree, dates)
- Religion (denomination, congregation)
- Residences (address, dates)
- Immigration/Emigration (date, port, ship, destination)
- Naturalization (date, court, location)
- Physical description (height, weight, hair, eyes)
- Photos and media
- Sources and citations
- Notes and research comments
- Timeline of life events
- Narrative biography
- Relationships (with type: biological, adopted, step, foster)
- DNA results (ethnicity, haplogroups, matches)
- Discussion/collaboration threads
