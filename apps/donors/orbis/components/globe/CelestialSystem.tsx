
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeStore, VisualRegime } from '../../stores/useTimeStore';
import { useUIStore } from '../../stores/useUIStore';
import { TerrainConfig } from '../../types';

interface CelestialSystemProps {
  config: TerrainConfig;
  children?: React.ReactNode;
  onInteraction: () => void;
  setSunDirection: (v: THREE.Vector3) => void;
}

export const CelestialSystem: React.FC<CelestialSystemProps> = ({ config, children, onInteraction, setSunDirection }) => {
  const planetSpinRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const { absoluteTime, timeScale, tick, getVisualRegime } = useTimeStore();
  const { showGlobalLight } = useUIStore();
  
  // Phase 26: Temporal Stability
  // We decouple the visual rotation from the raw simulation delta to prevent floating point drift 
  // and high-speed strobing.
  
  useFrame((_, delta) => {
    // 1. Advance Simulation Clock
    tick(delta);

    const { dayLengthSeconds, yearLengthDays } = config.orbital;
    const regime = getVisualRegime();

    // 2. Planet Rotation Logic (Day/Night Cycle)
    if (planetSpinRef.current) {
      if (regime >= VisualRegime.WARP) {
        // LOCK ROTATION: In Warp/Hyper modes (>1 day/sec), spinning the planet causes 
        // motion sickness and temporal aliasing. We lock it to "Noon at Prime Meridian".
        planetSpinRef.current.rotation.y = 0;
      } else {
        // CANONICAL ROTATION: Derived strictly from absoluteTime (microseconds)
        // rotationY = (absTime % dayLength) / dayLength * 2PI
        
        // Ensure inputs to BigInt are integers
        const dayLengthSafe = Math.floor(dayLengthSeconds || 86400);
        const dayLengthUs = BigInt(dayLengthSafe > 0 ? dayLengthSafe : 86400) * 1_000_000n;
        
        if (dayLengthUs > 0n) {
          // Defensive check: absoluteTime should be bigint, but safely handle number if leaked
          const absTimeBig = typeof absoluteTime === 'bigint' ? absoluteTime : BigInt(Math.floor(Number(absoluteTime)));
          
          // Calculate progress using Number for division to get float 0..1
          // (absTimeBig % dayLengthUs) gives us the microseconds into the current day
          // Dividing by dayLengthUs gives the fraction
          const dayProgress = Number(absTimeBig % dayLengthUs) / Number(dayLengthUs);
          
          // Rotate the planet group
          planetSpinRef.current.rotation.y = dayProgress * Math.PI * 2;
        }
      }
    }

    // 3. Solar Orbit Logic (Seasons)
    if (sunRef.current) {
      let orbitAngle = 0;
      
      if (regime === VisualRegime.HYPER) {
        // LOCK SEASONS: In Hyper mode (>42 days/sec), seasons flicker at >12Hz.
        // We lock to a fixed lighting angle (approx Summer Solstice) for stable inspection.
        orbitAngle = Math.PI / 4; 
      } else {
        // CANONICAL ORBIT: Derived from absoluteTime
        const dayLengthSafe = Math.floor(dayLengthSeconds || 86400);
        const yearLengthSafe = Math.floor(yearLengthDays || 365);
        
        // Ensure inputs to BigInt are integers
        const yearLengthUs = BigInt(yearLengthSafe > 0 ? yearLengthSafe : 365) * BigInt(dayLengthSafe > 0 ? dayLengthSafe : 86400) * 1_000_000n;
        
        if (yearLengthUs > 0n) {
          const absTimeBig = typeof absoluteTime === 'bigint' ? absoluteTime : BigInt(Math.floor(Number(absoluteTime)));
          const yearProgress = Number(absTimeBig % yearLengthUs) / Number(yearLengthUs);
          orbitAngle = yearProgress * Math.PI * 2;
        }
      }

      const dist = 50;
      const pos = new THREE.Vector3(Math.cos(orbitAngle) * dist, 0, Math.sin(orbitAngle) * dist);
      sunRef.current.position.copy(pos);
      setSunDir(pos.clone().normalize());
    }
  });

  // Helper to push sun direction update safely
  const setSunDir = (vec: THREE.Vector3) => {
      // In a real app we might debounce this or use a ref to avoid React render thrashing,
      // but for this specific component structure, we call the prop.
      setSunDirection(vec);
  };

  const tiltRad = (config.orbital.axialTilt * Math.PI) / 180;

  return (
    <group onPointerDown={onInteraction}>
      <directionalLight ref={sunRef} intensity={2.0} castShadow shadow-mapSize={[2048, 2048]} />
      {showGlobalLight && <ambientLight intensity={0.8} color="#ffffff" />}
      
      {/* Obliquity Container (Axial Tilt) */}
      <group rotation={[0, 0, -tiltRad]}>
        {/* Diurnal Rotation Container */}
        <group ref={planetSpinRef}>
          {children}
        </group>
      </group>
      
      <hemisphereLight intensity={showGlobalLight ? 0.2 : 0.3} groundColor="#000011" color="#222233" />
    </group>
  );
};
