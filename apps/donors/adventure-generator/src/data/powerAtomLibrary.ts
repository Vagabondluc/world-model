
import { PowerAtom } from '../types/monsterGrammar';

// This file serves as a library of atomic power fragments.
// The `cost` is a placeholder; the rules engine will assign real costs.
// The {damage} placeholder will be replaced by the CR-scaling logic.

const A = (p: Partial<PowerAtom> & { id: string; text: string; axis: PowerAtom['axis']; damage?: string }): PowerAtom => ({
    label: p.id.replace(/:/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    cost: 0.1,
    tags: [],
    actionType: 'Action',
    ...p
});

export const FIRE_PACK: PowerAtom[] = [
  A({ id: "fire:bolt", axis: "Offense", damage: "2d6 fire", text: "**Fire Bolt.** *Ranged Spell Attack:* +{atk} to hit, 120 ft.; {damage}." }),
  A({ id: "fire:cone", axis: "Offense", damage: "3d6 fire", text: "**Burning Cone (Recharge 5–6).** 15-ft cone; Dex save {dc}; {damage} on fail, half on success." }),
  A({ id: "fire:aura", axis: "Defense", damage: "1d6 fire", text: "**Searing Aura.** Creatures starting turn within 5 ft. take {damage}." }),
];

export const COLD_PACK: PowerAtom[] = [
  A({ id: "cold:slow-bolt", axis: "Control", text: "**Frost Bolt.** 60 ft.; target’s speed is reduced by 10 ft. until next turn." }),
  A({ id: "cold:ice-slick", axis: "Control", text: "**Ice Slick (Recharge 5–6).** 10-ft radius becomes difficult terrain; Dex save {dc} or fall prone." }),
  A({ id: "cold:armor", axis: "Defense", text: "**Frozen Armor.** AC +2 until it takes fire damage." }),
];

export const LIGHTNING_PACK: PowerAtom[] = [
  A({ id: "lightning:dash", axis: "Mobility", text: "**Flash Step (Bonus Action).** Teleport up to 15 ft." }),
  A({ id: "lightning:chain", axis: "Offense", damage: "2d8 lightning", text: "**Chain Lightning Strike.** Hit one target for {damage}; arcs to second target for half." }),
];

export const ALL_POWER_ATOMS: PowerAtom[] = [
    ...FIRE_PACK,
    ...COLD_PACK,
    ...LIGHTNING_PACK,
    // Future packs (NECROTIC, POISON, etc.) would be added here.
];
