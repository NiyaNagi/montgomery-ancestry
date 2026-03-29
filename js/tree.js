/**
 * SVG-based family tree visualization for Montgomery Ancestry Browser.
 * Renders a vertical descendant chart with zoom/pan/click interactions.
 */

import {
  getPerson, getFamily, getAllFamilies, getAllPeople, getFullName,
  getShortName, formatLifespan, getFamilyLineInfo, isLiving,
  getRootFamilies, extractYear
} from './data.js';

// Layout constants
const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;
const H_GAP = 28;
const V_GAP = 44;
const COUPLE_GAP = 8;
const PADDING = 40;

// State
let svgEl = null;
let gRoot = null;
let containerEl = null;
let transform = { x: 0, y: 0, scale: 1 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let nodePositions = new Map();
let onSelectCallback = null;
let selectedPersonId = null;
let activeFamilyLine = null;
let layoutCache = null;

// Pinch state
let lastPinchDist = 0;

/** Initialize the tree module. */
export function initTree(container, onSelect) {
  containerEl = container;
  onSelectCallback = onSelect;

  if (!containerEl) return;

  svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.setAttribute('class', 'tree-svg');
  svgEl.setAttribute('role', 'img');
  svgEl.setAttribute('aria-label', 'Family tree visualization');
  svgEl.style.overflow = 'visible';

  gRoot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gRoot.setAttribute('class', 'tree-root');
  svgEl.appendChild(gRoot);

  containerEl.appendChild(svgEl);

  bindInteractions();
}

/** Render the full family tree. */
export function renderTree(familyLine) {
  if (!gRoot) return;

  activeFamilyLine = familyLine;
  gRoot.innerHTML = '';
  nodePositions.clear();

  // Build layout
  const layout = computeLayout(familyLine);
  layoutCache = layout;

  if (!layout || layout.nodes.length === 0) {
    renderEmptyState();
    return;
  }

  // Draw connections first (behind nodes)
  const connGroup = createSVGElement('g', { class: 'connections' });
  for (const conn of layout.connections) {
    drawConnection(connGroup, conn);
  }
  gRoot.appendChild(connGroup);

  // Draw spouse connections
  const coupleGroup = createSVGElement('g', { class: 'couple-connections' });
  for (const couple of layout.couples) {
    drawCoupleConnection(coupleGroup, couple);
  }
  gRoot.appendChild(coupleGroup);

  // Draw nodes
  const nodeGroup = createSVGElement('g', { class: 'nodes' });
  for (const node of layout.nodes) {
    drawNode(nodeGroup, node);
    nodePositions.set(node.personId, { x: node.x, y: node.y });
  }
  gRoot.appendChild(nodeGroup);

  // Remove viewBox — we handle positioning via CSS transform on gRoot
  svgEl.removeAttribute('viewBox');

  // Center on Montgomery line or first visible person
  centerOnFocalPoint(familyLine);
}

/** Select and highlight a person node. */
export function selectPerson(personId) {
  selectedPersonId = personId;

  // Remove existing selection
  gRoot.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));

  // Add selection to new node
  const nodeEl = gRoot.querySelector(`[data-person-id="${personId}"]`);
  if (nodeEl) {
    nodeEl.classList.add('selected');
    panToNode(personId);
  }
}

/** Center the view on a specific person. */
export function panToNode(personId) {
  const pos = nodePositions.get(personId);
  if (!pos || !containerEl) return;

  const rect = containerEl.getBoundingClientRect();
  const targetScale = transform.scale || 1;

  transform.x = rect.width / 2 - pos.x * targetScale - (NODE_WIDTH / 2) * targetScale;
  transform.y = rect.height / 2 - pos.y * targetScale - (NODE_HEIGHT / 2) * targetScale;

  applyTransform(true);
}

/** Reset zoom to fit all content. */
export function resetZoom() {
  if (!containerEl || !layoutCache) return;

  const rect = containerEl.getBoundingClientRect();
  const bbox = layoutCache.bbox;

  const scaleX = (rect.width - 40) / bbox.w;
  const scaleY = (rect.height - 40) / bbox.h;
  const fitScale = Math.min(scaleX, scaleY, 1);

  // Enforce a minimum scale so nodes remain readable
  const MIN_SCALE = 0.5;
  transform.scale = Math.max(fitScale, MIN_SCALE);

  if (fitScale >= MIN_SCALE) {
    // Tree fits fully — center it
    transform.x = (rect.width - bbox.w * transform.scale) / 2 - bbox.x * transform.scale;
    transform.y = 20 - bbox.y * transform.scale;
  } else {
    // Tree is too large — show top-left of content with padding
    transform.x = 20 - bbox.x * transform.scale;
    transform.y = 20 - bbox.y * transform.scale;
  }

  applyTransform(true);
}

// === Layout Algorithm ===

function computeLayout(familyLine) {
  const allFamilies = getAllFamilies();
  const allPeople = getAllPeople();

  // Find root families for the selected family line or all
  let rootFamilies;
  if (familyLine && familyLine !== 'all') {
    rootFamilies = findRootsForLine(familyLine, allFamilies, allPeople);
  } else {
    rootFamilies = getRootFamilies();
  }

  if (rootFamilies.length === 0 && familyLine && familyLine !== 'all') {
    // Fallback: find any people in this line
    const linePeople = allPeople.filter(p => p.familyLine === familyLine);
    if (linePeople.length === 0) return { nodes: [], connections: [], couples: [], bbox: { x: 0, y: 0, w: 800, h: 600 } };

    // Find people with no parent in the filtered set
    rootFamilies = findRootsForLine(familyLine, allFamilies, allPeople);
  }

  const nodes = [];
  const connections = [];
  const couples = [];
  const placed = new Set();

  let globalX = PADDING;

  for (const rootFam of rootFamilies) {
    const result = layoutFamily(rootFam, globalX, PADDING, placed, familyLine);
    nodes.push(...result.nodes);
    connections.push(...result.connections);
    couples.push(...result.couples);
    globalX = result.maxX + H_GAP * 3;
  }

  // Handle isolated people (no family unit)
  const isolatedPeople = allPeople.filter(p => {
    if (placed.has(p.id)) return false;
    if (familyLine && familyLine !== 'all' && p.familyLine !== familyLine) return false;
    return true;
  });

  let isoY = PADDING;
  for (const person of isolatedPeople) {
    nodes.push({ personId: person.id, x: globalX, y: isoY, person });
    placed.add(person.id);
    isoY += NODE_HEIGHT + V_GAP / 2;
  }

  // Compute bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + NODE_WIDTH);
    maxY = Math.max(maxY, node.y + NODE_HEIGHT);
  }

  if (nodes.length === 0) {
    return { nodes, connections, couples, bbox: { x: 0, y: 0, w: 800, h: 600 } };
  }

  const bbox = {
    x: minX - PADDING,
    y: minY - PADDING,
    w: maxX - minX + PADDING * 2,
    h: maxY - minY + PADDING * 2
  };

  return { nodes, connections, couples, bbox };
}

function findRootsForLine(familyLine, allFamilies, allPeople) {
  // Find families where at least one member is in the family line and parents are not in our data
  const roots = [];
  const seen = new Set();

  for (const fam of allFamilies) {
    const husband = fam.husband ? getPerson(fam.husband) : null;
    const wife = fam.wife ? getPerson(fam.wife) : null;

    const isInLine = (husband && husband.familyLine === familyLine) ||
                     (wife && wife.familyLine === familyLine);

    if (!isInLine) continue;

    // Check if parents of husband/wife have families in this line
    const hHasParent = husband && husband.parentFamilyId && hasLineInFamily(husband.parentFamilyId, familyLine);
    const wHasParent = wife && wife.parentFamilyId && hasLineInFamily(wife.parentFamilyId, familyLine);

    if (!hHasParent && !wHasParent && !seen.has(fam.id)) {
      roots.push(fam);
      seen.add(fam.id);
    }
  }

  return roots;
}

function hasLineInFamily(famId, familyLine) {
  const fam = getFamily(famId);
  if (!fam) return false;
  const h = fam.husband ? getPerson(fam.husband) : null;
  const w = fam.wife ? getPerson(fam.wife) : null;
  return (h && h.familyLine === familyLine) || (w && w.familyLine === familyLine);
}

function layoutFamily(family, startX, startY, placed, filterLine) {
  const nodes = [];
  const connections = [];
  const couples = [];

  const husband = family.husband ? getPerson(family.husband) : null;
  const wife = family.wife ? getPerson(family.wife) : null;

  // Place couple at top
  let coupleX = startX;
  const coupleY = startY;

  if (husband && !placed.has(husband.id)) {
    nodes.push({ personId: husband.id, x: coupleX, y: coupleY, person: husband });
    placed.add(husband.id);
  }

  const husbandX = coupleX;
  coupleX += NODE_WIDTH + COUPLE_GAP;

  if (wife && !placed.has(wife.id)) {
    nodes.push({ personId: wife.id, x: coupleX, y: coupleY, person: wife });
    placed.add(wife.id);
  }

  const wifeX = coupleX;

  // Couple connector
  if (husband && wife) {
    couples.push({
      x1: husbandX + NODE_WIDTH,
      y1: coupleY + NODE_HEIGHT / 2,
      x2: wifeX,
      y2: coupleY + NODE_HEIGHT / 2
    });
  }

  // Children
  const childFamilies = getChildFamilies(family, filterLine);
  let maxX = wifeX + NODE_WIDTH;
  let childrenStartX = startX;

  if (childFamilies.length > 0) {
    const parentCenterX = husbandX + (wife ? (NODE_WIDTH + COUPLE_GAP) / 2 : NODE_WIDTH / 2);
    const parentBottomY = coupleY + NODE_HEIGHT;
    const childY = coupleY + NODE_HEIGHT + V_GAP;

    // Layout each child (may have their own families)
    let childX = startX;
    const childPositions = [];

    for (const { childId, childFam } of childFamilies) {
      const child = getPerson(childId);
      if (!child) continue;

      if (childFam) {
        // This child has their own family - recurse
        const childResult = layoutFamily(childFam, childX, childY, placed, filterLine);
        nodes.push(...childResult.nodes);
        connections.push(...childResult.connections);
        couples.push(...childResult.couples);

        const childNodePos = childResult.nodes.find(n => n.personId === childId);
        if (childNodePos) {
          childPositions.push({ x: childNodePos.x + NODE_WIDTH / 2, y: childNodePos.y });
        }

        childX = childResult.maxX + H_GAP;
        maxX = Math.max(maxX, childResult.maxX);
      } else {
        // Leaf child - no family of their own
        if (!placed.has(childId)) {
          nodes.push({ personId: childId, x: childX, y: childY, person: child });
          placed.add(childId);
          childPositions.push({ x: childX + NODE_WIDTH / 2, y: childY });
          childX += NODE_WIDTH + H_GAP;
          maxX = Math.max(maxX, childX);
        }
      }
    }

    // Draw parent-to-children connections
    if (childPositions.length > 0) {
      const midY = parentBottomY + V_GAP / 2;

      // Vertical line down from parents
      connections.push({
        type: 'vertical',
        x1: parentCenterX,
        y1: parentBottomY,
        x2: parentCenterX,
        y2: midY
      });

      // Horizontal line spanning all children
      const leftChild = Math.min(...childPositions.map(c => c.x));
      const rightChild = Math.max(...childPositions.map(c => c.x));

      if (childPositions.length > 1) {
        connections.push({
          type: 'horizontal',
          x1: leftChild,
          y1: midY,
          x2: rightChild,
          y2: midY
        });
      }

      // Vertical lines down to each child
      for (const cp of childPositions) {
        connections.push({
          type: 'vertical',
          x1: cp.x,
          y1: midY,
          x2: cp.x,
          y2: cp.y
        });
      }
    }

    // Re-center parents above children
    if (childPositions.length > 0) {
      const childSpanCenter = (Math.min(...childPositions.map(c => c.x)) + Math.max(...childPositions.map(c => c.x))) / 2;
      const parentSpanWidth = wife ? (NODE_WIDTH * 2 + COUPLE_GAP) : NODE_WIDTH;
      const idealParentX = childSpanCenter - parentSpanWidth / 2;

      if (idealParentX > startX) {
        // Shift parent nodes
        const hNode = nodes.find(n => n.personId === (husband ? husband.id : null));
        const wNode = nodes.find(n => n.personId === (wife ? wife.id : null));

        if (hNode) hNode.x = idealParentX;
        if (wNode) wNode.x = idealParentX + NODE_WIDTH + COUPLE_GAP;

        // Update couple connector
        const coupleConn = couples[couples.length - 1];
        if (coupleConn && husband && wife) {
          coupleConn.x1 = idealParentX + NODE_WIDTH;
          coupleConn.x2 = idealParentX + NODE_WIDTH + COUPLE_GAP;
        }

        // Update parent-to-children vertical line
        const newParentCenter = idealParentX + (wife ? (NODE_WIDTH + COUPLE_GAP / 2) : NODE_WIDTH / 2);
        for (const conn of connections) {
          if (conn.x1 === parentCenterX && conn.y1 === parentBottomY) {
            conn.x1 = newParentCenter;
            conn.x2 = newParentCenter;
          }
        }

        maxX = Math.max(maxX, idealParentX + parentSpanWidth);
      }
    }
  }

  return { nodes, connections, couples, maxX };
}

function getChildFamilies(family, filterLine) {
  const results = [];
  for (const childId of (family.children || [])) {
    const child = getPerson(childId);
    if (!child) continue;

    // Find the first spouse family for this child
    let childFam = null;
    if (child.spouseFamilyIds && child.spouseFamilyIds.length > 0) {
      // Prefer family in the same line if filtering
      for (const fId of child.spouseFamilyIds) {
        const f = getFamily(fId);
        if (f) { childFam = f; break; }
      }
    }

    results.push({ childId, childFam });
  }
  return results;
}

// === Drawing ===

function drawNode(parent, node) {
  const person = node.person;
  if (!person) return;

  const lineInfo = getFamilyLineInfo(person.familyLine);
  const living = isLiving(person);
  const lifespan = living ? 'Living' : formatLifespan(person);

  const g = createSVGElement('g', {
    class: `tree-node ${person.gender || 'unknown'} ${selectedPersonId === person.id ? 'selected' : ''}`,
    'data-person-id': person.id,
    transform: `translate(${node.x}, ${node.y})`,
    role: 'button',
    tabindex: '0',
    'aria-label': `${getFullName(person)}, ${lifespan || 'dates unknown'}`
  });

  // Background rect
  const rect = createSVGElement('rect', {
    x: 0, y: 0,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    rx: 8,
    class: 'node-bg',
    style: `stroke: ${lineInfo.color}`
  });
  g.appendChild(rect);

  // Line indicator
  const indicator = createSVGElement('rect', {
    x: 0, y: 0,
    width: 4,
    height: NODE_HEIGHT,
    rx: '2 0 0 2',
    fill: lineInfo.color,
    class: 'node-line-indicator'
  });
  g.appendChild(indicator);

  // Avatar circle
  const initial = person.firstName && person.firstName !== 'Unknown'
    ? person.firstName[0].toUpperCase()
    : '?';

  const circle = createSVGElement('circle', {
    cx: 22, cy: NODE_HEIGHT / 2,
    r: 14,
    class: `node-avatar ${person.gender || 'unknown'}`
  });
  g.appendChild(circle);

  const initialText = createSVGElement('text', {
    x: 22, y: NODE_HEIGHT / 2 + 4,
    class: 'node-initial',
    'text-anchor': 'middle'
  });
  initialText.textContent = initial;
  g.appendChild(initialText);

  // Name
  const name = createSVGElement('text', {
    x: 42, y: 22,
    class: 'node-name'
  });
  name.textContent = truncate(getShortName(person), 22);
  g.appendChild(name);

  // Dates
  if (lifespan) {
    const dates = createSVGElement('text', {
      x: 42, y: 40,
      class: 'node-dates'
    });
    dates.textContent = lifespan;
    g.appendChild(dates);
  }

  // Click handler
  g.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onSelectCallback) onSelectCallback(person.id);
  });

  g.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onSelectCallback) onSelectCallback(person.id);
    }
  });

  parent.appendChild(g);
}

function drawConnection(parent, conn) {
  const line = createSVGElement('line', {
    x1: conn.x1, y1: conn.y1,
    x2: conn.x2, y2: conn.y2,
    class: 'tree-connection'
  });
  parent.appendChild(line);
}

function drawCoupleConnection(parent, couple) {
  const line = createSVGElement('line', {
    x1: couple.x1, y1: couple.y1,
    x2: couple.x2, y2: couple.y2,
    class: 'couple-line'
  });
  parent.appendChild(line);
}

function renderEmptyState() {
  const text = createSVGElement('text', {
    x: 400, y: 300,
    class: 'empty-text',
    'text-anchor': 'middle'
  });
  text.textContent = 'No family members to display';
  gRoot.appendChild(text);

  // Use a viewBox only for the empty state so text is visible
  svgEl.setAttribute('viewBox', '0 0 800 600');
}

// === Interactions ===

function bindInteractions() {
  if (!containerEl) return;

  // Mouse wheel zoom
  containerEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = containerEl.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    zoomAt(mx, my, delta);
  }, { passive: false });

  // Mouse drag pan
  containerEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.tree-node')) return;
    isDragging = true;
    dragStart = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    containerEl.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    transform.x = e.clientX - dragStart.x;
    transform.y = e.clientY - dragStart.y;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (containerEl) containerEl.style.cursor = '';
  });

  // Touch pinch zoom and drag
  let touches = [];
  containerEl.addEventListener('touchstart', (e) => {
    touches = Array.from(e.touches);
    if (touches.length === 1) {
      isDragging = true;
      dragStart = { x: touches[0].clientX - transform.x, y: touches[0].clientY - transform.y };
    } else if (touches.length === 2) {
      isDragging = false;
      lastPinchDist = pinchDist(touches);
    }
  }, { passive: true });

  containerEl.addEventListener('touchmove', (e) => {
    const newTouches = Array.from(e.touches);
    if (newTouches.length === 1 && isDragging) {
      e.preventDefault();
      transform.x = newTouches[0].clientX - dragStart.x;
      transform.y = newTouches[0].clientY - dragStart.y;
      applyTransform();
    } else if (newTouches.length === 2) {
      e.preventDefault();
      const dist = pinchDist(newTouches);
      const delta = dist / lastPinchDist;
      lastPinchDist = dist;

      const cx = (newTouches[0].clientX + newTouches[1].clientX) / 2;
      const cy = (newTouches[0].clientY + newTouches[1].clientY) / 2;
      const rect = containerEl.getBoundingClientRect();
      zoomAt(cx - rect.left, cy - rect.top, delta);
    }
  }, { passive: false });

  containerEl.addEventListener('touchend', () => {
    isDragging = false;
  });
}

function pinchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function zoomAt(mx, my, delta) {
  const newScale = Math.max(0.1, Math.min(3, transform.scale * delta));
  const ratio = newScale / transform.scale;

  transform.x = mx - ratio * (mx - transform.x);
  transform.y = my - ratio * (my - transform.y);
  transform.scale = newScale;

  applyTransform();
}

function applyTransform(animate = false) {
  if (!gRoot) return;

  if (animate) {
    gRoot.style.transition = 'transform 0.4s ease';
    setTimeout(() => { gRoot.style.transition = ''; }, 400);
  }

  gRoot.setAttribute('transform', `translate(${transform.x}, ${transform.y}) scale(${transform.scale})`);
}

function centerOnFocalPoint(familyLine) {
  if (!containerEl || !layoutCache) return;

  const rect = containerEl.getBoundingClientRect();
  const bbox = layoutCache.bbox;
  const nodes = layoutCache.nodes;

  const scaleX = (rect.width - 40) / bbox.w;
  const scaleY = (rect.height - 40) / bbox.h;
  const fitScale = Math.min(scaleX, scaleY, 1);
  const MIN_SCALE = 0.5;

  if (fitScale >= MIN_SCALE) {
    // Tree fits — use resetZoom to center it fully
    resetZoom();
    return;
  }

  // Tree is too large to fit — find the topmost node (root ancestor)
  // and center the view on it so the root of the tree is visible
  transform.scale = MIN_SCALE;

  let topNode = null;
  let minY = Infinity;
  for (const node of nodes) {
    if (node.y < minY) {
      minY = node.y;
      topNode = node;
    }
  }

  if (topNode) {
    // Center horizontally on the root node, show from top
    const nodeCenter = topNode.x + NODE_WIDTH / 2;
    transform.x = rect.width / 2 - nodeCenter * transform.scale;
    transform.y = 20 - bbox.y * transform.scale;
  } else {
    transform.x = 20 - bbox.x * transform.scale;
    transform.y = 20 - bbox.y * transform.scale;
  }

  applyTransform(true);
}

// === SVG Helpers ===

function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}
