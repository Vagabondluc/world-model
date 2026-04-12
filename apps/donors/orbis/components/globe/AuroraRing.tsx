
import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeStore } from '../../stores/useTimeStore';
import { MagnetosphereConfig } from '../../types';

interface AuroraRingProps {
  config: MagnetosphereConfig;
  globeRadius: number;
}

export const AuroraRing: React.FC<AuroraRingProps> = ({ config, globeRadius }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { solarWindFlux, isAtmosphereActive, timeScale } = useTimeStore();
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Aurora Logic:
  // We place "curtains" (tall thin boxes) in a ring around the magnetic pole.
  // The ring is offset by dipoleTilt.
  const COUNT = 300;
  const dummy = new THREE.Object3D();

  const magneticAxis = useMemo(() => {
    const tiltRad = (config.dipoleTilt * Math.PI) / 180;
    // Magnetic North is tilted away from Geometric North (Y)
    return new THREE.Vector3(Math.sin(tiltRad), Math.cos(tiltRad), 0).normalize();
  }, [config.dipoleTilt]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    // Generate ring around (0,1,0) then rotate to match magnetic axis
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), magneticAxis);

    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      const radius = globeRadius * 0.95; // Just above surface
      const latRad = (70 + (Math.random() * 10)) * (Math.PI / 180); // 70-80 degrees latitude
      
      // Position on a standard sphere relative to Y-up
      const y = Math.cos(Math.PI / 2 - latRad) * radius; // High up
      const rRing = Math.sin(Math.PI / 2 - latRad) * radius;
      const x = Math.cos(angle) * rRing;
      const z = Math.sin(angle) * rRing;

      const pos = new THREE.Vector3(x, y, z);
      pos.applyQuaternion(quaternion); // Rotate to magnetic pole

      dummy.position.copy(pos);
      dummy.lookAt(0,0,0); // Look at center
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Dual rings (North and South)
      // Note: For simplicity in this v1, we just do North. 
      // To do South, we'd double the count and flip Y.
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [globeRadius, magneticAxis]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Animate visibility based on Solar Wind
    // If solar wind is weak, aurora is faint.
    // If solar wind is strong, aurora is bright.
    const baseOpacity = 0.1 + (solarWindFlux * 0.4) * config.strength;
    
    // Flicker
    const flicker = Math.sin(state.clock.elapsedTime * 2.0) * 0.1;
    materialRef.current.opacity = Math.max(0, Math.min(1, baseOpacity + flicker));
    materialRef.current.visible = materialRef.current.opacity > 0.05;

    // Color shift
    const hue = 0.3 + solarWindFlux * 0.1; // Green to Teal
    materialRef.current.color.setHSL(hue, 1.0, 0.5);

    // Rotate the whole ring slowly to simulate drift
    meshRef.current.rotation.y -= delta * 0.05;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      {/* Tall thin curtains */}
      <boxGeometry args={[0.2, 4.0, 0.2]} />
      <meshBasicMaterial 
        ref={materialRef}
        color="#00ff88" 
        transparent 
        opacity={0.3} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};
