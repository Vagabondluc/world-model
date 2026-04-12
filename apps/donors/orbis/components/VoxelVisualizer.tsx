
import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useThree, ThreeEvent, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { Voxel, VoxelMaterial } from '../types';
import { Loader2 } from 'lucide-react';
import { getMaterialProps } from '../utils/materialUtils';
import { TacticalGrid } from './tactical/TacticalGrid';
import { SpriteLayer } from './tactical/SpriteLayer';
import { PathVisualizer } from './tactical/PathVisualizer';
import { useUIStore } from '../stores/useUIStore';
import { useLocalStore } from '../stores/useLocalStore';
import { generateGreedyMesh } from '../services/terrain/greedyMesher';
import { raycastVoxels } from '../services/terrain/voxelCollision';

interface VoxelVisualizerProps {
  voxels: Voxel[];
  isLoading: boolean;
  mask?: 'HEX' | 'SQUARE';
}

const VoxelCursor: React.FC<{ voxels: Voxel[] }> = ({ voxels }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, camera, raycaster } = useThree();
  const { setHoveredVoxel } = useLocalStore();

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Throttle raycasting slightly if needed, but for now run per frame
    raycaster.setFromCamera(mouse, camera);
    const hit = raycastVoxels(raycaster.ray, voxels);

    if (hit) {
      meshRef.current.position.set(hit.voxel.x, hit.voxel.y, hit.voxel.z);
      meshRef.current.visible = true;
      setHoveredVoxel({ x: hit.voxel.x, y: hit.voxel.y, z: hit.voxel.z });
    } else {
      meshRef.current.visible = false;
      setHoveredVoxel(null);
    }
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <boxGeometry args={[1.05, 1.05, 1.05]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
    </mesh>
  );
};

const VoxelInternal: React.FC<{ voxels: Voxel[] }> = ({ voxels }) => {
  const { setPathStart, setPathEnd } = useLocalStore();
  const groupRef = useRef<THREE.Group>(null);
  
  // Memoize greedy mesh generation to prevent blocking the render thread too often
  const geometriesByMaterial = useMemo(() => {
      // Safety: If voxel count is extreme, maybe simplify? 
      // For now, assume chunk limits (48x48x64) are safe (~150k voxels max).
      return generateGreedyMesh(voxels);
  }, [voxels]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const hit = raycastVoxels(e.ray, voxels);
    if (hit) {
      const { x, z } = hit.voxel;
      const { pathStart } = useLocalStore.getState();
      if (!pathStart) setPathStart({ x, z });
      else setPathEnd({ x, z });
    }
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {Array.from(geometriesByMaterial.entries()).map(([material, geometry]) => {
        const props = getMaterialProps(material);
        return (
          <mesh key={material} geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial {...props} />
          </mesh>
        );
      })}
      
      <VoxelCursor voxels={voxels} />
      <TacticalGrid visible={true} />
      <SpriteLayer voxels={voxels} />
      <PathVisualizer />
    </group>
  );
};

export const VoxelVisualizer: React.FC<VoxelVisualizerProps> = ({ voxels, isLoading, mask = 'SQUARE' }) => {
  const { showGlobalLight } = useUIStore();
  const { resolution } = useLocalStore();

  const maskedVoxels = useMemo(() => {
    if (mask === 'SQUARE') return voxels;
    
    // Hexagon Mask Logic
    const radius = resolution / 2;
    const r = radius * 0.80; 
    
    return voxels.filter(v => {
        const x = Math.abs(v.x);
        const z = Math.abs(v.z);
        return Math.max(x, x * 0.5 + z * 0.866) <= r;
    });
  }, [voxels, mask, resolution]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      )}
      
      {/* 
         Use gl={{ preserveDrawingBuffer: true }} to help with Context Lost issues during hot reloads 
         and powerPreference="high-performance" to hint browser.
      */}
      <Canvas 
        shadows 
        camera={{ position: [25, 25, 25], fov: 35 }}
        gl={{ powerPreference: "high-performance", preserveDrawingBuffer: true }}
      >
        {showGlobalLight && (
          <>
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 20, 10]} 
              intensity={1.5} 
              castShadow 
              shadow-mapSize={[1024, 1024]}
            />
          </>
        )}
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <Center top>
          <VoxelInternal voxels={maskedVoxels} />
        </Center>
        
        <ContactShadows 
          opacity={0.4} 
          scale={50} 
          blur={2.5} 
          far={6} 
          resolution={256} 
          color="#000000" 
        />
        
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};
