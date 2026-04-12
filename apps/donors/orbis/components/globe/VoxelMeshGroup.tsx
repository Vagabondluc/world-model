
import React, { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { VoxelMaterial } from '../../types';
import { getMaterialProps } from '../../utils/materialUtils';

export const VoxelMeshGroup: React.FC<{ material: VoxelMaterial; matrices: THREE.Matrix4[] }> = ({ material, matrices }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { color, transparent, opacity, roughness, metalness, emissive, emissiveIntensity } = useMemo(() => getMaterialProps(material), [material]);
  
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < matrices.length; i++) meshRef.current.setMatrixAt(i, matrices[i]);
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, matrices.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        transparent={transparent} 
        opacity={opacity} 
        roughness={roughness} 
        metalness={metalness} 
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </instancedMesh>
  );
};
