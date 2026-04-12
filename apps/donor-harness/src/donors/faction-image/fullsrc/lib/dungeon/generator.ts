import type { DungeonMap, Room, Corridor, GenerationConfig, Door, Point } from './types';

// Seeded PRNG (mulberry32)
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface BSPNode {
  x: number;
  y: number;
  w: number;
  h: number;
  left?: BSPNode;
  right?: BSPNode;
  room?: Room;
}

function splitBSP(
  node: BSPNode,
  depth: number,
  rng: () => number,
  minSize: number
): void {
  if (depth <= 0 || node.w < minSize * 2 + 3 || node.h < minSize * 2 + 3) return;

  const splitH = node.w > node.h ? false : node.h > node.w ? true : rng() > 0.5;
  
  if (splitH) {
    const split = Math.floor(node.h * (0.35 + rng() * 0.3));
    if (split < minSize + 2 || node.h - split < minSize + 2) return;
    node.left = { x: node.x, y: node.y, w: node.w, h: split };
    node.right = { x: node.x, y: node.y + split, w: node.w, h: node.h - split };
  } else {
    const split = Math.floor(node.w * (0.35 + rng() * 0.3));
    if (split < minSize + 2 || node.w - split < minSize + 2) return;
    node.left = { x: node.x, y: node.y, w: split, h: node.h };
    node.right = { x: node.x + split, y: node.y, w: node.w - split, h: node.h };
  }

  splitBSP(node.left, depth - 1, rng, minSize);
  splitBSP(node.right, depth - 1, rng, minSize);
}

function placeRooms(
  node: BSPNode,
  rng: () => number,
  minSize: number,
  maxSize: number,
  rooms: Room[],
  idCounter: { v: number }
): void {
  if (node.left && node.right) {
    placeRooms(node.left, rng, minSize, maxSize, rooms, idCounter);
    placeRooms(node.right, rng, minSize, maxSize, rooms, idCounter);
    return;
  }

  const maxW = Math.min(maxSize, node.w - 2);
  const maxH = Math.min(maxSize, node.h - 2);
  if (maxW < minSize || maxH < minSize) return;

  const w = Math.floor(minSize + rng() * (maxW - minSize + 1));
  const h = Math.floor(minSize + rng() * (maxH - minSize + 1));
  const x = node.x + 1 + Math.floor(rng() * (node.w - w - 2));
  const y = node.y + 1 + Math.floor(rng() * (node.h - h - 2));

  const room: Room = {
    id: idCounter.v++,
    x, y,
    width: w,
    height: h,
    doors: [],
    type: 'normal',
  };
  node.room = room;
  rooms.push(room);
}

function getLeafRooms(node: BSPNode): Room[] {
  if (node.room) return [node.room];
  const rooms: Room[] = [];
  if (node.left) rooms.push(...getLeafRooms(node.left));
  if (node.right) rooms.push(...getLeafRooms(node.right));
  return rooms;
}

function roomCenter(room: Room): Point {
  return {
    x: Math.floor(room.x + room.width / 2),
    y: Math.floor(room.y + room.height / 2),
  };
}

function connectRooms(node: BSPNode, corridorWidth: number, rng: () => number): Corridor[] {
  if (!node.left || !node.right) return [];

  const corridors: Corridor[] = [];
  corridors.push(...connectRooms(node.left, corridorWidth, rng));
  corridors.push(...connectRooms(node.right, corridorWidth, rng));

  const leftRooms = getLeafRooms(node.left);
  const rightRooms = getLeafRooms(node.right);

  if (leftRooms.length === 0 || rightRooms.length === 0) return corridors;

  // Find closest pair
  let bestDist = Infinity;
  let bestL = leftRooms[0];
  let bestR = rightRooms[0];

  for (const l of leftRooms) {
    for (const r of rightRooms) {
      const cl = roomCenter(l);
      const cr = roomCenter(r);
      const dist = Math.abs(cl.x - cr.x) + Math.abs(cl.y - cr.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestL = l;
        bestR = r;
      }
    }
  }

  const start = roomCenter(bestL);
  const end = roomCenter(bestR);

  // L-shaped corridor
  const mid: Point = rng() > 0.5
    ? { x: end.x, y: start.y }
    : { x: start.x, y: end.y };

  corridors.push({
    points: [start, mid, end],
    width: corridorWidth,
  });

  return corridors;
}

function addDoors(rooms: Room[], corridors: Corridor[]): void {
  for (const room of rooms) {
    room.doors = [];
    for (const corridor of corridors) {
      for (const pt of corridor.points) {
        // Check if corridor point touches room edge
        if (
          pt.x >= room.x && pt.x < room.x + room.width &&
          pt.y >= room.y && pt.y < room.y + room.height
        ) {
          let dir: Door['direction'] = 'north';
          if (pt.y === room.y) dir = 'north';
          else if (pt.y === room.y + room.height - 1) dir = 'south';
          else if (pt.x === room.x) dir = 'west';
          else if (pt.x === room.x + room.width - 1) dir = 'east';

          // Avoid duplicates near same spot
          const hasDoorNearby = room.doors.some(
            d => Math.abs(d.position.x - pt.x) + Math.abs(d.position.y - pt.y) < 2
          );
          if (!hasDoorNearby) {
            room.doors.push({ position: { x: pt.x, y: pt.y }, direction: dir });
          }
        }
      }
    }
  }
}

export function generateDungeon(config: GenerationConfig): DungeonMap {
  const seed = config.seed ?? Math.floor(Math.random() * 2147483647);
  const rng = createRng(seed);

  // BSP depth based on room count
  const depth = Math.ceil(Math.log2(config.roomCount + 1));

  const root: BSPNode = { x: 0, y: 0, w: config.mapWidth, h: config.mapHeight };
  splitBSP(root, depth, rng, config.roomSizeMin);

  const rooms: Room[] = [];
  const idCounter = { v: 1 };
  placeRooms(root, rng, config.roomSizeMin, config.roomSizeMax, rooms, idCounter);

  // Trim to desired room count
  while (rooms.length > config.roomCount) {
    rooms.pop();
  }

  // Assign special room types
  if (rooms.length > 0) {
    rooms[0].type = 'entrance';
    rooms[0].label = 'Entrance';
  }
  if (rooms.length > 1) {
    rooms[rooms.length - 1].type = 'boss';
    rooms[rooms.length - 1].label = 'Boss';
  }
  if (rooms.length > 2) {
    const treasureIdx = Math.floor(rng() * (rooms.length - 2)) + 1;
    rooms[treasureIdx].type = 'treasure';
    rooms[treasureIdx].label = 'Treasure';
  }

  const corridors = connectRooms(root, config.corridorWidth, rng);
  addDoors(rooms, corridors);

  return {
    rooms,
    corridors,
    width: config.mapWidth,
    height: config.mapHeight,
    seed,
  };
}
