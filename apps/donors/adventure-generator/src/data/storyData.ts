import { SceneTypeOption } from '../types/scene';

export const SCENE_TYPE_OPTIONS: SceneTypeOption[] = ['Exploration', 'Combat', 'NPC Interaction', 'Dungeon'];

export const FACTION_CATEGORIES = [
    "Government & Authority", "Religious Organizations", "Criminal Enterprises",
    "Economic & Trade", "Arcane & Scholarly", "Adventuring & Mercenary",
    "Racial & Cultural", "Ideological & Revolutionary", "Secret & Shadow",
    "Planar & Extraplanar", "Environmental & Territorial"
] as const;
