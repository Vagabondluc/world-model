import { z } from 'zod';

// --- Primitives ---

export const AgeSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const PlayerIdSchema = z.string();

export const MapSizeSchema = z.enum(['SMALL', 'STANDARD', 'GRAND']);

export const HexSchema = z.object({
  q: z.number(),
  r: z.number(),
});

export const SelectionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("NONE") }),
  z.object({ kind: z.literal("HEX"), hex: HexSchema }),
  z.object({ kind: z.literal("WORLD"), worldId: z.string() }),
]);

// --- Chat ---

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number(),
  senderId: PlayerIdSchema,
  targetId: PlayerIdSchema.optional(), // undefined = global
  content: z.string(),
  type: z.enum(['CHAT', 'SYSTEM']).default('CHAT'),
});

// --- Config ---

export const PlayerConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  avatar: z.string(),
  domain: z.string(),
  secret: z.string().optional(),
  isHuman: z.boolean(),
  isReady: z.boolean().optional(),
});

export const WorldGenSchema = z.object({
  waterLevel: z.number().min(0).max(1).default(0.5),
  mountainDensity: z.number().min(0).max(1).default(0.3),
  forestDensity: z.number().min(0).max(1).default(0.4),
  seed: z.number().int().default(() => Math.floor(Math.random() * 1000000)),
});

export const GameSessionConfigSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  lastPlayed: z.number(),
  worldName: z.string(),
  mapSize: MapSizeSchema,
  initialAge: AgeSchema,
  players: z.array(PlayerConfigSchema),
  rules: z.object({
    strictAP: z.boolean(),
    draftMode: z.boolean(),
  }),
  worldGen: WorldGenSchema.default({ waterLevel: 0.5, mountainDensity: 0.3, forestDensity: 0.4, seed: 12345 }),
});

// --- World ---

export const WorldKindSchema = z.enum([
  "TERRAIN",
  "CLIMATE",
  "WATER",
  "REGION",
  "LANDMARK",
  "RACE",
  "SUBRACE",
  "SETTLEMENT",
  "CITY",
  "CULTURE_TAG",
  "NATION",
  "BORDER",
  "TREATY",
  "WAR",
  "PROJECT",
  "AVATAR",
  "ORDER",
  "ARMY",
  "EVENT",
  "CATASTROPHE",
  "LABEL"
]);

export const WorldObjectSchema = z.object({
  id: z.string().uuid(),
  kind: WorldKindSchema,
  name: z.string().optional(),
  hexes: z.array(HexSchema),
  attrs: z.record(z.string(), z.any()),
  createdBy: PlayerIdSchema.optional(),
  createdRound: z.number().optional(),
  createdTurn: z.number().optional(),
  createdAge: AgeSchema.optional(),
  isNamed: z.boolean(),
});

// --- Events ---

export const BaseEventSchema = z.object({
  id: z.string().uuid(),
  ts: z.number(),
  playerId: PlayerIdSchema,
  age: AgeSchema,
  round: z.number(),
  turn: z.number(),
});

const WorldCreateSchema = BaseEventSchema.extend({
  type: z.literal("WORLD_CREATE"),
  cost: z.number(),
  payload: z.object({
    worldId: z.string(),
    kind: WorldKindSchema,
    name: z.string().optional(),
    hexes: z.array(HexSchema).optional(),
    attrs: z.record(z.string(), z.any()).optional(),
  })
});

const PatchOpSchema = z.union([
  z.object({ op: z.literal("set"), path: z.string(), value: z.any() }),
  z.object({ op: z.literal("unset"), path: z.string() }),
  z.object({ op: z.literal("addHex"), hexes: z.array(HexSchema) }),
  z.object({ op: z.literal("removeHex"), hexes: z.array(HexSchema) }),
]);

const WorldModifySchema = BaseEventSchema.extend({
  type: z.literal("WORLD_MODIFY"),
  cost: z.number(),
  payload: z.object({
    worldId: z.string(),
    patch: z.array(PatchOpSchema),
  }),
});

const WorldDeleteSchema = BaseEventSchema.extend({
  type: z.literal("WORLD_DELETE"),
  cost: z.number(),
  payload: z.object({ worldId: z.string() }),
});

export const WorldEventSchema = z.discriminatedUnion("type", [WorldCreateSchema, WorldModifySchema, WorldDeleteSchema]);

export const TurnEventSchema = z.discriminatedUnion("type", [
  BaseEventSchema.extend({ type: z.literal("TURN_BEGIN"), payload: z.object({ playerId: PlayerIdSchema }) }),
  BaseEventSchema.extend({ type: z.literal("TURN_END"), payload: z.object({ playerId: PlayerIdSchema }) }),
  BaseEventSchema.extend({ type: z.literal("ROUND_END"), payload: z.object({ round: z.number() }) }),
  BaseEventSchema.extend({ type: z.literal("AGE_ADVANCE"), payload: z.object({ from: AgeSchema, to: z.union([AgeSchema, z.literal(4)]) }) }),
]);

export const QolEventSchema = z.discriminatedUnion("type", [
  BaseEventSchema.extend({
    type: z.literal("EVENT_REVOKE"),
    payload: z.object({ targetEventIds: z.array(z.string()), reason: z.string().optional() }),
  }),
  BaseEventSchema.extend({
    type: z.literal("DRAFT_ROLLBACK_USED"),
    payload: z.object({ age: AgeSchema }),
  }),
]);

export const EconomyEventSchema = z.discriminatedUnion("type", [
  BaseEventSchema.extend({
    type: z.literal("POWER_ROLL"),
    payload: z.object({ 
      roll: z.tuple([z.number(), z.number()]),
      bonus: z.number(),
      result: z.number()
    })
  })
]);

const CombatResolveSchema = BaseEventSchema.extend({
  type: z.literal("COMBAT_RESOLVE"),
  payload: z.object({
    attackerId: z.string(),
    defenderId: z.string(),
    rolls: z.object({
      attacker: z.tuple([z.number(), z.number()]),
      defender: z.tuple([z.number(), z.number()]),
      modifiers: z.object({ attacker: z.number(), defender: z.number() })
    }),
    outcome: z.enum(["ATTACKER_WINS", "DEFENDER_WINS", "DRAW"]),
    consequence: z.string()
  })
});

const WorldSnapshotSchema = BaseEventSchema.extend({
  type: z.literal("WORLD_SNAPSHOT"),
  payload: z.object({
    cacheSnapshot: z.array(z.tuple([z.string(), WorldObjectSchema])),
    lastEventId: z.string().optional(),
  }),
});

export const GameEventSchema = z.union([
  WorldEventSchema,
  TurnEventSchema,
  QolEventSchema,
  EconomyEventSchema,
  CombatResolveSchema,
  WorldSnapshotSchema,
  BaseEventSchema.extend({
    type: z.literal("CHAT_MESSAGE"),
    payload: ChatMessageSchema
  })
]);