import React, { useRef, useEffect } from 'react';
import { GameSessionConfig } from '../../types';
import { getBaseBiome } from '../../logic/biomes';
import { getMapDimensions, getHexPosition, HEX_WIDTH, HEX_HEIGHT } from '../../logic/geometry';

interface MapPreviewProps {
  config: GameSessionConfig;
  zoom?: number;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ config, zoom = 0.2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dims = getMapDimensions(config.mapSize);
    const scale = zoom;
    
    // Set actual canvas size to match the scaled map
    canvas.width = dims.width * scale + 40; 
    canvas.height = dims.height * scale + 40;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(20, 20); // Padding
    ctx.scale(scale, scale);

    // Render simple hexes
    for (let r = 0; r < dims.rows; r++) {
      for (let q = 0; q < dims.cols; q++) {
        const biome = getBaseBiome(q, r, config.worldGen);
        const pos = getHexPosition(q, r);
        
        let color = '#333';
        if (biome === 'water') color = '#0891b2'; // Cyan-700
        if (biome === 'mountain') color = '#7e22ce'; // Purple-700
        if (biome === 'forest') color = '#059669'; // Emerald-600
        if (biome === 'plains') color = '#3f6212'; // Lime-900

        drawHex(ctx, pos.x, pos.y, color);
      }
    }

    ctx.restore();

  }, [config.mapSize, config.worldGen, zoom]);

  const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const w = HEX_WIDTH;
    const h = HEX_HEIGHT;
    
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h / 4);
    ctx.lineTo(x + w, y + h * 0.75);
    ctx.lineTo(x + w / 2, y + h);
    ctx.lineTo(x, y + h * 0.75);
    ctx.lineTo(x, y + h / 4);
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.fill();
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-xl overflow-auto border border-white/5 relative custom-scrollbar p-10">
      <canvas ref={canvasRef} className="rounded shadow-2xl ring-1 ring-white/10" />
    </div>
  );
};