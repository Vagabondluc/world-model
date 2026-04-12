// @ts-nocheck
/**
 * ViolationOverlay - CRC-A4-032
 * 
 * Detects and highlights various constraint violations for debugging.
 * Provides visual overlay capabilities for violation visualization.
 */

import { City, Point } from '../types';

/**
 * Types of violations that can be detected
 */
export type ViolationType =
  | 'building-wall-intersection'
  | 'building-river-buffer'
  | 'road-wall-contact-no-gate'
  | 'invalid-bridge-connectivity'
  | 'invalid-bridge-orientation'
  | 'invalid-bridge'
  | 'tower-spacing-outlier'
  | 'gate-missing'
  | 'clear-zone-violation'
  | 'density-violation'
  | 'hierarchy-violation';

/**
 * Represents a single violation
 */
export interface Violation {
  id: string;
  type: ViolationType;
  position: Point;
  description: string;
  severity: 'error' | 'warning' | 'info' | 'high' | 'medium' | 'low' | 'critical';
  buildingId?: string;
  wallId?: string;
  roadId?: string;
  gateId?: string;
  bridgeId?: string;
  towerId?: string;
  riverId?: string;
  intersectionArea?: number;
  distance?: number;
  expectedValue?: number;
  actualValue?: number;
  relatedViolations?: string[];
  suggestion?: string;
  validityIssues?: string[];
}

/**
 * Configuration for the violation overlay
 */
export interface OverlayConfig {
  enabled: boolean;
  highlightColor: string;
  opacity: number;
  showLabels: boolean;
  filterTypes?: ViolationType[];
  minSeverity?: 'error' | 'warning' | 'info';
}

/**
 * Filter for querying violations
 */
export interface ViolationFilter {
  types?: ViolationType[];
  severity?: ('error' | 'warning' | 'info' | 'high' | 'medium' | 'low' | 'critical')[];
  minSeverity?: 'error' | 'warning' | 'info' | 'high' | 'medium' | 'low' | 'critical';
  area?: {
    min?: Point;
    max?: Point;
  };
  boundingBox?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  limit?: number;
}

/**
 * Result of violation overlay generation
 */
export interface ViolationOverlay {
  cityId: string;
  timestamp: number;
  enabled: boolean;
  buildingWallIntersections: Violation[];
  buildingRiverBufferViolations: Violation[];
  roadWallContactsWithoutGates: Violation[];
  invalidBridges: Violation[];
  towerSpacingOutliers: Violation[];
  allViolations: Violation[];
  violationCount: number;
  config: OverlayConfig;
}

/**
 * Statistics about violations
 */
export interface ViolationStatistics {
  totalCount: number;
  byType: Record<ViolationType, number>;
  bySeverity: Record<'error' | 'warning' | 'info', number>;
  averagePerType: number;
}

/**
 * ViolationOverlay class detects and manages constraint violations.
 * 
 * Features:
 * - Detects building-wall intersections
 * - Detects building-river buffer violations
 * - Detects road-wall contacts without gates
 * - Detects invalid bridge connectivity/orientation
 * - Detects tower spacing outliers
 * - Supports filtering by type and severity
 * - Provides visual overlay for debugging
 */
export class ViolationOverlayGenerator {
  private config: OverlayConfig;
  private violations: Violation[] = [];
  private violationIdCounter: number = 0;

  constructor(config?: Partial<OverlayConfig>) {
    this.config = {
      enabled: true,
      highlightColor: '#ff0000',
      opacity: 0.5,
      showLabels: true,
      ...config
    };
  }

  /**
   * Generates a violation overlay for a city
   */
  generateOverlay(city: City): ViolationOverlay {
    this.violations = [];
    this.violationIdCounter = 0;

    // Detect all violation types
    const buildingWallIntersections = this.detectBuildingWallIntersections(city);
    const buildingRiverBufferViolations = this.detectBuildingRiverBufferViolations(city);
    const roadWallContactsWithoutGates = this.detectRoadWallContactsWithoutGates(city);
    const invalidBridges = this.detectInvalidBridges(city);
    const towerSpacingOutliers = this.detectTowerSpacingOutliers(city);

    // Combine all violations
    this.violations = [
      ...buildingWallIntersections,
      ...buildingRiverBufferViolations,
      ...roadWallContactsWithoutGates,
      ...invalidBridges,
      ...towerSpacingOutliers
    ];

    return {
      cityId: city.id || 'unknown',
      timestamp: Date.now(),
      enabled: this.config.enabled,
      buildingWallIntersections,
      buildingRiverBufferViolations,
      roadWallContactsWithoutGates,
      invalidBridges,
      towerSpacingOutliers,
      allViolations: this.violations,
      violationCount: this.violations.length,
      config: this.config
    };
  }

  /**
   * Detects buildings that intersect with walls
   */
  private detectBuildingWallIntersections(city: City): Violation[] {
    const violations: Violation[] = [];

    if (!city.buildings || !city.walls) {
      return violations;
    }

    const walls = Array.isArray(city.walls) ? city.walls : [city.walls];

    for (const building of city.buildings) {
      for (const wall of walls) {
        if (this.checkBuildingWallIntersection(building, wall)) {
          violations.push({
            id: `violation-${++this.violationIdCounter}`,
            type: 'building-wall-intersection',
            position: building.position || building.centroid || { x: 0, y: 0 },
            description: `Building ${building.id} intersects with wall`,
            severity: 'error',
            buildingId: building.id,
            wallId: wall.id,
            intersectionArea: this.calculateIntersectionArea(building, wall)
          });
        }
      }
    }

    return violations;
  }

  /**
   * Detects buildings within river buffer zones
   */
  private detectBuildingRiverBufferViolations(city: City): Violation[] {
    const violations: Violation[] = [];

    if (!city.buildings || !city.river) {
      return violations;
    }

    const bufferDistance = city.config?.riverBufferDistance || 20;

    for (const building of city.buildings) {
      const distance = this.calculateDistanceToRiver(building, city.river);
      if (distance < bufferDistance) {
        violations.push({
          id: `violation-${++this.violationIdCounter}`,
          type: 'building-river-buffer',
          position: building.position || building.centroid || { x: 0, y: 0 },
          description: `Building ${building.id} is within river buffer zone`,
          severity: 'warning',
          buildingId: building.id,
          riverId: city.river.id,
          distance,
          expectedValue: bufferDistance,
          actualValue: distance
        });
      }
    }

    return violations;
  }

  /**
   * Detects roads that contact walls without gates
   */
  private detectRoadWallContactsWithoutGates(city: City): Violation[] {
    const violations: Violation[] = [];

    if (!city.roads || !city.walls) {
      return violations;
    }

    const walls = Array.isArray(city.walls) ? city.walls : [city.walls];
    const gates = city.gates || [];

    for (const road of city.roads) {
      if (this.roadContactsWall(road, walls)) {
        const hasGate = this.hasGateAtRoadWallContact(road, gates);
        if (!hasGate) {
          violations.push({
            id: `violation-${++this.violationIdCounter}`,
            type: 'road-wall-contact-no-gate',
            position: road.endPoint || road.position || { x: 0, y: 0 },
            description: `Road ${road.id} contacts wall without a gate`,
            severity: 'error',
            roadId: road.id
          });
        }
      }
    }

    return violations;
  }

  /**
   * Detects invalid bridge connectivity or orientation
   */
  private detectInvalidBridges(city: City): Violation[] {
    const violations: Violation[] = [];

    if (!city.bridges) {
      return violations;
    }

    for (const bridge of city.bridges) {
      const validityIssues: string[] = [];
      
      // Check connectivity
      if (!this.isBridgeConnected(bridge, city)) {
        validityIssues.push('connectivity');
      }

      // Check orientation (should be near-perpendicular to river)
      if (!this.isBridgeOrientationValid(bridge, city)) {
        validityIssues.push('orientation');
      }

      if (validityIssues.length > 0) {
        violations.push({
          id: `violation-${++this.violationIdCounter}`,
          type: 'invalid-bridge',
          position: bridge.position || { x: 0, y: 0 },
          description: `Bridge ${bridge.id} has validity issues: ${validityIssues.join(', ')}`,
          severity: 'error',
          bridgeId: bridge.id,
          validityIssues,
          suggestion: `Fix bridge ${bridge.id}: ${validityIssues.map(i => i === 'connectivity' ? 'ensure proper road connections' : 'adjust to be perpendicular to river').join('; ')}`
        });
      }
    }

    return violations;
  }

  /**
   * Detects tower spacing outliers
   */
  private detectTowerSpacingOutliers(city: City): Violation[] {
    const violations: Violation[] = [];

    if (!city.towers || city.towers.length < 2) {
      return violations;
    }

    const minSpacing = city.config?.minTowerSpacing || 30;
    const maxSpacing = city.config?.maxTowerSpacing || 100;

    // Sort towers by position along wall
    const sortedTowers = [...city.towers].sort((a, b) => {
      return (a.position?.x || 0) - (b.position?.x || 0);
    });

    for (let i = 1; i < sortedTowers.length; i++) {
      const prevTower = sortedTowers[i - 1];
      const currTower = sortedTowers[i];
      const spacing = this.calculateDistance(prevTower.position, currTower.position);

      if (spacing < minSpacing) {
        violations.push({
          id: `violation-${++this.violationIdCounter}`,
          type: 'tower-spacing-outlier',
          position: currTower.position || { x: 0, y: 0 },
          description: `Tower ${currTower.id} is too close to tower ${prevTower.id} (spacing: ${spacing.toFixed(2)})`,
          severity: 'warning',
          towerId: currTower.id,
          distance: spacing,
          expectedValue: minSpacing,
          actualValue: spacing,
          suggestion: `Move tower ${currTower.id} further from tower ${prevTower.id} to achieve minimum spacing of ${minSpacing}`
        });
      } else if (spacing > maxSpacing) {
        violations.push({
          id: `violation-${++this.violationIdCounter}`,
          type: 'tower-spacing-outlier',
          position: currTower.position || { x: 0, y: 0 },
          description: `Tower ${currTower.id} is too far from tower ${prevTower.id} (spacing: ${spacing.toFixed(2)})`,
          severity: 'warning',
          towerId: currTower.id,
          distance: spacing,
          expectedValue: maxSpacing,
          actualValue: spacing,
          suggestion: `Add an intermediate tower or move tower ${currTower.id} closer to tower ${prevTower.id} to achieve maximum spacing of ${maxSpacing}`
        });
      }
    }

    return violations;
  }

  /**
   * Checks if a building intersects with a wall
   */
  private checkBuildingWallIntersection(building: any, wall: any): boolean {
    if (!building || !wall) return false;
    
    // Simplified intersection check
    const buildingPos = building.position || building.centroid || { x: 0, y: 0 };
    const wallPoints = wall.points || wall.path || [];
    
    for (const point of wallPoints) {
      const distance = this.calculateDistance(buildingPos, point);
      if (distance < (building.radius || 10)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Calculates intersection area between building and wall
   */
  private calculateIntersectionArea(building: any, wall: any): number {
    // Simplified calculation
    const buildingPos = building.position || building.centroid || { x: 0, y: 0 };
    const wallPoints = wall.points || wall.path || [];
    
    let minDistance = Infinity;
    for (const point of wallPoints) {
      const distance = this.calculateDistance(buildingPos, point);
      minDistance = Math.min(minDistance, distance);
    }
    
    const buildingRadius = building.radius || 10;
    if (minDistance < buildingRadius) {
      return Math.PI * Math.pow(buildingRadius - minDistance, 2);
    }
    
    return 0;
  }

  /**
   * Calculates distance from building to river
   */
  private calculateDistanceToRiver(building: any, river: any): number {
    const buildingPos = building.position || building.centroid || { x: 0, y: 0 };
    const riverPoints = river.points || river.path || [];
    
    let minDistance = Infinity;
    for (const point of riverPoints) {
      const distance = this.calculateDistance(buildingPos, point);
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance;
  }

  /**
   * Checks if a road contacts a wall
   */
  private roadContactsWall(road: any, walls: any[]): boolean {
    const roadEnd = road.endPoint || road.position;
    if (!roadEnd) return false;
    
    for (const wall of walls) {
      const wallPoints = wall.points || wall.path || [];
      for (const point of wallPoints) {
        const distance = this.calculateDistance(roadEnd, point);
        if (distance < 5) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Checks if there's a gate at road-wall contact
   */
  private hasGateAtRoadWallContact(road: any, gates: any[]): boolean {
    const roadEnd = road.endPoint || road.position;
    if (!roadEnd) return false;
    
    for (const gate of gates) {
      const gatePos = gate.position || gate;
      const distance = this.calculateDistance(roadEnd, gatePos);
      if (distance < 10) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Checks if a bridge is properly connected
   */
  private isBridgeConnected(bridge: any, city: City): boolean {
    if (!bridge.endpoints || bridge.endpoints.length < 2) {
      return false;
    }
    
    // Check if endpoints connect to roads
    const roads = city.roads || [];
    for (const endpoint of bridge.endpoints) {
      let connected = false;
      for (const road of roads) {
        if (road.points && road.points.includes(endpoint)) {
          connected = true;
          break;
        }
      }
      if (!connected) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Checks if bridge orientation is valid (near-perpendicular to river)
   */
  private isBridgeOrientationValid(bridge: any, city: City): boolean {
    if (!city.river || !bridge.axis) {
      return true; // Cannot verify without river or axis
    }
    
    const riverTangent = city.river.tangent || { x: 1, y: 0 };
    const bridgeAxis = bridge.axis;
    
    // Calculate angle between bridge and river tangent
    const dot = riverTangent.x * bridgeAxis.x + riverTangent.y * bridgeAxis.y;
    const mag1 = Math.sqrt(riverTangent.x ** 2 + riverTangent.y ** 2);
    const mag2 = Math.sqrt(bridgeAxis.x ** 2 + bridgeAxis.y ** 2);
    
    if (mag1 === 0 || mag2 === 0) return true;
    
    const cosAngle = dot / (mag1 * mag2);
    const angle = Math.acos(Math.min(1, Math.max(-1, cosAngle))) * (180 / Math.PI);
    
    // Bridge should be near perpendicular (90 degrees ± tolerance)
    const tolerance = city.config?.bridgePerpTolerance || 15;
    return Math.abs(angle - 90) <= tolerance;
  }

  /**
   * Calculates distance between two points
   */
  private calculateDistance(p1: Point | undefined, p2: Point | undefined): number {
    if (!p1 || !p2) return Infinity;
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  /**
   * Gets the current configuration
   */
  getConfig(): OverlayConfig {
    return { ...this.config };
  }

  /**
   * Updates the configuration
   */
  setConfig(config: Partial<OverlayConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets violation statistics
   */
  getStatistics(): ViolationStatistics {
    const byType: Record<ViolationType, number> = {
      'building-wall-intersection': 0,
      'building-river-buffer': 0,
      'road-wall-contact-no-gate': 0,
      'invalid-bridge-connectivity': 0,
      'invalid-bridge-orientation': 0,
      'invalid-bridge': 0,
      'tower-spacing-outlier': 0,
      'gate-missing': 0,
      'clear-zone-violation': 0,
      'density-violation': 0,
      'hierarchy-violation': 0
    };

    const bySeverity: Record<'error' | 'warning' | 'info', number> = {
      error: 0,
      warning: 0,
      info: 0
    };

    for (const violation of this.violations) {
      byType[violation.type]++;
      bySeverity[violation.severity]++;
    }

    const typeCount = Object.values(byType).filter(c => c > 0).length;
    const averagePerType = typeCount > 0 ? this.violations.length / typeCount : 0;

    return {
      totalCount: this.violations.length,
      byType,
      bySeverity,
      averagePerType
    };
  }
}

// Create default instance
const defaultOverlayGenerator = new ViolationOverlayGenerator();

/**
 * Generates a violation overlay for a city
 */
export function generateViolationOverlay(city: City, config?: Partial<OverlayConfig>): ViolationOverlay {
  const generator = config ? new ViolationOverlayGenerator(config) : defaultOverlayGenerator;
  return generator.generateOverlay(city);
}

/**
 * Filters violations by type
 * Can accept either an array of types or a ViolationFilter object
 */
export function filterViolationsByType(
  violationsOrOverlay: Violation[] | ViolationOverlay,
  typesOrFilter?: ViolationType[] | ViolationFilter
): Violation[] {
  // Handle both array of violations and overlay object
  const violations = Array.isArray(violationsOrOverlay)
    ? violationsOrOverlay
    : violationsOrOverlay.allViolations;
  
  // Handle both array of types and filter object
  if (Array.isArray(typesOrFilter)) {
    return violations.filter(v => typesOrFilter.includes(v.type));
  }
  
  // Handle ViolationFilter object
  const filter = typesOrFilter as ViolationFilter | undefined;
  if (!filter) {
    return violations;
  }
  
  let filtered = violations;
  
  // Filter by types
  if (filter.types && filter.types.length > 0) {
    filtered = filtered.filter(v => filter.types!.includes(v.type));
  }
  
  // Filter by severity
  if (filter.severity && filter.severity.length > 0) {
    filtered = filtered.filter(v => filter.severity!.includes(v.severity));
  }
  
  // Filter by minSeverity
  if (filter.minSeverity) {
    const severityOrder: Record<string, number> = {
      'info': 0,
      'warning': 1,
      'error': 2
    };
    const minLevel = severityOrder[filter.minSeverity] || 0;
    filtered = filtered.filter(v => severityOrder[v.severity] >= minLevel);
  }
  
  // Filter by bounding box / area
  if (filter.area) {
    filtered = filtered.filter(v => {
      if (filter.area!.min && filter.area!.max) {
        return v.position.x >= filter.area!.min!.x &&
               v.position.x <= filter.area!.max!.x &&
               v.position.y >= filter.area!.min!.y &&
               v.position.y <= filter.area!.max!.y;
      }
      return true;
    });
  }
  
  // Filter by boundingBox
  if (filter.boundingBox) {
    const bb = filter.boundingBox;
    filtered = filtered.filter(v =>
      v.position.x >= bb.minX &&
      v.position.x <= bb.maxX &&
      v.position.y >= bb.minY &&
      v.position.y <= bb.maxY
    );
  }
  
  // Apply limit
  if (filter.limit && filter.limit > 0) {
    filtered = filtered.slice(0, filter.limit);
  }
  
  return filtered;
}

/**
 * Filters violations by severity
 */
export function filterViolationsBySeverity(
  violations: Violation[],
  severities: ('error' | 'warning' | 'info' | 'high' | 'medium' | 'low' | 'critical')[]
): Violation[] {
  return violations.filter(v => severities.includes(v.severity));
}

/**
 * Toggles violation overlay visibility
 */
export function toggleViolationOverlay(overlay: ViolationOverlay, enabled?: boolean): ViolationOverlay {
  return {
    ...overlay,
    enabled: enabled !== undefined ? enabled : !overlay.enabled
  };
}

/**
 * Gets the total violation count
 * Can optionally filter by type or severity
 */
export function getViolationCount(
  overlay: ViolationOverlay,
  type?: ViolationType | string,
  severity?: string
): number {
  if (!type && !severity) {
    return overlay.violationCount;
  }
  
  let violations = overlay.allViolations;
  
  if (type) {
    violations = violations.filter(v => v.type === type);
  }
  
  if (severity) {
    violations = violations.filter(v => v.severity === severity);
  }
  
  return violations.length;
}

/**
 * Gets details for a specific violation
 */
export function getViolationDetails(overlay: ViolationOverlay, violationId: string): Violation | null {
  return overlay.allViolations.find(v => v.id === violationId) || null;
}

/**
 * Validates a violation overlay
 */
export function validateViolationOverlay(overlay: ViolationOverlay): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!overlay.cityId) {
    errors.push('Missing cityId');
  }

  if (!overlay.allViolations) {
    errors.push('Missing allViolations array');
    return { valid: false, errors };
  }

  if (overlay.violationCount !== overlay.allViolations.length) {
    errors.push('Violation count mismatch');
  }

  for (const violation of overlay.allViolations) {
    if (!violation.id || !violation.type || !violation.position) {
      errors.push(`Invalid violation: ${violation.id || 'unknown'}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
