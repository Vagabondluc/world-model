
export interface CRStatRow {
    cr: number;
    crLabel: string;
    prof: number;
    ac: number;
    hpMin: number;
    hpMax: number;
    atk: number;
    dmgMin: number;
    dmgMax: number;
    dc: number;
    xp: number;
}

export const DMG_CR_TABLE: CRStatRow[] = [
    { cr: 0,     crLabel: "0",   prof: 2, ac: 13, hpMin: 1,   hpMax: 6,   atk: 3,  dmgMin: 0,   dmgMax: 1,   dc: 13, xp: 10 },
    { cr: 0.125, crLabel: "1/8", prof: 2, ac: 13, hpMin: 7,   hpMax: 35,  atk: 3,  dmgMin: 2,   dmgMax: 3,   dc: 13, xp: 25 },
    { cr: 0.25,  crLabel: "1/4", prof: 2, ac: 13, hpMin: 36,  hpMax: 49,  atk: 3,  dmgMin: 4,   dmgMax: 5,   dc: 13, xp: 50 },
    { cr: 0.5,   crLabel: "1/2", prof: 2, ac: 13, hpMin: 50,  hpMax: 70,  atk: 3,  dmgMin: 6,   dmgMax: 8,   dc: 13, xp: 100 },
    { cr: 1,     crLabel: "1",   prof: 2, ac: 13, hpMin: 71,  hpMax: 85,  atk: 3,  dmgMin: 9,   dmgMax: 14,  dc: 13, xp: 200 },
    { cr: 2,     crLabel: "2",   prof: 2, ac: 13, hpMin: 86,  hpMax: 100, atk: 3,  dmgMin: 15,  dmgMax: 20,  dc: 13, xp: 450 },
    { cr: 3,     crLabel: "3",   prof: 2, ac: 13, hpMin: 101, hpMax: 115, atk: 4,  dmgMin: 21,  dmgMax: 26,  dc: 13, xp: 700 },
    { cr: 4,     crLabel: "4",   prof: 2, ac: 14, hpMin: 116, hpMax: 130, atk: 5,  dmgMin: 27,  dmgMax: 32,  dc: 14, xp: 1100 },
    { cr: 5,     crLabel: "5",   prof: 3, ac: 15, hpMin: 131, hpMax: 145, atk: 6,  dmgMin: 33,  dmgMax: 38,  dc: 15, xp: 1800 },
    { cr: 6,     crLabel: "6",   prof: 3, ac: 15, hpMin: 146, hpMax: 160, atk: 6,  dmgMin: 39,  dmgMax: 44,  dc: 15, xp: 2300 },
    { cr: 7,     crLabel: "7",   prof: 3, ac: 15, hpMin: 161, hpMax: 175, atk: 6,  dmgMin: 45,  dmgMax: 50,  dc: 15, xp: 2900 },
    { cr: 8,     crLabel: "8",   prof: 3, ac: 16, hpMin: 176, hpMax: 190, atk: 7,  dmgMin: 51,  dmgMax: 56,  dc: 16, xp: 3900 },
    { cr: 9,     crLabel: "9",   prof: 4, ac: 16, hpMin: 191, hpMax: 205, atk: 7,  dmgMin: 57,  dmgMax: 62,  dc: 16, xp: 5000 },
    { cr: 10,    crLabel: "10",  prof: 4, ac: 17, hpMin: 206, hpMax: 220, atk: 7,  dmgMin: 63,  dmgMax: 68,  dc: 16, xp: 5900 },
    { cr: 11,    crLabel: "11",  prof: 4, ac: 17, hpMin: 221, hpMax: 235, atk: 8,  dmgMin: 69,  dmgMax: 74,  dc: 17, xp: 7200 },
    { cr: 12,    crLabel: "12",  prof: 4, ac: 17, hpMin: 236, hpMax: 250, atk: 8,  dmgMin: 75,  dmgMax: 80,  dc: 17, xp: 8400 },
    { cr: 13,    crLabel: "13",  prof: 5, ac: 18, hpMin: 251, hpMax: 265, atk: 8,  dmgMin: 81,  dmgMax: 86,  dc: 18, xp: 10000 },
    { cr: 14,    crLabel: "14",  prof: 5, ac: 18, hpMin: 266, hpMax: 280, atk: 8,  dmgMin: 87,  dmgMax: 92,  dc: 18, xp: 11500 },
    { cr: 15,    crLabel: "15",  prof: 5, ac: 18, hpMin: 281, hpMax: 295, atk: 8,  dmgMin: 93,  dmgMax: 98,  dc: 18, xp: 13000 },
    { cr: 16,    crLabel: "16",  prof: 5, ac: 18, hpMin: 296, hpMax: 310, atk: 9,  dmgMin: 99,  dmgMax: 104, dc: 18, xp: 15000 },
    { cr: 17,    crLabel: "17",  prof: 6, ac: 19, hpMin: 311, hpMax: 325, atk: 10, dmgMin: 105, dmgMax: 110, dc: 19, xp: 18000 },
    { cr: 18,    crLabel: "18",  prof: 6, ac: 19, hpMin: 326, hpMax: 340, atk: 10, dmgMin: 111, dmgMax: 116, dc: 19, xp: 20000 },
    { cr: 19,    crLabel: "19",  prof: 6, ac: 19, hpMin: 341, hpMax: 355, atk: 10, dmgMin: 117, dmgMax: 122, dc: 19, xp: 22000 },
    { cr: 20,    crLabel: "20",  prof: 6, ac: 19, hpMin: 356, hpMax: 400, atk: 10, dmgMin: 123, dmgMax: 140, dc: 19, xp: 25000 },
    { cr: 21,    crLabel: "21",  prof: 7, ac: 19, hpMin: 401, hpMax: 445, atk: 11, dmgMin: 141, dmgMax: 158, dc: 20, xp: 33000 },
    { cr: 22,    crLabel: "22",  prof: 7, ac: 19, hpMin: 446, hpMax: 490, atk: 11, dmgMin: 159, dmgMax: 176, dc: 20, xp: 41000 },
    { cr: 23,    crLabel: "23",  prof: 7, ac: 19, hpMin: 491, hpMax: 535, atk: 11, dmgMin: 177, dmgMax: 194, dc: 20, xp: 50000 },
    { cr: 24,    crLabel: "24",  prof: 7, ac: 19, hpMin: 536, hpMax: 580, atk: 12, dmgMin: 195, dmgMax: 212, dc: 21, xp: 62000 },
    { cr: 25,    crLabel: "25",  prof: 8, ac: 19, hpMin: 581, hpMax: 625, atk: 12, dmgMin: 213, dmgMax: 230, dc: 21, xp: 75000 },
    { cr: 26,    crLabel: "26",  prof: 8, ac: 19, hpMin: 626, hpMax: 670, atk: 13, dmgMin: 231, dmgMax: 248, dc: 22, xp: 90000 },
    { cr: 27,    crLabel: "27",  prof: 8, ac: 19, hpMin: 671, hpMax: 715, atk: 13, dmgMin: 249, dmgMax: 266, dc: 22, xp: 105000 },
    { cr: 28,    crLabel: "28",  prof: 8, ac: 19, hpMin: 716, hpMax: 760, atk: 13, dmgMin: 267, dmgMax: 284, dc: 22, xp: 120000 },
    { cr: 29,    crLabel: "29",  prof: 9, ac: 19, hpMin: 761, hpMax: 805, atk: 13, dmgMin: 285, dmgMax: 302, dc: 22, xp: 135000 },
    { cr: 30,    crLabel: "30",  prof: 9, ac: 19, hpMin: 806, hpMax: 850, atk: 14, dmgMin: 303, dmgMax: 320, dc: 23, xp: 155000 }
];
