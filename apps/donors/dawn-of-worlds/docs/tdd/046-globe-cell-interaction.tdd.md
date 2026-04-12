# TDD: Globe Cell Interaction & Visualization

**Epic**: 045 Phase 4+ Enhancements  
**Spec**: [046-globe-cell-interaction.md](../specs/046-globe-cell-interaction.md)

## Test Strategy

This document outlines the test-driven development approach for implementing globe cell interaction features. Tests should be written **before** implementation.

## Unit Tests

### `CellMesher.test.ts`

#### Biome Color Coding

```typescript
describe('CellMesher - Color Modes', () => {
  test('should apply standard biome colors by default', () => {
    const cells = generateMockCells();
    const mesh = CellMesher.createSolidMesh(cells, 1.0);
    
    // Verify colors match BiomeType color palette
    expect(getColorForCell(mesh, 0)).toEqual(BIOME_COLORS.OCEAN);
  });

  test('should apply elevation-based shading', () => {
    const cells = generateMockCells();
    cells[0].biomeData = { height: 0.9, temperature: 0.5, moisture: 0.5 };
    
    const mesh = CellMesher.createSolidMesh(cells, 1.0, { mode: 'elevation' });
    
    // High elevation should be lighter
    expect(getColorBrightness(mesh, 0)).toBeGreaterThan(0.8);
  });

  test('should apply temperature overlay', () => {
    const cells = generateMockCells();
    cells[0].biomeData = { height: 0.5, temperature: 0.9, moisture: 0.5 };
    
    const mesh = CellMesher.createSolidMesh(cells, 1.0, { mode: 'temperature' });
    
    // Hot cells should be red-ish
    const color = getColorForCell(mesh, 0);
    expect(color.r).toBeGreaterThan(color.b);
  });

  test('should update cell color dynamically', () => {
    const mesh = CellMesher.createSolidMesh(generateMockCells(), 1.0);
    const newColor = [1.0, 0.0, 0.0]; // Red
    
    CellMesher.updateCellColor(mesh, 'cell-0', newColor);
    
    expect(getColorForCell(mesh, 0)).toEqual(newColor);
  });
});
```

### `ThreeGlobeRenderer.test.ts`

#### Cell Selection

```typescript
describe('ThreeGlobeRenderer - Selection', () => {
  let renderer: ThreeGlobeRenderer;
  let mockContainer: HTMLElement;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    renderer = new ThreeGlobeRenderer({
      container: mockContainer,
      radius: 1.0,
      subdivisions: 2
    });
  });

  test('should select cell by ID', () => {
    const cellId = 'cell-42';
    const onSelect = jest.fn();
    renderer.on('cellSelected', onSelect);
    
    renderer.selectCell(cellId);
    
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: cellId }));
    expect(renderer.getSelectedCell()).toBe(cellId);
  });

  test('should deselect current cell', () => {
    renderer.selectCell('cell-42');
    const onDeselect = jest.fn();
    renderer.on('cellDeselected', onDeselect);
    
    renderer.deselectCell();
    
    expect(onDeselect).toHaveBeenCalled();
    expect(renderer.getSelectedCell()).toBeNull();
  });

  test('should highlight selected cell visually', () => {
    const cellId = 'cell-42';
    
    renderer.selectCell(cellId);
    
    // Verify visual indicator (e.g., outline mesh created)
    expect(renderer.hasSelectionIndicator(cellId)).toBe(true);
  });

  test('should handle clicking on cell', () => {
    const cells = generateMockHexGrid();
    renderer.createHexOverlay(cells);
    
    const onSelect = jest.fn();
    renderer.on('cellSelected', onSelect);
    
    // Simulate click at cell position
    const clickEvent = new MouseEvent('click', { clientX: 100, clientY: 100 });
    mockContainer.dispatchEvent(clickEvent);
    
    expect(onSelect).toHaveBeenCalled();
  });

  test('should deselect when clicking empty space', () => {
    renderer.selectCell('cell-42');
    const onDeselect = jest.fn();
    renderer.on('cellDeselected', onDeselect);
    
    // Click on empty space (no intersection)
    const clickEvent = new MouseEvent('click', { clientX: 0, clientY: 0 });
    mockContainer.dispatchEvent(clickEvent);
    
    expect(onDeselect).toHaveBeenCalled();
  });
});
```

### `hexGrid.test.ts`

#### Cell Data Access

```typescript
describe('HexGrid - Cell Queries', () => {
  test('should get cell by ID', () => {
    const cells = generateHexGrid({ gridWidth: 36, gridHeight: 18, radius: 1.0 });
    const cellId = 'cell-10-5';
    
    const cell = getCellById(cells, cellId);
    
    expect(cell).toBeDefined();
    expect(cell.id).toBe(cellId);
  });

  test('should get cell neighbors', () => {
    const cells = generateHexGrid({ gridWidth: 36, gridHeight: 18, radius: 1.0 });
    const cell = getCellById(cells, 'cell-10-5');
    
    const neighbors = getCellNeighbors(cells, cell.id);
    
    // Mid-latitude cells should have exactly 6 neighbors
    expect(neighbors.length).toBe(6);
  });

  test('should calculate cell lat/lon coordinates', () => {
    const cell: HexCell = {
      id: 'cell-0-0',
      gridPos: { col: 0, row: 0 },
      center: { x: 0, y: 1, z: 0 },
      // ... other properties
    };
    
    const coords = cellToLatLon(cell);
    
    expect(coords.lat).toBeCloseTo(90, 1); // North pole
    expect(coords.lon).toBeDefined();
  });
});
```

### `cylindricalHexGrid.test.ts`

#### Cylindrical Projection Grid Generation

```typescript
describe('CylindricalHexGrid - Generation', () => {
  test('should generate correct number of cells', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    expect(cells.length).toBe(36 * 18); // 648 cells
  });

  test('should have correct cell IDs', () => {
    const config = { gridWidth: 10, gridHeight: 5, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    expect(cells[0].id).toBe('cell-0-0');
    expect(cells[cells.length - 1].id).toBe('cell-9-4');
  });

  test('should wrap longitude at edges', () => {
    const config = { gridWidth: 10, gridHeight: 5, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    // Cell at col=0 should neighbor col=9 (wrap)
    const firstCol = cells.find(c => c.gridPos.col === 0 && c.gridPos.row === 2);
    expect(firstCol.neighbors).toContain('cell-9-2');
  });

  test('should NOT wrap latitude at poles', () => {
    const config = { gridWidth: 10, gridHeight: 5, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    // Cell at row=0 should have fewer than 6 neighbors (no wrap up)
    const topRow = cells.find(c => c.gridPos.row === 0 && c.gridPos.col === 5);
    expect(topRow.neighbors.length).toBeLessThan(6);
  });

  test('should project centers to sphere surface', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    for (const cell of cells) {
      const dist = Math.sqrt(cell.center.x**2 + cell.center.y**2 + cell.center.z**2);
      expect(dist).toBeCloseTo(config.radius, 5);
    }
  });

  test('should have adjacent cells sharing edges', () => {
    const config = { gridWidth: 10, gridHeight: 5, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const cell = getCellById(cells, 'cell-5-2');
    
    for (const neighborId of cell.neighbors) {
      const neighbor = getCellById(cells, neighborId);
      // Neighbor should also list this cell as neighbor
      expect(neighbor.neighbors).toContain(cell.id);
    }
  });
});

describe('CylindricalHexGrid - Pole Caps', () => {
  test('should generate exactly 2 pole cap cells', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const poleCaps = cells.filter(c => c.isPoleCap === true);
    expect(poleCaps.length).toBe(2);
  });

  test('should have correct pole cap IDs', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const northPole = cells.find(c => c.id === 'cell-pole-north');
    const southPole = cells.find(c => c.id === 'cell-pole-south');
    
    expect(northPole).toBeDefined();
    expect(southPole).toBeDefined();
    expect(northPole.isPoleCap).toBe(true);
    expect(southPole.isPoleCap).toBe(true);
  });

  test('should place north pole at y=+radius', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const northPole = cells.find(c => c.id === 'cell-pole-north');
    expect(northPole.center.y).toBeCloseTo(config.radius, 2);
    expect(northPole.center.x).toBeCloseTo(0, 5);
    expect(northPole.center.z).toBeCloseTo(0, 5);
  });

  test('should place south pole at y=-radius', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const southPole = cells.find(c => c.id === 'cell-pole-south');
    expect(southPole.center.y).toBeCloseTo(-config.radius, 2);
  });

  test('north pole should neighbor all cells in row 1', () => {
    const config = { gridWidth: 10, gridHeight: 5, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const northPole = cells.find(c => c.id === 'cell-pole-north');
    
    // Should have gridWidth neighbors (all cells in row 1)
    expect(northPole.neighbors.length).toBe(config.gridWidth);
    
    // All neighbors should be in row 1
    for (const neighborId of northPole.neighbors) {
      expect(neighborId).toMatch(/^cell-\d+-1$/);
    }
  });

  test('cells in row 1 should have pole cap as neighbor', () => {
    const config = { gridWidth: 10, gridHeight: 5, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const row1Cells = cells.filter(c => c.gridPos?.row === 1);
    
    for (const cell of row1Cells) {
      expect(cell.neighbors).toContain('cell-pole-north');
    }
  });

  test('pole caps should have gridWidth vertices', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const northPole = cells.find(c => c.id === 'cell-pole-north');
    expect(northPole.vertices.length).toBe(config.gridWidth);
  });

  test('pole caps should have normalizedArea near 0', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const northPole = cells.find(c => c.id === 'cell-pole-north');
    expect(northPole.normalizedArea).toBeLessThan(0.1);
  });
});

describe('CylindricalHexGrid - Normalized Area', () => {
  test('equator cells should have normalizedArea ~1.0', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    // Row 9 is the equator (middle row)
    const equatorCell = cells.find(c => c.gridPos?.row === 9);
    expect(equatorCell.normalizedArea).toBeCloseTo(1.0, 1);
  });

  test('polar cells should have smaller normalizedArea', () => {
    const config = { gridWidth: 36, gridHeight: 18, radius: 1.0 };
    const cells = generateHexGrid(config);
    
    const equatorCell = cells.find(c => c.gridPos?.row === 9);
    const polarCell = cells.find(c => c.gridPos?.row === 2);
    
    expect(polarCell.normalizedArea).toBeLessThan(equatorCell.normalizedArea);
  });
});
```

## Integration Tests

### `GlobeInteraction.integration.test.tsx`

```typescript
describe('Globe Interaction - Integration', () => {
  test('should display cell info when cell is selected', async () => {
    const { container } = render(<GlobeTestPage />);
    
    // Wait for globe to load
    await waitFor(() => expect(screen.getByText(/Globe Renderer/)).toBeInTheDocument());
    
    // Click on globe (simulate cell selection)
    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });
    
    // Verify info panel appears
    await waitFor(() => {
      expect(screen.getByText(/Cell Information/)).toBeInTheDocument();
      expect(screen.getByText(/Biome:/)).toBeInTheDocument();
    });
  });

  test('should update display mode', async () => {
    const { container } = render(<GlobeTestPage />);
    
    // Change display mode to "Elevation"
    const dropdown = screen.getByLabelText(/Display Mode/);
    fireEvent.change(dropdown, { target: { value: 'elevation' } });
    
    // Verify globe updates (check canvas or state)
    await waitFor(() => {
      // Could verify via screenshot comparison or state inspection
      expect(container.querySelector('[data-display-mode="elevation"]')).toBeInTheDocument();
    });
  });
});
```

## Browser Tests

### Manual Test Cases

#### TC-001: Hover Highlighting
1. Navigate to `/globe-test`
2. Move mouse over globe
3. **Expected**: Cell under cursor highlights with subtle glow
4. Move mouse away
5. **Expected**: Highlight fades out smoothly

#### TC-002: Cell Selection
1. Navigate to `/globe-test`
2. Click on a cell
3. **Expected**: 
   - Cell shows selection indicator (border/glow)
   - Info panel appears with cell data
4. Click another cell
5. **Expected**: 
   - Previous cell deselects
   - New cell selects
   - Info panel updates

#### TC-003: Display Mode Toggle
1. Navigate to `/globe-test`
2. Select "Elevation" from display mode dropdown
3. **Expected**: Globe colors shift to elevation gradient (dark→light)
4. Select "Temperature"
5. **Expected**: Globe colors shift to temperature gradient (blue→red)
6. Select "Biomes"
7. **Expected**: Globe returns to standard biome colors

#### TC-004: Keyboard Navigation
1. Navigate to `/globe-test`
2. Press Tab key
3. **Expected**: First cell receives focus indicator
4. Press Tab again
5. **Expected**: Focus moves to next cell
6. Press Enter
7. **Expected**: Focused cell becomes selected

## Performance Tests

### `performance.test.ts`

```typescript
describe('Performance - Cell Interaction', () => {
  test('should maintain 60fps during hover', async () => {
    const renderer = setupRenderer();
    const fpsMonitor = new FPSMonitor();
    
    // Simulate rapid mouse movement
    for (let i = 0; i < 100; i++) {
      simulateMouseMove(i * 5, i * 5);
      await nextFrame();
    }
    
    expect(fpsMonitor.getAverageFPS()).toBeGreaterThanOrEqual(58);
  });

  test('should update cell colors in <16ms', () => {
    const mesh = CellMesher.createSolidMesh(generateMockCells(1000), 1.0);
    
    const start = performance.now();
    CellMesher.updateCellColor(mesh, 'cell-500', [1, 0, 0]);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(16); // One frame at 60fps
  });
});
```

## Acceptance Criteria

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All manual test cases verified
- [ ] Performance benchmarks met (60fps, <16ms updates)
- [ ] Code coverage > 80% for new features
- [ ] No console errors or warnings
- [ ] Accessibility audit passes (keyboard navigation, ARIA labels)

## Test Execution Order

1. **Unit Tests First**: Write and pass unit tests for each component
2. **Integration Tests**: Verify components work together
3. **Browser Tests**: Manual verification of UX
4. **Performance Tests**: Ensure no regressions

## Tools

- **Unit Testing**: Vitest
- **Component Testing**: React Testing Library
- **Browser Testing**: Playwright or manual
- **Performance**: Chrome DevTools Performance Monitor
