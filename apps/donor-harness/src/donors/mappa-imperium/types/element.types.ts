import { HexCoordinate } from './map.types';

export interface Resource {
    id: string;
    name: string;
    type: 'mineral' | 'flora' | 'fauna' | 'magical' | 'other';
    properties: string;
    symbol: string;
    location?: HexCoordinate;
}

export interface Deity {
    id: string;
    name: string;
    domain: string;
    symbol: string; // Descriptive text
    emoji: string;  // Visual emoji for map
    description: string;
}

export interface Location {
    id: string;
    name: string;
    siteType: string;
    description: string;
    symbol: string;
    deityId?: string; // ID of the associated Deity ElementCard
}

export interface Faction {
    id: string;
    name: string;
    race: string;
    symbolName: string; // From the rulebook table, e.g., "Flame", "Horse"
    emoji: string;      // Visual emoji for the map, e.g., "🔥", "🐎"
    color: string;
    theme: string;
    description: string;
    leaderName: string;
    capitalName?: string; // Name of the capital city
    isNeighbor: boolean;
    neighborType?: string; // The specific type from the neighbor table, e.g., "Tribe or Clan"
    industry?: string;
    industryDescription?: string;
}

export interface Settlement {
    id: string;
    name: string;
    purpose: string;
    description: string;
    factionId?: string; // ID of the owning Faction ElementCard
    notes?: string;
}

export interface Event {
    id: string;
    name: string;
    description: string;
    factionId?: string; // For linking neighbor development events
}

export interface Character {
    id: string;
    name: string;
    description: string;
    factionId?: string;
}

export interface War {
    id: string;
    name: string;
    description: string;
    attackers: string[];
    defenders: string[];
}

export interface Monument {
    id: string;
    name: string;
    description: string;
    locationId?: string;
}

export interface ElementCard {
    id: string;
    type: 'Resource' | 'Deity' | 'Location' | 'Faction' | 'Settlement' | 'Event' | 'Character' | 'War' | 'Monument';
    name: string;
    desc?: string;
    owner: number; // playerNumber
    era: number;
    data: Resource | Deity | Location | Faction | Settlement | Event | Character | War | Monument;
    isDebug?: boolean;
    createdYear?: number;
    creationStep?: string;
    location?: HexCoordinate;
}
