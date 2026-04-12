
import React, { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '../../store/gameStore';
import { selectDebugState } from '../../logic/selectors/debugSelectors';
import { useDebugActions } from '../../hooks/useDebugActions';

export default function DebugDashboard() {
    const [isVisible, setIsVisible] = useState(false);
    const actions = useDebugActions();

    // Select atomic values to avoid object reference stability issues
    const eraName = useGameStore(state => `Age ${state.age}`);
    const eraIndex = useGameStore(state => state.age);
    const power = useGameStore(state => state.playerCache[state.activePlayerId]?.currentPower || 0);
    const unitCount = useGameStore(state => Array.from(state.worldCache.values()).filter(obj => obj.kind === 'UNIT' || obj.kind === 'ARMY').length);
    const objectCount = useGameStore(state => state.worldCache.size);
    const debugState = {
        era: { name: eraName, index: eraIndex },
        resources: { power },
        units: { length: unitCount },
        world: { objectCount }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + Backtick (`) or Tilde (~) OR Ctrl + Shift + D
            if (
                (e.ctrlKey && (e.key === '`' || e.key === '~')) ||
                (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')
            ) {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            id="antigravity-debug-overlay"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '400px',
                maxHeight: '80vh',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                color: '#0f0',
                fontFamily: 'monospace',
                zIndex: 9999,
                padding: '10px',
                border: '1px solid #0f0',
                overflowY: 'auto',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,255,0,0.2)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #0f0' }}>
                <strong>AG BROWSER CONTROL</strong>
                <button onClick={() => setIsVisible(false)} style={{ background: 'none', border: 'none', color: '#0f0', cursor: 'pointer' }}>[X]</button>
            </div>

            {/* Hidden Data Dump for AI Analysis */}
            <pre
                id="ag-debug-state-dump"
                data-testid="game-state-json"
                style={{ display: 'block', height: '1px', overflow: 'hidden', opacity: 0.1, margin: 0 }}
            >
                {JSON.stringify(debugState, null, 2)}
            </pre>

            <div className="debug-section" style={{ marginBottom: '10px' }}>
                <div><strong>STATE OVERVIEW</strong></div>
                <div>Age: {debugState.era.name} (idx: {debugState.era.index})</div>
                <div>Power: {debugState.resources.power}</div>
                <div>Units: {debugState.units.length}</div>
                <div>Objects: {debugState.world.objectCount}</div>
            </div>

            <div className="debug-controls" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                <button
                    data-testid="debug-action-res-add-power"
                    onClick={() => actions.addPower(10)}
                    style={btnStyle}
                >
                    +10 Power
                </button>
                <button
                    data-testid="debug-action-res-add-power-1000"
                    onClick={() => actions.addPower(1000)}
                    style={btnStyle}
                >
                    +1000 Power
                </button>
                <button
                    data-testid="debug-action-era-next"
                    onClick={() => actions.advanceEra()}
                    style={btnStyle}
                >
                    Advance Era
                </button>
                <button
                    data-testid="debug-action-era-unlock-tech"
                    onClick={() => actions.unlockAllTech()}
                    style={btnStyle}
                >
                    Unlock All Tech
                </button>
            </div>
        </div>
    );
}

const btnStyle = {
    backgroundColor: '#003300',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '5px',
    cursor: 'pointer',
    textAlign: 'center' as const,
    fontSize: '12px'
};
