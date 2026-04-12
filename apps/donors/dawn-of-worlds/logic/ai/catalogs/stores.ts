import { StoreProfile } from '../types';

export const STORE_CATALOG: Record<string, StoreProfile> = {
    // --- MILITARY STORES ---
    MILITARY_RAID: {
        id: 'MILITARY_RAID',
        name: 'Military Raid',
        reducesFamilies: ['GRUDGE', 'AMBITION', 'OPPORTUNITY'],
        costs: { military: 2, economic: 0, political: 0, stability: 0, legitimacy: -1 },
        risk: 0.4,
        visibility: 0.9
    },
    FULL_INVASION: {
        id: "FULL_INVASION",
        name: "Conquest",
        reducesFamilies: ["GRUDGE", "AMBITION", "FEAR"],
        costs: { military: 100, economic: 50, political: 20, stability: 10, legitimacy: 5 },
        risk: 0.8,
        visibility: 1.0
    },
    FORTIFY_BORDER: {
        id: 'FORTIFY_BORDER',
        name: 'Fortify Border',
        reducesFamilies: ['FEAR', 'OPPORTUNITY'],
        costs: { military: 3, economic: 3, political: 0, stability: 2, legitimacy: 0 },
        risk: 0.2,
        visibility: 0.7
    },

    // --- ECONOMIC STORES ---
    TRADE_EMBARGO: {
        id: 'TRADE_EMBARGO',
        name: 'Trade Embargo',
        reducesFamilies: ['SHAME', 'AMBITION', 'OPPORTUNITY'],
        costs: { military: 0, economic: 3, political: 2, stability: 0, legitimacy: 0 },
        risk: 0.1,
        visibility: 0.5
    },
    DEVELOP_INDUSTRY: {
        id: "DEVELOP_INDUSTRY",
        name: "Industrialization",
        reducesFamilies: ["AMBITION"],
        costs: { military: 0, economic: 50, political: 0, stability: -5, legitimacy: 0 },
        risk: 0.1,
        visibility: 0.2
    },

    // --- DIPLOMATIC/CULTURAL STORES ---
    BUILD_MONUMENT: {
        id: "BUILD_MONUMENT",
        name: "Grand Monument",
        reducesFamilies: ["SHAME"],
        costs: { military: 0, economic: 60, political: 0, stability: 0, legitimacy: 0 },
        risk: 0.0,
        visibility: 0.8
    },
    FORM_ALLIANCE: {
        id: "FORM_ALLIANCE",
        name: "Strategic Alliance",
        reducesFamilies: ["FEAR"],
        costs: { military: 0, economic: 0, political: 30, stability: 0, legitimacy: 0 },
        risk: 0.3,
        visibility: 0.7
    }
};
