import { WorldObject, Hex, GameEvent, QolSettings } from '../types';
import { hexToKey } from './geometry';

function mergeHexes(a: Hex[], b: Hex[]): Hex[] {
  const s = new Map<string, Hex>();
  for (const h of a) s.set(hexToKey(h), h);
  for (const h of b) s.set(hexToKey(h), h);
  return [...s.values()];
}

function removeHexes(a: Hex[], b: Hex[]): Hex[] {
  const remove = new Set(b.map(hexToKey));
  return a.filter(h => !remove.has(hexToKey(h)));
}

function applyEvent(world: Map<string, WorldObject>, evt: GameEvent, settings: QolSettings) {
  if (evt.type === "WORLD_CREATE") {
    const { worldId, kind, name, hexes, attrs } = evt.payload;
    world.set(worldId, {
      id: worldId,
      kind,
      name,
      hexes: hexes ?? [],
      attrs: attrs ?? {},
      createdBy: settings.social.ownershipTags === "SOFT" ? evt.playerId : undefined,
      createdAge: evt.age,
      createdRound: evt.round,
      createdTurn: evt.turn,
      isNamed: Boolean(name && name.trim().length > 0),
    });
  } else if (evt.type === "WORLD_MODIFY") {
    const obj = world.get(evt.payload.worldId);
    if (obj) {
      const newObj = { ...obj, attrs: { ...obj.attrs } };
      for (const op of evt.payload.patch) {
        if (op.op === "set") {
          if (op.path === "name") {
            newObj.name = op.value;
            newObj.isNamed = Boolean(op.value && op.value.trim());
          } else if (op.path.startsWith("attrs.")) {
            newObj.attrs[op.path.slice("attrs.".length)] = op.value;
          }
        } else if (op.op === "unset") {
          if (op.path.startsWith("attrs.")) {
            delete newObj.attrs[op.path.slice("attrs.".length)];
          }
        } else if (op.op === "addHex") {
          newObj.hexes = mergeHexes(newObj.hexes, op.hexes);
        } else if (op.op === "removeHex") {
          newObj.hexes = removeHexes(newObj.hexes, op.hexes);
        }
      }
      world.set(newObj.id, newObj);
    }
  } else if (evt.type === "WORLD_DELETE") {
    world.delete(evt.payload.worldId);
  }
}

/**
 * Incremental World Deriver (SPEC-014)
 * Patches the worldCache for O(1) updates unless a historical revocation occurs.
 * Handles WORLD_SNAPSHOT for log compaction.
 */
export function deriveWorld(
  events: GameEvent[],
  revokedIds: Set<string>,
  settings: QolSettings,
  prevCache?: Map<string, WorldObject>
): Map<string, WorldObject> {
  // Check for Snapshot
  let world = new Map<string, WorldObject>();
  let startIndex = 0;

  // Scan backwards for the most recent snapshot
  for (let i = events.length - 1; i >= 0; i--) {
    const evt = events[i];
    if (evt.type === 'WORLD_SNAPSHOT') {
      world = new Map(evt.payload.cacheSnapshot as [string, WorldObject][]);
      startIndex = i + 1;
      break;
    }
  }

  // Incremental Path (Only if no snapshot was found recently overriding the flow, OR if prevCache is valid)
  // Ensure prevCache is actually a Map instance to avoid runtime hydration errors
  if (startIndex === 0 && prevCache instanceof Map && events.length > 0) {
    const lastEvent = events[events.length - 1];
    const isRevoke = lastEvent.type === 'EVENT_REVOKE';
    const isSnapshot = lastEvent.type === 'WORLD_SNAPSHOT';

    if (!isRevoke && !isSnapshot) {
      const nextWorld = new Map(prevCache);
      applyEvent(nextWorld, lastEvent, settings);
      return nextWorld;
    }
  }

  // Full Rebuild (from startIndex)
  for (let i = startIndex; i < events.length; i++) {
    const evt = events[i];
    if (revokedIds.has(evt.id)) continue;
    applyEvent(world, evt, settings);
  }
  return world;
}