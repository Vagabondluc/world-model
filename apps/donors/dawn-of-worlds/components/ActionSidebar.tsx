
import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACTION_REGISTRY } from '../logic/actions';
import { selectLegalActions, selectCanAdvanceAge } from '../logic/selectors';
import { proposeTurnScopedUndo } from '../logic/undo';
import { triggerHaptic } from '../logic/haptics';
import { ui } from '../logic/ui.tokens';
import { getIconForAction } from '../logic/assets';

interface ActionSidebarProps {
  isErrorState: boolean;
  toggleErrorState: () => void;
  activeAction: string | null;
  onActionSelect: (actionId: string | null) => void;
}

const ActionSidebar: React.FC<ActionSidebarProps> = ({
  activeAction,
  onActionSelect
}) => {
  const state = useGameStore(state => state);
  const dispatch = useGameStore(state => state.dispatch);
  const setPreview = useGameStore(state => state.setPreview);
  const onboardingStep = useGameStore(state => state.onboardingStep);
  const setOnboardingStep = useGameStore(state => state.setOnboardingStep);

  const activePlayerId = state.activePlayerId;
  const playerData = state.playerCache[activePlayerId];
  const apRemaining = playerData?.currentPower || 0;

  const canAdvance = selectCanAdvanceAge(state as any);


  const legalActions = useMemo(() => {
    const registryArray = Object.values(ACTION_REGISTRY);
    return selectLegalActions(state as any, state.activeSelection, registryArray);
  }, [state.age, state.activeSelection, state.events, apRemaining]); // Re-calc when AP changes

  const handleActionClick = (actionId: string, enabled: boolean) => {
    if (!enabled) { triggerHaptic('reject'); return; }
    const actionDef = ACTION_REGISTRY[actionId];
    if (!actionDef) return;

    if (activeAction === actionId) {
      triggerHaptic('confirm');
      const event = actionDef.buildEvent(state as any, state.activeSelection);
      dispatch(event);
      onActionSelect(null);
    } else {
      triggerHaptic('tap');
      onActionSelect(actionId);
      const ghost = actionDef.buildEvent(state as any, state.activeSelection);
      setPreview(ghost);
      if (onboardingStep === 'ACTION') setOnboardingStep('END_TURN');
    }
  };

  return (
    <aside className={`w-72 border-r border-white/5 ${ui.color.bg.panel}/95 backdrop-blur-xl flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.3)]`}>
      <div className={`p-6 border-b border-white/5 ${onboardingStep === 'ACTION' ? 'ring-2 ring-primary animate-pulse' : ''}`}>
        <h1 className={`${ui.color.text.primary} text-[11px] font-black uppercase tracking-[0.2em] mb-1`}>Action Palette</h1>
        <p className={`${ui.color.text.muted} text-[10px] font-medium opacity-60`}>Age {state.age} — AP: {apRemaining} Remaining</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar" role="listbox" aria-label="Available architectural actions">
        {legalActions.map(({ action, enabled, reason }) => {
          const isActive = activeAction === action.id;
          return (
            <div
              key={action.id}
              role="button"
              tabIndex={enabled ? 0 : -1}
              aria-disabled={!enabled}
              aria-pressed={isActive}
              aria-label={`${action.label}. Cost: ${action.baseCost} Action Points. ${enabled ? '' : 'Restricted: ' + reason}`}
              onClick={() => handleActionClick(action.id, enabled)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActionClick(action.id, enabled);
                }
              }}
              className={`group relative flex items-center justify-between ${ui.radius.panel} p-3.5 cursor-pointer transition-all duration-300 border ${isActive ? 'bg-primary/20 border-primary/40 shadow-glow' : !enabled ? `${ui.color.state.disabled} grayscale cursor-not-allowed border-transparent` : `border-transparent ${ui.color.state.hover}`
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-text-muted group-hover:text-white'}`}>
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{getIconForAction(action.id)}</span>
                </div>
                <div>
                  <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>{action.label}</p>
                  <p className={`${ui.color.text.muted} text-[10px] font-medium mt-0.5`}>{action.baseCost} AP Cost</p>
                </div>
              </div>
              {isActive && <div className="size-1.5 rounded-full bg-primary shadow-glow animate-pulse" aria-hidden="true"></div>}
              {!enabled && reason && (
                <div
                  className={`absolute left-[calc(100%+12px)] top-0 w-48 ${ui.color.bg.base}/95 backdrop-blur border border-red-500/30 text-[10px] text-red-200/80 p-2.5 ${ui.radius.panel} z-50 hidden group-hover:block shadow-2xl`}
                  id={`reason-${action.id}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-red-500 font-bold uppercase">
                    <span className="material-symbols-outlined text-[10px]" aria-hidden="true">error</span> Restricted
                  </div>
                  {reason}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
        <button
          type="button"
          onClick={() => { triggerHaptic('confirm'); dispatch({ id: crypto.randomUUID(), ts: Date.now(), playerId: state.activePlayerId, age: state.age, round: state.round, turn: state.turn, type: "AGE_ADVANCE", payload: { from: state.age, to: (state.age + 1) as any } }); }}
          disabled={!canAdvance}
          className={`w-full flex items-center justify-center gap-2 py-3 border text-[10px] font-black uppercase tracking-[0.2em] ${ui.radius.panel} transition-all ${canAdvance ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 hover:bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5 text-text-muted opacity-50 cursor-not-allowed'
            }`}
          aria-label="Advance to the next Age"
        >
          Advance Age
        </button>
        <button
          type="button"
          onClick={() => { const u = proposeTurnScopedUndo(state as any); if (u) dispatch(u); }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 ${ui.color.bg.input} border border-white/5 text-text-muted text-[10px] font-bold uppercase tracking-widest ${ui.radius.panel} hover:text-white transition-all`}
          aria-label="Undo the last action taken this turn"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">undo</span> Undo Action
        </button>
      </div>
    </aside>
  );
};

export default ActionSidebar;
