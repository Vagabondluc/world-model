
import React, { useState } from 'react';
import ActionSidebar from './ActionSidebar';
import InspectorSidebar from './InspectorSidebar';
import MapViewport from './MapViewport';
import TimelineView from './TimelineView';
import { useGameStore } from '../store/gameStore';
import { selectApRemaining } from '../logic/selectors';
import { ACTION_REGISTRY } from '../logic/actions';
import { triggerHaptic } from '../logic/haptics';

type Tab = 'MAP' | 'ACTIONS' | 'INSPECT' | 'LOG';

interface MobileLayoutProps {
  onSearchClick: () => void;
  onEndTurnClick: () => void;
  onShortcutsClick: () => void;
  isErrorState: boolean;
  toggleErrorState: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  onSearchClick, 
  onEndTurnClick, 
  onShortcutsClick,
  isErrorState, 
  toggleErrorState 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('MAP');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  
  const state = useGameStore(state => state);
  const dispatch = useGameStore(state => state.dispatch);
  const apRemaining = selectApRemaining(state as any);

  const handleActionConfirm = () => {
    if (!selectedActionId) return;
    const action = ACTION_REGISTRY[selectedActionId];
    if (action) {
      triggerHaptic('confirm');
      const event = action.buildEvent(state as any, state.activeSelection);
      dispatch(event);
      setSelectedActionId(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'ACTIONS':
        return (
          <div className="flex-1 bg-bg-dark flex flex-col overflow-hidden">
            <ActionSidebar 
              isErrorState={isErrorState} 
              toggleErrorState={toggleErrorState} 
              activeAction={null} 
              onActionSelect={(id) => { 
                if(id) {
                  setSelectedActionId(id);
                  setActiveTab('MAP'); 
                }
              }}
            />
          </div>
        );
      case 'INSPECT':
        return <InspectorSidebar isErrorState={isErrorState} />;
      case 'LOG':
        return <TimelineView onClose={() => setActiveTab('MAP')} />;
      case 'MAP':
      default:
        return (
          <MapViewport 
            isErrorState={isErrorState} 
            toggleErrorState={toggleErrorState}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-dark overflow-hidden">
      {/* Mobile Top Bar */}
      <header className="h-14 border-b border-white/5 bg-bg-dark flex items-center justify-between px-4 shrink-0">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Player {state.activePlayerId}</span>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-primary">Age {state.age}</span>
            <span className="text-white/20">/</span>
            <span className="text-white">Rnd {state.round}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex gap-1 mr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < apRemaining ? 'bg-primary shadow-glow' : 'bg-white/10'}`}></div>
            ))}
          </div>
          <button onClick={onShortcutsClick} className="p-2 text-text-muted active:text-white">
            <span className="material-symbols-outlined text-xl">help_center</span>
          </button>
          <button onClick={onSearchClick} className="p-2 text-text-muted active:text-white">
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
          <button onClick={onEndTurnClick} className="bg-primary text-white p-2 rounded-lg shadow-glow active:scale-90 ml-1">
            <span className="material-symbols-outlined text-xl">play_arrow</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative flex overflow-hidden">
        {renderContent()}

        {/* Action Preview Slide-Up Sheet */}
        <div className={`absolute bottom-0 left-0 right-0 z-50 bg-bg-panel border-t border-primary/30 p-4 transition-transform duration-300 transform ${selectedActionId ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{selectedActionId ? (ACTION_REGISTRY[selectedActionId]?.id.includes('WAR') ? 'swords' : 'bolt') : 'bolt'}</span>
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase">{selectedActionId && ACTION_REGISTRY[selectedActionId]?.label}</p>
                  <p className="text-[10px] text-text-muted">Confirm to expend {selectedActionId && ACTION_REGISTRY[selectedActionId]?.baseCost} AP</p>
                </div>
              </div>
              <button onClick={() => setSelectedActionId(null)} className="size-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
           </div>
           <button 
             onClick={handleActionConfirm}
             className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-glow active:scale-95 transition-transform"
           >
             Commit to Timeline
           </button>
        </div>
      </main>

      {/* Bottom Tabs */}
      <nav className="h-16 border-t border-white/5 bg-bg-panel grid grid-cols-4 px-2 shrink-0">
        {[
          { id: 'MAP', icon: 'map', label: 'Map' },
          { id: 'ACTIONS', icon: 'bolt', label: 'Actions' },
          { id: 'INSPECT', icon: 'query_stats', label: 'Inspect' },
          { id: 'LOG', icon: 'history', label: 'Log' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); setSelectedActionId(null); }}
            className={`flex flex-col items-center justify-center gap-1 w-full transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === tab.id ? 'font-variation-fill' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[9px] font-black uppercase tracking-tight">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;
