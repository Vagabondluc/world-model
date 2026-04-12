
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HexData, FrontType, VoxelMaterial } from '../../types';
import { PseudoRandom, noise3D } from '../../services/noise';
import { useTimeStore } from '../../stores/useTimeStore';
import { VoxelMeshGroup } from './VoxelMeshGroup';

interface CloudLayerProps {
  hexes: HexData[];
  globeRadius: number;
  seed: number;
  dayLength: number;
}

export const CloudLayer: React.FC<CloudLayerProps> = ({ hexes, globeRadius, seed, dayLength }) => {
  const equatorialRef = useRef<THREE.Group>(null);
  const temperateRef = useRef<THREE.Group>(null);
  const polarRef = useRef<THREE.Group>(null);
  const cloudAltitude = globeRadius * 1.15;
  const { isAtmosphereActive } = useTimeStore();
  
  const zonalMatrices = useMemo(() => {
    const equatorial: THREE.Matrix4[] = [];
    const temperate: THREE.Matrix4[] = [];
    const polar: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const terrainVoxelScale = (globeRadius / Math.sqrt(hexes.length / 100)) * 1.8;
    const cloudletScale = terrainVoxelScale * 0.12; 

    for (let i = 0; i < hexes.length; i++) {
      const hex = hexes[i];
      const atmos = hex.atmosphere;
      const { moisture } = hex.biomeData;
      
      const groupNoise = noise3D(hex.center[0] * 1.5, hex.center[1] * 1.5, hex.center[2] * 1.5, seed + 888);
      let threshold = 0.55;
      if (atmos && atmos.pressure < 1.0) threshold -= 0.15; 
      if (moisture * (groupNoise + 0.3) < threshold) continue;

      const rng = new PseudoRandom(seed + i + 999);
      
      let particleCount = Math.floor(10 + moisture * 20);
      if (atmos) {
        if (atmos.frontType !== FrontType.NONE) particleCount *= 1.5;
        particleCount += Math.floor(atmos.stormIntensity * 30);
      }

      const absY = Math.abs(hex.center[1]);
      let targetMatrices: THREE.Matrix4[];
      if (absY < 0.5) targetMatrices = equatorial; 
      else if (absY < 0.866) targetMatrices = temperate; 
      else targetMatrices = polar; 

      for (let j = 0; j < particleCount; j++) {
        const jitter = terrainVoxelScale * 1.2; 
        const ox = (rng.next() - 0.5) * jitter;
        const oy = (rng.next() - 0.5) * jitter;
        const oz = (rng.next() - 0.5) * jitter;
        
        let verticalLift = (rng.next() * 0.12);
        if (atmos?.frontType === FrontType.COLD) {
          verticalLift = (rng.next() * 0.4); 
        } else if (atmos?.frontType === FrontType.WARM) {
          verticalLift = (rng.next() * 0.05); 
        }
        
        const effectiveAltitude = cloudAltitude * (1.0 + verticalLift);
        const cx = hex.center[0] * effectiveAltitude + ox;
        const cy = hex.center[1] * effectiveAltitude + oy;
        const cz = hex.center[2] * effectiveAltitude + oz;

        dummy.position.set(cx, cy, cz);
        dummy.lookAt(cx * 1.5, cy * 1.5, cz * 1.5); 
        dummy.scale.setScalar(cloudletScale * (0.8 + rng.next() * 0.7)); 
        dummy.updateMatrix();
        targetMatrices.push(dummy.matrix.clone());
      }
    }
    // Safety slice to prevent too many instances if config allows huge grid
    return {
      equatorial: equatorial.slice(0, 40000),
      temperate: temperate.slice(0, 40000),
      polar: polar.slice(0, 20000)
    };
  }, [hexes, globeRadius, seed]);

  useFrame(() => {
    if (!isAtmosphereActive(dayLength)) return;
    const omega = 0.0005;
    if (equatorialRef.current) equatorialRef.current.rotation.y += (omega - 0.0003); 
    if (temperateRef.current) temperateRef.current.rotation.y += (omega + 0.0006); 
    if (polarRef.current) polarRef.current.rotation.y += (omega - 0.0001); 
  });

  return (
    <group>
      <group ref={equatorialRef}><VoxelMeshGroup material={VoxelMaterial.CLOUD} matrices={zonalMatrices.equatorial} /></group>
      <group ref={temperateRef}><VoxelMeshGroup material={VoxelMaterial.CLOUD} matrices={zonalMatrices.temperate} /></group>
      <group ref={polarRef}><VoxelMeshGroup material={VoxelMaterial.CLOUD} matrices={zonalMatrices.polar} /></group>
    </group>
  );
};
