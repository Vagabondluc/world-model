import { GameState } from '../types';
import { serializeState } from '../logic/serialization';

export interface ExportOptions {
    filename?: string;
    includeMetadata?: boolean;
}

export const exportGameState = (state: GameState, options?: ExportOptions): void => {
    const data = options?.includeMetadata
        ? {
            gameId: state.config?.id || "dawn-01",
            exportedAt: new Date().toISOString(),
            state: serializeState(state)
        }
        : serializeState(state);

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = options?.filename || `dawn-world-${state.config?.worldName || 'save'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};
