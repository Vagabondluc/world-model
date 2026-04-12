// @ts-nocheck
import { CityModel } from '../../pipeline/generateCity';
import { Point } from '../types';

export interface PlacementStage {
  name: string;
  scaffoldRef: string;
  derivedFrom?: string;
  scaffoldCellCount?: number;
  scaffoldVerticesUsed?: number;
  scaffoldCellAssignments?: Map<string, number[]>;
  scaffoldCellPlacements?: Map<number, string[]>;
  scaffoldDrivenRatio?: number;
}

/**
 * Gets placement stage information for a city.
 */
export function getPlacementStage(city: CityModel, stageName: string): PlacementStage {
  const scaffoldRef = `scaffold-${city.seed}`;
  
  switch (stageName) {
    case 'wall':
      return {
        name: 'wall',
        scaffoldRef,
        derivedFrom: 'circumference',
        scaffoldCellCount: city.boundary.length,
      };
    
    case 'gate':
      return {
        name: 'gate',
        scaffoldRef,
        derivedFrom: 'boundary',
        scaffoldVerticesUsed: city.gates.length,
      };
    
    case 'district':
      const cellAssignments = new Map<string, number[]>();
      const districtGroups = new Map<string, number[]>();
      
      for (const assignment of city.assignments) {
        const parcel = city.parcels.find(p => p.id === assignment.parcelId);
        if (parcel) {
          const blockId = parcel.blockId;
          if (!districtGroups.has(assignment.type)) {
            districtGroups.set(assignment.type, []);
          }
          const cellId = parseInt(blockId.replace('b-', ''), 10);
          if (!isNaN(cellId)) {
            districtGroups.get(assignment.type)!.push(cellId);
          }
        }
      }
      
      for (const [type, cellIds] of districtGroups) {
        cellAssignments.set(type, [...new Set(cellIds)]);
      }
      
      return {
        name: 'district',
        scaffoldRef,
        scaffoldCellAssignments: cellAssignments,
      };
    
    case 'building':
      const cellPlacements = new Map<number, string[]>();
      
      for (const building of city.buildings) {
        // Find which scaffold cell this building belongs to
        const parcel = city.parcels.find(p => p.id === building.parcelId);
        if (parcel) {
          const blockId = parcel.blockId;
          const cellId = parseInt(blockId.replace('b-', ''), 10);
          if (!isNaN(cellId)) {
            if (!cellPlacements.has(cellId)) {
              cellPlacements.set(cellId, []);
            }
            cellPlacements.get(cellId)!.push(building.id);
          }
        }
      }
      
      const buildingsWithCells = city.buildings.filter(b => {
        const parcel = city.parcels.find(p => p.id === b.parcelId);
        return parcel && parcel.blockId.startsWith('b-');
      });
      
      return {
        name: 'building',
        scaffoldRef,
        scaffoldCellPlacements: cellPlacements,
        scaffoldDrivenRatio: city.buildings.length > 0 
          ? buildingsWithCells.length / city.buildings.length 
          : 1,
      };
    
    case 'road':
      return {
        name: 'road',
        scaffoldRef,
        derivedFrom: 'scaffold-topology',
      };
    
    case 'parcel':
      const parcelsWithCells = city.parcels.filter(p => p.blockId.startsWith('b-'));
      return {
        name: 'parcel',
        scaffoldRef,
        scaffoldDrivenRatio: city.parcels.length > 0
          ? parcelsWithCells.length / city.parcels.length
          : 1,
      };
    
    default:
      return {
        name: stageName,
        scaffoldRef,
      };
  }
}

/**
 * Computes the overall scaffold-driven placement ratio for a city.
 */
export function computeScaffoldDrivenPlacementRatio(city: CityModel): number {
  const stages = ['wall', 'gate', 'district', 'building', 'road', 'parcel'];
  let totalRatio = 0;
  let count = 0;
  
  for (const stageName of stages) {
    const stage = getPlacementStage(city, stageName);
    if (stage.scaffoldDrivenRatio !== undefined) {
      totalRatio += stage.scaffoldDrivenRatio;
      count++;
    } else if (stage.scaffoldRef) {
      // Stages with scaffold reference are considered scaffold-driven
      totalRatio += 1;
      count++;
    }
  }
  
  return count > 0 ? totalRatio / count : 1;
}
