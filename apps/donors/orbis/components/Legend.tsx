
import React, { useMemo } from 'react';
import { ViewMode, BiomeType, VerticalZone } from '../types';
import { useUIStore } from '../stores/useUIStore';
import { getBiomeColor, getZoneColor } from '../utils/materialUtils';

const Swatch = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: color }} />
    <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wide">{label}</span>
  </div>
);

const GradientBar = ({ labels, gradient }: { labels: [string, string], gradient: string }) => (
  <div className="w-full">
    <div className="h-3 w-full rounded mb-1" style={{ background: gradient }} />
    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
      <span>{labels[0]}</span>
      <span>{labels[1]}</span>
    </div>
  </div>
);

export const Legend: React.FC = () => {
  const { viewMode } = useUIStore();

  const content = useMemo(() => {
    switch (viewMode) {
      case ViewMode.BIOME:
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <div className="col-span-2 text-[9px] text-slate-500 font-bold mb-1 uppercase">Aquatic</div>
            <Swatch color={getBiomeColor(BiomeType.DEEP_OCEAN).getStyle()} label="Abyssal" />
            <Swatch color={getBiomeColor(BiomeType.OCEAN).getStyle()} label="Ocean" />
            <Swatch color={getBiomeColor(BiomeType.WARM_OCEAN).getStyle()} label="Warm Shelf" />
            <Swatch color={getBiomeColor(BiomeType.CORAL_REEF).getStyle()} label="Coral Reef" />
            
            <div className="col-span-2 text-[9px] text-slate-500 font-bold mb-1 mt-2 uppercase">Terrestrial</div>
            <Swatch color={getBiomeColor(BiomeType.TROPICAL_RAIN_FOREST).getStyle()} label="Rainforest" />
            <Swatch color={getBiomeColor(BiomeType.SAVANNA).getStyle()} label="Savanna" />
            <Swatch color={getBiomeColor(BiomeType.SUBTROPICAL_DESERT).getStyle()} label="Desert" />
            <Swatch color={getBiomeColor(BiomeType.TEMPERATE_DECIDUOUS_FOREST).getStyle()} label="Temp Forest" />
            <Swatch color={getBiomeColor(BiomeType.GRASSLAND).getStyle()} label="Grassland" />
            <Swatch color={getBiomeColor(BiomeType.TAIGA).getStyle()} label="Taiga" />
            <Swatch color={getBiomeColor(BiomeType.TUNDRA).getStyle()} label="Tundra" />
            <Swatch color={getBiomeColor(BiomeType.SNOW).getStyle()} label="Snow/Ice" />
            <Swatch color={getBiomeColor(BiomeType.SCORCHED).getStyle()} label="Scorched" />
            <Swatch color={getBiomeColor(BiomeType.VOLCANIC).getStyle()} label="Volcanic" />
          </div>
        );

      case ViewMode.CIVILIZATION:
        return (
          <div>
            <Swatch color="#f43f5e" label="City / Metropolis" />
            <Swatch color="#fbbf24" label="Village / Camp" />
            <GradientBar labels={['Uninhabitable', 'Ideal']} gradient="linear-gradient(to right, #222, #0f0)" />
            <div className="mt-2 text-[9px] text-slate-500 leading-tight">
              Habitability score determines potential. Red/Amber indicates active settlements.
            </div>
          </div>
        );

      case ViewMode.ELEVATION:
        return (
          <div>
            <GradientBar labels={['Deep Ocean', 'Sea Level']} gradient="linear-gradient(to right, hsl(210,80%,30%), hsl(210,80%,60%))" />
            <div className="h-1" />
            <GradientBar labels={['Lowland', 'Summit']} gradient="linear-gradient(to right, hsl(120,50%,30%), hsl(0,0%,100%))" />
          </div>
        );

      case ViewMode.TEMPERATURE:
        return (
          <GradientBar labels={['-30°C (Polar)', '+40°C (Tropical)']} gradient="linear-gradient(to right, #00ffff, #00ff00, #ff0000)" />
        );

      case ViewMode.MOISTURE:
        return (
          <GradientBar labels={['Arid (Desert)', 'Wet (Rainforest)']} gradient="linear-gradient(to right, #a0522d, #0000ff)" />
        );

      case ViewMode.PLATES:
        return (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-300">
              <span className="font-bold text-white">Distinct Colors:</span> Different Tectonic Plates
            </div>
            <div className="text-[10px] text-slate-300">
              <span className="font-bold text-white">Darker Shade:</span> Oceanic Crust (Thinner)
            </div>
            <div className="text-[10px] text-slate-300">
              <span className="font-bold text-white">Lighter Shade:</span> Continental Crust (Thicker)
            </div>
          </div>
        );

      case ViewMode.RIVERS:
        return (
          <div>
            <Swatch color="#60a5fa" label="River Channel" />
            <Swatch color="#334155" label="Drainage Basin" />
            <div className="mt-2 text-[9px] text-slate-500">
              Blue indicates active flow accumulation &gt; threshold. Dark grey indicates land.
            </div>
          </div>
        );

      case ViewMode.ZONES:
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <Swatch color={getZoneColor(VerticalZone.ABYSSAL).getStyle()} label="Abyssal" />
            <Swatch color={getZoneColor(VerticalZone.OCEANIC).getStyle()} label="Oceanic" />
            <Swatch color={getZoneColor(VerticalZone.SHELF).getStyle()} label="Shelf" />
            <Swatch color={getZoneColor(VerticalZone.STRAND).getStyle()} label="Strand" />
            <Swatch color={getZoneColor(VerticalZone.LOWLAND).getStyle()} label="Lowland" />
            <Swatch color={getZoneColor(VerticalZone.HIGHLAND).getStyle()} label="Highland" />
            <Swatch color={getZoneColor(VerticalZone.MONTANE).getStyle()} label="Montane" />
            <Swatch color={getZoneColor(VerticalZone.SUMMIT).getStyle()} label="Summit" />
          </div>
        );

      case ViewMode.ATMOSPHERE:
        return (
          <div>
            <GradientBar labels={['Low Pressure', 'High Pressure']} gradient="linear-gradient(to right, #1e1b4b, #38bdf8)" />
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-[10px] text-slate-300">Cold Front (Storms)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-[10px] text-slate-300">Warm Front (Rain)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-white opacity-40" />
                <span className="text-[10px] text-slate-300">Wind Vector</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [viewMode]);

  if (!content) return null;

  return (
    <div className="absolute bottom-6 right-6 z-20 w-48 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl pointer-events-none md:pointer-events-auto">
      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
        {viewMode} LEGEND
      </div>
      {content}
    </div>
  );
};
