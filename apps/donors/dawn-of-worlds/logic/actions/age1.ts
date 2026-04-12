
import { ActionDef, WorldEvent } from '../../types';
import { combineValidations, requireHexSelection, requireWorldSelection, requireAp } from './shared';
import { buildCreateEvent, buildModifyEvent } from './builders';

export const age1Actions: Record<string, ActionDef> = {
  A1_ADD_TERRAIN: {
    id: "A1_ADD_TERRAIN",
    label: "Add Terrain",
    age: 1,
    baseCost: 2,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 2)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 2, "TERRAIN", sel, {
      attrs: { biome: (sel as any).biome || 'plains' }
    }),
  },
  A1_ADD_WATER: {
    id: "A1_ADD_WATER",
    label: "Add River / Sea",
    age: 1,
    baseCost: 2,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 2)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 2, "WATER", sel, {
      attrs: { biome: 'water' }
    }),
  },
  A1_NAME_REGION: {
    id: "A1_NAME_REGION",
    label: "Name Region",
    age: 1,
    baseCost: 1,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 1)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 1, "REGION", sel, {
      name: "Unnamed Region"
    }),
  },
  A1_CREATE_LANDMARK: {
    id: "A1_CREATE_LANDMARK",
    label: "Create Landmark",
    age: 1,
    baseCost: 3,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 3)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 3, "LANDMARK", sel, {
      name: "Strange Landmark"
    }),
  },
  A1_SHAPE_CLIMATE: {
    id: "A1_SHAPE_CLIMATE",
    label: "Shape Climate",
    age: 1,
    baseCost: 2,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => requireHexSelection(sel),
      () => requireAp(state, 2)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 2, "CLIMATE", sel, {
      attrs: { biome: (sel as any).biome || 'arctic' }
    }),
  },
  A1_CREATE_AVATAR: {
    id: "A1_CREATE_AVATAR",
    label: "Create Avatar",
    age: 1,
    baseCost: 10,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age > 1 ? { ok: false, reason: "Use Age-specific action." } : { ok: true },
      () => requireHexSelection(sel),
      () => requireAp(state, 10)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 10, "AVATAR", sel, {
      name: "Great Spirit"
    }),
  },
  A1_CREATE_ORDER: {
    id: "A1_CREATE_ORDER",
    label: "Create Order",
    age: 1,
    baseCost: 8,
    target: "HEX",
    validate: (state, sel) => combineValidations(
      () => state.age > 1 ? { ok: false, reason: "Use Age-specific action." } : { ok: true },
      () => requireHexSelection(sel),
      () => requireAp(state, 8)
    ),
    buildEvent: (state, sel) => buildCreateEvent(state, 8, "ORDER", sel, {
      name: "Primordial Cult"
    }),
  },
  A1_CATASTROPHE: {
    id: "A1_CATASTROPHE",
    label: "Catastrophe",
    age: 1,
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
  A1_PURIFY: {
    id: "A1_PURIFY",
    label: "Purify",
    age: 1,
    baseCost: 5,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => requireWorldSelection(sel),
      () => requireAp(state, 5)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 5, (sel as any).worldId, [
      { op: "set", path: "attrs.alignment", value: "GOOD" }
    ]),
  },
  A1_CORRUPT: {
    id: "A1_CORRUPT",
    label: "Corrupt",
    age: 1,
    baseCost: 5,
    target: "WORLD",
    validate: (state, sel) => combineValidations(
      () => requireWorldSelection(sel),
      () => requireAp(state, 5)
    ),
    buildEvent: (state, sel) => buildModifyEvent(state, 5, (sel as any).worldId, [
      { op: "set", path: "attrs.alignment", value: "EVIL" }
    ]),
  },
};
