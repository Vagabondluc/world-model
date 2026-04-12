
import { HexData, SettlementType } from '../../types';
import { PseudoRandom } from '../noise';
import * as THREE from 'three';

export interface TownNode {
  id: number;
  x: number; // Normalized 0..1 relative to hex bounds
  y: number;
  type: 'HUB' | 'INTERSECTION' | 'BUILDING' | 'GATE';
  district: 'CENTER' | 'RESIDENTIAL' | 'INDUSTRIAL' | 'TRADE' | 'MILITARY' | 'SACRED';
  radius: number;
}

export interface TownEdge {
  from: number;
  to: number;
  width: number;
  type: 'MAIN' | 'LOCAL' | 'PATH';
}

export interface TownLayout {
  nodes: TownNode[];
  edges: TownEdge[];
  seed: number;
  populationEstimate: number;
}

export const generateTownLayout = (hex: HexData, seed: number): TownLayout => {
  const rng = new PseudoRandom(seed);
  const nodes: TownNode[] = [];
  const edges: TownEdge[] = [];
  let nextId = 0;

  const isCity = hex.settlementType === SettlementType.CITY || hex.settlementType === SettlementType.METROPOLIS;
  const sizeFactor = isCity ? 1.0 : 0.5;
  const centerRadius = isCity ? 0.15 : 0.08;

  // 1. Place Anchor (Town Center)
  // Prefer center, offset by noise to avoid grid look
  const cx = 0.5 + (rng.next() - 0.5) * 0.1;
  const cy = 0.5 + (rng.next() - 0.5) * 0.1;
  
  const centerNode: TownNode = {
    id: nextId++,
    x: cx,
    y: cy,
    type: 'HUB',
    district: 'CENTER',
    radius: centerRadius
  };
  nodes.push(centerNode);

  // 2. Main Arteries
  // Radiate outwards towards virtual neighbors (0, 60, 120 deg...)
  const arteryCount = 3 + Math.floor(rng.next() * 3); // 3 to 5 roads
  const arteryNodes: number[] = [0];

  for (let i = 0; i < arteryCount; i++) {
    const angle = (i / arteryCount) * Math.PI * 2 + (rng.next() * 0.5);
    const len = 0.35 + rng.next() * 0.1;
    
    const ex = cx + Math.cos(angle) * len;
    const ey = cy + Math.sin(angle) * len;
    
    const endNode: TownNode = {
      id: nextId++,
      x: ex,
      y: ey,
      type: 'GATE',
      district: 'TRADE',
      radius: 0.05
    };
    nodes.push(endNode);
    edges.push({ from: 0, to: endNode.id, width: 3, type: 'MAIN' });
    arteryNodes.push(endNode.id);
  }

  // 3. Grow Districts (L-System simplified)
  // For each artery edge, try to branch
  const districts = isCity 
    ? ['RESIDENTIAL', 'RESIDENTIAL', 'INDUSTRIAL', 'SACRED', 'MILITARY'] 
    : ['RESIDENTIAL', 'RESIDENTIAL', 'TRADE'];

  // Current nodes length might grow, capture static list for iteration
  const currentNodes = [...nodes];
  
  currentNodes.forEach(n => {
    if (n.id === 0) return; // Skip center logic for now
    
    // Branch count
    const branches = 1 + Math.floor(rng.next() * (isCity ? 4 : 2));
    
    for (let b = 0; b < branches; b++) {
      // Pick a district type for this cluster
      const district = districts[Math.floor(rng.next() * districts.length)] as TownNode['district'];
      
      // Random offset from the node
      const angle = rng.next() * Math.PI * 2;
      const dist = 0.05 + rng.next() * 0.1;
      
      const bx = n.x + Math.cos(angle) * dist;
      const by = n.y + Math.sin(angle) * dist;
      
      // Bounds check (0.1 to 0.9)
      if (bx < 0.1 || bx > 0.9 || by < 0.1 || by > 0.9) continue;

      const building: TownNode = {
        id: nextId++,
        x: bx,
        y: by,
        type: 'BUILDING',
        district,
        radius: 0.03 + rng.next() * 0.02
      };
      
      nodes.push(building);
      edges.push({ from: n.id, to: building.id, width: 1, type: 'LOCAL' });
    }
  });

  // 4. Fill in density (Buildings along edges)
  // Visualize as points
  
  return {
    nodes,
    edges,
    seed,
    populationEstimate: nodes.length * (isCity ? 1000 : 100)
  };
};
