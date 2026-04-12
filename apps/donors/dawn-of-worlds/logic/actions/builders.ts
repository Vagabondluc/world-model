import { GameState, Selection, WorldEvent } from '../../types';
import { createBaseEvent } from './shared';

export const buildCreateEvent = (
    state: GameState,
    cost: number,
    kind: string,
    selection: Selection,
    options?: {
        name?: string;
        attrs?: Record<string, any>;
        worldId?: string;
    }
): WorldEvent => ({
    ...createBaseEvent(state, cost),
    type: "WORLD_CREATE",
    payload: {
        worldId: options?.worldId || crypto.randomUUID(),
        kind,
        name: options?.name,
        hexes: selection.kind === "HEX" ? [selection.hex] : undefined,
        attrs: options?.attrs
    }
});

export const buildModifyEvent = (
    state: GameState,
    cost: number,
    worldId: string,
    patch: any[]
): WorldEvent => ({
    ...createBaseEvent(state, cost),
    type: "WORLD_MODIFY",
    payload: {
        worldId,
        patch
    }
});
