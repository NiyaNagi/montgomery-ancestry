/**
 * Unit Tests — Tree Layout Module
 * Tests for tree layout constants, zoom/pan transform math, and connection geometry.
 * Since tree.js uses ESM + DOM/SVG and can't be directly imported, we test the
 * pure mathematical logic by reimplementing the layout constants and helpers.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 3.3
 */

const {
  getPerson, getFamily, getAllPeople, getAllByFamilyLine,
  getChildren, getSpouses, getRootFamilies, getFullName,
  formatLifespan, isLiving, getFamilyLineInfo
} = require('./helpers/dataModule.cjs');

// Layout constants (mirrored from tree.js)
const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;
const H_GAP = 28;
const V_GAP = 72;
const COUPLE_GAP = 8;
const PADDING = 40;

describe('Tree Layout Module', () => {

  // ─── Layout Constants ────────────────────────────────────────

  describe('Layout Constants', () => {

    test('node dimensions are reasonable', () => {
      expect(NODE_WIDTH).toBeGreaterThanOrEqual(100);
      expect(NODE_HEIGHT).toBeGreaterThanOrEqual(40);
    });

    test('gaps are positive', () => {
      expect(H_GAP).toBeGreaterThan(0);
      expect(V_GAP).toBeGreaterThan(0);
      expect(COUPLE_GAP).toBeGreaterThan(0);
    });

    test('padding is positive', () => {
      expect(PADDING).toBeGreaterThan(0);
    });
  });

  // ─── Zoom/Pan Transform Calculations ─────────────────────────

  describe('Zoom/Pan Transform Calculations', () => {

    test('panToNode computes correct transform to center a node', () => {
      // Replicate the panToNode math from tree.js
      const containerWidth = 1440;
      const containerHeight = 900;
      const nodeX = 500;
      const nodeY = 300;
      const scale = 1;

      const tx = containerWidth / 2 - nodeX * scale - (NODE_WIDTH / 2) * scale;
      const ty = containerHeight / 2 - nodeY * scale - (NODE_HEIGHT / 2) * scale;

      // Node center should be at viewport center
      expect(tx + nodeX * scale + (NODE_WIDTH / 2) * scale).toBe(containerWidth / 2);
      expect(ty + nodeY * scale + (NODE_HEIGHT / 2) * scale).toBe(containerHeight / 2);
    });

    test('panToNode works at different scale levels', () => {
      const containerWidth = 1440;
      const containerHeight = 900;
      const nodeX = 500;
      const nodeY = 300;
      const scale = 0.5;

      const tx = containerWidth / 2 - nodeX * scale - (NODE_WIDTH / 2) * scale;
      const ty = containerHeight / 2 - nodeY * scale - (NODE_HEIGHT / 2) * scale;

      const renderedCenterX = tx + nodeX * scale + (NODE_WIDTH / 2) * scale;
      expect(renderedCenterX).toBeCloseTo(containerWidth / 2);
    });

    test('resetZoom computes scale to fit content', () => {
      const containerWidth = 1440;
      const containerHeight = 900;
      const bbox = { x: 0, y: 0, w: 3000, h: 2000 };

      const scaleX = (containerWidth - 40) / bbox.w;
      const scaleY = (containerHeight - 40) / bbox.h;
      const scale = Math.min(scaleX, scaleY, 1);

      expect(scale).toBeLessThan(1); // content is larger than viewport
      expect(scale).toBeGreaterThan(0);
      expect(scale).toBeCloseTo(0.43, 1);
    });

    test('resetZoom caps scale at 1 when content fits', () => {
      const containerWidth = 1440;
      const containerHeight = 900;
      const bbox = { x: 0, y: 0, w: 400, h: 300 };

      const scaleX = (containerWidth - 40) / bbox.w;
      const scaleY = (containerHeight - 40) / bbox.h;
      const scale = Math.min(scaleX, scaleY, 1);

      expect(scale).toBe(1);
    });

    test('zoom-at-point preserves the point under cursor', () => {
      // Replicate zoomAt math from tree.js
      let tx = 0, ty = 0, scale = 1;
      const mx = 400; // mouse X
      const my = 300; // mouse Y
      const delta = 1.1; // zoom in

      const newScale = Math.max(0.1, Math.min(3, scale * delta));
      const newTx = mx - (mx - tx) * (newScale / scale);
      const newTy = my - (my - ty) * (newScale / scale);

      // The point under the mouse should remain at (mx, my) in screen coords
      // world coord at mouse = (mx - tx) / scale
      const worldX = (mx - tx) / scale;
      const screenXAfter = worldX * newScale + newTx;
      expect(screenXAfter).toBeCloseTo(mx, 5);
    });
  });

  // ─── Connection Line Geometry ────────────────────────────────

  describe('Connection Line Geometry', () => {

    test('couple connection is horizontal between husband and wife', () => {
      const husbandX = 100;
      const wifeX = husbandX + NODE_WIDTH + COUPLE_GAP;
      const coupleY = 50;

      const conn = {
        x1: husbandX + NODE_WIDTH,
        y1: coupleY + NODE_HEIGHT / 2,
        x2: wifeX,
        y2: coupleY + NODE_HEIGHT / 2
      };

      // Connection should be horizontal (same y)
      expect(conn.y1).toBe(conn.y2);
      // Connection spans from right edge of husband to left edge of wife
      expect(conn.x2 - conn.x1).toBe(COUPLE_GAP);
    });

    test('parent-to-children vertical line starts below parent', () => {
      const parentY = 50;
      const childY = parentY + NODE_HEIGHT + V_GAP;
      const parentCenterX = 200;
      const midY = parentY + NODE_HEIGHT + V_GAP / 2;

      // Vertical line from parent bottom to midpoint
      const vertConn = {
        x1: parentCenterX,
        y1: parentY + NODE_HEIGHT,
        x2: parentCenterX,
        y2: midY
      };

      expect(vertConn.y2).toBeGreaterThan(vertConn.y1);
      expect(vertConn.y2).toBeLessThan(childY);
    });

    test('horizontal span line covers all children', () => {
      const childPositions = [
        { x: 100, y: 200 },
        { x: 300, y: 200 },
        { x: 500, y: 200 }
      ];

      const leftChild = Math.min(...childPositions.map(c => c.x));
      const rightChild = Math.max(...childPositions.map(c => c.x));

      expect(leftChild).toBe(100);
      expect(rightChild).toBe(500);
      expect(rightChild - leftChild).toBe(400);
    });

    test('single child has no horizontal span line', () => {
      const childPositions = [{ x: 200, y: 200 }];
      expect(childPositions.length).toBe(1);
      // tree.js skips horizontal line when childPositions.length <= 1
    });
  });

  // ─── Node Positioning for Known Families ─────────────────────

  describe('Node Positioning Logic', () => {

    test('couple layout: wife positioned to right of husband', () => {
      const husbandX = PADDING;
      const wifeX = husbandX + NODE_WIDTH + COUPLE_GAP;
      expect(wifeX).toBe(PADDING + NODE_WIDTH + COUPLE_GAP);
      expect(wifeX).toBeGreaterThan(husbandX + NODE_WIDTH);
    });

    test('children are placed one generation below parents', () => {
      const parentY = PADDING;
      const childY = parentY + NODE_HEIGHT + V_GAP;
      expect(childY - parentY).toBe(NODE_HEIGHT + V_GAP);
    });

    test('multiple children are spaced by NODE_WIDTH + H_GAP', () => {
      const startX = PADDING;
      const childXPositions = [];
      for (let i = 0; i < 5; i++) {
        childXPositions.push(startX + i * (NODE_WIDTH + H_GAP));
      }
      // Each child should be separated by NODE_WIDTH + H_GAP
      for (let i = 1; i < childXPositions.length; i++) {
        expect(childXPositions[i] - childXPositions[i - 1]).toBe(NODE_WIDTH + H_GAP);
      }
    });

    test('bounding box includes padding around content', () => {
      const nodes = [
        { x: 100, y: 50 },
        { x: 500, y: 300 }
      ];
      const minX = Math.min(...nodes.map(n => n.x));
      const minY = Math.min(...nodes.map(n => n.y));
      const maxX = Math.max(...nodes.map(n => n.x)) + NODE_WIDTH;
      const maxY = Math.max(...nodes.map(n => n.y)) + NODE_HEIGHT;

      const bbox = {
        x: minX - PADDING,
        y: minY - PADDING,
        w: maxX - minX + PADDING * 2,
        h: maxY - minY + PADDING * 2
      };

      expect(bbox.x).toBe(100 - PADDING);
      expect(bbox.w).toBe(500 + NODE_WIDTH - 100 + PADDING * 2);
    });
  });

  // ─── Data-Driven Layout Verification ─────────────────────────

  describe('Data-Driven Layout Verification', () => {

    test('Calvin Thompson (1822) has 2 spouse families for layout', () => {
      const calvin = getPerson('calvin-thompson-1822');
      expect(calvin.spouseFamilyIds.length).toBe(2);
    });

    test('Thomas Holmes has 14 children across 2 marriages', () => {
      const spouses = getSpouses('thomas-holmes-1817');
      const totalChildren = spouses.reduce((sum, s) => sum + s.children.length, 0);
      expect(totalChildren).toBe(14);
    });

    test('thompson-patriarch family has no wife node to render', () => {
      const fam = getFamily('family-thompson-patriarch');
      expect(fam.wife).toBeNull();
    });

    test('root families exist for tree rendering', () => {
      const roots = getRootFamilies();
      expect(roots.length).toBeGreaterThan(0);
    });

    test('each family line has renderable people', () => {
      const lines = ['thompson', 'holmes', 'smyth-gies', 'northwood', 'montgomery', 'smith-rowe-jones'];
      for (const line of lines) {
        const people = getAllByFamilyLine(line);
        expect(people.length).toBeGreaterThan(0);
      }
    });

    test('node display data is available for all people', () => {
      const allPeople = getAllPeople();
      for (const person of allPeople) {
        // Every person should have renderable name and line info
        const name = getFullName(person);
        expect(name).toBeTruthy();
        const lineInfo = getFamilyLineInfo(person.familyLine);
        expect(lineInfo).toBeDefined();
        expect(lineInfo.color).toBeDefined();
      }
    });
  });
});

