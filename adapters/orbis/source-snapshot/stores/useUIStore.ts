
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode } from '../types';

export type GlobeMode = 'HEX' | 'VOXEL';
export type ProjectionMode = 'GLOBE' | 'FLAT';
export type MapProjection = 'EQUIRECTANGULAR' | 'MOLLWEIDE' | 'LOCAL';
export type InspectorMode = 'DOCKED' | 'FULLSCREEN';

interface UIState {
  viewMode: ViewMode;
  globeMode: GlobeMode;
  projectionMode: ProjectionMode;
  mapProjection: MapProjection;
  inspectorMode: InspectorMode;
  
  showGlobeElevation: boolean;
  showClouds: boolean;
  showGlobalLight: boolean;
  
  isSettingsOpen: boolean;
  isInspectorOpen: boolean;
  isLoadModalOpen: boolean; 
  isCosmicPanelOpen: boolean; 
  isHelpOpen: boolean;
  activeNotification: string | null;
  
  // Sidebar State
  sidebarTab: 'GLOBAL' | 'LOCAL';

  // Mobile UI State
  mobileTab: 'NONE' | 'LAYERS' | 'TOOLS' | 'INSPECT';
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setGlobeMode: (mode: GlobeMode) => void;
  setProjectionMode: (mode: ProjectionMode) => void;
  setMapProjection: (proj: MapProjection) => void;
  setInspectorMode: (mode: InspectorMode) => void;
  
  toggleGlobeElevation: () => void;
  toggleClouds: () => void;
  toggleGlobalLight: () => void;
  toggleSettings: () => void;
  toggleInspector: () => void;
  toggleCosmicPanel: () => void;
  setLoadModalOpen: (isOpen: boolean) => void;
  setHelpOpen: (isOpen: boolean) => void;
  
  setNotification: (msg: string | null) => void;
  setMobileTab: (tab: 'NONE' | 'LAYERS' | 'TOOLS' | 'INSPECT') => void;
  setSidebarTab: (tab: 'GLOBAL' | 'LOCAL') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      viewMode: ViewMode.BIOME,
      globeMode: 'HEX', 
      projectionMode: 'GLOBE',
      mapProjection: 'EQUIRECTANGULAR',
      inspectorMode: 'DOCKED',
      
      showGlobeElevation: false,
      showClouds: false,         
      showGlobalLight: true,     
      
      isSettingsOpen: true,
      isInspectorOpen: true,
      isLoadModalOpen: false,
      isCosmicPanelOpen: false,
      isHelpOpen: false,
      activeNotification: null,
      mobileTab: 'NONE',
      sidebarTab: 'GLOBAL',

      setViewMode: (mode) => set({ viewMode: mode }),
      setGlobeMode: (mode) => set({ globeMode: mode }),
      setProjectionMode: (mode) => set({ projectionMode: mode }),
      setMapProjection: (proj) => set({ mapProjection: proj }),
      setInspectorMode: (mode) => set({ inspectorMode: mode }),
      
      toggleGlobeElevation: () => set((state) => ({ showGlobeElevation: !state.showGlobeElevation })),
      toggleClouds: () => set((state) => ({ showClouds: !state.showClouds })),
      toggleGlobalLight: () => set((state) => ({ showGlobalLight: !state.showGlobalLight })),
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
      toggleCosmicPanel: () => set((state) => ({ isCosmicPanelOpen: !state.isCosmicPanelOpen })),
      setLoadModalOpen: (isOpen) => set({ isLoadModalOpen: isOpen }),
      setHelpOpen: (isOpen) => set({ isHelpOpen: isOpen }),
      
      setNotification: (msg) => {
        set({ activeNotification: msg });
        if (msg) setTimeout(() => set({ activeNotification: null }), 3000);
      },
      setMobileTab: (tab) => set({ mobileTab: tab }),
      setSidebarTab: (tab) => set({ sidebarTab: tab }),
    }),
    {
      name: 'orbis-ui-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        globeMode: state.globeMode,
        projectionMode: state.projectionMode,
        mapProjection: state.mapProjection,
        showGlobeElevation: state.showGlobeElevation,
        showClouds: state.showClouds,
        showGlobalLight: state.showGlobalLight,
        sidebarTab: state.sidebarTab,
      }),
    }
  )
);
