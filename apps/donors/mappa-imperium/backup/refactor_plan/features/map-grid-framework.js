// ===== CORE MAP GRID FRAMEWORK =====

class MapGrid {
  constructor(width = 24, height = 16, playerCount = 4) {
    this.width = width;
    this.height = height;
    this.playerCount = playerCount;
    
    // Initialize empty grid
    this.grid = Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => ({
        terrain: 'water',
        owner: null,
        territory: null,
        features: []
      }))
    );
    
    // Player territories
    this.territories = this.calculateTerritories();
    this.landmasses = new Map(); // Track all landmasses
    this.validation = new LandmassValidator(this);
  }
  
  // ===== TERRITORY MANAGEMENT =====
  
  calculateTerritories() {
    const territories = new Map();
    
    switch (this.playerCount) {
      case 2:
        territories.set(1, { name: 'North', bounds: this.createBounds(0, 0, this.width, this.height / 2) });
        territories.set(2, { name: 'South', bounds: this.createBounds(0, this.height / 2, this.width, this.height / 2) });
        break;
        
      case 3:
        territories.set(1, { name: 'North', bounds: this.createBounds(0, 0, this.width, this.height / 3) });
        territories.set(2, { name: 'Central', bounds: this.createBounds(0, this.height / 3, this.width, this.height / 3) });
        territories.set(3, { name: 'South', bounds: this.createBounds(0, 2 * this.height / 3, this.width, this.height / 3) });
        break;
        
      case 4:
        territories.set(1, { name: 'Northwest', bounds: this.createBounds(0, 0, this.width / 2, this.height / 2) });
        territories.set(2, { name: 'Northeast', bounds: this.createBounds(this.width / 2, 0, this.width / 2, this.height / 2) });
        territories.set(3, { name: 'Southwest', bounds: this.createBounds(0, this.height / 2, this.width / 2, this.height / 2) });
        territories.set(4, { name: 'Southeast', bounds: this.createBounds(this.width / 2, this.height / 2, this.width / 2, this.height / 2) });
        break;
        
      case 6:
        // 2x3 grid
        for (let i = 0; i < 6; i++) {
          const row = Math.floor(i / 2);
          const col = i % 2;
          territories.set(i + 1, {
            name: `Territory ${i + 1}`,
            bounds: this.createBounds(
              col * (this.width / 2),
              row * (this.height / 3),
              this.width / 2,
              this.height / 3
            )
          });
        }
        break;
        
      case 8:
        // 2x4 grid
        for (let i = 0; i < 8; i++) {
          const row = Math.floor(i / 2);
          const col = i % 2;
          territories.set(i + 1, {
            name: `Territory ${i + 1}`,
            bounds: this.createBounds(
              col * (this.width / 2),
              row * (this.height / 4),
              this.width / 2,
              this.height / 4
            )
          });
        }
        break;
    }
    
    return territories;
  }
  
  createBounds(x, y, width, height) {
    return {
      minX: Math.floor(x),
      minY: Math.floor(y),
      maxX: Math.floor(x + width),
      maxY: Math.floor(y + height)
    };
  }
  
  // ===== LANDMASS PLACEMENT =====
  
  placeLandmass(playerId, landmassType, diceRoll) {
    const territory = this.territories.get(playerId);
    if (!territory) throw new Error(`Invalid player ID: ${playerId}`);
    
    const landmassConfig = this.getLandmassConfig(landmassType, diceRoll);
    const placementResult = this.findOptimalPlacement(territory, landmassConfig);
    
    if (!placementResult.success) {
      return {
        success: false,
        error: placementResult.error,
        suggestions: this.getSuggestions(territory, landmassConfig)
      };
    }
    
    // Create the landmass
    const landmass = this.createLandmass(
      playerId, 
      landmassConfig, 
      placementResult.positions
    );
    
    // Validate contiguity
    if (!this.validation.isContiguous(placementResult.positions)) {
      return {
        success: false,
        error: 'Landmass must be contiguous (all squares connected)',
        positions: placementResult.positions
      };
    }
    
    // Place on grid
    this.applyLandmassToGrid(landmass);
    this.landmasses.set(landmass.id, landmass);
    
    return {
      success: true,
      landmass: landmass,
      positions: placementResult.positions
    };
  }
  
  getLandmassConfig(type, diceRoll) {
    const configs = {
      'single-island': {
        1: { squares: 2, shape: 'compact' },
        2: { squares: 3, shape: 'compact' },
        3: { squares: 4, shape: 'compact' },
        4: { squares: 5, shape: 'linear' },
        5: { squares: 6, shape: 'linear' },
        6: { squares: 8, shape: 'scattered' }
      },
      'archipelago': {
        1: { islands: 2, squares: [2, 2], minDistance: 2 },
        2: { islands: 2, squares: [3, 2], minDistance: 1 },
        3: { islands: 3, squares: [2, 2, 2], minDistance: 1 },
        4: { islands: 3, squares: [3, 2, 2], minDistance: 1 },
        5: { islands: 4, squares: [2, 2, 2, 2], minDistance: 1 },
        6: { islands: 4, squares: [3, 2, 2, 2], minDistance: 1 }
      },
      'continent': {
        1: { squares: 8, shape: 'blob', density: 0.7 },
        2: { squares: 10, shape: 'blob', density: 0.7 },
        3: { squares: 12, shape: 'elongated', density: 0.8 },
        4: { squares: 14, shape: 'elongated', density: 0.8 },
        5: { squares: 16, shape: 'complex', density: 0.9 },
        6: { squares: 18, shape: 'complex', density: 0.9 }
      }
    };
    
    return configs[type][diceRoll];
  }
  
  findOptimalPlacement(territory, config) {
    const { bounds } = territory;
    const attempts = [];
    
    // Try different placement strategies
    const strategies = [
      () => this.tryCompactPlacement(bounds, config),
      () => this.tryLinearPlacement(bounds, config),
      () => this.tryScatteredPlacement(bounds, config),
      () => this.tryBorderPlacement(bounds, config)
    ];
    
    for (const strategy of strategies) {
      const result = strategy();
      if (result.success) return result;
      attempts.push(result);
    }
    
    return {
      success: false,
      error: 'Could not find valid placement',
      attempts: attempts
    };
  }
  
  // ===== PLACEMENT STRATEGIES =====
  
  tryCompactPlacement(bounds, config) {
    const centerX = Math.floor((bounds.minX + bounds.maxX) / 2);
    const centerY = Math.floor((bounds.minY + bounds.maxY) / 2);
    
    // Start from center and expand outward
    const positions = [{ x: centerX, y: centerY }];
    
    for (let i = 1; i < config.squares; i++) {
      const candidates = this.getAdjacentCandidates(positions, bounds);
      if (candidates.length === 0) {
        return { success: false, error: 'No adjacent squares available' };
      }
      
      // Pick candidate closest to center
      const best = candidates.reduce((closest, candidate) => {
        const distToCurrent = Math.abs(candidate.x - centerX) + Math.abs(candidate.y - centerY);
        const distToClosest = Math.abs(closest.x - centerX) + Math.abs(closest.y - centerY);
        return distToCurrent < distToClosest ? candidate : closest;
      });
      
      positions.push(best);
    }
    
    return { success: true, positions };
  }
  
  tryLinearPlacement(bounds, config) {
    // Try horizontal and vertical lines
    const directions = [
      { dx: 1, dy: 0 }, // horizontal
      { dx: 0, dy: 1 }, // vertical
      { dx: 1, dy: 1 }, // diagonal
      { dx: 1, dy: -1 } // diagonal
    ];
    
    for (const dir of directions) {
      const result = this.tryDirectionalPlacement(bounds, config, dir);
      if (result.success) return result;
    }
    
    return { success: false, error: 'Could not create linear landmass' };
  }
  
  tryDirectionalPlacement(bounds, config, direction) {
    const { dx, dy } = direction;
    const maxLength = Math.min(
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY
    );
    
    if (config.squares > maxLength) {
      return { success: false, error: 'Landmass too large for territory' };
    }
    
    // Try different starting positions
    for (let startX = bounds.minX; startX < bounds.maxX; startX++) {
      for (let startY = bounds.minY; startY < bounds.maxY; startY++) {
        const positions = [];
        
        for (let i = 0; i < config.squares; i++) {
          const x = startX + (i * dx);
          const y = startY + (i * dy);
          
          if (x >= bounds.maxX || y >= bounds.maxY || x < bounds.minX || y < bounds.minY) {
            break;
          }
          
          if (this.grid[y][x].terrain !== 'water') {
            break; // Square already occupied
          }
          
          positions.push({ x, y });
        }
        
        if (positions.length === config.squares) {
          return { success: true, positions };
        }
      }
    }
    
    return { success: false, error: 'No valid directional placement found' };
  }
  
  // ===== UTILITY METHODS =====
  
  getAdjacentCandidates(existingPositions, bounds) {
    const candidates = [];
    const existing = new Set(existingPositions.map(p => `${p.x},${p.y}`));
    
    for (const pos of existingPositions) {
      const neighbors = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x, y: pos.y - 1 }
      ];
      
      for (const neighbor of neighbors) {
        if (neighbor.x >= bounds.minX && neighbor.x < bounds.maxX &&
            neighbor.y >= bounds.minY && neighbor.y < bounds.maxY &&
            !existing.has(`${neighbor.x},${neighbor.y}`) &&
            this.grid[neighbor.y][neighbor.x].terrain === 'water') {
          
          const key = `${neighbor.x},${neighbor.y}`;
          if (!candidates.some(c => `${c.x},${c.y}` === key)) {
            candidates.push(neighbor);
          }
        }
      }
    }
    
    return candidates;
  }
  
  createLandmass(playerId, config, positions) {
    return {
      id: this.generateLandmassId(),
      owner: playerId,
      type: config.type || 'island',
      positions: positions,
      size: positions.length,
      createdAt: new Date(),
      features: []
    };
  }
  
  applyLandmassToGrid(landmass) {
    for (const pos of landmass.positions) {
      this.grid[pos.y][pos.x] = {
        terrain: 'land',
        owner: landmass.owner,
        territory: landmass.owner,
        landmassId: landmass.id,
        features: []
      };
    }
  }
  
  generateLandmassId() {
    return `landmass_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ===== LANDMASS VALIDATION =====

class LandmassValidator {
  constructor(mapGrid) {
    this.map = mapGrid;
  }
  
  isContiguous(positions) {
    if (positions.length === 0) return false;
    if (positions.length === 1) return true;
    
    const visited = new Set();
    const queue = [positions[0]];
    const positionSet = new Set(positions.map(p => `${p.x},${p.y}`));
    
    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Check adjacent squares
      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (positionSet.has(neighborKey) && !visited.has(neighborKey)) {
          queue.push(neighbor);
        }
      }
    }
    
    return visited.size === positions.length;
  }
  
  validateLandmassRules(landmass, rules) {
    const errors = [];
    
    // Check minimum size
    if (rules.minSize && landmass.size < rules.minSize) {
      errors.push(`Landmass too small (${landmass.size} < ${rules.minSize})`);
    }
    
    // Check maximum size
    if (rules.maxSize && landmass.size > rules.maxSize) {
      errors.push(`Landmass too large (${landmass.size} > ${rules.maxSize})`);
    }
    
    // Check shape constraints
    if (rules.maxWidth || rules.maxHeight) {
      const bounds = this.getLandmassBounds(landmass);
      if (rules.maxWidth && bounds.width > rules.maxWidth) {
        errors.push(`Landmass too wide (${bounds.width} > ${rules.maxWidth})`);
      }
      if (rules.maxHeight && bounds.height > rules.maxHeight) {
        errors.push(`Landmass too tall (${bounds.height} > ${rules.maxHeight})`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
  
  getLandmassBounds(landmass) {
    const xs = landmass.positions.map(p => p.x);
    const ys = landmass.positions.map(p => p.y);
    
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      width: Math.max(...xs) - Math.min(...xs) + 1,
      height: Math.max(...ys) - Math.min(...ys) + 1
    };
  }
}

// ===== PANGEA CONNECTION SYSTEM =====

class PangeaConnector {
  constructor(mapGrid) {
    this.map = mapGrid;
  }
  
  canConnectLandmasses(landmass1Id, landmass2Id) {
    const lm1 = this.map.landmasses.get(landmass1Id);
    const lm2 = this.map.landmasses.get(landmass2Id);
    
    if (!lm1 || !lm2) return false;
    
    // Check if they're in adjacent territories
    const territory1 = this.map.territories.get(lm1.owner);
    const territory2 = this.map.territories.get(lm2.owner);
    
    return this.areTerritoriesAdjacent(territory1, territory2);
  }
  
  areTerritoriesAdjacent(territory1, territory2) {
    const bounds1 = territory1.bounds;
    const bounds2 = territory2.bounds;
    
    // Check if territories share a border
    const verticalAdjacent = (
      (bounds1.maxX === bounds2.minX || bounds2.maxX === bounds1.minX) &&
      !(bounds1.maxY <= bounds2.minY || bounds2.maxY <= bounds1.minY)
    );
    
    const horizontalAdjacent = (
      (bounds1.maxY === bounds2.minY || bounds2.maxY === bounds1.minY) &&
      !(bounds1.maxX <= bounds2.minX || bounds2.maxX <= bounds1.minX)
    );
    
    return verticalAdjacent || horizontalAdjacent;
  }
  
  findConnectionPath(landmass1Id, landmass2Id) {
    const lm1 = this.map.landmasses.get(landmass1Id);
    const lm2 = this.map.landmasses.get(landmass2Id);
    
    if (!this.canConnectLandmasses(landmass1Id, landmass2Id)) {
      return { success: false, error: 'Landmasses cannot be connected' };
    }
    
    // Find shortest path between landmasses
    const borderSquares1 = this.findBorderSquares(lm1);
    const borderSquares2 = this.findBorderSquares(lm2);
    
    let shortestPath = null;
    let shortestDistance = Infinity;
    
    for (const square1 of borderSquares1) {
      for (const square2 of borderSquares2) {
        const path = this.findPath(square1, square2);
        if (path && path.length < shortestDistance) {
          shortestDistance = path.length;
          shortestPath = path;
        }
      }
    }
    
    return shortestPath ? 
      { success: true, path: shortestPath } :
      { success: false, error: 'No valid connection path found' };
  }
  
  findBorderSquares(landmass) {
    const borderSquares = [];
    
    for (const pos of landmass.positions) {
      const neighbors = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x, y: pos.y - 1 }
      ];
      
      // If any neighbor is water, this is a border square
      for (const neighbor of neighbors) {
        if (neighbor.x >= 0 && neighbor.x < this.map.width &&
            neighbor.y >= 0 && neighbor.y < this.map.height &&
            this.map.grid[neighbor.y][neighbor.x].terrain === 'water') {
          borderSquares.push(pos);
          break;
        }
      }
    }
    
    return borderSquares;
  }
  
  findPath(start, end) {
    // Simple A* pathfinding for land bridge
    const openSet = [{ ...start, g: 0, h: this.heuristic(start, end), f: this.heuristic(start, end) }];
    const closedSet = new Set();
    const cameFrom = new Map();
    
    while (openSet.length > 0) {
      const current = openSet.reduce((lowest, node) => 
        node.f < lowest.f ? node : lowest
      );
      
      if (current.x === end.x && current.y === end.y) {
        return this.reconstructPath(cameFrom, current);
      }
      
      openSet.splice(openSet.indexOf(current), 1);
      closedSet.add(`${current.x},${current.y}`);
      
      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];
      
      for (const neighbor of neighbors) {
        if (neighbor.x < 0 || neighbor.x >= this.map.width ||
            neighbor.y < 0 || neighbor.y >= this.map.height ||
            closedSet.has(`${neighbor.x},${neighbor.y}`)) {
          continue;
        }
        
        const tentativeG = current.g + 1;
        const existingNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
        
        if (!existingNode) {
          const newNode = {
            ...neighbor,
            g: tentativeG,
            h: this.heuristic(neighbor, end),
            f: tentativeG + this.heuristic(neighbor, end)
          };
          openSet.push(newNode);
          cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
        } else if (tentativeG < existingNode.g) {
          existingNode.g = tentativeG;
          existingNode.f = tentativeG + existingNode.h;
          cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
        }
      }
    }
    
    return null; // No path found
  }
  
  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  
  reconstructPath(cameFrom, current) {
    const path = [current];
    let currentKey = `${current.x},${current.y}`;
    
    while (cameFrom.has(currentKey)) {
      current = cameFrom.get(currentKey);
      path.unshift(current);
      currentKey = `${current.x},${current.y}`;
    }
    
    return path;
  }
}

// ===== USAGE EXAMPLE =====

// Initialize map for 4 players
const gameMap = new MapGrid(24, 16, 4);

// Player 1 rolls dice for landmass in Era I
const player1Result = gameMap.placeLandmass(1, 'single-island', 4);

if (player1Result.success) {
  console.log('Landmass created successfully!', player1Result.landmass);
} else {
  console.log('Placement failed:', player1Result.error);
  console.log('Try these suggestions:', player1Result.suggestions);
}

// Check if two landmasses can be connected (Pangea option)
const pangeaConnector = new PangeaConnector(gameMap);
const connectionResult = pangeaConnector.findConnectionPath('landmass1', 'landmass2');

if (connectionResult.success) {
  console.log('Connection path found:', connectionResult.path);
}

export { MapGrid, LandmassValidator, PangeaConnector };