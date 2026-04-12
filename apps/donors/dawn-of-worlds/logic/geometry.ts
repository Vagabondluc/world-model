
import { Hex, MapSize } from '../types';

export const sameHex = (a: Hex, b: Hex): boolean => a.q === b.q && a.r === b.r;

export const HEX_WIDTH = 120;
export const HEX_HEIGHT = 140;
export const X_OFFSET = HEX_WIDTH;
export const Y_OFFSET = HEX_HEIGHT * 0.75;

export const getHexPosition = (col: number, row: number) => {
  const xPos = col * X_OFFSET + (row % 2 === 1 ? X_OFFSET * 0.5 : 0);
  const yPos = row * Y_OFFSET;
  return { x: xPos, y: yPos };
};

export const getHexCorners = (col: number, row: number) => {
  const { x, y } = getHexPosition(col, row);
  const w = HEX_WIDTH;
  const h = HEX_HEIGHT;

  // Vertices based on CSS clip-path for pointy-topped hexes
  // 0: Top, 1: Top-Right, 2: Bottom-Right, 3: Bottom, 4: Bottom-Left, 5: Top-Left
  return [
    { x: x + w / 2, y: y },           // 0
    { x: x + w, y: y + h / 4 },   // 1
    { x: x + w, y: y + h * 0.75 },// 2
    { x: x + w / 2, y: y + h },       // 3
    { x: x, y: y + h * 0.75 },// 4
    { x: x, y: y + h / 4 }    // 5
  ];
};


export const hexToKey = (h: Hex): string => `${h.q},${h.r}`;

export const keyToHex = (key: string): Hex => {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
};

export const getNeighbors = (q: number, r: number): { q: number; r: number }[] => {
  // Odd-r offset coordinates neighbors
  const parity = r & 1;
  const directions = [
    // 0: Top Right
    parity ? { q: 1, r: -1 } : { q: 0, r: -1 },
    // 1: Right
    { q: 1, r: 0 },
    // 2: Bottom Right
    parity ? { q: 1, r: 1 } : { q: 0, r: 1 },
    // 3: Bottom Left
    parity ? { q: 0, r: 1 } : { q: -1, r: 1 },
    // 4: Left
    { q: -1, r: 0 },
    // 5: Top Left
    parity ? { q: 0, r: -1 } : { q: -1, r: -1 },
  ];

  return directions.map(d => ({ q: q + d.q, r: r + d.r }));
};

export const getEdgeKey = (h1: Hex, h2: Hex) => {
  const k1 = hexToKey(h1);
  const k2 = hexToKey(h2);
  return k1 < k2 ? `${k1}:${k2}` : `${k2}:${k1}`;
};

export const getMapDimensions = (size: MapSize) => {
  let cols = 30;
  let rows = 20;

  switch (size) {
    case 'SMALL': cols = 20; rows = 15; break;
    case 'GRAND': cols = 40; rows = 30; break;
    case 'STANDARD':
    default: cols = 30; rows = 20; break;
  }

  const width = cols * HEX_WIDTH + HEX_WIDTH * 0.5;
  const height = rows * (HEX_HEIGHT * 0.75) + HEX_HEIGHT * 0.25;

  return { cols, rows, width, height };
};
