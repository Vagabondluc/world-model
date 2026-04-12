
import React, { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { HexData } from '../../types';
import { useTimeStore } from '../../stores/useTimeStore';

export const WindNeedles = ({ hexes, globeRadius, visible, dayLength }: { hexes: HexData[], globeRadius: number, visible: boolean, dayLength: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { isAtmosphereActive } = useTimeStore();
  const isCurrentlyVisible = visible && isAtmosphereActive(dayLength);

  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];
    if (!isCurrentlyVisible) return mats;
    
    // Adjust stride based on density: we want enough to see flow but not cover the globe
    const stride = hexes.length > 5000 ? 2 : 1;

    for (let i = 0; i < hexes.length; i += stride) {
      const h = hexes[i];
      if (!h.atmosphere) continue;
      const wind = new THREE.Vector3(...h.atmosphere.windVector);
      const speed = wind.length();
      if (speed < 0.001) continue;

      const pos = new THREE.Vector3(...h.center).multiplyScalar(globeRadius + 0.2);
      dummy.position.copy(pos);
      
      // Orient the needle to point along the wind vector
      const target = pos.clone().add(wind.normalize());
      dummy.lookAt(target);
      
      // Cone points toward +Y by default. Rotate dummy to align with wind direction.
      dummy.rotateX(Math.PI / 2);

      // Scale: Prominent "flow needles"
      // Thin at the tip (cone tip) and longer based on speed
      const baseScale = 0.03;
      const length = 0.3 + speed * 40;
      dummy.scale.set(baseScale, length, baseScale);
      
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
    }
    return mats;
  }, [hexes, globeRadius, isCurrentlyVisible]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < matrices.length; i++) meshRef.current.setMatrixAt(i, matrices[i]);
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.count = matrices.length;
  }, [matrices]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, hexes.length]} visible={isCurrentlyVisible}>
      <coneGeometry args={[1, 1, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} depthWrite={false} />
    </instancedMesh>
  );
};