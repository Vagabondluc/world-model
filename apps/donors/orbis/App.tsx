
import React, { useEffect, useState, useCallback } from 'react';
import { HexGrid } from './components/HexGrid';
import { Header } from './components/Header';
import { Toolbars } from './components/Toolbars';
import { MobileUI } from './components/MobileUI';
import { TimeWidget } from './components/TimeWidget';
import { Legend } from './components/Legend';
import { CosmicPanel } from './components/CosmicPanel'; 
import { SimulationOrchestrator } from './components/SimulationOrchestrator';
import { LayoutGrid } from './components/layout/LayoutGrid';
import { RightPanel } from './components/panels/RightPanel';
import { useWorldStore } from './stores/useWorldStore';
import { useLocalStore } from './stores/useLocalStore';
import { useUIStore } from './stores/useUIStore';
import { useRegionStore } from './stores/useRegionStore';
import { useTimeStore } from './stores/useTimeStore';
import { RefreshCw } from 'lucide-react';
import { TooltipProvider } from './components/ui/TooltipSystem';
import { HelpModal } from './components/modals/HelpModal';
import { LoadModal } from './components/LoadModal';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const App: React.FC = () => {
  const isMobile = useIsMobile();
  const { 
    hexes, config, isGenerating, selectedHexId, 
    terraformMode, seed, regenerateWorld, setSelectedHexId, getHexById, applyBrush
  } = useWorldStore();

  const { resolution, hydrateVoxelChunk } = useLocalStore();
  const { 
    viewMode, globeMode, showGlobeElevation, showClouds, mobileTab, setMobileTab,
    isSettingsOpen, setSidebarTab, isInspectorOpen, inspectorMode, setInspectorMode,
    projectionMode, setProjectionMode, setHelpOpen, isHelpOpen, toggleSettings
  } = useUIStore();

  const { isPaused, setPaused } = useTimeStore();
  const { regions, initializeRegions } = useRegionStore();

  useEffect(() => {
    regenerateWorld();
  }, []);

  useEffect(() => {
    if (hexes.length > 0) initializeRegions(hexes);
  }, [hexes]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case '?':
          e.preventDefault();
          setHelpOpen(!isHelpOpen);
          break;
        case 'm':
          e.preventDefault();
          setProjectionMode(projectionMode === 'GLOBE' ? 'FLAT' : 'GLOBE');
          break;
        case ' ':
          e.preventDefault();
          setPaused(!isPaused);
          break;
        case 'escape':
          e.preventDefault();
          if (isHelpOpen) setHelpOpen(false);
          else if (selectedHexId) setSelectedHexId(null);
          else if (isSettingsOpen) toggleSettings();
          break;
        case '1':
          setSidebarTab('GLOBAL');
          break;
        case '2':
          setSidebarTab('LOCAL');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHelpOpen, projectionMode, isPaused, selectedHexId, isSettingsOpen, setHelpOpen, setProjectionMode, setPaused, setSelectedHexId, toggleSettings, setSidebarTab]);

  useEffect(() => {
    if (selectedHexId) {
      hydrateVoxelChunk(selectedHexId, config, regions);
      if (isMobile && mobileTab === 'NONE') setMobileTab('INSPECT');
      if (!isMobile) {
        setSidebarTab('LOCAL');
        // Automatically open inspector if it was closed
        if (!isInspectorOpen) useUIStore.getState().toggleInspector();
      }
    }
  }, [selectedHexId, hexes, config.elevationScale, config.seaLevel, resolution, regions]);

  const handleHexSelect = (hex: any) => {
    setSelectedHexId(hex.id);
  };

  const handleApplyBrush = (id: string) => {
    applyBrush(id);
    setSelectedHexId(id);
  };

  // --- Components mapped to Layout Zones ---

  const ViewportContent = (
    <>
      <div className="absolute inset-0 z-0" aria-label="Planetary Visualization Viewport">
        <HexGrid 
          hexes={hexes} 
          selectedHexId={selectedHexId} 
          onSelectHex={handleHexSelect}
          viewMode={viewMode} 
          globeMode={globeMode}
          showGlobeElevation={showGlobeElevation}
          showClouds={showClouds}
          seaLevel={config.seaLevel}
          elevationScale={config.elevationScale}
          terraformMode={terraformMode}
          onApplyBrush={handleApplyBrush}
          seed={seed}
          config={config}
        />
      </div>
      {isGenerating && (
        <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6" role="alert" aria-busy="true">
          <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-indigo-300 uppercase tracking-[0.2em]">Synthesizing Lattice</h2>
        </div>
      )}
    </>
  );

  const Overlays = (
    <>
      <TimeWidget />
      <CosmicPanel />
      <HelpModal />
      <LoadModal />
      {!isMobile && <Legend />}
    </>
  );

  return (
    <TooltipProvider>
      <SimulationOrchestrator />
      
      <LayoutGrid 
        isMobile={isMobile}
        header={<Header />}
        leftPanel={<nav className="h-full pt-4" aria-label="Toolrail"><Toolbars /></nav>}
        rightPanel={isSettingsOpen || (isInspectorOpen && inspectorMode === 'FULLSCREEN') ? <aside className="h-full" aria-label="Control Panel"><RightPanel /></aside> : null}
        bottomPanel={null} 
        mobileDock={<MobileUI />}
        viewport={ViewportContent}
        overlays={Overlays}
      />
    </TooltipProvider>
  );
};

export default App;
