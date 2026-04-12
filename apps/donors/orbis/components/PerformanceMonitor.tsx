
import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Activity } from 'lucide-react';
import { useTimeStore } from '../stores/useTimeStore';

/**
 * PerformanceMonitor
 * Displays FPS (Frames Per Second) and TPS (Sim Ticks Per Second).
 * Integrated into the TimeWidget area.
 */
export const PerformanceMonitor: React.FC = () => {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const { tps, setTps } = useTimeStore();
  
  // We use useFrame to count render loops
  useFrame((state) => {
    frameCountRef.current++;
    const time = performance.now();
    if (time >= lastTimeRef.current + 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (time - lastTimeRef.current)));
      
      // Heuristic for TPS (Sim ticks): 
      // Since SimSystem runs on the main thread in this version (via useFrame/useEffect), 
      // TPS is roughly bounded by FPS, but mathematically we verify against the timeStore.
      // In a worker-based setup, we'd query the worker. 
      // Here, we just report the frame rate as the effective tick rate for the visual loop.
      setTps(Math.round((frameCountRef.current * 1000) / (time - lastTimeRef.current)));
      
      frameCountRef.current = 0;
      lastTimeRef.current = time;
    }
  });

  const getStatusColor = (val: number) => {
    if (val >= 55) return 'text-emerald-400';
    if (val >= 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  // Wrap HTML content in <Html> from drei to render into DOM instead of WebGL scene
  return (
    <Html center transform={false} fullscreen style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center gap-2 px-2 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg shadow-lg pointer-events-auto">
          <Activity className="w-3 h-3 text-slate-500" />
          <div className="flex gap-2 text-[9px] font-mono font-bold">
            <span className={getStatusColor(fps)}>
              {fps} FPS
            </span>
            <span className="text-slate-600">|</span>
            <span className={getStatusColor(tps)}>
              {tps} TPS
            </span>
          </div>
        </div>
      </div>
    </Html>
  );
};
