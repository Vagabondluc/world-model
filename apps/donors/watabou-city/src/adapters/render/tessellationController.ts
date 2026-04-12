// @ts-nocheck
/**
 * Tessellation Controller - CRC-A4-027
 * 
 * Controls tessellation overlay visibility, ensuring full tessellation
 * overlays are suppressed unless explicitly enabled.
 * 
 * Acceptance Criteria:
 * - Tessellation overlays are not rendered by default
 * - Tessellation is only visible when explicitly enabled
 * - Debug visualization respects configuration settings
 */

import { Point } from '../../domain/types';

export interface TessellationConfig {
  showTessellation: boolean;
  showVoronoiCells: boolean;
  showDebugGrid: boolean;
  showScaffold: boolean;
  tessellationOpacity: number;
  tessellationColor: string;
}

export const DEFAULT_TESSELLATION_CONFIG: TessellationConfig = {
  showTessellation: false,
  showVoronoiCells: false,
  showDebugGrid: false,
  showScaffold: false,
  tessellationOpacity: 0.3,
  tessellationColor: '#888888'
};

export interface TessellationElement {
  type: 'cell' | 'edge' | 'vertex' | 'grid';
  points: Point[];
  visible: boolean;
}

export interface RenderOutput {
  elements: TessellationElement[];
  containsTessellationOverlay: boolean;
  containsVoronoiCells: boolean;
  containsDebugGrid: boolean;
  containsScaffold: boolean;
  tessellationElements: TessellationElement[];
}

export class TessellationController {
  private config: TessellationConfig;
  private elements: TessellationElement[];
  
  constructor(config?: Partial<TessellationConfig>) {
    this.config = { ...DEFAULT_TESSELLATION_CONFIG, ...config };
    this.elements = [];
  }
  
  /**
   * Gets the current tessellation configuration.
   */
  getConfig(): TessellationConfig {
    return { ...this.config };
  }
  
  /**
   * Updates the tessellation configuration.
   */
  setConfig(config: Partial<TessellationConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Toggles tessellation overlay visibility.
   */
  toggleTessellationVisibility(): boolean {
    this.config.showTessellation = !this.config.showTessellation;
    return this.config.showTessellation;
  }
  
  /**
   * Sets tessellation visibility explicitly.
   */
  setTessellationVisibility(visible: boolean): void {
    this.config.showTessellation = visible;
  }
  
  /**
   * Checks if tessellation should be rendered.
   */
  shouldRenderTessellation(): boolean {
    return this.config.showTessellation;
  }
  
  /**
   * Checks if Voronoi cells should be rendered.
   */
  shouldRenderVoronoiCells(): boolean {
    return this.config.showVoronoiCells;
  }
  
  /**
   * Checks if debug grid should be rendered.
   */
  shouldRenderDebugGrid(): boolean {
    return this.config.showDebugGrid;
  }
  
  /**
   * Checks if scaffold should be rendered.
   */
  shouldRenderScaffold(): boolean {
    return this.config.showScaffold;
  }
  
  /**
   * Adds tessellation elements for rendering.
   */
  addElements(elements: TessellationElement[]): void {
    this.elements.push(...elements);
  }
  
  /**
   * Clears all tessellation elements.
   */
  clearElements(): void {
    this.elements = [];
  }
  
  /**
   * Gets visible tessellation elements based on configuration.
   */
  getVisibleElements(): TessellationElement[] {
    const visible: TessellationElement[] = [];
    
    if (this.config.showTessellation || this.config.showVoronoiCells) {
      visible.push(...this.elements.filter(e => e.type === 'cell' || e.type === 'edge'));
    }
    
    if (this.config.showDebugGrid) {
      visible.push(...this.elements.filter(e => e.type === 'grid'));
    }
    
    return visible;
  }
  
  /**
   * Generates render output with tessellation visibility applied.
   */
  generateRenderOutput(): RenderOutput {
    const tessellationElements = this.getVisibleElements();
    
    return {
      elements: this.elements,
      containsTessellationOverlay: this.config.showTessellation && tessellationElements.length > 0,
      containsVoronoiCells: this.config.showVoronoiCells && this.elements.some(e => e.type === 'cell'),
      containsDebugGrid: this.config.showDebugGrid && this.elements.some(e => e.type === 'grid'),
      containsScaffold: this.config.showScaffold && this.elements.some(e => e.type === 'vertex'),
      tessellationElements
    };
  }
  
  /**
   * Creates Voronoi cell elements from tessellation data.
   */
  createVoronoiCells(cells: Point[][]): TessellationElement[] {
    return cells.map(polygon => ({
      type: 'cell' as const,
      points: polygon,
      visible: this.config.showVoronoiCells
    }));
  }
  
  /**
   * Creates debug grid elements.
   */
  createDebugGrid(width: number, height: number, cellSize: number): TessellationElement[] {
    const elements: TessellationElement[] = [];
    
    // Vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      elements.push({
        type: 'grid',
        points: [{ x, y: 0 }, { x, y: height }],
        visible: this.config.showDebugGrid
      });
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      elements.push({
        type: 'grid',
        points: [{ x: 0, y }, { x: width, y }],
        visible: this.config.showDebugGrid
      });
    }
    
    return elements;
  }
}

/**
 * Renders a city with tessellation settings applied.
 */
export function renderCity(city: any): RenderOutput {
  const config: TessellationConfig = {
    showTessellation: city.config?.showTessellation ?? false,
    showVoronoiCells: city.config?.showVoronoiCells ?? false,
    showDebugGrid: city.config?.showDebugGrid ?? false,
    showScaffold: city.config?.showScaffold ?? false,
    tessellationOpacity: city.config?.tessellationOpacity ?? 0.3,
    tessellationColor: city.config?.tessellationColor ?? '#888888'
  };
  
  const controller = new TessellationController(config);
  
  // Add tessellation elements if available
  if (city.tessellationCells) {
    controller.addElements(controller.createVoronoiCells(city.tessellationCells));
  }
  
  return controller.generateRenderOutput();
}

/**
 * Analyzes render output for tessellation content.
 */
export function analyzeRenderOutput(output: RenderOutput): {
  hasTessellation: boolean;
  tessellationCount: number;
  types: string[];
} {
  return {
    hasTessellation: output.containsTessellationOverlay,
    tessellationCount: output.tessellationElements.length,
    types: [...new Set(output.tessellationElements.map(e => e.type))]
  };
}

/**
 * Generates a test city with debug tessellation disabled.
 */
export function generateCityWithDebugTessellationDisabled(): any {
  return {
    config: {
      showTessellation: false,
      showVoronoiCells: false,
      showDebugGrid: false,
      showScaffold: false
    },
    tessellationCells: [
      [{ x: 0.1, y: 0.1 }, { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.2 }, { x: 0.1, y: 0.2 }],
      [{ x: 0.2, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.2 }, { x: 0.2, y: 0.2 }],
    ]
  };
}

/**
 * Generates a test city with debug tessellation enabled.
 */
export function generateCityWithDebugTessellationEnabled(): any {
  return {
    config: {
      showTessellation: true,
      showVoronoiCells: true,
      showDebugGrid: true,
      showScaffold: true
    },
    tessellationCells: [
      [{ x: 0.1, y: 0.1 }, { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.2 }, { x: 0.1, y: 0.2 }],
      [{ x: 0.2, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.2 }, { x: 0.2, y: 0.2 }],
    ]
  };
}
