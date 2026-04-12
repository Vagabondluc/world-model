
import { WorldKind } from '../types';

export const ACTION_ICONS: Record<string, string> = {
    // Age 1
    A1_ADD_TERRAIN: 'terrain',
    A1_ADD_WATER: 'water',
    A1_NAME_REGION: 'edit_location_alt',
    A1_CREATE_LANDMARK: 'fort',

    // Age 2
    A2_CREATE_RACE: 'groups',
    A2_FOUND_CITY: 'apartment',
    A2_CREATE_SUBRACE: 'family_history',

    // Age 3
    A3_FOUND_NATION: 'public',
    A3_CLAIM_BORDER: 'shield',
    A3_DECLARE_WAR: 'swords',
    A3_SHAPE_CLIMATE: 'cloud',
    A3_SIGN_TREATY: 'handshake',
    A3_GREAT_PROJECT: 'foundation',
    A3_CREATE_AVATAR: 'person_celebrate',
    A3_CREATE_ORDER: 'local_police',
    A3_PURIFY: 'wb_sunny',
    A3_CORRUPT: 'skull',
    A3_CATASTROPHE: 'volcano'
};

export const KIND_ICONS: Record<WorldKind, string> = {
    TERRAIN: 'terrain',
    CLIMATE: 'cloud',
    WATER: 'water',
    REGION: 'map',
    LANDMARK: 'fort',
    RACE: 'groups',
    SUBRACE: 'family_history',
    SETTLEMENT: 'cottage',
    CITY: 'apartment',
    CULTURE_TAG: 'style',
    NATION: 'public',
    BORDER: 'shield',
    TREATY: 'handshake',
    WAR: 'swords',
    PROJECT: 'foundation',
    AVATAR: 'person_celebrate',
    ORDER: 'local_police',
    ARMY: 'security',
    EVENT: 'event',
    CATASTROPHE: 'volcano',
    LABEL: 'label'
};

export const getIconForAction = (actionId: string): string => {
    return ACTION_ICONS[actionId] || 'bolt';
};

export const getIconForKind = (kind: WorldKind): string => {
    return KIND_ICONS[kind] || 'circle';
};
