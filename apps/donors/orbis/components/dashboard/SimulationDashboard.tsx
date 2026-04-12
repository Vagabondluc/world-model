
import React, { useState, useEffect } from 'react';
import { SimSystem } from '../../sim/SimSystem';
import { ChronicleEntry } from '../../sim/narrative/types';
import { NarrativeArtifact } from '../../core/schemas/narrative';
import { 
  Activity, Shield, Wind, Leaf, Users, AlertTriangle, 
  TrendingUp, TrendingDown, Info, Zap, Landmark, BarChart3, 
  History, Signal, BookOpen, Crown
} from 'lucide-react';

const DashboardCard = ({ title, icon: Icon, color, children, status }: any) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
    <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300 uppercase">
        {status}
      </span>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Gauge = ({ value, label, sublabel, trend, color = "bg-indigo-500" }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <span className="text-[10px] text-slate-500 font-medium uppercase">{label}</span>
      <div className="flex items-center gap-1">
        {trend === 'up' ? <TrendingUp className="w-2 h-2 text-emerald-500" /> : <TrendingDown className="w-2 h-2 text-rose-500" />}
        <span className="text-xs font-mono font-bold text-slate-200">{(value * 100).toFixed(1)}%</span>
      </div>
    </div>
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${value * 100}%` }} 
      />
    </div>
    {sublabel && <span className="text-[8px] text-slate-600 block italic">{sublabel}</span>}
  </div>
);

const ChronicleEntryRow: React.FC<{ entry: ChronicleEntry }> = ({ entry }) => (
  <div className="flex gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 group hover:bg-slate-800 transition-colors">
    <div className={`shrink-0 w-1 h-auto rounded-full ${entry.severity === 'critical' ? 'bg-rose-500' : entry.severity === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-200 uppercase">{entry.title}</span>
        <span className="text-[7px] font-mono text-slate-500">Year {entry.year}</span>
      </div>
      <p className="text-[9px] text-slate-400 leading-tight">{entry.message}</p>
    </div>
  </div>
);

const MythRow: React.FC<{ artifact: NarrativeArtifact }> = ({ artifact }) => (
  <div className="flex flex-col gap-1 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-bold text-amber-200 uppercase tracking-tight">{artifact.isMyth ? 'Mythic' : 'Narrative'}</span>
      <span className="text-[8px] font-mono text-slate-500">{artifact.tone}</span>
    </div>
    <p className="text-[9px] text-slate-400 italic">"{artifact.lesson}"</p>
    <div className="w-full h-0.5 bg-slate-700 mt-1 rounded-full overflow-hidden">
        <div className={`h-full ${artifact.isMyth ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${(artifact.mythRetentionPPM / 1_000_000) * 100}%` }} />
    </div>
  </div>
);

export const SimulationDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    health: 0.9,
    radiation: 0.1,
    co2: 0.5,
    vitality: 0.8,
    temp: 14.5,
    regime: 'FRONTIER',
    stability: 1.0,
    lastTick: 0n
  });
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);
  const [myths, setMyths] = useState<NarrativeArtifact[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        health: SimSystem.magnetosphere.getHealth(),
        radiation: SimSystem.magnetosphere.getRadiationStress(),
        co2: SimSystem.carbon.getCO2(),
        vitality: SimSystem.biosphere.getCapacity(),
        temp: SimSystem.climate.getTemperature(9),
        regime: SimSystem.regime.getRegime(),
        stability: SimSystem.regime.getStability(),
        lastTick: SimSystem.scheduler.getAbsoluteTime()
      });
      // Get the latest entries from the Narrative Engine
      setChronicle(SimSystem.narrative.getChronicle().slice(0, 5));
      // Get active myths
      setMyths(SimSystem.myths.getArtifacts().sort((a,b) => b.mythRetentionPPM - a.mythRetentionPPM).slice(0, 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 space-y-6 custom-scrollbar overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200 uppercase tracking-tighter">Situation Room</h2>
          <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
            <Signal className="w-3 h-3 text-emerald-500 animate-pulse" />
            Sim Epoch: {stats.lastTick.toString()}
          </p>
        </div>
        <div className="p-2 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
          <Activity className="w-5 h-5 text-indigo-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Signals Log */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <History className="w-3 h-3 text-slate-500" />
            <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Chronicle</h4>
          </div>
          <div className="space-y-2">
            {chronicle.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-slate-800 rounded-2xl">
                <span className="text-[9px] text-slate-600 uppercase font-bold italic">No history recorded yet</span>
              </div>
            ) : (
              chronicle.map(e => <ChronicleEntryRow key={e.id} entry={e} />)
            )}
          </div>
        </div>

        {/* Cultural Mythos */}
        {myths.length > 0 && (
          <DashboardCard title="Cultural Mythos" icon={BookOpen} color="bg-amber-600" status="Active">
              <div className="space-y-2">
                  {myths.map(m => <MythRow key={m.artifactId} artifact={m} />)}
              </div>
          </DashboardCard>
        )}

        {/* Civilization */}
        <DashboardCard title="Governance" icon={Landmark} color="bg-purple-500" status={stats.regime}>
          <Gauge label="System Stability" value={stats.stability} trend="down" color="bg-purple-500" sublabel="Entropy-driven institutional decay" />
        </DashboardCard>

        {/* Geosphere */}
        <DashboardCard title="Magnetosphere" icon={Shield} color="bg-cyan-500" status="Active">
          <Gauge label="Shield Strength" value={stats.health} trend="down" />
          <Gauge label="Surface Radiation" value={stats.radiation} trend="up" />
        </DashboardCard>

        {/* Biosphere */}
        <DashboardCard title="Biosphere" icon={Leaf} color="bg-emerald-500" status="Vibrant">
          <Gauge label="Global Vitality" value={stats.vitality} trend="up" sublabel="Niche capacity: High" />
        </DashboardCard>
      </div>
      
      <div className="flex items-start gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <p className="text-[9px] text-slate-500 leading-normal italic">
          Interpreted signals from the 2.0 authoritative engine.
        </p>
      </div>
    </div>
  );
};
