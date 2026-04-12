
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { HexData } from '../types';
import { getBiomeColor } from '../utils/materialUtils';
import { sphericalToLocalTangent } from '../utils/projection';

interface HexVisualizerProps {
  selectedHex: HexData;
  neighbors: HexData[];
  inspectMode: 'SINGLE' | 'REGION';
}

const HexPrism: React.FC<{ hex: HexData, centerHex: HexData, isCenter: boolean }> = ({ hex, centerHex, isCenter }) => {
  const { shape, height, position } = useMemo(() => {
    const centerVec = new THREE.Vector3(...centerHex.center);
    
    // Position relative to the main selected hex
    const [lx, lz] = isCenter 
      ? [0, 0] 
      : sphericalToLocalTangent(hex.center[0], hex.center[1], hex.center[2], centerVec);
    
    // Normalize position scaling (sphericalToLocalTangent scales by 1000)
    // We want a visual scale where hex radius ~1 unit
    const scaleFactor = 0.05; 
    const pos = new THREE.Vector3(lx * scaleFactor, 0, -lz * scaleFactor);

    // Build Shape from vertices relative to THIS hex's center
    // We assume the hex is flat in local space for the icon/inspector view
    const hexCenter = new THREE.Vector3(...hex.center);
    const up = hexCenter.clone().normalize();
    const tempRight = new THREE.Vector3(0, 1, 0).cross(up).lengthSq() > 0.01 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
    const right = new THREE.Vector3().crossVectors(up, tempRight).normalize();
    const forward = new THREE.Vector3().crossVectors(up, right).normalize();

    const points = hex.vertices.map(v => {
      const vec = new THREE.Vector3(...v).sub(hexCenter);
      return new THREE.Vector2(vec.dot(right), vec.dot(forward));
    });

    const s = new THREE.Shape();
    if (points.length > 0) {
      // Scale vertices to match the position scaling
      const vertScale = 20; // Visual size of hex
      s.moveTo(points[0].x * vertScale, points[0].y * vertScale);
      for (let i = 1; i < points.length; i++) s.lineTo(points[i].x * vertScale, points[i].y * vertScale);
      s.closePath();
    }
    
    // Height exaggeration
    const h = Math.max(0.2, (hex.biomeData.height + 1) * 2); 
    
    return { shape: s, height: h, position: pos };
  }, [hex, centerHex, isCenter]);

  const color = useMemo(() => getBiomeColor(hex.biome), [hex.biome]);

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: height, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      {isCenter && (
        <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]}>
           <edgesGeometry args={[new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })]} />
           <lineBasicMaterial color="white" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
};

export const HexVisualizer: React.FC<HexVisualizerProps> = ({ selectedHex, neighbors, inspectMode }) => {
  return (
    <Canvas camera={{ position: [8, 8, 8], fov: 40 }} shadows>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-10, 5, -10]} intensity={0.5} />
      
      <Center top>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <HexPrism hex={selectedHex} centerHex={selectedHex} isCenter={true} />
          {inspectMode === 'REGION' && neighbors.map(h => (
            <HexPrism key={h.id} hex={h} centerHex={selectedHex} isCenter={false} />
          ))}
        </Float>
      </Center>
      
      <OrbitControls makeDefault enableZoom={true} minDistance={5} maxDistance={50} />
      <ContactShadows opacity={0.5} scale={30} blur={2} far={10} resolution={256} color="#000000" />
    </Canvas>
  );
};
