import { DelveTheme } from '../../types/delve';
import { SeededRNG } from '../seededRng';

const TRAP_OPTIONS: Record<DelveTheme, { trigger: string, types: string[] }[]> = {
    crypt: [
        { trigger: "Stepping on a grave slab", types: ["necrotic", "spirit"] },
        { trigger: "Opening a sarcophagus", types: ["poison_gas", "curse"] },
        { trigger: "Disturbing an offering", types: ["necrotic", "lightning"] }
    ],
    ruin: [
        { trigger: "Loose cobblestone", types: ["pit", "darts"] },
        { trigger: "Tripwire", types: ["falling_stones", "crossbow"] },
        { trigger: "Weak archway", types: ["collapse", "falling_stones"] }
    ],
    cavern: [
        { trigger: "Vibration", types: ["falling_stalactite", "collapse"] },
        { trigger: "Stepping in puddle", types: ["acid", "slime"] },
        { trigger: "Breaking a spore pod", types: ["poison_gas", "confusion"] }
    ],
    tower: [
        { trigger: "Crossing a rune", types: ["fire", "lightning", "force"] },
        { trigger: "Touching a book", types: ["explosive", "psychic"] },
        { trigger: "Opening a door", types: ["shock", "teleport"] }
    ],
    sewer: [
        { trigger: "Igniting a torch", types: ["explosion"] },
        { trigger: "Sluice gate valve", types: ["water_jet", "sludge"] },
        { trigger: "Submerged tripwire", types: ["net", "disease_darts"] }
    ],
    haunted_mansion: [
        { trigger: "Opening a dusty book", types: ["psychic", "curse"] },
        { trigger: "Sitting in a chair", types: ["spirit", "necrotic"] },
        { trigger: "A portrait's eyes glowing", types: ["psychic", "lightning"] }
    ],
};

export function getTrapDetails(theme: DelveTheme, level: number, rng: SeededRNG) {
    const themeOptions = TRAP_OPTIONS[theme] || TRAP_OPTIONS['ruin'];
    const selected = themeOptions[Math.floor(rng.nextFloat() * themeOptions.length)];
    const type = selected.types[Math.floor(rng.nextFloat() * selected.types.length)];
    
    const saveDC = 10 + Math.floor(level / 2);
    const spotDC = 12 + Math.floor(level / 2);
    const disarmDC = 12 + Math.floor(level / 2);
    const dmgDice = Math.ceil(level / 1.5);

    let effect = "";
    let name = "Trap";

    switch(type) {
        case "necrotic": name = "Necrotic Blast"; effect = `Blast of negative energy (${dmgDice}d8 necrotic, Con DC ${saveDC})`; break;
        case "spirit": name = "Grasping Spirits"; effect = `Spectral hands grapple (${dmgDice}d6 cold + Restrained, Str DC ${saveDC})`; break;
        case "poison_gas": name = "Toxic Gas Cloud"; effect = `Cloud of noxious gas (${dmgDice}d6 poison, Con DC ${saveDC})`; break;
        case "curse": name = "Ancient Curse"; effect = `Bestow Curse (Disadvantage on attacks, Wis DC ${saveDC})`; break;
        case "pit": name = "Spiked Pit"; effect = `10ft spiked pit (${Math.ceil(dmgDice/2)}d6 fall + ${Math.ceil(dmgDice/2)}d6 piercing, Dex DC ${saveDC})`; break;
        case "darts": name = "Hidden Darts"; effect = `Volley of darts (${dmgDice}d4 piercing, Dex DC ${saveDC})`; break;
        case "falling_stones": name = "Falling Masonry"; effect = `Falling masonry (${dmgDice}d10 bludgeoning, Dex DC ${saveDC})`; break;
        case "collapse": name = "Ceiling Collapse"; effect = `Ceiling collapse (${dmgDice}d10 bludgeoning + Prone, Dex DC ${saveDC})`; break;
        case "acid": name = "Acid Spray"; effect = `Acid spray (${dmgDice}d6 acid, Dex DC ${saveDC})`; break;
        case "slime": name = "Green Slime Drop"; effect = `Green slime drop (Acid damage + equipment corrosion, Dex DC ${saveDC})`; break;
        case "lightning": name = "Arcing Bolt"; effect = `Arcing electricity (${dmgDice}d8 lightning, Dex DC ${saveDC})`; break;
        case "fire": name = "Flame Jet"; effect = `Jet of flame (${dmgDice}d8 fire, Dex DC ${saveDC})`; break;
        case "explosion": name = "Gas Explosion"; effect = `Methane explosion (${dmgDice}d6 fire, Dex DC ${saveDC})`; break;
        case "psychic": name = "Mental Shriek"; effect = `Mental shriek (${dmgDice}d6 psychic, Int DC ${saveDC})`; break;
        case "force": name = "Explosive Rune"; effect = `Explosive rune (${dmgDice}d8 force, Dex DC ${saveDC})`; break;
        case "shock": name = "Shocking Latch"; effect = `Shocking grasp (${dmgDice}d8 lightning, cannot take reactions)`; break;
        case "teleport": name = "Displacement Trap"; effect = `Teleport trap (Sent to random nearby room, Cha DC ${saveDC})`; break;
        case "confusion": name = "Spore Burst"; effect = `Confusion spores (Confused 1 minute, Con DC ${saveDC})`; break;
        case "water_jet": name = "Pressure Cutter"; effect = `High pressure water (${dmgDice}d6 bludgeoning + push 10ft, Str DC ${saveDC})`; break;
        case "net": name = "Weighted Net"; effect = `Weighted net (Restrained, Str DC ${saveDC} to escape)`; break;
        case "crossbow": name = "Heavy Crossbow"; effect = `Heavy crossbow trap (${dmgDice}d10 piercing, Dex DC ${saveDC})`; break;
        case "disease_darts": name = "Filth Darts"; effect = `Filth darts (${Math.ceil(dmgDice/2)}d4 piercing + Disease, Con DC ${saveDC})`; break;
        default: name = "Mechanical Trap"; effect = `Mechanical damage (${dmgDice}d6 bludgeoning, Dex DC ${saveDC})`;
    }

    return { name, trigger: selected.trigger, effect, dc: saveDC, spotDC, disarmDC };
}