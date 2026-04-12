
import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useLocalStore } from '../../stores/useLocalStore';
import { CoverType, TerrainType } from '../../core/tactical/types';

interface TacticalGridProps {
  visible: boolean;
}

export const TacticalGrid: React.FC<TacticalGridProps> = ({ visible }) => {
  const { tacticalMap } = useLocalStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const edgesRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    if (!visible || !tacticalMap) return { count: 0, matrices: [], colors: new Float32Array(0) };
    
    const matrices: THREE.Matrix4[] = [];
    const colors: number[] = [];
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    tacticalMap.cells.forEach(cell => {
        dummy.position.set(cell.worldX, cell.worldY + 0.05, cell.worldZ);
        dummy.rotation.x = -Math.PI / 2;
        // Scale slightly smaller than cell size for grid effect
        const s = tacticalMap.cellSize * 0.95;
        dummy.scale.set(s, s, 1);
        dummy.updateMatrix();
        matrices.push(dummy.matrix.clone());

        // Color based on Terrain/Cover
        if (cell.cover === CoverType.Full) color.setHex(0xef4444); // Red cover
        else if (cell.cover === CoverType.Half) color.setHex(0xf59e0b); // Orange half-cover
        else if (cell.terrain === TerrainType.Difficult) color.setHex(0x3b82f6); // Blue difficult
        else color.setHex(0xffffff); // Standard

        colors.push(color.r, color.g, color.b);
    });

    return { count: matrices.length, matrices, colors: new Float32Array(colors) };
  }, [tacticalMap, visible]);

  useLayoutEffect(() => {
    if (!meshRef.current || data.count === 0) return;
    
    meshRef.current.count = data.count;
    for (let i = 0; i < data.count; i++) {
        meshRef.current.setMatrixAt(i, data.matrices[i]);
    }
    
    meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(data.colors, 3));
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Update Edges (Optional, can just use the filled tiles for now)
    if (edgesRef.current) {
        edgesRef.current.count = data.count;
        for (let i = 0; i < data.count; i++) {
            edgesRef.current.setMatrixAt(i, data.matrices[i]);
        }
        edgesRef.current.instanceMatrix.needsUpdate = true;
    }

  }, [data]);

  if (!visible || !tacticalMap) return null;

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, data.count]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
            transparent 
            opacity={0.15} 
            depthWrite={false} 
            vertexColors 
            side={THREE.DoubleSide}
        />
      </instancedMesh>
      
      {/* Grid Lines via Edges */}
      <instancedMesh ref={edgesRef} args={[undefined, undefined, data.count]}>
         <planeGeometry args={[1, 1]} /> 
         <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
      </instancedMesh>
    </group>
  );
};
