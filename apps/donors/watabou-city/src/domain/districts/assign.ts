// @ts-nocheck
import { Parcel } from '../parcels/subdivide';
import { PRNG } from '../seed/prng';
import { Point, dist } from '../types';
import { River, distanceToRiver } from '../terrain/river';

export type DistrictType = 'residential' | 'commercial' | 'industrial' | 'park' | 'rural' | 'residential-high' | 'residential-mid' | 'elite' | 'religious' | 'military';

export interface DistrictAssignment {
  parcelId: string;
  type: DistrictType;
}

/**
 * Assigns district types to parcels based on distance to hub and noise.
 */
export function assignDistricts(parcels: Parcel[], hub: Point, river: River, rng: PRNG): DistrictAssignment[] {
  const outerRingTypes: DistrictType[] = [
    'rural',
    'residential-high',
    'residential-mid',
    'elite',
    'religious',
    'military',
  ];

  return parcels.map(p => {
    // Calculate centroid
    const centroid = p.polygon.reduce((acc, pt) => ({ x: acc.x + pt.x / p.polygon.length, y: acc.y + pt.y / p.polygon.length }), { x: 0, y: 0 });
    const d = dist(centroid, hub);
    const dRiver = distanceToRiver(centroid, river);
    
    let type: DistrictType = 'residential';
    if (dRiver < 0.03) type = rng.bernoulli(0.75) ? 'park' : 'commercial';
    else if (d < 0.06 && rng.bernoulli(0.5)) type = 'park';
    else if (d < 0.12) type = 'commercial';
    else if (d > 0.33) type = outerRingTypes[rng.nextInt(0, outerRingTypes.length)];
    else if (d > 0.26 && rng.bernoulli(0.28)) type = 'park';
    else if (d > 0.2 && rng.bernoulli(0.22)) type = 'industrial';
    else if (rng.bernoulli(0.14)) type = 'park';

    return {
      parcelId: p.id,
      type,
    };
  });
}


