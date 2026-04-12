// @ts-nocheck
import { DistrictAssignment } from '../districts/assign';
import { Parcel } from '../parcels/subdivide';
import { PRNG } from '../seed/prng';
import { Point, dist } from '../types';

export interface Poi {
  id: number;
  name: string;
  point: Point;
}

const POI_NAMES = [
  'Fortress',
  'Fish Crown',
  'Temple of Ash',
  'Old Market',
  'Stone Bridge',
  'Scribes Hall',
  'South Gate Inn',
  'Bronze Court',
  'Moon Well',
  'Raven Tower',
];

export function placePois(
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  rng: PRNG,
  count = 10,
): Poi[] {
  const candidates = parcels
    .filter((p) => {
      const type = assignments.find((a) => a.parcelId === p.id)?.type;
      return type && type !== 'rural';
    })
    .map((p) => ({ parcel: p, point: centroid(p.polygon) }));

  if (candidates.length === 0) return [];

  // Deterministic shuffle
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const pois: Poi[] = [];
  for (const candidate of candidates) {
    if (pois.length >= count) break;
    if (pois.some((p) => dist(p.point, candidate.point) < 0.05)) continue;
    pois.push({
      id: pois.length + 1,
      name: POI_NAMES[pois.length % POI_NAMES.length],
      point: candidate.point,
    });
  }

  let i = 0;
  while (pois.length < Math.min(count, POI_NAMES.length) && i < candidates.length) {
    const c = candidates[i++];
    if (pois.some((p) => p.point.x === c.point.x && p.point.y === c.point.y)) continue;
    pois.push({
      id: pois.length + 1,
      name: POI_NAMES[pois.length % POI_NAMES.length],
      point: c.point,
    });
  }

  return pois;
}

function centroid(poly: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}
