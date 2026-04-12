// @ts-nocheck
import { Point, dist, isPointInPolygon } from '../types';
import { RoadNetwork, Road } from '../roads/hierarchy';

export interface BlockEdge {
  id: string;
  start: Point;
  end: Point;
  blockId: string;
  adjacentRoadId?: string;
  frontageBuildings: string[]; // IDs of buildings that use this edge for frontage
}

export interface Block {
  id: string;
  polygon: Point[];
  edges: BlockEdge[];
  centroid: Point;
  area: number;
  buildings: string[]; // IDs of buildings in this block
}

export interface Building {
  id: string;
  centroid: Point;
  footprint: Point[];
  blockId: string;
  frontageEdgeId?: string;
}

/**
 * BlockGenerator class creates explicit block polygons from roads and maintains
 * block-edge information for building frontage.
 */
export class BlockGenerator {
  private roadNetwork: RoadNetwork;
  private blocks: Block[] = [];

  constructor(roadNetwork: RoadNetwork) {
    this.roadNetwork = roadNetwork;
  }

  /**
   * Generates blocks from the road network
   */
  public generateBlocks(): Block[] {
    this.blocks = [];
    
    // Create a graph from roads to find enclosed areas
    const roadGraph = this.createRoadGraph();
    
    // Find cycles in the graph which represent blocks
    const cycles = this.findCycles(roadGraph);
    
    // Convert cycles to block polygons
    for (const cycle of cycles) {
      const block = this.createBlockFromCycle(cycle);
      if (block && this.isValidBlock(block)) {
        this.blocks.push(block);
      }
    }

    return this.blocks;
  }

  /**
   * Creates a graph representation of the road network
   */
  private createRoadGraph(): Map<string, Point[]> {
    const graph = new Map<string, Point[]>();
    
    for (const road of this.roadNetwork.roads) {
      // Add start node
      if (!graph.has(this.pointToKey(road.start))) {
        graph.set(this.pointToKey(road.start), []);
      }
      
      // Add end node
      if (!graph.has(this.pointToKey(road.end))) {
        graph.set(this.pointToKey(road.end), []);
      }
      
      // Connect nodes
      graph.get(this.pointToKey(road.start))!.push(road.end);
      graph.get(this.pointToKey(road.end))!.push(road.start);
    }
    
    return graph;
  }

  /**
   * Converts a point to a string key for map lookup
   */
  private pointToKey(point: Point): string {
    return `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
  }

  /**
   * Converts a key string back to a Point
   */
  private keyToPoint(key: string): Point {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  }

  /**
   * Finds cycles in the road graph which represent potential blocks
   */
  private findCycles(graph: Map<string, Point[]>): Point[][] {
    const cycles: Point[][] = [];
    const visited = new Set<string>();
    
    for (const [nodeKey, neighbors] of graph.entries()) {
      if (visited.has(nodeKey)) continue;
      
      const node = this.keyToPoint(nodeKey);
      const cycle = this.dfsFindCycle(node, node, graph, new Set<string>(), []);
      
      if (cycle && cycle.length >= 3) {
        cycles.push(cycle);
        
        // Mark all nodes in the cycle as visited
        for (const point of cycle) {
          visited.add(this.pointToKey(point));
        }
      }
    }
    
    return cycles;
  }

  /**
   * Depth-first search to find cycles in the graph
   */
  private dfsFindCycle(
    current: Point, 
    start: Point, 
    graph: Map<string, Point[]>, 
    path: Set<string>, 
    currentPath: Point[]
  ): Point[] | null {
    const currentKey = this.pointToKey(current);
    
    if (path.has(currentKey)) {
      // Found a cycle
      if (this.pointsEqual(current, start) && currentPath.length >= 3) {
        return [...currentPath];
      }
      return null;
    }
    
    path.add(currentKey);
    currentPath.push(current);
    
    const neighbors = graph.get(currentKey) || [];
    for (const neighbor of neighbors) {
      const cycle = this.dfsFindCycle(neighbor, start, graph, path, currentPath);
      if (cycle) {
        return cycle;
      }
    }
    
    currentPath.pop();
    path.delete(currentKey);
    
    return null;
  }

  /**
   * Creates a block from a cycle of points
   */
  private createBlockFromCycle(cycle: Point[]): Block | null {
    if (cycle.length < 3) return null;
    
    const blockId = `block-${this.blocks.length}`;
    
    // Calculate centroid
    const centroid = this.calculateCentroid(cycle);
    
    // Calculate area
    const area = this.calculateArea(cycle);
    
    // Create edges
    const edges: BlockEdge[] = [];
    for (let i = 0; i < cycle.length; i++) {
      const start = cycle[i];
      const end = cycle[(i + 1) % cycle.length];
      
      const edge: BlockEdge = {
        id: `edge-${blockId}-${i}`,
        start,
        end,
        blockId,
        frontageBuildings: []
      };
      
      // Find adjacent road if any
      const adjacentRoad = this.findAdjacentRoad(start, end);
      if (adjacentRoad) {
        edge.adjacentRoadId = adjacentRoad.id;
      }
      
      edges.push(edge);
    }
    
    return {
      id: blockId,
      polygon: cycle,
      edges,
      centroid,
      area,
      buildings: []
    };
  }

  /**
   * Calculates the centroid of a polygon
   */
  private calculateCentroid(polygon: Point[]): Point {
    let x = 0;
    let y = 0;
    
    for (const point of polygon) {
      x += point.x;
      y += point.y;
    }
    
    return {
      x: x / polygon.length,
      y: y / polygon.length
    };
  }

  /**
   * Calculates the area of a polygon using the shoelace formula
   */
  private calculateArea(polygon: Point[]): number {
    let area = 0;
    
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    
    return Math.abs(area / 2);
  }

  /**
   * Finds a road that is adjacent to the given edge
   */
  private findAdjacentRoad(start: Point, end: Point): Road | null {
    for (const road of this.roadNetwork.roads) {
      if (this.edgesMatch(start, end, road.start, road.end)) {
        return road;
      }
    }
    
    return null;
  }

  /**
   * Checks if two edges match (regardless of direction)
   */
  private edgesMatch(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    return (this.pointsEqual(a1, b1) && this.pointsEqual(a2, b2)) ||
           (this.pointsEqual(a1, b2) && this.pointsEqual(a2, b1));
  }

  /**
   * Checks if two points are equal within a tolerance
   */
  private pointsEqual(p1: Point, p2: Point): boolean {
    return Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001;
  }

  /**
   * Validates if a block is valid (not too small, not self-intersecting)
   */
  private isValidBlock(block: Block): boolean {
    // Check minimum area
    if (block.area < 0.001) return false;
    
    // Check if polygon is simple (no self-intersections)
    if (!this.isSimplePolygon(block.polygon)) return false;
    
    return true;
  }

  /**
   * Checks if a polygon is simple (no self-intersections)
   */
  private isSimplePolygon(polygon: Point[]): boolean {
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const a1 = polygon[i];
      const a2 = polygon[(i + 1) % n];
      
      for (let j = i + 2; j < n; j++) {
        // Skip adjacent edges
        if (j === i || (j + 1) % n === i) continue;
        
        const b1 = polygon[j];
        const b2 = polygon[(j + 1) % n];
        
        if (this.doSegmentsIntersect(a1, a2, b1, b2)) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Checks if two line segments intersect
   */
  private doSegmentsIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    const r = { x: a2.x - a1.x, y: a2.y - a1.y };
    const s = { x: b2.x - b1.x, y: b2.y - b1.y };
    
    const denominator = r.x * s.y - r.y * s.x;
    
    if (Math.abs(denominator) < 0.0001) return false; // Parallel
    
    const t = ((b1.x - a1.x) * s.y - (b1.y - a1.y) * s.x) / denominator;
    const u = ((b1.x - a1.x) * r.y - (b1.y - a1.y) * r.x) / denominator;
    
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }

  /**
   * Finds the block that contains a given point
   */
  public findBlockContainingPoint(point: Point): Block | null {
    for (const block of this.blocks) {
      if (isPointInPolygon(point, block.polygon)) {
        return block;
      }
    }
    
    return null;
  }

  /**
   * Finds the nearest block edge to a given point
   */
  public findNearestBlockEdge(point: Point): BlockEdge | null {
    let nearestEdge: BlockEdge | null = null;
    let minDistance = Infinity;
    
    for (const block of this.blocks) {
      for (const edge of block.edges) {
        const distance = this.distanceToLineSegment(point, edge.start, edge.end);
        if (distance < minDistance) {
          minDistance = distance;
          nearestEdge = edge;
        }
      }
    }
    
    return nearestEdge;
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
   * Assigns a building to a block and finds its frontage edge
   */
  public assignBuildingToBlock(building: Building): void {
    // Find block containing building centroid
    const block = this.findBlockContainingPoint(building.centroid);
    
    if (!block) return;
    
    building.blockId = block.id;
    block.buildings.push(building.id);
    
    // Find nearest edge for frontage
    const nearestEdge = this.findNearestBlockEdge(building.centroid);
    
    if (nearestEdge && nearestEdge.blockId === block.id) {
      building.frontageEdgeId = nearestEdge.id;
      nearestEdge.frontageBuildings.push(building.id);
    }
  }

  /**
   * Gets all generated blocks
   */
  public getBlocks(): Block[] {
    return this.blocks;
  }

  /**
   * Gets a block by ID
   */
  public getBlockById(id: string): Block | null {
    return this.blocks.find(b => b.id === id) || null;
  }

  /**
   * Gets a block edge by ID
   */
  public getBlockEdgeById(id: string): BlockEdge | null {
    for (const block of this.blocks) {
      const edge = block.edges.find(e => e.id === id);
      if (edge) return edge;
    }
    
    return null;
  }
}

/**
 * Generates explicit block polygons from roads
 */
export function generateBlocksFromRoads(roadNetwork: RoadNetwork): Block[] {
  const generator = new BlockGenerator(roadNetwork);
  return generator.generateBlocks();
}

/**
 * Checks if a polygon is valid
 */
export function isValidPolygon(polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  
  // Check if polygon is simple (no self-intersections)
  const generator = new BlockGenerator({ roads: [], nodes: new Map(), edges: [] });
  return generator['isSimplePolygon'](polygon);
}