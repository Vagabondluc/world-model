// @ts-nocheck
import React, { useState } from 'react';
import { useCityStore } from './state';
import { RefreshCw, Settings2 } from 'lucide-react';
import { ParameterEditor } from './components/ParameterEditor';
import { QualityPanel } from './components/QualityPanel';
import { DebugModesDropdown } from './components/DebugModesDropdown';

type TabType = 'controls' | 'parameters' | 'quality';

export const CityControls: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('controls');
  const {
    seed,
    size,
    setSeed,
    setSize,
    generate,
    isGenerating,
    model,
    showDebug,
    setShowDebug,
    showVoronoi,
    setShowVoronoi,
    debugModes,
    qualityChecks,
  } = useCityStore();

  const failCount = qualityChecks.filter((c) => c.status === 'fail').length;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-200 bg-stone-50">
        <Settings2 className="w-5 h-5 text-stone-600" />
        <h2 className="text-lg font-semibold text-stone-800">City Generator</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 px-4 pt-4 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('controls')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'controls'
              ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
              : 'text-stone-600 hover:text-stone-800'
          }`}
        >
          Quick Controls
        </button>
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'parameters'
              ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
              : 'text-stone-600 hover:text-stone-800'
          }`}
        >
          Parameters
        </button>
        <button
          onClick={() => setActiveTab('quality')}
          className={`relative px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'quality'
              ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
              : 'text-stone-600 hover:text-stone-800'
          }`}
        >
          Quality
          {failCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {failCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'controls' && (
          <QuickControlsTab
            seed={seed}
            size={size}
            setSeed={setSeed}
            setSize={setSize}
            generate={generate}
            isGenerating={isGenerating}
            model={model}
            showDebug={showDebug}
            setShowDebug={setShowDebug}
            showVoronoi={showVoronoi}
            setShowVoronoi={setShowVoronoi}
            debugModes={debugModes}
          />
        )}
        {activeTab === 'parameters' && <ParametersTab />}
        {activeTab === 'quality' && <QualityTab checks={qualityChecks} />}
      </div>
    </div>
  );
};

interface QuickControlsTabProps {
  seed: number;
  size: number;
  setSeed: (seed: number) => void;
  setSize: (size: number) => void;
  generate: () => Promise<void>;
  isGenerating: boolean;
  model: any;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  showVoronoi: boolean;
  setShowVoronoi: (show: boolean) => void;
  debugModes: any[];
}

const QuickControlsTab: React.FC<QuickControlsTabProps> = ({
  seed,
  size,
  setSeed,
  setSize,
  generate,
  isGenerating,
  model,
  showDebug,
  setShowDebug,
  showVoronoi,
  setShowVoronoi,
  debugModes,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-600 flex justify-between">
          <span>City Seed</span>
          <span className="font-mono text-xs text-stone-400">#{seed}</span>
        </label>
        <input
          type="number"
          value={seed}
          onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          placeholder="Enter seed"
        />
        <button
          onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          ↻ Randomize Seed
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-600 flex justify-between">
          <span>City Size</span>
          <span className="font-mono text-xs text-stone-400">{size} units</span>
        </label>
        <input
          type="range"
          min="6"
          max="40"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
          <span>SMALL (6)</span>
          <span>MEDIUM (23)</span>
          <span>LARGE (40)</span>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={isGenerating}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
      >
        <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Synthesizing...' : 'Generate City'}
      </button>

      <div className="border-t border-stone-200 pt-4 mt-4">
        <h3 className="text-xs font-bold text-stone-600 uppercase mb-3">
          Debug & Visualization
        </h3>

        <div className="space-y-2">
          <DebugModesDropdown modes={debugModes} />

          <label className="flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 cursor-pointer hover:bg-stone-100 transition-colors">
            <span className="font-medium">Show Voronoi Grid</span>
            <input
              type="checkbox"
              checked={showVoronoi}
              onChange={(e) => setShowVoronoi(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 cursor-pointer hover:bg-stone-100 transition-colors">
            <span className="font-medium">Show Classic Debug</span>
            <input
              type="checkbox"
              checked={showDebug}
              onChange={(e) => setShowDebug(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
          </label>
        </div>
      </div>

      {showDebug && model?.decision && (
        <div
          className={`mt-4 p-4 rounded-xl border ${
            model.decision.approved
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-red-50 border-red-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Release Status
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                model.decision.approved
                  ? 'bg-emerald-200 text-emerald-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {model.decision.approved ? 'APPROVED' : 'BLOCKED'}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-tight">
            {model.decision.approved
              ? 'All conformance gates and policy checks passed.'
              : 'One or more safety gates failed. Check Quality tab.'}
          </p>
        </div>
      )}

      {showDebug && model && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
            Diagnostics
          </h3>
          <CityStats />
        </div>
      )}

      {model?.pois && model.pois.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
            Landmarks
          </h3>
          <div className="space-y-2 max-h-32 overflow-auto pr-1">
            {model.pois.map((poi: any) => (
              <div key={poi.id} className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-200 text-stone-800 font-bold text-xs">
                  {poi.id}
                </span>
                <span className="text-stone-700">{poi.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ParametersTab: React.FC = () => {
  return <ParameterEditor />;
};

interface QualityTabProps {
  checks: any[];
}

const QualityTab: React.FC<QualityTabProps> = ({ checks }) => {
  return <QualityPanel checks={checks} />;
};

const CityStats: React.FC = () => {
  const model = useCityStore((state) => state.model);
  const [showTopology, setShowTopology] = React.useState(true);
  const [showCrossings, setShowCrossings] = React.useState(true);
  const [showLandUse, setShowLandUse] = React.useState(true);
  if (!model) return <p className="text-xs text-stone-400 italic">No data available</p>;

  const { diagnostics } = model;
  const hardRows = [
    {
      key: 'wall-closed',
      group: 'topology',
      label: 'Wall Closed',
      value: diagnostics.wall_closed_flag ?? 0,
      threshold: '== 1',
      pass: (diagnostics.wall_closed_flag ?? 0) === 1,
    },
    {
      key: 'walls-above',
      group: 'topology',
      label: 'Wall Layer Order',
      value: diagnostics.render_walls_above_buildings_flag ?? 0,
      threshold: '== 1',
      pass: (diagnostics.render_walls_above_buildings_flag ?? 0) === 1,
    },
    {
      key: 'offscreen-roads',
      group: 'crossings',
      label: 'Offscreen Roads',
      value: diagnostics.offscreen_road_count ?? 0,
      threshold: '>= 2',
      pass: (diagnostics.offscreen_road_count ?? 0) >= 2,
    },
    {
      key: 'road-wall',
      group: 'crossings',
      label: 'Road-Wall Unresolved',
      value: diagnostics.unresolved_road_wall_intersections ?? 0,
      threshold: '== 0',
      pass: (diagnostics.unresolved_road_wall_intersections ?? 0) === 0,
    },
    {
      key: 'river-wall',
      group: 'crossings',
      label: 'River-Wall Unresolved',
      value: diagnostics.unresolved_river_wall_intersections ?? 0,
      threshold: '== 0',
      pass: (diagnostics.unresolved_river_wall_intersections ?? 0) === 0,
    },
    {
      key: 'grass-inside',
      group: 'landuse',
      label: 'Grass Inside Wall',
      value: ((diagnostics.grass_inside_wall_ratio ?? 0) * 100).toFixed(1) + '%',
      threshold: '<= 35.0%',
      pass: (diagnostics.grass_inside_wall_ratio ?? 0) <= 0.35,
    },
  ];
  const visibleHardRows = hardRows.filter((r) => {
    if (r.group === 'topology') return showTopology;
    if (r.group === 'crossings') return showCrossings;
    if (r.group === 'landuse') return showLandUse;
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <StatItem label="Trunk Share" value={Math.round(diagnostics.road_trunk_share * 100) + '%'} />
        <StatItem label="Blocks" value={diagnostics.block_count} />
        <StatItem label="Districts" value={diagnostics.district_count} />
        <StatItem label="Tree Density" value={diagnostics.tree_density} />
      </div>
      <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-2">Hard Constraints Overlay</p>
        <div className="flex flex-wrap gap-3 mb-2">
          <label className="text-[10px] text-stone-600 flex items-center gap-1.5">
            <input type="checkbox" checked={showTopology} onChange={(e) => setShowTopology(e.target.checked)} />
            Topology
          </label>
          <label className="text-[10px] text-stone-600 flex items-center gap-1.5">
            <input type="checkbox" checked={showCrossings} onChange={(e) => setShowCrossings(e.target.checked)} />
            Crossings
          </label>
          <label className="text-[10px] text-stone-600 flex items-center gap-1.5">
            <input type="checkbox" checked={showLandUse} onChange={(e) => setShowLandUse(e.target.checked)} />
            Land Use
          </label>
        </div>
        <div className="space-y-1.5">
          {visibleHardRows.map((row) => (
            <div key={row.key} className="flex items-center justify-between text-[10px]">
              <span className="text-stone-600">{row.label}</span>
              <span className={`font-mono ${row.pass ? 'text-emerald-700' : 'text-red-700'}`}>
                {row.value} ({row.threshold})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: number | string }> = ({
  label,
  value,
}) => (
  <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{label}</p>
    <p className="text-base font-mono font-medium text-stone-700">{value}</p>
  </div>
);
