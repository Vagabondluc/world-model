
import { DelveTheme, DelveConcept } from '../../types/delve';
import { generateId } from '../helpers';

const THEME_ADJECTIVES: Record<DelveTheme, { adjective: string, tag: string, description: string, visual: string }[]> = {
    crypt: [
        { adjective: "Flooded", tag: "water", description: "Ancient waterways have breached the tomb.", visual: "Knee-deep brackish water, dripping moss, slick stone." },
        { adjective: "Infernal", tag: "fire", description: "A rift to the lower planes has scorched the dead.", visual: "Scorched stone, smell of sulfur, faint heat haze." },
        { adjective: "Restless", tag: "undead", description: "The dead here do not sleep easily.", visual: "Whispers in the dark, shifting shadows, cold spots." },
        { adjective: "Crystalline", tag: "crystal", description: "Strange geode growths are overtaking the masonry.", visual: "Jutting glowing crystals, prismatic reflections." },
        { adjective: "Cultist", tag: "arcane", description: "A dark ritual is being prepared within.", visual: "Chalk runes, smell of incense, muffled chanting." }
    ],
    ruin: [
        { adjective: "Overgrown", tag: "nature", description: "Nature is reclaiming this place aggressively.", visual: "Thick vines, blooming nightshades, cracked pavement." },
        { adjective: "Bandit", tag: "humanoid", description: "Fortified by local brigands.", visual: "Crude barricades, campfire smoke, scattered loot." },
        { adjective: "Haunted", tag: "ghost", description: "The echoes of the past linger violently.", visual: "Spectral residue, sudden drops in temperature." },
        { adjective: "Sinking", tag: "mud", description: "The foundation is failing, dragging the ruin down.", visual: "Slanted floors, mud flows, groaning stone." },
        { adjective: "Arcane", tag: "magic", description: "Remnants of a wizard's tower or laboratory.", visual: "Floating debris, sparks of wild magic." }
    ],
    cavern: [
        { adjective: "Volcanic", tag: "fire", description: "Magma flows just beneath the surface.", visual: "Red glow, oppressive heat, ash in the air." },
        { adjective: "Fungal", tag: "poison", description: "Choked with toxic and bioluminescent mushrooms.", visual: "Glowing spores, purple haze, soft spongy ground." },
        { adjective: "Drow", tag: "underdark", description: "A forward scouting post for dark elves.", visual: "Spider silk, sleek black stone architecture." },
        { adjective: "Crystal", tag: "psionic", description: "Resonant crystals that hum with psychic energy.", visual: "Singing stones, headache-inducing vibrations." },
        { adjective: "Ice", tag: "cold", description: "Frozen deep beneath the earth.", visual: "Icicles, slippery floors, visible breath." }
    ],
    tower: [
        { adjective: "Clockwork", tag: "construct", description: "Filled with ticking gears and automatons.", visual: "Brass pipes, steam vents, rhythmic ticking." },
        { adjective: "Astral", tag: "planar", description: "The tower bleeds into the Astral Plane.", visual: "Starry void outside windows, zero gravity zones." },
        { adjective: "Necrotic", tag: "undead", description: "A seat of power for a lich or necromancer.", visual: "Bone decorations, green torches, smell of formaldehyde." },
        { adjective: "Elemental", tag: "elemental", description: "Binding circles for raw elemental power.", visual: "Containment runes, crackling energy." },
        { adjective: "Abandoned", tag: "mystery", description: "Left in a hurry centuries ago.", visual: "Dust sheets, half-eaten meals, untouched journals." }
    ],
    sewer: [
        { adjective: "Plague", tag: "disease", description: "Source of a virulent sickness.", visual: "Green mist, bloated rats, sick-sweet smell." },
        { adjective: "Thieves'", tag: "crime", description: "Used as a highway for a guild.", visual: "Marked walls, stash boxes, hidden traps." },
        { adjective: "Mutated", tag: "aberration", description: "Alchemical runoff has changed the wildlife.", visual: "Glowing sludge, extra eyes, tentacles." },
        { adjective: "Ancient", tag: "history", description: "Built atop a much older civilization.", visual: "Different masonry styles, ancient mosaics beneath slime." },
        { adjective: "Smuggler", tag: "water", description: "Connected to the docks and tides.", visual: "Salt water smell, boats, damp crates." }
    ],
    haunted_mansion: [
        { adjective: "Gothic", tag: "ghost", description: "A classic tale of tragedy and restless spirits.", visual: "Cobwebs, dusty portraits, eerie silence." },
        { adjective: "Psychic", tag: "psychic", description: "The mansion itself is a malevolent, thinking entity.", visual: "Shifting hallways, whispers in the mind, bleeding walls." },
        { adjective: "Cursed", tag: "necrotic", description: "A curse binds the spirits to this place, and seeks new victims.", visual: "Withering plants, cold spots, runes that glow faintly." },
        { adjective: "Sanguine", tag: "vampire", description: "A nest of vampires has taken root in the old estate.", visual: "Wine stains that look like blood, coffins in the cellar, charmed servants." },
        { adjective: "Forgotten", tag: "mystery", description: "The family vanished overnight a century ago, leaving everything behind.", visual: "Dust-covered furniture, a half-finished meal, a child's toy on the floor." }
    ]
};

function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function generateDelveConcepts(theme: DelveTheme): DelveConcept[] {
    const variants = getRandomItems(THEME_ADJECTIVES[theme], 3);
    
    return variants.map(variant => ({
        id: generateId(),
        title: `The ${variant.adjective} ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
        theme: theme,
        description: variant.description,
        tags: [theme, variant.tag],
        visuals: variant.visual
    }));
}
