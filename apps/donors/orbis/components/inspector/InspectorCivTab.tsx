
import React, { useMemo, useEffect, useRef } from 'react';
import { HexData } from '../../types';
import { generateTownLayout, TownLayout } from '../../services/procedural/townGenerator';
import { stringToSeed } from '../../utils/hashUtils';
import { Users, Castle, Coins, Anchor } from 'lucide-react';

interface InspectorCivTabProps {
  hex: HexData;
}

const DISTRICT_COLORS = {
  CENTER: '#f43f5e',
  RESIDENTIAL: '#22c55e',
  INDUSTRIAL: '#f59e0b',
  TRADE: '#60a5fa',
  MILITARY: '#64748b',
  SACRED: '#d946ef'
};

export const InspectorCivTab: React.FC<InspectorCivTabProps> = ({ hex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const layout = useMemo(() => {
    const seed = stringToSeed(hex.id + "civ");
    return generateTownLayout(hex, seed);
  }, [hex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Draw Background (Hex hint)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);
    
    // Draw Roads
    layout.edges.forEach(e => {
      const n1 = layout.nodes.find(n => n.id === e.from);
      const n2 = layout.nodes.find(n => n.id === e.to);
      if (n1 && n2) {
        ctx.beginPath();
        ctx.moveTo(n1.x * size, n1.y * size);
        ctx.lineTo(n2.x * size, n2.y * size);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = e.type === 'MAIN' ? 4 : 2;
        ctx.stroke();
      }
    });

    // Draw Nodes
    layout.nodes.forEach(n => {
      ctx.beginPath();
      const r = n.radius * size;
      ctx.arc(n.x * size, n.y * size, r, 0, Math.PI * 2);
      ctx.fillStyle = DISTRICT_COLORS[n.district] || '#94a3b8';
      ctx.fill();
      
      if (n.type === 'HUB') {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

  }, [layout]);

  return (
    <div className="h-full flex flex-col bg-slate-950 p-4 space-y-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 bg-indigo-900/30 rounded-lg border border-indigo-500/30 text-indigo-400">
          <Castle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{hex.name}</h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">{hex.settlementType} • Pop ~{(layout.populationEstimate).toLocaleString()}</span>
        </div>
      </div>

      <div className="aspect-square w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
        <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-[9px] text-slate-400 backdrop-blur-md">
          Layout ID: {layout.seed.toString(16).substring(0, 6)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1 text-slate-500 text-[10px] font-bold uppercase">
            <Users className="w-3 h-3" /> Demographics
          </div>
          <div className="text-xs text-slate-300">Dominant: Human</div>
          <div className="text-[9px] text-slate-500">Minority: 15% Elven</div>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1 text-slate-500 text-[10px] font-bold uppercase">
            <Coins className="w-3 h-3" /> Economy
          </div>
          <div className="text-xs text-slate-300">Exports: Lumber</div>
          <div className="text-[9px] text-slate-500">Imports: Grain, Steel</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Anchor className="w-3 h-3" /> Districts
        </h4>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(layout.nodes.map(n => n.district))).map(d => (
            <div key={d} className="flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300">
              <div className="w-2 h-2 rounded-full" style={{ background: DISTRICT_COLORS[d as keyof typeof DISTRICT_COLORS] }} />
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
