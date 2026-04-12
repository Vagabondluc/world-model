// @ts-nocheck
import { Point, dist, isPointInPolygon } from '../types';
import { RoadNetwork, Road, RoadTier } from '../roads/hierarchy';

export interface Square {
  id: string;
  polygon: Point[];
  centroid: Point;
  area: number;
  type: 'market' | 'plaza' | 'churchyard';
  connectedRoads: string[]; // IDs of connected roads
}

export interface City {
  roads: RoadNetwork;
  config: CityConfig;
}

export interface CityConfig {
  minSquareArea: number;
  maxSquareArea: number;
  squareTypes: Array<'market' | 'plaza' | 'churchyard'>;
  squarePlacementStrategy: 'central' | 'distributed' | 'near-gates';
}

/**
 * SquareGenerator class generates explicit open-space polygons (squares) that are
 * connected to the arterial network to provide structured voids in the city.
 */
export class SquareGenerator {
  private roadNetwork: RoadNetwork;
  private config: CityConfig;
  private squares: Square[] = [];

  constructor(roadNetwork: RoadNetwork, config: CityConfig) {
    this.roadNetwork = roadNetwork;
    this.config = config;
  }

  /**
   * Generates public squares for the city
   */
  public generateSquares(): Square[] {
    this.squares = [];
    
    // Determine square placement strategy
    switch (this.config.squarePlacementStrategy) {
      case 'central':
        this.generateCentralSquares();
        break;
      case 'distributed':
        this.generateDistributedSquares();
        break;
      case 'near-gates':
        this.generateNearGateSquares();
        break;
      default:
        this.generateDistributedSquares();
    }

    return this.squares;
  }

  /**
   * Generates squares in central locations
   */
  private generateCentralSquares(): void {
    // Find the center of the road network
    const centerPoint = this.findNetworkCenter();
    
    // Generate a main square at the center
    const mainSquare = this.createSquareAtPoint(centerPoint, 'market');
    if (mainSquare) {
      this.squares.push(mainSquare);
    }
    
    // Generate smaller squares around the center
    const secondaryCount = Math.floor(Math.random() * 2) + 1; // 1-2 secondary squares
    for (let i = 0; i < secondaryCount; i++) {
      const angle = (i / secondaryCount) * Math.PI * 2;
      const distance = 0.1 + Math.random() * 0.1;
      const point = {
        x: centerPoint.x + Math.cos(angle) * distance,
        y: centerPoint.y + Math.sin(angle) * distance
      };
      
      const type = this.config.squareTypes[i % this.config.squareTypes.length];
      const square = this.createSquareAtPoint(point, type);
      if (square) {
        this.squares.push(square);
      }
    }
  }

  /**
   * Generates squares distributed throughout the city
   */
  private generateDistributedSquares(): void {
    // Find suitable locations for squares
    const candidateLocations = this.findCandidateLocations(5); // Find 5 candidates
    
    // Select the best locations
    const selectedLocations = this.selectBestLocations(candidateLocations, 3); // Select 3
    
    // Create squares at selected locations
    for (let i = 0; i < selectedLocations.length; i++) {
      const location = selectedLocations[i];
      const type = this.config.squareTypes[i % this.config.squareTypes.length];
      const square = this.createSquareAtPoint(location.point, type);
      if (square) {
        this.squares.push(square);
      }
    }
  }

  /**
   * Generates squares near city gates
   */
  private generateNearGateSquares(): void {
    // Find roads that connect to the outside (likely near gates)
    const externalRoads = this.findExternalRoads();
    
    // Create squares near these roads
    for (let i = 0; i < Math.min(externalRoads.length, 3); i++) {
      const road = externalRoads[i];
      const point = this.findPointAlongRoad(road, 0.1); // 10% along the road from the start
      const type = this.config.squareTypes[i % this.config.squareTypes.length];
      const square = this.createSquareAtPoint(point, type);
      if (square) {
        this.squares.push(square);
      }
    }
  }

  /**
   * Finds the center point of the road network
   */
  private findNetworkCenter(): Point {
    if (this.roadNetwork.roads.length === 0) {
      return { x: 0.5, y: 0.5 };
    }

    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (const road of this.roadNetwork.roads) {
      sumX += road.start.x + road.end.x;
      sumY += road.start.y + road.end.y;
      count += 2;
    }

    return {
      x: sumX / count,
      y: sumY / count
    };
  }

  /**
   * Finds candidate locations for squares
   */
  private findCandidateLocations(count: number): Array<{ point: Point; score: number }> {
    const candidates: Array<{ point: Point; score: number }> = [];
    
    // Generate random points and evaluate their suitability
    for (let i = 0; i < count * 3; i++) { // Generate 3x more candidates than needed
      const point = {
        x: 0.2 + Math.random() * 0.6, // Keep away from edges
        y: 0.2 + Math.random() * 0.6
      };
      
      const score = this.evaluateLocation(point);
      candidates.push({ point, score });
    }

    // Sort by score (higher is better)
    candidates.sort((a, b) => b.score - a.score);
    
    return candidates.slice(0, count);
  }

  /**
   * Evaluates the suitability of a location for a square
   */
  private evaluateLocation(point: Point): number {
    let score = 0;
    
    // Check proximity to arterial roads
    const nearestArterial = this.findNearestRoadByTier(point, 'arterial');
    if (nearestArterial) {
      const distance = this.distanceToRoad(point, nearestArterial);
      if (distance < 0.05) {
        score += 10; // Close to arterial is good
      } else if (distance < 0.1) {
        score += 5; // Moderately close is okay
      }
    }
    
    // Check proximity to collector roads
    const nearestCollector = this.findNearestRoadByTier(point, 'collector');
    if (nearestCollector) {
      const distance = this.distanceToRoad(point, nearestCollector);
      if (distance < 0.05) {
        score += 5; // Close to collector is good
      }
    }
    
    // Check if location is not too close to other potential squares
    for (const square of this.squares) {
      const distance = dist(point, square.centroid);
      if (distance < 0.1) {
        score -= 20; // Too close to existing square is bad
      }
    }
    
    // Add some randomness for variety
    score += Math.random() * 5;
    
    return score;
  }

  /**
   * Selects the best locations from candidates
   */
  private selectBestLocations(
    candidates: Array<{ point: Point; score: number }>, 
    count: number
  ): Array<{ point: Point; score: number }> {
    // Filter out locations that are too close to each other
    const selected: Array<{ point: Point; score: number }> = [];
    
    for (const candidate of candidates) {
      if (selected.length >= count) break;
      
      let tooClose = false;
      for (const selectedLocation of selected) {
        if (dist(candidate.point, selectedLocation.point) < 0.15) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        selected.push(candidate);
      }
    }
    
    return selected;
  }

  /**
   * Creates a square at a specific point
   */
  private createSquareAtPoint(point: Point, type: 'market' | 'plaza' | 'churchyard'): Square | null {
    // Determine square size based on type
    let area = this.config.minSquareArea + 
      (this.config.maxSquareArea - this.config.minSquareArea) * Math.random();
    
    // Market squares are larger
    if (type === 'market') {
      area *= 1.5;
    }
    
    // Calculate square dimensions (assuming roughly square shape)
    const size = Math.sqrt(area);
    
    // Generate square polygon
    const halfSize = size / 2;
    const polygon = [
      { x: point.x - halfSize, y: point.y - halfSize },
      { x: point.x + halfSize, y: point.y - halfSize },
      { x: point.x + halfSize, y: point.y + halfSize },
      { x: point.x - halfSize, y: point.y + halfSize }
    ];
    
    // Find connected roads
    const connectedRoads = this.findConnectedRoads(point);
    
    // If not connected to any roads, don't create the square
    if (connectedRoads.length === 0) {
      return null;
    }
    
    const square: Square = {
      id: `square-${this.squares.length}`,
      polygon,
      centroid: point,
      area,
      type,
      connectedRoads
    };
    
    return square;
  }

  /**
   * Finds roads of a specific tier nearest to a point
   */
  private findNearestRoadByTier(point: Point, tier: RoadTier): Road | null {
    let nearestRoad: Road | null = null;
    let minDistance = Infinity;
    
    for (const road of this.roadNetwork.roads) {
      if (road.tier !== tier) continue;
      
      const distance = this.distanceToRoad(point, road);
      if (distance < minDistance) {
        minDistance = distance;
        nearestRoad = road;
      }
    }
    
    return nearestRoad;
  }

  /**
   * Calculates the distance from a point to a road
   */
  private distanceToRoad(point: Point, road: Road): number {
    return this.distanceToLineSegment(point, road.start, road.end);
  }

  /**
   * Calculates the distance from a point to a line segment
   */
  private distanceToLineSegment(point: Point, start: Point, end: Point): number {
    const lineLength = dist(start, end);
    
    if (lineLength === 0) return dist(point, start);
    
    const t = Math.max(0, Math.min(1, 
      ((point.x - start.x) * (end.x - start.x) + 
       (point.y - start.y) * (end.y - start.y)) / (lineLength * lineLength)
    ));
    
    const projection = {
      x: start.x + t * (end.x - start.x),
      y: start.y + t * (end.y - start.y)
    };
    
    return dist(point, projection);
  }

  /**
   * Finds roads that are connected to a point
   */
  private findConnectedRoads(point: Point): string[] {
    const connectedRoads: string[] = [];
    const threshold = 0.05; // Maximum distance to consider a road connected
    
    for (const road of this.roadNetwork.roads) {
      const distance = this.distanceToRoad(point, road);
      if (distance < threshold) {
        connectedRoads.push(road.id);
      }
    }
    
    return connectedRoads;
  }

  /**
   * Finds roads that connect to the outside of the city
   */
  private findExternalRoads(): Road[] {
    // Simplified: assume roads near the edges are external
    const externalRoads: Road[] = [];
    
    for (const road of this.roadNetwork.roads) {
      const midPoint = {
        x: (road.start.x + road.end.x) / 2,
        y: (road.start.y + road.end.y) / 2
      };
      
      // Check if road is near the edge of the city
      if (midPoint.x < 0.2 || midPoint.x > 0.8 || 
          midPoint.y < 0.2 || midPoint.y > 0.8) {
        externalRoads.push(road);
      }
    }
    
    return externalRoads;
  }

  /**
   * Finds a point along a road at a specific fraction of its length
   */
  private findPointAlongRoad(road: Road, fraction: number): Point {
    return {
      x: road.start.x + (road.end.x - road.start.x) * fraction,
      y: road.start.y + (road.end.y - road.start.y) * fraction
    };
  }

  /**
   * Gets all generated squares
   */
  public getSquares(): Square[] {
    return this.squares;
  }

  /**
   * Validates that squares are connected to arterial network
   */
  public validateSquareConnectivity(): boolean {
    for (const square of this.squares) {
      // Check if at least one connected road is arterial
      let hasArterialConnection = false;
      
      for (const roadId of square.connectedRoads) {
        const road = this.roadNetwork.roads.find(r => r.id === roadId);
        if (road && road.tier === 'arterial') {
          hasArterialConnection = true;
          break;
        }
      }
      
      if (!hasArterialConnection) {
        return false;
      }
    }
    
    return true;
  }
}

/**
 * Generates public squares for a city
 */
export function generatePublicSquares(city: City): Square[] {
  const generator = new SquareGenerator(city.roads, city.config);
  return generator.generateSquares();
}

/**
 * Checks if a square is connected to the arterial network
 */
export function isConnectedToNetwork(
  square: Square, 
  roadNetwork: RoadNetwork, 
  tier: RoadTier
): boolean {
  for (const roadId of square.connectedRoads) {
    const road = roadNetwork.roads.find(r => r.id === roadId);
    if (road && road.tier === tier) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generates a test city for testing
 */
export function generateCity(): City {
  // Create a simple test road network
  const roads: Road[] = [
    {
      id: 'road1',
      start: { x: 0.2, y: 0.5 },
      end: { x: 0.8, y: 0.5 },
      tier: 'arterial'
    },
    {
      id: 'road2',
      start: { x: 0.5, y: 0.2 },
      end: { x: 0.5, y: 0.8 },
      tier: 'arterial'
    },
    {
      id: 'road3',
      start: { x: 0.3, y: 0.3 },
      end: { x: 0.7, y: 0.7 },
      tier: 'collector'
    }
  ];

  return {
    roads: {
      roads,
      nodes: new Map(),
      edges: []
    },
    config: {
      minSquareArea: 0.01,
      maxSquareArea: 0.05,
      squareTypes: ['market', 'plaza', 'churchyard'],
      squarePlacementStrategy: 'distributed'
    }
  };
}