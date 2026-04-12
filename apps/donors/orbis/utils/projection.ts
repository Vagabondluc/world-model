
import * as THREE from 'three';
import { HexData } from '../types';
import { MapProjection } from '../stores/useUIStore';

// Constants for Projections
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1000;

// Newton-Raphson solver for Mollweide auxiliary angle theta
// 2theta + sin(2theta) = pi * sin(lat)
const solveMollweideTheta = (lat: number): number => {
  const target = Math.PI * Math.sin(lat);
  let theta = lat; // Initial guess
  
  // 5 iterations is usually plenty for display precision
  for (let i = 0; i < 5; i++) {
    const num = 2 * theta + Math.sin(2 * theta) - target;
    const den = 2 + 2 * Math.cos(2 * theta);
    theta -= num / den;
  }
  return theta;
};

// Local Tangent Plane Projection (Orthographic approximation)
// Center is the vector of the focus hex.
export const sphericalToLocalTangent = (
  x: number, y: number, z: number,
  center: THREE.Vector3
): [number, number] => {
  const point = new THREE.Vector3(x, y, z);
  
  // Define Basis
  // Normal is Center
  const N = center.clone().normalize();
  // Up vector (arbitrary, but standard world UP is good unless we are at pole)
  let UP = new THREE.Vector3(0, 1, 0);
  if (Math.abs(N.dot(UP)) > 0.9) UP = new THREE.Vector3(0, 0, 1);
  
  const U = new THREE.Vector3().crossVectors(UP, N).normalize(); // Tangent X (East-ish)
  const V = new THREE.Vector3().crossVectors(N, U).normalize();  // Tangent Y (North-ish)
  
  // Project difference vector onto basis
  const diff = point.sub(center); // Not strictly geodesic, but for local flat maps it works perfectly
  
  const u = diff.dot(U);
  const v = diff.dot(V);
  
  return [u * 1000, v * 1000]; // Scale up for consistency with map units
};

export const sphericalToCartesian2D = (
  x: number, y: number, z: number, 
  offsetRadians: number = 0,
  projection: MapProjection = 'EQUIRECTANGULAR',
  centerHex?: THREE.Vector3
): [number, number] => {
  
  if (projection === 'LOCAL' && centerHex) {
    return sphericalToLocalTangent(x, y, z, centerHex);
  }

  // Normalize
  const len = Math.sqrt(x*x + y*y + z*z);
  if (len === 0) return [MAP_WIDTH/2, MAP_HEIGHT/2];
  
  const nx = x / len;
  const ny = y / len;
  const nz = z / len;

  // Longitude: -PI to PI
  let longitude = Math.atan2(nx, nz) + offsetRadians;
  // Wrap
  while (longitude > Math.PI) longitude -= 2 * Math.PI;
  while (longitude < -Math.PI) longitude += 2 * Math.PI;
  
  // Latitude: -PI/2 to PI/2
  const latitude = Math.asin(ny);

  if (projection === 'MOLLWEIDE') {
    // Mollweide Projection
    // x = R * 2*sqrt(2)/pi * lon * cos(theta)
    // y = R * sqrt(2) * sin(theta)
    // We map -PI..PI lon to 0..Width and -PI/2..PI/2 lat to Height..0
    
    const theta = solveMollweideTheta(latitude);
    
    // Normalized coords (-1 to 1)
    const normX = (2 * Math.sqrt(2) / Math.PI) * longitude * Math.cos(theta);
    const normY = Math.sqrt(2) * Math.sin(theta);
    
    // Map to canvas. Note: Mollweide width is 2*sqrt(2) ~ 2.828 relative to height sqrt(2) ~ 1.414 (2:1 aspect)
    // But our normX/Y are relative.
    // The max value of normX is at lon=PI, theta=0 => 2*sqrt(2)
    // The max value of normY is at theta=PI/2 => sqrt(2)
    // So we normalize by dividing by these max values.
    
    const u = (normX / (2 * Math.sqrt(2))) * 0.5 + 0.5; // -1..1 -> 0..1
    const v = 1.0 - ((normY / Math.sqrt(2)) * 0.5 + 0.5);
    
    return [u * MAP_WIDTH, v * MAP_HEIGHT];
  }

  // Fallback: Equirectangular
  const u = (longitude + Math.PI) / (2 * Math.PI);
  const v = 1.0 - ((latitude + Math.PI / 2) / Math.PI);

  return [u * MAP_WIDTH, v * MAP_HEIGHT];
};

export const cartesian2DToSphericalVector = (
  px: number, py: number, 
  offsetRadians: number = 0,
  projection: MapProjection = 'EQUIRECTANGULAR',
  centerHex?: THREE.Vector3
): THREE.Vector3 => {
  // NOTE: Inverse Local projection is complex for hit testing due to scaling ambiguity.
  // For 'LOCAL' mode, we usually rely on direct object picking or re-projecting hexes to find closest.
  // This function is primarily for the global map hit testing.
  
  const u = px / MAP_WIDTH;
  const v = py / MAP_HEIGHT;

  if (projection === 'MOLLWEIDE') {
    // Inverse Mollweide
    // u,v are 0..1
    // map back to normX, normY range
    const normX = (u - 0.5) * 2 * (2 * Math.sqrt(2));
    const normY = (1.0 - v - 0.5) * 2 * Math.sqrt(2);
    
    // theta = asin(y / sqrt(2))
    // Clamp y to avoid NaN at exact edges
    const thetaArg = Math.max(-1, Math.min(1, normY / Math.sqrt(2)));
    const theta = Math.asin(thetaArg);
    
    // lat = asin( (2theta + sin(2theta)) / pi )
    const latArg = Math.max(-1, Math.min(1, (2 * theta + Math.sin(2 * theta)) / Math.PI));
    const latitude = Math.asin(latArg);
    
    // lon = pi * x / (2*sqrt(2) * cos(theta))
    // Avoid divide by zero at poles (theta = +/- PI/2)
    const cosTheta = Math.cos(theta);
    let longitude = 0;
    if (Math.abs(cosTheta) > 1e-6) {
      longitude = (Math.PI * normX) / (2 * Math.sqrt(2) * cosTheta);
    }
    
    // Apply offset
    longitude -= offsetRadians;
    
    const y = Math.sin(latitude);
    const r = Math.cos(latitude);
    const x = Math.sin(longitude) * r;
    const z = Math.cos(longitude) * r;
    return new THREE.Vector3(x, y, z).normalize();
  }

  // Equirectangular Inverse
  let longitude = u * 2 * Math.PI - Math.PI;
  longitude -= offsetRadians;

  const latitude = (1.0 - v) * Math.PI - Math.PI / 2;

  const y = Math.sin(latitude);
  const r = Math.cos(latitude);
  const x = Math.sin(longitude) * r;
  const z = Math.cos(longitude) * r;

  return new THREE.Vector3(x, y, z).normalize();
};

export const findOptimalSeam = (hexes: HexData[], seaLevel: number): number => {
  if (!hexes.length) return 0;

  // Divide longitude into buckets to find the slice with the least land
  const BUCKETS = 72; // 5-degree increments
  const counts = new Uint32Array(BUCKETS);
  let landCount = 0;

  for (let i = 0; i < hexes.length; i++) {
    const h = hexes[i];
    // We only care about land for the seam
    if (h.biomeData.height > seaLevel) {
        landCount++;
        // Project to longitude
        const lon = Math.atan2(h.center[0], h.center[2]);
        // Normalize to 0..1
        const norm = (lon + Math.PI) / (2 * Math.PI);
        // Map to bucket
        const b = Math.floor(norm * BUCKETS) % BUCKETS;
        counts[b]++;
    }
  }

  // If the world is waterworld, return 0
  if (landCount === 0) return 0;

  // Find bucket with minimum land hexes
  let minVal = Infinity;
  let minIdx = -1;

  for (let i = 0; i < BUCKETS; i++) {
      if (counts[i] < minVal) {
          minVal = counts[i];
          minIdx = i;
      }
  }

  if (minIdx === -1) return 0;

  // The center longitude of the best bucket should be the visual edge (PI)
  // bucket_center = -PI + (minIdx + 0.5) * stride
  const stride = (2 * Math.PI) / BUCKETS;
  const seamLon = -Math.PI + (minIdx + 0.5) * stride;

  // We want seamLon + offset = PI (the wrap point)
  // So offset = PI - seamLon
  return Math.PI - seamLon;
};
