// @ts-nocheck
/**
 * AutoFixer - CRC-A4-033
 * 
 * Identifies constraint violations and applies fixes by relocating
 * or pruning low-priority elements to satisfy hard constraints.
 */

import { City, Point } from '../domain/types';
import { ViolationOverlay, Violation, ViolationType, generateViolationOverlay } from '../domain/diagnostics/violationOverlay';

/**
 * Priority levels for elements
 */
export type ConstraintPriority = 'P0' | 'P1' | 'P2' | 'P3';

/**
 * Types of fix operations
 */
export type FixOperationType = 'relocate' | 'prune' | 'resize' | 'modify' | 'add';

/**
 * Types of elements that can be fixed
 */
export type FixableElementType = 'building' | 'road' | 'gate' | 'bridge' | 'tower' | 'wall' | 'district';

/**
 * Represents a single fix operation
 */
export interface FixOperation {
  id: string;
  type: FixOperationType;
  elementType: FixableElementType;
  elementId: string;
  description: string;
  violationId: string;
  priority: ConstraintPriority;
  before: {
    position?: Point;
    size?: number;
    properties?: Record<string, any>;
  };
  after: {
    position?: Point;
    size?: number;
    properties?: Record<string, any>;
  };
  success: boolean;
  timestamp: number;
}

/**
 * Log of fix operations
 */
export interface FixLog {
  operations: FixOperation[];
  startTime: number;
  endTime: number;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
}

/**
 * Configuration for auto-fix
 */
export interface AutoFixConfig {
  enabled: boolean;
  maxIterations: number;
  preserveHighPriority: boolean;
  logOperations: boolean;
  strategies: FixOperationType[];
  priorityThreshold?: ConstraintPriority;
  maxRelocationDistance?: number;
  minElementsPreserved?: number;
}

/**
 * Result of auto-fix application
 */
export interface FixResult {
  originalCity: City;
  fixedCity: City;
  log: FixLog;
  success: boolean;
  remainingViolations: Violation[];
  fixedViolations: Violation[];
  statistics: FixStatistics;
}

/**
 * Statistics about fix operations
 */
export interface FixStatistics {
  totalViolations: number;
  fixedViolations: number;
  remainingViolations: number;
  relocatedElements: number;
  prunedElements: number;
  resizedElements: number;
  addedElements: number;
  iterations: number;
}

/**
 * Default auto-fix configuration
 */
export const DEFAULT_AUTO_FIX_CONFIG: AutoFixConfig = {
  enabled: true,
  maxIterations: 10,
  preserveHighPriority: true,
  logOperations: true,
  strategies: ['relocate', 'prune', 'resize'],
  priorityThreshold: 'P2',
  maxRelocationDistance: 50,
  minElementsPreserved: 10
};

/**
 * AutoFixer class identifies and fixes constraint violations.
 * 
 * Features:
 * - Detects violations using ViolationOverlay
 * - Relocates elements to resolve conflicts
 * - Prunes low-priority elements when relocation fails
 * - Resizes elements to fit constraints
 * - Logs all operations for audit
 * - Preserves high-priority elements
 */
export class AutoFixer {
  private config: AutoFixConfig;
  private operations: FixOperation[] = [];
  private operationIdCounter: number = 0;
  private iterationCount: number = 0;

  constructor(config?: Partial<AutoFixConfig>) {
    this.config = { ...DEFAULT_AUTO_FIX_CONFIG, ...config };
  }

  /**
   * Applies auto-fixes to a city
   */
  applyFixes(city: City): FixResult {
    const startTime = Date.now();
    this.operations = [];
    this.operationIdCounter = 0;
    this.iterationCount = 0;

    // If auto-fix is disabled, return original city with no operations
    if (!this.config.enabled) {
      const endTime = Date.now();
      return {
        originalCity: city,
        fixedCity: this.cloneCity(city),
        log: {
          operations: [],
          startTime,
          endTime,
          totalOperations: 0,
          successfulOperations: 0,
          failedOperations: 0
        },
        success: true,
        remainingViolations: [],
        fixedViolations: [],
        statistics: {
          totalViolations: 0,
          fixedViolations: 0,
          remainingViolations: 0,
          relocatedElements: 0,
          prunedElements: 0,
          resizedElements: 0,
          addedElements: 0,
          iterations: 0
        }
      };
    }

    // Deep clone the city to avoid modifying the original
    const fixedCity = this.cloneCity(city);
    let overlay = generateViolationOverlay(fixedCity);
    const initialViolations = [...overlay.allViolations];

    // If no violations, return early
    if (initialViolations.length === 0) {
      const endTime = Date.now();
      return {
        originalCity: city,
        fixedCity,
        log: {
          operations: [],
          startTime,
          endTime,
          totalOperations: 0,
          successfulOperations: 0,
          failedOperations: 0
        },
        success: true,
        remainingViolations: [],
        fixedViolations: [],
        statistics: {
          totalViolations: 0,
          fixedViolations: 0,
          remainingViolations: 0,
          relocatedElements: 0,
          prunedElements: 0,
          resizedElements: 0,
          addedElements: 0,
          iterations: 0
        }
      };
    }

    // Iteratively apply fixes
    while (overlay.violationCount > 0 && this.iterationCount < this.config.maxIterations) {
      this.iterationCount++;
      
      // Get violations sorted by priority
      const sortedViolations = this.sortViolationsByPriority(overlay.allViolations);
      
      // Try to fix each violation
      let fixedAny = false;
      for (const violation of sortedViolations) {
        const fixed = this.fixViolation(violation, fixedCity);
        if (fixed) {
          fixedAny = true;
        }
      }

      // Re-generate overlay to check remaining violations
      overlay = generateViolationOverlay(fixedCity);
      
      // If no fixes were applied, stop to avoid infinite loop
      if (!fixedAny) {
        break;
      }
    }

    const endTime = Date.now();
    const log: FixLog = {
      operations: this.operations,
      startTime,
      endTime,
      totalOperations: this.operations.length,
      successfulOperations: this.operations.filter(op => op.success).length,
      failedOperations: this.operations.filter(op => !op.success).length
    };

    const fixedViolationIds = new Set(
      this.operations.filter(op => op.success).map(op => op.violationId)
    );

    const fixedViolations = initialViolations.filter(v => fixedViolationIds.has(v.id));
    const remainingViolations = overlay.allViolations;

    return {
      originalCity: city,
      fixedCity,
      log,
      success: remainingViolations.filter(v => v.severity === 'error').length === 0,
      remainingViolations,
      fixedViolations,
      statistics: {
        totalViolations: initialViolations.length,
        fixedViolations: fixedViolations.length,
        remainingViolations: remainingViolations.length,
        relocatedElements: this.operations.filter(op => op.type === 'relocate' && op.success).length,
        prunedElements: this.operations.filter(op => op.type === 'prune' && op.success).length,
        resizedElements: this.operations.filter(op => op.type === 'resize' && op.success).length,
        addedElements: this.operations.filter(op => op.type === 'add' && op.success).length,
        iterations: this.iterationCount
      }
    };
  }

  /**
   * Fixes a single violation
   */
  private fixViolation(violation: Violation, city: City): boolean {
    switch (violation.type) {
      case 'building-wall-intersection':
        return this.fixBuildingWallIntersection(violation, city);
      case 'building-river-buffer':
        return this.fixBuildingRiverBuffer(violation, city);
      case 'road-wall-contact-no-gate':
        return this.fixRoadWallContactNoGate(violation, city);
      case 'invalid-bridge-connectivity':
      case 'invalid-bridge-orientation':
        return this.fixInvalidBridge(violation, city);
      case 'tower-spacing-outlier':
        return this.fixTowerSpacing(violation, city);
      default:
        return false;
    }
  }

  /**
   * Fixes building-wall intersection by relocating or pruning the building
   */
  private fixBuildingWallIntersection(violation: Violation, city: City): boolean {
    if (!violation.buildingId || !city.buildings) return false;

    const buildingIndex = city.buildings.findIndex(b => b.id === violation.buildingId);
    if (buildingIndex === -1) return false;

    const building = city.buildings[buildingIndex];
    const originalPosition = { ...building.position };

    // Try relocation first
    if (this.config.strategies.includes('relocate')) {
      const newPosition = this.findRelocationPosition(building, city, 'wall');
      if (newPosition) {
        building.position = newPosition;
        
        this.logOperation({
          type: 'relocate',
          elementType: 'building',
          elementId: building.id,
          description: `Relocated building ${building.id} away from wall`,
          violationId: violation.id,
          priority: 'P0',
          before: { position: originalPosition },
          after: { position: newPosition },
          success: true
        });
        
        return true;
      }
    }

    // If relocation fails, try pruning
    if (this.config.strategies.includes('prune') && !this.isHighPriority(building)) {
      city.buildings.splice(buildingIndex, 1);
      
      this.logOperation({
        type: 'prune',
        elementType: 'building',
        elementId: building.id,
        description: `Pruned building ${building.id} due to wall collision`,
        violationId: violation.id,
        priority: 'P0',
        before: { position: originalPosition },
        after: {},
        success: true
      });
      
      return true;
    }

    // Log failed attempt
    this.logOperation({
      type: 'relocate',
      elementType: 'building',
      elementId: building.id,
      description: `Failed to fix building-wall intersection for ${building.id}`,
      violationId: violation.id,
      priority: 'P0',
      before: { position: originalPosition },
      after: { position: originalPosition },
      success: false
    });

    return false;
  }

  /**
   * Fixes building-river buffer violation
   */
  private fixBuildingRiverBuffer(violation: Violation, city: City): boolean {
    if (!violation.buildingId || !city.buildings) return false;

    const buildingIndex = city.buildings.findIndex(b => b.id === violation.buildingId);
    if (buildingIndex === -1) return false;

    const building = city.buildings[buildingIndex];
    const originalPosition = { ...building.position };

    // Try relocation
    if (this.config.strategies.includes('relocate')) {
      const newPosition = this.findRelocationPosition(building, city, 'river');
      if (newPosition) {
        building.position = newPosition;
        
        this.logOperation({
          type: 'relocate',
          elementType: 'building',
          elementId: building.id,
          description: `Relocated building ${building.id} away from river buffer`,
          violationId: violation.id,
          priority: 'P1',
          before: { position: originalPosition },
          after: { position: newPosition },
          success: true
        });
        
        return true;
      }
    }

    // Try resizing (reducing building footprint)
    if (this.config.strategies.includes('resize') && building.size) {
      const originalSize = building.size;
      building.size = originalSize * 0.5;
      
      this.logOperation({
        type: 'resize',
        elementType: 'building',
        elementId: building.id,
        description: `Resized building ${building.id} to fit within river buffer`,
        violationId: violation.id,
        priority: 'P1',
        before: { size: originalSize },
        after: { size: building.size },
        success: true
      });
      
      return true;
    }

    return false;
  }

  /**
   * Fixes road-wall contact without gate by adding a gate
   */
  private fixRoadWallContactNoGate(violation: Violation, city: City): boolean {
    if (!violation.roadId || !city.roads) return false;

    const road = city.roads.find(r => r.id === violation.roadId);
    if (!road) return false;

    // Add a gate at the road-wall contact point
    if (this.config.strategies.includes('add') && city.gates) {
      const gatePosition = road.endPoint || violation.position;
      const newGate = {
        id: `gate-${Date.now()}`,
        position: gatePosition,
        roadId: road.id,
        type: 'auto-generated'
      };
      
      city.gates.push(newGate);
      
      this.logOperation({
        type: 'add',
        elementType: 'gate',
        elementId: newGate.id,
        description: `Added gate at road-wall contact for road ${road.id}`,
        violationId: violation.id,
        priority: 'P0',
        before: {},
        after: { position: gatePosition },
        success: true
      });
      
      return true;
    }

    return false;
  }

  /**
   * Fixes invalid bridge by relocating or pruning
   */
  private fixInvalidBridge(violation: Violation, city: City): boolean {
    if (!violation.bridgeId || !city.bridges) return false;

    const bridgeIndex = city.bridges.findIndex(b => b.id === violation.bridgeId);
    if (bridgeIndex === -1) return false;

    const bridge = city.bridges[bridgeIndex];

    // For connectivity issues, try to fix endpoints
    if (violation.type === 'invalid-bridge-connectivity') {
      if (this.config.strategies.includes('modify')) {
        // Attempt to reconnect bridge endpoints
        bridge.connected = true;
        
        this.logOperation({
          type: 'modify',
          elementType: 'bridge',
          elementId: bridge.id,
          description: `Modified bridge ${bridge.id} connectivity`,
          violationId: violation.id,
          priority: 'P0',
          before: { properties: { connected: false } },
          after: { properties: { connected: true } },
          success: true
        });
        
        return true;
      }
    }

    // For orientation issues, try to adjust
    if (violation.type === 'invalid-bridge-orientation') {
      if (this.config.strategies.includes('modify')) {
        // Adjust bridge orientation
        if (bridge.axis && city.river?.tangent) {
          const newAxis = {
            x: -city.river.tangent.y,
            y: city.river.tangent.x
          };
          
          this.logOperation({
            type: 'modify',
            elementType: 'bridge',
            elementId: bridge.id,
            description: `Adjusted bridge ${bridge.id} orientation`,
            violationId: violation.id,
            priority: 'P1',
            before: { properties: { axis: bridge.axis } },
            after: { properties: { axis: newAxis } },
            success: true
          });
          
          bridge.axis = newAxis;
          return true;
        }
      }
    }

    // If modification fails, prune the bridge
    if (this.config.strategies.includes('prune')) {
      city.bridges.splice(bridgeIndex, 1);
      
      this.logOperation({
        type: 'prune',
        elementType: 'bridge',
        elementId: bridge.id,
        description: `Pruned invalid bridge ${bridge.id}`,
        violationId: violation.id,
        priority: 'P0',
        before: {},
        after: {},
        success: true
      });
      
      return true;
    }

    return false;
  }

  /**
   * Fixes tower spacing outliers by relocating
   */
  private fixTowerSpacing(violation: Violation, city: City): boolean {
    if (!violation.towerId || !city.towers) return false;

    const towerIndex = city.towers.findIndex(t => t.id === violation.towerId);
    if (towerIndex === -1) return false;

    const tower = city.towers[towerIndex];
    const originalPosition = { ...tower.position };

    // Try relocation
    if (this.config.strategies.includes('relocate')) {
      const newPosition = this.findTowerRelocationPosition(tower, city);
      if (newPosition) {
        tower.position = newPosition;
        
        this.logOperation({
          type: 'relocate',
          elementType: 'tower',
          elementId: tower.id,
          description: `Relocated tower ${tower.id} to fix spacing`,
          violationId: violation.id,
          priority: 'P2',
          before: { position: originalPosition },
          after: { position: newPosition },
          success: true
        });
        
        return true;
      }
    }

    // If relocation fails and spacing is too small, prune
    if (this.config.strategies.includes('prune') && violation.actualValue !== undefined) {
      const minSpacing = city.config?.minTowerSpacing || 30;
      if (violation.actualValue < minSpacing) {
        city.towers.splice(towerIndex, 1);
        
        this.logOperation({
          type: 'prune',
          elementType: 'tower',
          elementId: tower.id,
          description: `Pruned tower ${tower.id} due to spacing conflict`,
          violationId: violation.id,
          priority: 'P2',
          before: { position: originalPosition },
          after: {},
          success: true
        });
        
        return true;
      }
    }

    return false;
  }

  /**
   * Finds a new position for relocating a building
   */
  private findRelocationPosition(building: any, city: City, avoidType: 'wall' | 'river'): Point | null {
    const currentPosition = building.position || { x: 0, y: 0 };
    const maxDistance = this.config.maxRelocationDistance || 50;
    
    // Try positions in a spiral pattern
    for (let distance = 10; distance <= maxDistance; distance += 10) {
      for (let angle = 0; angle < 360; angle += 45) {
        const radians = (angle * Math.PI) / 180;
        const newPosition = {
          x: currentPosition.x + distance * Math.cos(radians),
          y: currentPosition.y + distance * Math.sin(radians)
        };
        
        // Check if position is valid
        if (this.isValidBuildingPosition(newPosition, city, avoidType)) {
          return newPosition;
        }
      }
    }
    
    return null;
  }

  /**
   * Finds a new position for relocating a tower
   */
  private findTowerRelocationPosition(tower: any, city: City): Point | null {
    const currentPosition = tower.position || { x: 0, y: 0 };
    const minSpacing = city.config?.minTowerSpacing || 30;
    const maxSpacing = city.config?.maxTowerSpacing || 100;
    const targetSpacing = (minSpacing + maxSpacing) / 2;
    
    // Find direction to nearest tower
    let nearestTower: any = null;
    let nearestDistance = Infinity;
    
    for (const other of city.towers || []) {
      if (other.id === tower.id) continue;
      const dist = this.calculateDistance(other.position, currentPosition);
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestTower = other;
      }
    }
    
    if (nearestTower) {
      // Move away from nearest tower
      const dx = currentPosition.x - nearestTower.position.x;
      const dy = currentPosition.y - nearestTower.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        return {
          x: nearestTower.position.x + (dx / dist) * targetSpacing,
          y: nearestTower.position.y + (dy / dist) * targetSpacing
        };
      }
    }
    
    return null;
  }

  /**
   * Checks if a position is valid for building placement
   */
  private isValidBuildingPosition(position: Point, city: City, avoidType: 'wall' | 'river'): boolean {
    // Check wall clearance
    if (avoidType === 'wall' && city.walls) {
      const walls = Array.isArray(city.walls) ? city.walls : [city.walls];
      for (const wall of walls) {
        const points = wall.points || wall.path || [];
        for (const point of points) {
          if (this.calculateDistance(position, point) < 15) {
            return false;
          }
        }
      }
    }
    
    // Check river clearance
    if (avoidType === 'river' && city.river) {
      const riverPoints = city.river.points || city.river.path || [];
      const bufferDistance = city.config?.riverBufferDistance || 20;
      for (const point of riverPoints) {
        if (this.calculateDistance(position, point) < bufferDistance) {
          return false;
        }
      }
    }
    
    // Check if within city bounds
    if (city.boundary && city.boundary.length > 0) {
      // Simple bounds check
      const bounds = this.getBounds(city.boundary);
      if (position.x < bounds.minX || position.x > bounds.maxX ||
          position.y < bounds.minY || position.y > bounds.maxY) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Gets bounding box of points
   */
  private getBounds(points: Point[]): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (const p of points) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    
    return { minX, maxX, minY, maxY };
  }

  /**
   * Checks if an element is high priority
   */
  private isHighPriority(element: any): boolean {
    if (!this.config.preserveHighPriority) return false;
    return element.priority === 'high' || element.landmark === true;
  }

  /**
   * Sorts violations by priority
   */
  private sortViolationsByPriority(violations: Violation[]): Violation[] {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return [...violations].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  /**
   * Calculates distance between two points
   */
  private calculateDistance(p1: Point | undefined, p2: Point | undefined): number {
    if (!p1 || !p2) return Infinity;
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  /**
   * Deep clones a city object
   */
  private cloneCity(city: City): City {
    return JSON.parse(JSON.stringify(city));
  }

  /**
   * Logs a fix operation
   */
  private logOperation(params: {
    type: FixOperationType;
    elementType: FixableElementType;
    elementId: string;
    description: string;
    violationId: string;
    priority: ConstraintPriority;
    before: any;
    after: any;
    success: boolean;
  }): void {
    if (!this.config.logOperations) return;

    this.operations.push({
      id: `op-${++this.operationIdCounter}`,
      ...params,
      timestamp: Date.now()
    });
  }

  /**
   * Gets the current configuration
   */
  getConfig(): AutoFixConfig {
    return { ...this.config };
  }

  /**
   * Updates the configuration
   */
  setConfig(config: Partial<AutoFixConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create default instance
const defaultAutoFixer = new AutoFixer();

/**
 * Applies auto-fixes to a city
 */
export function applyAutoFixes(city: City, config?: Partial<AutoFixConfig>): FixResult {
  const fixer = config ? new AutoFixer(config) : defaultAutoFixer;
  return fixer.applyFixes(city);
}

/**
 * Gets the fix log from a result
 */
export function getFixLog(result: FixResult): FixLog {
  return result.log;
}

/**
 * Configures the auto-fixer
 */
export function configureAutoFix(config: Partial<AutoFixConfig>): AutoFixer {
  return new AutoFixer(config);
}

/**
 * Validates fix results
 */
export function validateFixResults(result: FixResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!result.fixedCity) {
    errors.push('Missing fixed city');
  }

  if (!result.log) {
    errors.push('Missing fix log');
  }

  if (result.statistics.fixedViolations + result.statistics.remainingViolations !== result.statistics.totalViolations) {
    errors.push('Violation count mismatch in statistics');
  }

  // Check for remaining error-level violations
  const remainingErrors = result.remainingViolations.filter(v => v.severity === 'error');
  if (remainingErrors.length > 0) {
    errors.push(`${remainingErrors.length} error-level violations remain`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Compares pre-fix and post-fix cities
 */
export function comparePrePostFix(result: FixResult): {
  buildingsRemoved: number;
  buildingsRelocated: number;
  gatesAdded: number;
  bridgesRemoved: number;
  towersRemoved: number;
} {
  const originalBuildings = result.originalCity.buildings?.length || 0;
  const fixedBuildings = result.fixedCity.buildings?.length || 0;
  
  const originalGates = result.originalCity.gates?.length || 0;
  const fixedGates = result.fixedCity.gates?.length || 0;
  
  const originalBridges = result.originalCity.bridges?.length || 0;
  const fixedBridges = result.fixedCity.bridges?.length || 0;
  
  const originalTowers = result.originalCity.towers?.length || 0;
  const fixedTowers = result.fixedCity.towers?.length || 0;

  const relocatedBuildings = result.log.operations.filter(
    op => op.type === 'relocate' && op.elementType === 'building' && op.success
  ).length;

  return {
    buildingsRemoved: originalBuildings - fixedBuildings,
    buildingsRelocated: relocatedBuildings,
    gatesAdded: fixedGates - originalGates,
    bridgesRemoved: originalBridges - fixedBridges,
    towersRemoved: originalTowers - fixedTowers
  };
}

/**
 * Gets fix statistics
 */
export function getFixStatistics(result: FixResult): FixStatistics {
  return result.statistics;
}
