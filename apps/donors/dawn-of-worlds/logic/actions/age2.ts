
import { ActionDef, WorldEvent } from '../../types';
import { existsKindAtHex, isAdjacentToKind } from '../selectors';
import { combineValidations, requireHexSelection, requireWorldSelection, requireAp } from './shared';
import { buildCreateEvent, buildModifyEvent } from './builders';

export const age2Actions: Record<string, ActionDef> = {
  A2_CREATE_RACE: {
    id: "A2_CREATE_RACE",
    label: "Create Race",
    age: 2,
    baseCost: 2,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 2 ? { ok: false, reason: "Forbidden in Age I." } : { ok: true },
      () => requireHexSelection(sel),
      () => existsKindAtHex(state, (sel as any).hex, "WATER") ? { ok: false, reason: "Cannot spawn in deep water." } : { ok: true },
      () => requireAp(state, 2)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 2, "RACE", sel, {
      name: "Sentient Species"
    }),
  },
  A2_CREATE_SUBRACE: {
    id: "A2_CREATE_SUBRACE",
    label: "Create Subrace",
    age: 2,
    baseCost: 4,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 2 ? { ok: false, reason: "Forbidden in Age I." } : { ok: true },
      () => requireHexSelection(sel),
      () => !isAdjacentToKind(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Must be adjacent to existing Race." } : { ok: true },
      () => existsKindAtHex(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Hex already occupied by Race." } : { ok: true },
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 4, "RACE", sel, {
      name: "New Offshoot",
      attrs: { isSubrace: true }
    }),
  },
  A2_FOUND_CITY: {
    id: "A2_FOUND_CITY",
    label: "Found City",
    age: 2,
    baseCost: 3,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 2 ? { ok: false, reason: "Forbidden in Age I." } : { ok: true },
      () => requireHexSelection(sel),
      () => !existsKindAtHex(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Requires local Race." } : { ok: true },
      () => requireAp(state, 3)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 3, "SETTLEMENT", sel, {
      name: "Metropolis",
      attrs: { settlementType: 'CITY' }
    }),
  },
  A2_SHAPE_CLIMATE: {
    id: "A2_SHAPE_CLIMATE",
    label: "Shape Climate",
    age: 2,
    baseCost: 4,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 4, "CLIMATE", sel, {
      attrs: { biome: (sel as any).biome || 'tropical' }
    }),
  },
  A2_CREATE_AVATAR: {
    id: "A2_CREATE_AVATAR",
    label: "Create Avatar",
    age: 2,
    baseCost: 7,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age > 2 ? { ok: false, reason: "Use Age-specific action." } : { ok: true },
      () => requireHexSelection(sel),
      () => requireAp(state, 7)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 7, "AVATAR", sel, {
      name: "Legendary Hero"
    }),
  },
  A2_CREATE_ORDER: {
    id: "A2_CREATE_ORDER",
    label: "Create Order",
    age: 2,
    baseCost: 6,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age > 2 ? { ok: false, reason: "Use Age-specific action." } : { ok: true },
      () => requireHexSelection(sel),
      () => !existsKindAtHex(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Requires Race to host Order." } : { ok: true },
      () => requireAp(state, 6)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 6, "ORDER", sel, {
      name: "Secret Society"
    }),
  },
  A2_PURIFY: {
    id: "A2_PURIFY",
    label: "Purify",
    age: 2,
    baseCost: 3,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => requireWorldSelection(sel),
      () => requireAp(state, 3)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 3, (sel as any).worldId, [
      { op: "set", path: "attrs.alignment", value: "GOOD" }
    ]),
  },
  A2_CORRUPT: {
    id: "A2_CORRUPT",
    label: "Corrupt",
    age: 2,
    baseCost: 3,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => requireWorldSelection(sel),
      () => requireAp(state, 3)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 3, (sel as any).worldId, [
      { op: "set", path: "attrs.alignment", value: "EVIL" }
    ]),
  },
  A2_CATASTROPHE: {
    id: "A2_CATASTROPHE",
    label: "Catastrophe",
    age: 2,
    baseCost: 10,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 10)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 10, "CATASTROPHE", sel, {
      name: "Natural Disaster"
    }),
  },
};
