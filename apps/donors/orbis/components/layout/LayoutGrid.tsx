
import React, { ReactNode } from 'react';
import { useUIStore } from '../../stores/useUIStore';

interface LayoutGridProps {
  header: ReactNode;
  leftPanel?: ReactNode;  // Tools
  rightPanel?: ReactNode; // Simulation/Settings
  bottomPanel?: ReactNode; // Timeline/Inspector
  mobileDock?: ReactNode; // Bottom Nav
  viewport: ReactNode;    // The 3D Canvas
  overlays?: ReactNode;   // Modals, Notifications
  isMobile: boolean;
}

export const LayoutGrid: React.FC<LayoutGridProps> = ({
  header,
  leftPanel,
  rightPanel,
  bottomPanel,
  mobileDock,
  viewport,
  overlays,
  isMobile
}) => {
  const { inspectorMode } = useUIStore();

  if (isMobile) {
    // --- Mobile Layout (Vertical Flex) ---
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
        <div className="shrink-0 z-50">{header}</div>
        <div className="flex-1 relative z-0 overflow-hidden">
          {viewport}
          <div className="absolute inset-0 pointer-events-none z-30">
            {overlays}
          </div>
        </div>
        <div className="shrink-0 z-40 relative">{bottomPanel}</div>
        <div className="shrink-0 z-50">{mobileDock}</div>
      </div>
    );
  }

  // --- Desktop / Tablet Layout (CSS Grid) ---
  // If Inspector is fullscreen, RightPanel expands to cover the viewport area
  
  const rightPanelClass = inspectorMode === 'FULLSCREEN' 
    ? "row-start-2 row-span-2 col-start-2 col-span-2 z-50 border-l border-slate-800 bg-slate-950/95 backdrop-blur-md overflow-hidden transition-all duration-300"
    : "row-start-2 row-span-2 col-start-3 z-40 border-l border-slate-800 bg-slate-950/90 backdrop-blur-md overflow-y-auto custom-scrollbar transition-all duration-300";

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden grid grid-rows-[56px_1fr_auto] grid-cols-[64px_1fr_320px]">
      
      {/* Zone A: Header */}
      <div className="col-span-3 z-50 border-b border-slate-800 bg-slate-950">
        {header}
      </div>

      {/* Zone B: Left Tools */}
      <div className="row-start-2 row-span-2 col-start-1 z-40 border-r border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        {leftPanel}
      </div>

      {/* Zone E: Viewport (Center) */}
      <div className="row-start-2 col-start-2 relative z-0 bg-black overflow-hidden">
        {viewport}
        <div className="absolute inset-0 pointer-events-none z-30">
          {overlays}
        </div>
      </div>

      {/* Zone C: Right Panel */}
      {rightPanel && (
        <div className={rightPanelClass}>
          {rightPanel}
        </div>
      )}

      {/* Zone D: Bottom Panel */}
      {bottomPanel && (
        <div className="row-start-3 col-start-2 z-40 pointer-events-none">
           {bottomPanel}
        </div>
      )}

    </div>
  );
};
