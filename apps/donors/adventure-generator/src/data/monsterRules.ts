import { AlignTendency, Axis } from '../types/monsterGrammar';

export const MONSTER_TYPES = [
    "Aberration", "Beast", "Celestial", "Construct", "Dragon", "Elemental", 
    "Fey", "Fiend", "Giant", "Humanoid", "Monstrosity", "Ooze", "Plant", "Undead"
];

export const CREATURE_ROLES = [
    { name: "Brute", value: "Brute", description: "High damage and high hit points, simple tactics." },
    { name: "Controller", value: "Controller", description: "Debuffs and manipulates the battlefield." },
    { name: "Skirmisher", value: "Skirmisher", description: "Highly mobile, hit-and-run tactics." },
    { name: "Artillery", value: "Artillery", description: "Fights from a distance, weak in melee." },
    { name: "Soldier", value: "Soldier", description: "Protects allies by drawing enemy attention." },
    { name: "Leader", value: "Leader", description: "Buffs allies and coordinates attacks." },
    { name: "Support", value: "Support", description: "Heals and protects allies." },
    { name: "Ambusher", value: "Ambusher", description: "Hides and strikes, focusing on single targets." },
    { name: "Minion", value: "Minion", description: "Fights in groups, dangerous in numbers." },
    { name: "Solo", value: "Solo", description: "A single, powerful boss with legendary actions." },
];

export const ALIGNMENTS: { value: AlignTendency, name: string }[] = [
    { value: "LG", name: "Lawful Good" },
    { value: "NG", name: "Neutral Good" },
    { value: "CG", name: "Chaotic Good" },
    { value: "LN", name: "Lawful Neutral" },
    { value: "N", name: "True Neutral" },
    { value: "CN", name: "Chaotic Neutral" },
    { value: "LE", name: "Lawful Evil" },
    { value: "NE", name: "Neutral Evil" },
    { value: "CE", name: "Chaotic Evil" },
];

export const ROLE_AXIS_BUDGETS: Record<string, Record<Axis, number>> = {
  Brute:      { Offense:0.45, Defense:0.35, Control:0.10, Mobility:0.05, Utility:0.05 },
  Controller: { Offense:0.20, Defense:0.20, Control:0.45, Mobility:0.10, Utility:0.05 },
  Skirmisher: { Offense:0.35, Defense:0.20, Control:0.15, Mobility:0.25, Utility:0.05 },
  Artillery:  { Offense:0.45, Defense:0.15, Control:0.20, Mobility:0.10, Utility:0.10 },
  Soldier:    { Offense:0.25, Defense:0.40, Control:0.20, Mobility:0.10, Utility:0.05 },
  Leader:     { Offense:0.15, Defense:0.20, Control:0.40, Mobility:0.10, Utility:0.15 },
  Support:    { Offense:0.10, Defense:0.20, Control:0.35, Mobility:0.10, Utility:0.25 },
  Ambusher:   { Offense:0.40, Defense:0.15, Control:0.15, Mobility:0.25, Utility:0.05 },
  Minion:     { Offense:0.30, Defense:0.10, Control:0.05, Mobility:0.20, Utility:0.05 },
  Solo:       { Offense:0.35, Defense:0.35, Control:0.20, Mobility:0.05, Utility:0.05 },
};

export const CR_TABLE: Record<number, { ac: number; hp: [number, number]; dpr: [number, number]; atk: number; dc: number; xp: number; }> = {
  0:  { ac:13, hp:[1,6],     dpr:[0,1],     atk:3, dc:10, xp: 10 },
  1:  { ac:13, hp:[15,18],   dpr:[9,14],    atk:3, dc:12, xp: 200 },
  2:  { ac:13, hp:[30,46],   dpr:[15,19],   atk:3, dc:12, xp: 450 },
  3:  { ac:13, hp:[46,60],   dpr:[20,25],   atk:4, dc:13, xp: 700 },
  4:  { ac:14, hp:[60,75],   dpr:[26,30],   atk:5, dc:14, xp: 1100 },
  5:  { ac:15, hp:[80,95],   dpr:[31,36],   atk:6, dc:15, xp: 1800 },
  6:  { ac:15, hp:[95,110],  dpr:[37,42],   atk:6, dc:15, xp: 2300 },
  7:  { ac:15, hp:[110,125], dpr:[43,48],   atk:6, dc:15, xp: 2900 },
  8:  { ac:16, hp:[125,140], dpr:[49,54],   atk:7, dc:16, xp: 3900 },
  9:  { ac:16, hp:[140,155], dpr:[55,60],   atk:7, dc:16, xp: 5000 },
  10: { ac:17, hp:[155,170], dpr:[61,66],   atk:7, dc:16, xp: 5900 },
  11: { ac:17, hp:[170,185], dpr:[67,72],   atk:8, dc:17, xp: 7200 },
  12: { ac:17, hp:[185,200], dpr:[73,78],   atk:8, dc:17, xp: 8400 },
  13: { ac:18, hp:[200,215], dpr:[79,84],   atk:8, dc:18, xp: 10000 },
  14: { ac:18, hp:[215,230], dpr:[85,90],   atk:8, dc:18, xp: 11500 },
  15: { ac:18, hp:[230,245], dpr:[91,96],   atk:8, dc:18, xp: 13000 },
  16: { ac:18, hp:[245,260], dpr:[97,102],  atk:9, dc:18, xp: 15000 },
  17: { ac:19, hp:[260,275], dpr:[103,108], atk:10, dc:19, xp: 18000 },
  18: { ac:19, hp:[275,290], dpr:[109,114], atk:10, dc:19, xp: 20000 },
  19: { ac:19, hp:[290,305], dpr:[115,120], atk:10, dc:19, xp: 22000 },
  20: { ac:19, hp:[305,320], dpr:[121,126], atk:10, dc:19, xp: 25000 },
  21: { ac:19, hp:[320,335], dpr:[127,132], atk:11, dc:20, xp: 33000 },
  22: { ac:19, hp:[335,350], dpr:[133,138], atk:11, dc:20, xp: 41000 },
  23: { ac:19, hp:[350,365], dpr:[139,144], atk:11, dc:20, xp: 50000 },
  24: { ac:19, hp:[365,380], dpr:[145,150], atk:12, dc:21, xp: 62000 },
  25: { ac:19, hp:[380,395], dpr:[151,156], atk:12, dc:21, xp: 75000 },
  26: { ac:19, hp:[395,410], dpr:[157,162], atk:13, dc:22, xp: 90000 },
  27: { ac:19, hp:[410,425], dpr:[163,168], atk:13, dc:22, xp: 105000 },
  28: { ac:20, hp:[425,440], dpr:[169,174], atk:14, dc:23, xp: 120000 },
  29: { ac:20, hp:[440,455], dpr:[175,180], atk:14, dc:23, xp: 135000 },
  30: { ac:21, hp:[455,470], dpr:[181,186], atk:15, dc:23, xp: 155000 },
};

export const ROLE_SCALING: Record<string, { hpMult: number; acMod: number; dprMod: number; utilityBonus?: boolean; }> = {
  Brute:      { hpMult: 1.30, acMod: -1, dprMod: 2 },
  Artillery:  { hpMult: 0.80, acMod: 0,  dprMod: 4 },
  Skirmisher: { hpMult: 0.85, acMod: 1,  dprMod: 1 },
  Soldier:    { hpMult: 1.10, acMod: 1, dprMod: 0 },
  Controller: { hpMult: 0.90, acMod: 0,  dprMod: -1 },
  Leader:     { hpMult: 1.00, acMod: 0,  dprMod: -2, utilityBonus: true },
  Support:    { hpMult: 0.90, acMod: 0,  dprMod: -3, utilityBonus: true },
};
