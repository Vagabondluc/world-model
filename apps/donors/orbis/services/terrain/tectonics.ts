
import * as THREE from 'three';
import { PlateType } from '../../types';
import { PseudoRandom, fbm3D } from '../noise';
import { HexGeometry } from './topology';

export interface Plate {
  id: number;
  center: THREE.Vector3;
  initialCenter: THREE.Vector3; // For resetting
  type: PlateType;
  rotationAxis: THREE.Vector3;
  angularSpeed: number;
  driftDirection: THREE.Vector3;
}

export const generatePlates = (count: number, seed: number, isSupercontinent: boolean = false): Plate[] => {
  const rng = new PseudoRandom(seed);
  const plates: Plate[] = [];
  
  // Pick a random "Supercontinent Center" on the sphere
  const scTheta = 2 * Math.PI * rng.next();
  const scPhi = Math.acos(2 * rng.next() - 1);
  const superContinentCenter = new THREE.Vector3(
    Math.sin(scPhi) * Math.cos(scTheta),
    Math.sin(scPhi) * Math.sin(scTheta),
    Math.cos(scPhi)
  );

  for (let i = 0; i < count; i++) {
    let center = new THREE.Vector3();
    
    if (isSupercontinent) {
      // Cluster generation: Place plates mostly within a hemisphere of the SC center
      // Use Gaussian-like distribution around SC center
      const spread = 1.5; // Radius of supercontinent
      
      // Rejection sampling for clustering
      let valid = false;
      let attempts = 0;
      while (!valid && attempts < 50) {
        const u = rng.next();
        const v = rng.next();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        center.set(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        );
        
        const dist = center.distanceTo(superContinentCenter);
        // Higher probability if closer to center
        if (rng.next() > (dist / spread)) {
          valid = true;
        }
        attempts++;
      }
    } else {
      // Standard Uniform Distribution
      const u = rng.next();
      const v = rng.next();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      center.set(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
    }

    // Determine Type
    let isContinental = false;
    if (isSupercontinent) {
      // In Pangea mode, plates close to center are Continental
      const distToSC = center.distanceTo(superContinentCenter);
      isContinental = distToSC < 1.0; 
    } else {
      // Random scattering
      const distToSC = center.distanceTo(superContinentCenter);
      isContinental = distToSC < 1.2 ? rng.next() > 0.2 : rng.next() > 0.85;
    }

    const type = isContinental ? PlateType.CONTINENTAL : PlateType.OCEANIC;

    // Kinematics: Drift vectors
    // If supercontinent, drift is strictly AWAY from center to simulate breakup
    let driftDirection = new THREE.Vector3();
    
    if (isSupercontinent && type === PlateType.CONTINENTAL) {
       driftDirection.subVectors(center, superContinentCenter).normalize();
       // Add slight chaos
       driftDirection.x += (rng.next() - 0.5) * 0.2;
       driftDirection.y += (rng.next() - 0.5) * 0.2;
       driftDirection.z += (rng.next() - 0.5) * 0.2;
       driftDirection.normalize();
    } else if (type === PlateType.CONTINENTAL) {
       // Random drift for standard mode
       driftDirection.subVectors(center, superContinentCenter).normalize();
       driftDirection.addScalar((rng.next() - 0.5));
       driftDirection.normalize();
    } else {
       // Ocean plates move randomly
       driftDirection.set(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5).normalize();
    }

    const rotationAxis = new THREE.Vector3().crossVectors(center, driftDirection).normalize();
    // Supercontinent breakup is violent/fast initially
    const angularSpeed = (rng.next() * 0.02) + (isSupercontinent ? 0.01 : 0.005);

    plates.push({ 
      id: i, 
      center, 
      initialCenter: center.clone(), 
      type, 
      rotationAxis, 
      angularSpeed, 
      driftDirection 
    });
  }
  return plates;
};

// Re-computes plate assignment based on current (potentially drifted) plate centers
export const assignPlates = (grid: HexGeometry[], plates: Plate[], seed: number) => {
  const hexPlateData = new Int8Array(grid.length);
  const hexVelocities = new Array(grid.length);

  grid.forEach((hex, idx) => {
    const [x, y, z] = hex.center;
    // Domain warp lookup to make boundaries jagged
    const warpScale = 2.0;
    const warpStrength = 0.4;
    
    const wx = x + fbm3D(x, y, z, 2, 0.5, 2.0, warpScale, seed) * warpStrength;
    const wy = y + fbm3D(x, y, z, 2, 0.5, 2.0, warpScale, seed + 100) * warpStrength;
    const wz = z + fbm3D(x, y, z, 2, 0.5, 2.0, warpScale, seed + 200) * warpStrength;
    const lookupPos = new THREE.Vector3(wx, wy, wz).normalize();

    let minDist = Infinity;
    let plateId = 0;

    // Voronoi Lookup
    plates.forEach((plate, pIdx) => {
      const d = plate.center.distanceTo(lookupPos);
      if (d < minDist) {
        minDist = d;
        plateId = pIdx;
      }
    });

    hexPlateData[idx] = plateId;

    const plate = plates[plateId];
    const hexPos = new THREE.Vector3(...hex.center);
    const velocity = new THREE.Vector3()
      .crossVectors(plate.rotationAxis, hexPos)
      .multiplyScalar(plate.angularSpeed);
    
    hexVelocities[idx] = velocity;
  });

  return { hexPlateData, hexVelocities };
};

export const calculateStress = (grid: HexGeometry[], hexPlateData: Int8Array, hexVelocities: THREE.Vector3[]) => {
  const tectonicStresses = new Float32Array(grid.length);
  const isBoundary = new Uint8Array(grid.length);

  grid.forEach((geo, idx) => {
    const plateId = hexPlateData[idx];
    const velocity = hexVelocities[idx];
    
    let maxStress = 0;
    let boundary = false;

    for (const nid of geo.neighborIndices) {
      const neighborPlateId = hexPlateData[nid];
      
      if (neighborPlateId !== plateId) {
        boundary = true;
        const neighborVelocity = hexVelocities[nid];
        const relVel = velocity.clone().sub(neighborVelocity);
        
        const neighborCenter = new THREE.Vector3(...grid[nid].center);
        const myCenter = new THREE.Vector3(...geo.center);
        const boundaryNormal = neighborCenter.sub(myCenter).normalize();
        
        const stress = relVel.dot(boundaryNormal);
        
        if (Math.abs(stress) > Math.abs(maxStress)) {
          maxStress = stress;
        }
      }
    }
    
    isBoundary[idx] = boundary ? 1 : 0;
    tectonicStresses[idx] = boundary ? maxStress * 20.0 : 0; 
  });

  return { tectonicStresses, isBoundary };
};

// Simulation Kernel: Rotate plates over time
export const driftPlates = (plates: Plate[], timeDelta: number) => {
  plates.forEach(p => {
    const angle = p.angularSpeed * timeDelta * 0.5; // Scale down for control
    p.center.applyAxisAngle(p.rotationAxis, angle);
    p.center.normalize(); // Prevent drift from unit sphere
  });
};
