
import { useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useTimeStore } from '../stores/useTimeStore';
import { HexData } from '../types';

interface InteractionProps {
  hexes: HexData[];
  isTerraforming: boolean;
  onApplyBrush: (id: string) => void;
  onSelectHex: (hex: HexData) => void;
}

export const useGlobeInteraction = ({ hexes, isTerraforming, onApplyBrush, onSelectHex }: InteractionProps) => {
  const clickStartRef = useRef<{x: number, y: number, ts: number} | null>(null);
  const { autoPauseEnabled, setPaused } = useTimeStore();

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    clickStartRef.current = { x: e.clientX, y: e.clientY, ts: Date.now() };
    if (autoPauseEnabled) setPaused(true);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (autoPauseEnabled) setPaused(false);
    if (!clickStartRef.current) return;
    const dx = Math.abs(e.clientX - clickStartRef.current.x);
    const dy = Math.abs(e.clientY - clickStartRef.current.y);
    const dt = Date.now() - clickStartRef.current.ts;

    if (dx < 5 && dy < 5 && dt < 300) {
      if (e.intersections.length > 0) {
        e.stopPropagation();
        const hit = e.intersections[0];
        const hitPoint = hit.point.clone().normalize();
        let closestHex: HexData | null = null;
        let maxDot = -1;
        hexes.forEach(h => {
          const dot = (h.center[0] * hitPoint.x) + (h.center[1] * hitPoint.y) + (h.center[2] * hitPoint.z);
          if (dot > maxDot) { maxDot = dot; closestHex = h; }
        });
        if (closestHex) {
          if (isTerraforming) onApplyBrush(closestHex.id);
          else onSelectHex(closestHex);
        }
      }
    }
    clickStartRef.current = null;
  };

  return { handlePointerDown, handlePointerUp };
};
