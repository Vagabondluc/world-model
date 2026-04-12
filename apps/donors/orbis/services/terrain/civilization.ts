
import { HexData, SettlementType } from '../../types';
import { PseudoRandom } from '../noise';

export const simulateCivilization = (hexes: HexData[], seed: number) => {
  const growthRng = new PseudoRandom(seed + 555);
  const CAPITALS_COUNT = 8;
  const growthIterations = 4;
  const validSites = hexes.filter(h => h.habitabilityScore > 0.6);
  
  if (validSites.length > 0) {
    for (let i = 0; i < CAPITALS_COUNT; i++) {
       const site = validSites[Math.floor(growthRng.next() * validSites.length)];
       site.settlementType = SettlementType.CITY;
    }
  }
  
  const hexMap = new Map(hexes.map(h => [h.id, h]));
  for (let it = 0; it < growthIterations; it++) {
    const currentSettled = hexes.filter(h => h.settlementType !== SettlementType.NONE);
    currentSettled.forEach(h => {
       h.neighbors.forEach(nid => {
          const neighbor = hexMap.get(nid);
          if (neighbor && neighbor.settlementType === SettlementType.NONE) {
             const spreadProb = neighbor.habitabilityScore * 0.3;
             if (growthRng.next() < spreadProb) {
                neighbor.settlementType = SettlementType.VILLAGE;
             }
          } else if (neighbor && neighbor.settlementType === SettlementType.VILLAGE) {
             const upgradeProb = neighbor.habitabilityScore * 0.15;
             if (growthRng.next() < upgradeProb) {
                neighbor.settlementType = SettlementType.CITY;
             }
          }
       });
    });
  }
};
