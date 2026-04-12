
import React from 'react';
import { Canvas } from '@react-three/fiber'; 
import { useTimeStore, Season, TemporalRegime, VisualRegime } from '../stores/useTimeStore';
import { useWorldStore } from '../stores/useWorldStore';
import { Calendar, Clock, Snowflake, Flower2, Sun, TreeDeciduous, Wind, Activity, Play, Pause, FastForward, Rewind, Zap } from 'lucide-react';
import { TooltipTrigger } from './ui/TooltipSystem';
import { PerformanceMonitor } from './PerformanceMonitor';

const SeasonIcon = ({ season }: { season: Season }) => {
  switch (season) {
    case 'SPRING': return <Flower2 className="w-4 h-4 text-pink-400" />;
    case 'SUMMER': return <Sun className="w-4 h-4 text-amber-400" />;
    case 'AUTUMN': return <TreeDeciduous className="w-4 h-4 text-orange-400" />;
    case 'WINTER': return <Snowflake className="w-4 h-4 text-cyan-400" />;
  }
};

export const TimeWidget: React.FC = () => {
  const { config } = useWorldStore();
  const { getYear, getDayOfYear, getLocalTime, getSeason, isPaused, setPaused, getRegime, timeScale, setTimeScale, getVisualRegime } = useTimeStore();
  
  const { yearLengthDays, dayLengthSeconds } = config.orbital;
  const year = getYear(yearLengthDays, dayLengthSeconds);
  const day = getDayOfYear(yearLengthDays, dayLengthSeconds);
  const hour = getLocalTime(dayLengthSeconds);
  const season = getSeason(yearLengthDays, dayLengthSeconds);
  const regime = getRegime(dayLengthSeconds, yearLengthDays);
  const visualRegime = getVisualRegime();

  const formatHour = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.floor((h % 1) * 60);
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  };

  const getVisualRegimeLabel = (vr: VisualRegime) => {
      switch(vr) {
          case VisualRegime.REALTIME: return "REALTIME";
          case VisualRegime.FAST: return "FAST";
          case VisualRegime.WARP: return "WARP";
          case VisualRegime.HYPER: return "HYPER";
      }
  }

  return (
    <div className="absolute top-[20px] left-[20px] z-30 flex items-start gap-4 pointer-events-none">
      
      {/* 
        Gizmo Placeholder: Transparent center allows R3F Gizmo to show through 
      */}
      <div className="w-[110px] h-[110px] rounded-full border-2 border-slate-700/30 flex items-center justify-center shrink-0" />

      {/* TIME CONTROLS & INFO */}
      <div className="flex flex-col gap-2 mt-2 pointer-events-auto">
        
        {/* Control Bar */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 shadow-xl">
          <TooltipTrigger content={isPaused ? "Resume Simulation" : "Pause Simulation"}>
            <button 
              onClick={() => setPaused(!isPaused)}
              className={`p-2 rounded-md transition-all ${isPaused ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/40' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {isPaused ? <Play className="w-4 h-4" fill="currentColor" /> : <Pause className="w-4 h-4" fill="currentColor" />}
            </button>
          </TooltipTrigger>
          
          <div className="w-[1px] h-6 bg-slate-700 mx-1" />
          
          <TooltipTrigger content="Slower">
            <button 
              onClick={() => setTimeScale(Math.max(1, timeScale / 2))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
            >
              <Rewind className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          
          <div className="px-2 text-[10px] font-mono font-bold text-indigo-300 min-w-[3rem] text-center">
            {timeScale >= dayLengthSeconds ? `${(timeScale/dayLengthSeconds).toFixed(1)}d/s` : `${timeScale}x`}
          </div>

          <TooltipTrigger content="Faster">
            <button 
              onClick={() => setTimeScale(Math.min(5000000, timeScale * 2))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
        </div>

        {/* Data Display */}
        <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl transition-opacity duration-500 w-48 ${isPaused ? 'opacity-80' : 'opacity-100'}`}>
          <div className="flex flex-col gap-2">
            {/* Year & Day */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-800 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Planetary Cycle</div>
                <div className="text-xs font-bold text-slate-200">Year {year + 1}, Day {day + 1}</div>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-slate-800/50" />
            
            {/* Hour & Season */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-300">{formatHour(hour)}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                <SeasonIcon season={season} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{season}</span>
              </div>
            </div>

            {/* Regime Badges */}
            <div className="flex gap-1.5 pt-1">
               <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[7px] font-bold uppercase tracking-tighter transition-all ${regime === TemporalRegime.LIVING ? 'bg-cyan-900/20 border-cyan-500 text-cyan-400' : 'bg-slate-800/50 border-slate-700 text-slate-600 opacity-50'}`}>
                 <Wind className="w-2 h-2" /> Atmos
               </div>
               <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[7px] font-bold uppercase tracking-tighter transition-all ${regime === TemporalRegime.GEOLOGIC ? 'bg-amber-900/20 border-amber-500 text-amber-400' : 'bg-slate-800/50 border-slate-700 text-slate-600 opacity-50'}`}>
                 <Activity className="w-2 h-2" /> Geo
               </div>
               {/* Visual Regime Indicator */}
               <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[7px] font-bold uppercase tracking-tighter transition-all ${visualRegime >= VisualRegime.WARP ? 'bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-400' : 'bg-slate-800/50 border-slate-700 text-slate-600 opacity-50'}`}>
                 <Zap className="w-2 h-2" /> {getVisualRegimeLabel(visualRegime)}
               </div>
            </div>
          </div>
        </div>

        {/* Perf Monitor in small canvas */}
        <div className="w-full h-8">
            <Canvas>
                <PerformanceMonitor />
            </Canvas>
        </div>
      </div>
    </div>
  );
};
