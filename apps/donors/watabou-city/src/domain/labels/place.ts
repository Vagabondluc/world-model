// @ts-nocheck
import { DistrictAssignment, DistrictType } from '../districts/assign';
import { Parcel } from '../parcels/subdivide';
import { Point } from '../types';

export interface Label {
  text: string;
  point: Point;
}

/**
 * Places labels for districts.
 */
export function placeLabels(parcels: Parcel[], assignments: DistrictAssignment[]): Label[] {
  const labels: Label[] = [];
  
  const types: DistrictType[] = ['commercial', 'industrial', 'park', 'rural'];
  
  types.forEach(type => {
    const typeParcels = parcels.filter(p => assignments.find(a => a.parcelId === p.id)?.type === type);
    if (typeParcels.length > 0) {
      const p = typeParcels[Math.floor(typeParcels.length / 2)];
      const centroid = p.polygon.reduce((acc, pt) => ({ x: acc.x + pt.x / p.polygon.length, y: acc.y + pt.y / p.polygon.length }), { x: 0, y: 0 });
      
      labels.push({
        text: type.toUpperCase(),
        point: centroid,
      });
    }
  });

  return labels;
}

