
import * as THREE from 'three';
import { HexData, TerrainConfig, AirMassType, FrontType } from '../../types';

export const calculateAtmosphere = (hexes: HexData[], config: TerrainConfig, seed: number) => {
  const hexMap = new Map(hexes.map(h => [h.id, h]));
  
  // 1. Density and Initial Pressure
  hexes.forEach(h => {
    const T = (h.biomeData.temperature + 273.15) / 300; // Normalized Temp (Kelvin-ish)
    const M = h.biomeData.moisture;
    
    // Density rho is inversely proportional to Temp, and decreased by Moisture
    const density = (1.0 / T) * (1.0 - 0.3 * M);
    
    // Pressure P depends on density and altitude
    // High density (cold) = High Pressure, High altitude = Low Pressure
    const pressure = 1.0 * density - (h.biomeData.height * 0.2);
    
    let airMassType: AirMassType;
    if (h.biomeData.temperature < 10) {
      airMassType = h.biomeData.moisture > 0.4 ? AirMassType.MP : AirMassType.CP;
    } else {
      airMassType = h.biomeData.moisture > 0.4 ? AirMassType.MT : AirMassType.CT;
    }

    h.atmosphere = {
      density,
      pressure,
      airMassType,
      windVector: [0, 0, 0],
      frontType: FrontType.NONE,
      stormIntensity: 0
    };
  });

  // 2. Wind Vectors (Gradient + Coriolis)
  hexes.forEach(h => {
    const pressureGradient = new THREE.Vector3(0, 0, 0);
    const hPos = new THREE.Vector3(...h.center);
    const hPress = h.atmosphere!.pressure;

    h.neighbors.forEach(nid => {
      const nb = hexMap.get(nid);
      if (nb) {
        const nbPos = new THREE.Vector3(...nb.center);
        const nbPress = nb.atmosphere!.pressure;
        const dist = hPos.distanceTo(nbPos);
        const diff = (hPress - nbPress) / dist;
        const dir = nbPos.clone().sub(hPos).normalize();
        pressureGradient.add(dir.multiplyScalar(diff));
      }
    });

    // Wind flows FROM high TO low pressure
    const wind = pressureGradient.clone().multiplyScalar(-1);
    
    // Apply Coriolis Deflection (Rotate vector based on latitude)
    // Rotation direction: Clockwise in North (Y > 0), Counter-clockwise in South (Y < 0)
    const lat = h.center[1]; // Y is roughly latitude on our sphere
    const deflectionAngle = lat * (Math.PI / 4); // Max 45 degrees
    const normal = hPos.clone().normalize();
    wind.applyAxisAngle(normal, deflectionAngle);

    h.atmosphere!.windVector = wind.toArray() as [number, number, number];
  });

  // 3. Front Detection
  hexes.forEach(h => {
    let maxDensityDiff = 0;
    let frontType = FrontType.NONE;
    let stormIntensity = 0;

    const hDens = h.atmosphere!.density;
    const hWind = new THREE.Vector3(...h.atmosphere!.windVector);

    h.neighbors.forEach(nid => {
      const nb = hexMap.get(nid);
      if (nb) {
        const nbDens = nb.atmosphere!.density;
        const diff = Math.abs(hDens - nbDens);
        
        if (diff > 0.15) { // Significant density boundary
          const boundaryVec = new THREE.Vector3(...nb.center).sub(new THREE.Vector3(...h.center)).normalize();
          const relativeVel = hWind.dot(boundaryVec); // Speed component pushing into boundary

          if (diff > maxDensityDiff) {
            maxDensityDiff = diff;
            // If the Cold (more dense) air is pushing into Warm air
            if (hDens > nbDens && relativeVel > 0.05) {
              frontType = FrontType.COLD;
              stormIntensity = Math.min(1.0, diff * 3 * relativeVel);
            } 
            // If the Warm (less dense) air is pushing over Cold air
            else if (hDens < nbDens && relativeVel > 0.05) {
              frontType = FrontType.WARM;
              stormIntensity = Math.min(1.0, diff * 2 * relativeVel);
            }
          }
        }
      }
    });
    
    h.atmosphere!.frontType = frontType;
    h.atmosphere!.stormIntensity = stormIntensity;
  });
};
