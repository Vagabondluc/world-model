import type { DebugData, UnifiedDebugSystemProps } from '../types/debugTypes';

export const exportDebugReport = (debugData: DebugData, props: Omit<UnifiedDebugSystemProps, 'isOpen' | 'onClose' | 'onImportGameData'>) => {
    const report = {
      timestamp: new Date().toISOString(),
      ...debugData,
      gameState: {
        currentEra: props.currentEra,
        completedEras: props.completedEras,
        players: props.players.map(p => ({ name: p.name, playerNumber: p.playerNumber }))
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mappa-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};