
import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
import * as THREE from 'three';
import { HexData, ViewMode, PlateType, FrontType } from '../../types';
import { getBiomeColor, getZoneColor } from '../../utils/materialUtils';

interface GlobeMeshProps {
  hexes: HexData[];
  viewMode: ViewMode;
  globeRadius: number;
  elevationScale: number;
  seaLevel: number;
  showGlobeElevation: boolean;
  onPointerDown?: (e: any) => void;
  onPointerUp?: (e: any) => void;
}

export const GlobeMesh = forwardRef<THREE.Mesh, GlobeMeshProps>(({
  hexes, viewMode, globeRadius, elevationScale, seaLevel, showGlobeElevation, onPointerDown, onPointerUp
}, ref) => {
  // Use internal ref if not provided, or merge (simplification: assume parent manages ref if needed for MagicTorch, or use a callback)
  const internalRef = useRef<THREE.Mesh>(null);
  
  // Expose ref to parent
  React.useImperativeHandle(ref, () => internalRef.current!);

  const isDataMode = [
    ViewMode.ATMOSPHERE, ViewMode.TEMPERATURE, ViewMode.MOISTURE, 
    ViewMode.PLATES, ViewMode.ZONES, ViewMode.CIVILIZATION
  ].includes(viewMode);

  // 1. Compute Topology for Hex Grid (Single Mesh)
  const topology = useMemo(() => {
    if (hexes.length === 0) return null;
    const indices: number[] = [];
    let vertexCounter = 0;
    hexes.forEach((hex) => {
      const vertCount = 1 + hex.vertices.length; // center + outer vertices
      const centerIdx = vertexCounter;
      const polyStartIdx = centerIdx + 1;
      for (let v = 0; v < hex.vertices.length; v++) {
        indices.push(centerIdx, polyStartIdx + v, polyStartIdx + ((v + 1) % hex.vertices.length));
      }
      vertexCounter += vertCount;
    });
    return { indices, totalVertices: vertexCounter };
  }, [hexes.length]);

  // 2. Update Geometry Attributes (Positions & Colors)
  useEffect(() => {
    if (!topology || !internalRef.current) return;
    const geometry = internalRef.current.geometry;
    
    // Initialize or Resize buffers
    if (geometry.attributes.position?.count !== topology.totalVertices) {
       geometry.setIndex(topology.indices);
       geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(topology.totalVertices * 3), 3));
       geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(topology.totalVertices * 3), 3));
    }
    
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const tempColor = new THREE.Color();
    let idx = 0;

    hexes.forEach(h => {
      // Logic for color
      if (viewMode === ViewMode.BIOME) tempColor.set(getBiomeColor(h.biome));
      else if (viewMode === ViewMode.PLATES) {
         tempColor.set(h.plateColor);
         if (h.plateType === PlateType.OCEANIC) tempColor.multiplyScalar(0.4);
      }
      else if (viewMode === ViewMode.ELEVATION) {
         const height = h.biomeData.height;
         if (height < seaLevel) {
           const d = (height - (seaLevel - 1.0));
           tempColor.setHSL(0.6, 0.8, 0.1 + d * 0.3);
         } else {
           const d = (height - seaLevel) / (1.0 - seaLevel);
           tempColor.setHSL(0, 0, 0.3 + d * 0.6);
         }
      }
      else if (viewMode === ViewMode.ZONES) tempColor.set(getZoneColor(h.verticalZone));
      else if (viewMode === ViewMode.TEMPERATURE) {
         const tNorm = Math.min(1, Math.max(0, (h.biomeData.temperature + 30) / 70));
         tempColor.setHSL(0.7 - (tNorm * 0.7), 0.8, 0.5);
      } else if (viewMode === ViewMode.ATMOSPHERE && h.atmosphere) {
         const p = Math.max(0, Math.min(1, (h.atmosphere.pressure - 0.7) / 0.6));
         tempColor.setHSL(0.65, 0.7, 0.1 + p * 0.7); 
         if (h.atmosphere.frontType === FrontType.COLD) tempColor.lerp(new THREE.Color('#ef4444'), 0.8);
         else if (h.atmosphere.frontType === FrontType.WARM) tempColor.lerp(new THREE.Color('#3b82f6'), 0.6);
      } else if (viewMode === ViewMode.CIVILIZATION) {
         if (h.settlementType !== 'NONE') tempColor.set(h.settlementType === 'CITY' ? '#f43f5e' : '#fbbf24');
         else tempColor.setHSL(0.3 * h.habitabilityScore, 0.5, 0.1 + h.habitabilityScore * 0.3);
      } else {
         tempColor.set(getBiomeColor(h.biome));
      }

      // Height logic
      const radius = globeRadius + (showGlobeElevation ? (h.biomeData.height - seaLevel) * elevationScale : 0);
      const centerPos = new THREE.Vector3(...h.center).multiplyScalar(radius);
      
      // Center Vertex
      positions[idx] = centerPos.x; positions[idx+1] = centerPos.y; positions[idx+2] = centerPos.z;
      colors[idx] = tempColor.r; colors[idx+1] = tempColor.g; colors[idx+2] = tempColor.b;
      idx += 3;

      // Outer Vertices
      h.vertices.forEach(v => {
        const vPos = new THREE.Vector3(...v).normalize().multiplyScalar(radius);
        positions[idx] = vPos.x; positions[idx+1] = vPos.y; positions[idx+2] = vPos.z;
        colors[idx] = tempColor.r; colors[idx+1] = tempColor.g; colors[idx+2] = tempColor.b;
        idx += 3;
      });
    });

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [hexes, viewMode, showGlobeElevation, seaLevel, elevationScale, topology]);

  return (
    <mesh ref={internalRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <bufferGeometry />
      <meshStandardMaterial 
        vertexColors 
        roughness={isDataMode ? 1.0 : 0.7} 
        metalness={0.1} 
        flatShading 
        emissiveIntensity={isDataMode ? 0.8 : 0} 
        emissive={isDataMode ? "#ffffff" : "#000000"}
      />
    </mesh>
  );
});
