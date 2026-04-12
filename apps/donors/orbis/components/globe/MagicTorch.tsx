
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import '../../types'; // Import for side-effects (JSX augmentation)

export const MagicTorch = ({ globeMeshRef, sunDirection }: { globeMeshRef: React.RefObject<THREE.Mesh | null>, sunDirection: THREE.Vector3 }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse, camera, raycaster } = useThree();

  useFrame(() => {
    if (!lightRef.current || !globeMeshRef.current) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(globeMeshRef.current);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      // Convert the world hit point to the mesh's local coordinate system
      // This is necessary because MagicTorch is inside the same rotating group as the mesh
      const localPoint = globeMeshRef.current.worldToLocal(hit.point.clone());
      const normal = localPoint.clone().normalize();
      
      const worldNormal = hit.point.clone().normalize();
      const dayFactor = worldNormal.dot(sunDirection);
      const isNight = dayFactor < 0.1;
      
      if (isNight) {
        lightRef.current.position.copy(localPoint).add(normal.multiplyScalar(0.5));
        const transition = THREE.MathUtils.smoothstep(dayFactor, 0.1, -0.2);
        lightRef.current.intensity = 45 * transition;
      } else {
        lightRef.current.intensity = 0;
      }
    } else {
      lightRef.current.intensity = 0;
    }
  });

  return <pointLight ref={lightRef} intensity={0} distance={7} color="#e2e8f0" decay={2} />;
};
