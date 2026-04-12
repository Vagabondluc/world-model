
import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getHexPosition } from '../logic/geometry';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const ParticleOverlay: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const events = useGameStore(state => state.events);
  const particles = useRef<Particle[]>([]);
  const lastProcessedEventId = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for new impactful events
    const latest = events[events.length - 1];
    if (!latest || latest.id === lastProcessedEventId.current) return;
    
    lastProcessedEventId.current = latest.id;

    if (latest.type === 'WORLD_CREATE' && latest.payload.kind === 'CATASTROPHE') {
      const hex = latest.payload.hexes?.[0];
      if (hex) {
        const pos = getHexPosition(hex.q, hex.r);
        spawnExplosion(pos.x + 60, pos.y + 70, '#ef4444'); // Red/Orange fire
      }
    }

    if (latest.type === 'COMBAT_RESOLVE') {
      // Find where defender is
      const defenderId = latest.payload.defenderId;
      const world = useGameStore.getState().worldCache;
      const obj = world.get(defenderId);
      if (obj && obj.hexes.length > 0) {
        const hex = obj.hexes[0];
        const pos = getHexPosition(hex.q, hex.r);
        const color = latest.payload.outcome.includes('ATTACKER') ? '#ef4444' : '#3b82f6';
        spawnExplosion(pos.x + 60, pos.y + 70, color);
      }
    }
  }, [events]);

  const spawnExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: Math.random() * 4 + 2
      });
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.current = particles.current.filter(p => p.life > 0);
      
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life -= 0.02;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (particles.current.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (particles.current.length > 0) {
        animate();
    } else {
        // Keep loop alive to check for new particles
        const loop = () => {
            if (particles.current.length > 0) animate();
            else rafRef.current = requestAnimationFrame(loop);
        };
        loop();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className="absolute inset-0 pointer-events-none z-[15]"
    />
  );
};

export default ParticleOverlay;
