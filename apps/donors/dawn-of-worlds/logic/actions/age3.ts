
import { ActionDef, WorldEvent } from '../../types';
import { existsKindAtHex, isAdjacentToKind } from '../selectors';
import { combineValidations, requireHexSelection, requireWorldSelection, requireAp } from './shared';
import { buildCreateEvent, buildModifyEvent } from './builders';

export const age3Actions: Record<string, ActionDef> = {
  A3_FOUND_NATION: {
    id: "A3_FOUND_NATION",
    label: "Found Nation",
    age: 3,
    baseCost: 3,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 3 ? { ok: false, reason: "Forbidden until Age III." } : { ok: true },
      () => requireHexSelection(sel),
      () => !existsKindAtHex(state, (sel as any).hex, "SETTLEMENT") ? { ok: false, reason: "Requires Capital City." } : { ok: true },
      () => requireAp(state, 3)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 3, "NATION", sel, {
      name: "Sovereign State"
    }),
  },
  A3_CLAIM_BORDER: {
    id: "A3_CLAIM_BORDER",
    label: "Claim Border",
    age: 3,
    baseCost: 2,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 3 ? { ok: false, reason: "Forbidden until Age III." } : { ok: true },
      () => requireHexSelection(sel),
      () => (!isAdjacentToKind(state, (sel as any).hex, "NATION") && !isAdjacentToKind(state, (sel as any).hex, "BORDER"))
        ? { ok: false, reason: "Must be adjacent to your territory." }
        : { ok: true },
      () => requireAp(state, 2)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 2, "BORDER", sel, {}),
  },
  A3_SHAPE_CLIMATE: {
    id: "A3_SHAPE_CLIMATE",
    label: "Shape Climate",
    age: 3,
    baseCost: 6,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 6)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 6, "CLIMATE", sel, {
      attrs: { biome: (sel as any).biome || 'wasteland' }
    }),
  },
  A3_DECLARE_WAR: {
    id: "A3_DECLARE_WAR",
    label: "Declare War",
    age: 3,
    baseCost: 4,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => state.age < 3 ? { ok: false, reason: "Forbidden until Age III." } : { ok: true },
      () => requireWorldSelection(sel),
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 4, (sel as any).worldId, [
      { op: "set", path: "attrs.status", value: "AT_WAR" }
    ]),
  },
  A3_SIGN_TREATY: {
    id: "A3_SIGN_TREATY",
    label: "Sign Treaty",
    age: 3,
    baseCost: 2,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => state.age < 3 ? { ok: false, reason: "Forbidden until Age III." } : { ok: true },
      () => requireWorldSelection(sel),
      () => requireAp(state, 2)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 2, (sel as any).worldId, [
      { op: "set", path: "attrs.status", value: "PEACE_TREATY" }
    ]),
  },
  A3_GREAT_PROJECT: {
    id: "A3_GREAT_PROJECT",
    label: "Great Project",
    age: 3,
    baseCost: 4,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 3 ? { ok: false, reason: "Forbidden until Age III." } : { ok: true },
      () => requireHexSelection(sel),
      () => !existsKindAtHex(state, (sel as any).hex, "SETTLEMENT") ? { ok: false, reason: "Requires local City." } : { ok: true },
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 4, "PROJECT", sel, {
      name: "Grand Wonder"
    }),
  },
  A3_CREATE_AVATAR: {
    id: "A3_CREATE_AVATAR",
    label: "Create Avatar",
    age: 3,
    baseCost: 8,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 8)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 8, "AVATAR", sel, {
      name: "God-King"
    }),
  },
  A3_CREATE_ORDER: {
    id: "A3_CREATE_ORDER",
    label: "Create Order",
    age: 3,
    baseCost: 4,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => !existsKindAtHex(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Requires Race to host Order." } : { ok: true },
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 4, "ORDER", sel, {
      name: "Political Party"
    }),
  },
  A3_CREATE_SUBRACE: {
    id: "A3_CREATE_SUBRACE",
    label: "Create Subrace",
    age: 3,
    baseCost: 10,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age < 3 ? { ok: false, reason: "Forbidden until Age III." } : { ok: true },
      () => requireHexSelection(sel),
      () => !isAdjacentToKind(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Must be adjacent to existing Race." } : { ok: true },
      () => existsKindAtHex(state, (sel as any).hex, "RACE") ? { ok: false, reason: "Hex already occupied by Race." } : { ok: true },
      () => requireAp(state, 10)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 10, "RACE", sel, {
      name: "Late-Era Divergence",
      attrs: { isSubrace: true }
    }),
  },
  A3_PURIFY: {
    id: "A3_PURIFY",
    label: "Purify",
    age: 3,
    baseCost: 4,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => requireWorldSelection(sel),
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 4, (sel as any).worldId, [
      { op: "set", path: "attrs.alignment", value: "GOOD" }
    ]),
  },
  A3_CORRUPT: {
    id: "A3_CORRUPT",
    label: "Corrupt",
    age: 3,
    baseCost: 4,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => requireWorldSelection(sel),
      () => requireAp(state, 4)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 4, (sel as any).worldId, [
      { op: "set", path: "attrs.alignment", value: "EVIL" }
    ]),
  },
  A3_CATASTROPHE: {
    id: "A3_CATASTROPHE",
    label: "Catastrophe",
    age: 3,
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
