export interface Point {
  x: number;
  y: number;
}

export interface Door {
  position: Point;
  direction: 'north' | 'south' | 'east' | 'west';
}

export type RoomType = 'normal' | 'entrance' | 'boss' | 'treasure';

export interface Room {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  doors: Door[];
  type: RoomType;
  label?: string;
}

export interface Corridor {
  points: Point[];
  width: number;
}

export interface DungeonMap {
  rooms: Room[];
  corridors: Corridor[];
  width: number;
  height: number;
  seed: number;
}

export interface GenerationConfig {
  mapWidth: number;
  mapHeight: number;
  roomCount: number;
  roomSizeMin: number;
  roomSizeMax: number;
  corridorWidth: number;
  seed: number | null;
}

export const DEFAULT_CONFIG: GenerationConfig = {
  mapWidth: 80,
  mapHeight: 60,
  roomCount: 12,
  roomSizeMin: 4,
  roomSizeMax: 12,
  corridorWidth: 2,
  seed: null,
};

export interface ViewState {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export interface RenderConfig {
  cellSize: number;
  showGrid: boolean;
  showLabels: boolean;
  showDoors: boolean;
}

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  cellSize: 16,
  showGrid: true,
  showLabels: true,
  showDoors: true,
};
