import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { selectApSpentThisTurn, selectApRemaining } from '../logic/selectors';
import { GameState } from '../types';
import { filterByTurn, filterWorldEvents, filterNonRevoked } from '../logic/eventFilters';
import { getNextPlayer } from '../logic/turnOrder';
import { formatAgeRoman } from '../logic/format';

interface EndTurnModalProps {
  onClose: () => void;
}

const EndTurnModal: React.FC<EndTurnModalProps> = ({ onClose }) => {
  const state = useGameStore();
  const { dispatch } = state;

  const turnEvents = useMemo(() => {
    let evts = filterByTurn(state.events, state as unknown as GameState);
    evts = filterWorldEvents(evts);
    evts = filterNonRevoked(evts, state.revokedEventIds);
    return evts;
  }, [state.events, state.activePlayerId, state.age, state.round, state.turn, state.revokedEventIds]);

  const spent = selectApSpentThisTurn(state as unknown as GameState);
  const remaining = selectApRemaining(state as unknown as GameState);
  const total = state.settings.turn.apByAge[state.age];

  const handleSubmit = () => {
    dispatch({
      id: crypto.randomUUID(),
      ts: Date.now(),
      playerId: state.activePlayerId,
      age: state.age,
      round: state.round,
      turn: state.turn,
      type: "TURN_END",
      payload: { playerId: state.activePlayerId }
    });
    onClose();
  };

  const nextPlayer = getNextPlayer(state.players, state.activePlayerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-bg-panel shadow-[0_30px_90px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
        <div className="border-b border-white/5 bg-white/5 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Finish Turn</h3>
            <p className="text-[11px] font-mono text-primary uppercase tracking-widest">Age {state.age}, Round {state.round}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-[10px] font-bold uppercase text-text-muted mb-3 tracking-wider">Session Summary</h4>
            <div className="space-y-2">
              {turnEvents.map(e => (
                <div key={e.id} className="flex items-center justify-between rounded bg-bg-input px-3 py-2 border border-white/5">
                  <span className="text-sm text-white">
                    {e.type === 'WORLD_CREATE' ? 'Created' : 'Modified'}
                    <span className="text-primary font-medium ml-1">{(e as any).payload.kind || 'Entity'}</span>
                  </span>
                  {'cost' in e && <span className="font-mono text-xs text-text-muted">({e.cost} AP)</span>}
                </div>
              ))}
              {turnEvents.length === 0 && (
                <div className="p-4 text-center border border-dashed border-white/10 rounded">
                  <p className="text-xs text-text-muted italic">No actions recorded this turn.</p>
                </div>
              )}
              <div className="flex items-center justify-between rounded bg-primary/10 px-3 py-2 border border-primary/20 mt-4">
                <span className="text-sm font-semibold text-white">Total Power Expended</span>
                <span className="font-mono text-sm text-primary font-bold">{spent} of {total} AP</span>
              </div>
            </div>
          </div>

          {remaining > 0 && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
              <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
              <div>
                <p className="text-xs font-bold text-amber-500 uppercase mb-1">Unspent Power</p>
                <p className="text-sm text-amber-100/80 leading-relaxed">
                  You have <span className="font-mono font-bold text-white">{remaining} AP</span> remaining. These do not carry over to the next round.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 py-2 px-1 border-t border-white/5 pt-4">
            <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Up Next:</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
              <span className="text-sm font-bold text-white/80">Player {nextPlayer}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 px-6 py-4 flex items-center justify-end gap-3 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest">
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary-hover active:scale-95 shadow-glow"
          >
            COMMIT TO TIMELINE
            <span className="material-symbols-outlined text-sm">history_edu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndTurnModal;
