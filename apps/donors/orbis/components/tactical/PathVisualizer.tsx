
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLocalStore } from '../../stores/useLocalStore';
import '../../types'; // Import for side-effects (JSX augmentation)

export const PathVisualizer: React.FC = () => {
  const { calculatedPath, pathStart, pathEnd, hoveredVoxel, movementRange } = useLocalStore();

  const pathLine = useMemo(() => {
    if (calculatedPath.length < 2) return null;
    const points = calculatedPath.map(node => new THREE.Vector3(node.x, node.y + 0.6, node.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: "#60a5fa", 
      transparent: true, 
      opacity: 0.8 
    });
    return new THREE.Line(geometry, material);
  }, [calculatedPath]);

  return (
    <group>
      {/* Reachable Movement Range Overlay */}
      {movementRange.length > 0 && (
        <group>
          {movementRange.map((node, i) => (
            <mesh key={`range-${i}`} position={[node.x, node.y + 0.51, node.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial 
                color="#60a5fa" 
                transparent 
                opacity={0.15} 
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* The Path Line */}
      {pathLine && <primitive object={pathLine} />}

      {/* Path Nodes (Footprints) */}
      {calculatedPath.map((node, i) => (
        <mesh key={`node-${i}`} position={[node.x, node.y + 0.55, node.z]}>
          <boxGeometry args={[0.3, 0.05, 0.3]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Start Marker */}
      {pathStart && (
        <mesh position={[pathStart.x, 0, pathStart.z]}>
          <cylinderGeometry args={[0.5, 0.5, 20, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.1} />
        </mesh>
      )}

      {/* End Marker */}
      {pathEnd && (
        <mesh position={[pathEnd.x, 0, pathEnd.z]}>
          <cylinderGeometry args={[0.5, 0.5, 20, 32]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={0.1} />
        </mesh>
      )}

      {/* Hover Cursor */}
      {hoveredVoxel && (
        <mesh position={[hoveredVoxel.x, hoveredVoxel.y, hoveredVoxel.z]}>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};
