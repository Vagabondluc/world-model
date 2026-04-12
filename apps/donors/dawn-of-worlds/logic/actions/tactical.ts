import { ActionDef, WorldEvent } from '../../types';
import { combineValidations, requireHexSelection, requireAp } from './shared';
import { createBaseEvent } from './shared';

// Helper for building tactical events since they might differ slightly from God Actions
const buildTacticalEvent = (
    state: any,
    cost: number,
    type: string,
    payload: any
): WorldEvent => ({
    ...createBaseEvent(state, cost),
    type: type as any, // logical cast, as these might be new event types
    payload
});

export const tacticalActions: Record<string, ActionDef> = {
    TAC_MOVE_UNIT: {
        id: "TAC_MOVE_UNIT",
        label: "Move Unit",
        age: 3, // Assuming Tactical layer is available in Age 3 or always
        baseCost: 1,
        target: "HEX",
        validate: (state, sel) => combineValidations(
            () => requireHexSelection(sel),
            () => requireAp(state, 1)
            // Add check for unit ownership/existence
        ),
        buildEvent: (state, sel) => buildTacticalEvent(state, 1, "MOVE_UNIT", {
            to: (sel as any).hex,
            unitId: (sel as any).unitId // Needs to be injected by context or selection
        }),
    },

    TAC_ATTACK_TILE: {
        id: "TAC_ATTACK_TILE",
        label: "Attack Tile",
        age: 3,
        baseCost: 2,
        target: "HEX",
        validate: (state, sel) => combineValidations(
            () => requireHexSelection(sel),
            () => requireAp(state, 2)
        ),
        buildEvent: (state, sel) => buildTacticalEvent(state, 2, "ATTACK_TILE", {
            target: (sel as any).hex,
            attackerId: (sel as any).unitId
        }),
    },

    TAC_FORTIFY: {
        id: "TAC_FORTIFY",
        label: "Fortify",
        age: 3,
        baseCost: 1,
        target: "HEX", // Targeting the unit at the hex
        validate: (state, sel) => combineValidations(
            () => requireHexSelection(sel),
            () => requireAp(state, 1)
        ),
        buildEvent: (state, sel) => buildTacticalEvent(state, 1, "UNIT_FORTIFY", {
            location: (sel as any).hex,
            unitId: (sel as any).unitId
        }),
    }
};
