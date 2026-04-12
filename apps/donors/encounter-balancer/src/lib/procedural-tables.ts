// Procedural Generation Tables for D&D Encounters
// Uses random tables, dice rolls, and combinatorial logic

// ============== UTILITY FUNCTIONS ==============

// Simulate dice roll (e.g., "2d6", "1d20", "3d8")
export function rollDice(notation: string): number {
  const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/);
  if (!match) return 0;
  
  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3] || '0');
  
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total + modifier;
}

// Pick random item from array
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Pick N random items from array (no duplicates)
export function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

// Weighted random pick
export function weightedPick<T>(items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const { item, weight } of items) {
    random -= weight;
    if (random <= 0) return item;
  }
  return items[0].item;
}

// Random between min and max
export function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random from range with bell curve distribution
export function bellCurve(min: number, max: number): number {
  const mid = (min + max) / 2;
  const spread = (max - min) / 4;
  // Average of 3 random numbers gives bell curve
  const r = (Math.random() + Math.random() + Math.random()) / 3;
  return Math.round(mid + (r - 0.5) * spread * 2);
}

// ============== ENVIRONMENTAL TABLES ==============

export const TERRAIN_TYPES = [
  'Mountain Pass',
  'Volcanic Field',
  'Icy Fjord',
  'Dense Forest',
  'Underground Cave',
  'Desert Ruins',
  'Swamp Marsh',
  'Coastal Cliff',
  'Urban Alley',
  'Temple Chamber',
  'River Crossing',
  'Frozen Tundra',
  'Jungle Temple',
  'Abandoned Mine',
  'Haunted Manor',
  'Ancient Bridge',
  'Crystalline Cavern',
  'Burning Wastes',
  'Sunken Ruins',
  'Floating Sky Island',
];

export const TERRAIN_DESCRIPTIONS: Record<string, string[]> = {
  'Mountain Pass': [
    'Narrow paths wind between towering peaks, with sheer drops on either side. The wind howls through the gaps, carrying loose stones and dust.',
    'Ancient switchback trails carved into the mountainside offer treacherous footing. Patches of snow cling to shadowed crevices even in summer.',
    'A natural saddle between two jagged peaks provides the only crossing. Boulders perch precariously on the slopes above.',
  ],
  'Volcanic Field': [
    'Cracked black earth steams with geothermal activity. Rivers of molten rock glow in the distance, and the air reeks of sulfur.',
    'Obsidian shards pierce the ground like black glass teeth. Geysers erupt unpredictably, spraying scalding water.',
    'A landscape of cooling lava flows and smoking fissures. The ground thrums with heat, and the sky is choked with ash.',
  ],
  'Icy Fjord': [
    'Glacial walls tower over a frozen inlet. Massive ice floes drift in the dark water, and the crack of calving glaciers echoes constantly.',
    'A narrow channel between ice-covered cliffs. Slippery ice sheets cover the rocky shores, and frozen waterfalls cascade from above.',
    'Packed ice and snow blanket the fjord floor. Mist rises from patches of open water, obscuring vision.',
  ],
  'Dense Forest': [
    'Ancient oaks block out the sky, their roots forming treacherous obstacles. Fog clings to the forest floor.',
    'Thick undergrowth makes movement difficult. Shafts of light pierce the canopy, illuminating patches of poisonous fungi.',
    'Massive pines tower overhead, their lowest branches twenty feet up. The ground is carpeted with needles that muffle sound.',
  ],
  'Underground Cave': [
    'Stalactites hang from the vaulted ceiling like stone teeth. The only light comes from bioluminescent fungi.',
    'A natural cavern with a subterranean lake. The water is still and black, reflecting the stalagmites above.',
    'Narrow tunnels open into chambers filled with crystalline formations. The air is cold and smells of minerals.',
  ],
  'Desert Ruins': [
    'Crumbling stone pillars rise from shifting sands. Ancient hieroglyphs warn of dangers within.',
    'Half-buried structures create a maze of walls and passages. Sand swirls in the wind, reducing visibility.',
    'A collapsed temple exposes underground chambers. The hot sun beats down mercilessly.',
  ],
  'Swamp Marsh': [
    'Murky water covers half the ground, with uncertain footing between tangled roots. Mist obscures vision beyond thirty feet.',
    'A maze of raised hummocks surrounded by deep water. Giant lily pads provide unstable platforms.',
    'Mangrove roots create a labyrinth of natural bridges and pitfalls. The air is thick with insects.',
  ],
  'Coastal Cliff': [
    'Sheer rock faces drop to churning waves below. Narrow ledges offer precarious paths along the cliff face.',
    'Sea caves riddle the base of the cliffs. The tide brings dangerous surges of water.',
    'A rocky plateau overlooks the ocean, with sudden drop-offs hidden by coastal fog.',
  ],
  'Urban Alley': [
    'Narrow passages between tall buildings create a labyrinth. Shadows hide threats around every corner.',
    'Crumbling walls and collapsed roofs provide vantage points and hazards. Rain slicks the cobblestones.',
    'Market stalls and carts create obstacles and cover. Crowds scatter when violence erupts.',
  ],
  'Temple Chamber': [
    'Vaulted ceilings tower over an ancient sanctuary. Faded murals depict forgotten gods and dire warnings.',
    'Broken pillars create a maze of partial walls. Altars and pedestals hold treasures—or traps.',
    'A circular ritual chamber with a domed ceiling. Strange symbols glow faintly on the floor.',
  ],
  'River Crossing': [
    'A wide river blocks the path, its waters rushing between steep banks. A natural crossing offers the only way forward.',
    'Foaming rapids churn between scattered rocks. A fallen tree provides a precarious bridge across.',
    'The river runs swift and deep here, but a series of stepping stones offers a path across.',
  ],
  'Frozen Tundra': [
    'Endless ice stretches to the horizon, broken only by jagged ice formations. The wind howls across the desolate landscape.',
    'Snow drifts pile high against frozen rocks. The temperature drops rapidly as night approaches.',
    'A frozen wasteland where nothing grows. Only the hardiest creatures survive in this frigid expanse.',
  ],
  'Jungle Temple': [
    'Ancient stone structures emerge from the jungle canopy, covered in vines and moss. The air is thick with humidity.',
    'Carved steps lead up to a crumbling temple entrance. Strange sounds echo from within the darkness.',
    'Massive trees tower over the ruins, their roots tearing apart ancient stonework. Shafts of light pierce the canopy.',
  ],
  'Abandoned Mine': [
    'Rusted tracks disappear into darkness. The smell of damp earth and old timber fills the air.',
    'Wooden support beams groan under the weight of the mountain. Shafts lead deeper into the earth.',
    'Abandoned equipment lies scattered about. Some tunnels have collapsed, others lead to unknown depths.',
  ],
  'Haunted Manor': [
    'A decrepit mansion looms against the sky. Broken windows stare like hollow eyes, and the front door hangs askew.',
    'Dust covers everything in the abandoned house. Cobwebs drape the furniture like funeral shrouds.',
    'The air inside is cold and still. Shadows seem to move on their own, and whispers echo in empty rooms.',
  ],
  'Ancient Bridge': [
    'An ancient stone bridge spans a bottomless chasm. Parts have crumbled away, leaving gaps in the path.',
    'The bridge stretches across a vast canyon, wind whistling through the ancient stonework.',
    'Weathered statues line the bridge, their faces worn away by time. The drop on either side is dizzying.',
  ],
  'Crystalline Cavern': [
    'Massive crystals jut from every surface, their facets catching and refracting light into rainbow patterns.',
    'The cavern pulses with an inner light. Crystal formations create a maze of glittering passages.',
    'Sharp crystals cover the walls and ceiling. The sound of each footstep echoes strangely.',
  ],
  'Burning Wastes': [
    'Blackened earth stretches in every direction. Rivers of lava cut through the ash, and smoke rises from countless vents.',
    'The ground is hot to the touch. Sulfurous fumes burn the lungs, and heat shimmers distort the horizon.',
    'Flames lick from fissures in the ground. The sky above is choked with ash and smoke.',
  ],
  'Sunken Ruins': [
    'Ancient buildings rise from shallow water, their tops barely breaking the surface. What lies below remains hidden.',
    'Flooded streets wind between crumbling structures. The water is murky and hides what swims beneath.',
    'Columns and archways rise from the depths. Air pockets in the buildings offer brief respite from the water.',
  ],
  'Floating Sky Island': [
    'A massive chunk of earth floats in the sky, waterfalls cascading off its edges into the clouds below.',
    'The island drifts among the clouds, connected to others by bridges of solidified light and air.',
    'Ancient ruins dot the floating landmass. The ground ends abruptly, dropping away into infinite sky.',
  ],
};

export const PHYSICAL_FEATURES: Record<string, { name: string; description: string; mechanicalEffect: string; impacts: string[] }[]> = {
  'Mountain Pass': [
    { name: 'Sheer Cliffs', description: 'Vertical rock faces rise 40 feet on either side.', mechanicalEffect: 'DC 15 Athletics to climb; falling damage applies', impacts: ['Limits movement', 'Creates chokepoints'] },
    { name: 'Loose Scree', description: 'Unstable stones cover the path.', mechanicalEffect: 'DC 10 Dexterity save or fall prone; creates difficult terrain', impacts: ['Slows movement', 'Reveals position'] },
    { name: 'Narrow Bridge', description: 'A natural stone bridge spans a chasm.', mechanicalEffect: 'Single file crossing only; DC 12 Acrobatics if pushed', impacts: ['Creates bottleneck', 'Risk of falling'] },
    { name: 'Overhanging Ledges', description: 'Rock ledges jut from the cliff face.', mechanicalEffect: 'Provides elevated position; can be reached by climbing', impacts: ['Elevation advantage', 'Cover from below'] },
    { name: 'Boulder Field', description: 'Massive boulders create a maze of gaps and tunnels.', mechanicalEffect: 'Provides three-quarters cover; squeezes large creatures', impacts: ['Abundant cover', 'Limits visibility'] },
  ],
  'Volcanic Field': [
    { name: 'Lava Rivers', description: 'Molten rock flows in channels across the area.', mechanicalEffect: '2d6 fire damage within 5 feet; 5d10 if immersed', impacts: ['Creates barriers', 'Environmental hazard'] },
    { name: 'Geysers', description: 'Steam vents erupt unpredictably.', mechanicalEffect: 'DC 13 Dexterity save or take 3d6 fire damage', impacts: ['Random danger zones', 'Obscures vision'] },
    { name: 'Obsidian Shards', description: 'Sharp volcanic glass covers the ground.', mechanicalEffect: 'Difficult terrain; 1d4 piercing damage if knocked prone', impacts: ['Punishes falling', 'Slows movement'] },
    { name: 'Cooling Crust', description: 'A thin crust over molten rock.', mechanicalEffect: 'DC 12 Perception to spot weak spots; 4d6 fire damage if it breaks', impacts: ['Hidden dangers', 'Unpredictable terrain'] },
    { name: 'Ash Clouds', description: 'Billowing clouds of volcanic ash.', mechanicalEffect: 'Heavy obscurement; disadvantage on Perception', impacts: ['Limits visibility', 'Respiration issues'] },
  ],
  'Icy Fjord': [
    { name: 'Glacier Walls', description: 'Sheer ice faces rise from the water.', mechanicalEffect: 'DC 14 Athletics to climb; ice tools grant advantage', impacts: ['Vertical terrain', 'Slippery surfaces'] },
    { name: 'Ice Floes', description: 'Floating sheets of ice dot the water.', mechanicalEffect: 'DC 11 Acrobatics to cross; capsizes if overloaded', impacts: ['Unstable platforms', 'Water hazard'] },
    { name: 'Frozen Waterfalls', description: 'Cascades of ice cling to the cliffs.', mechanicalEffect: 'DC 13 Athletics to climb; ice can break (DC 15 check)', impacts: ['Vertical movement', 'Falling hazard'] },
    { name: 'Pressure Ridges', description: 'Ice pushed up into jagged walls.', mechanicalEffect: 'Provides half cover; difficult terrain to cross', impacts: ['Natural barriers', 'Cover available'] },
    { name: 'Thin Ice Patches', description: 'Areas where the ice is dangerously thin.', mechanicalEffect: 'DC 12 Perception to spot; 3d6 cold damage if falling through', impacts: ['Hidden danger', 'Cold exposure'] },
  ],
  'Dense Forest': [
    { name: 'Ancient Oaks', description: 'Massive trees with thick trunks.', mechanicalEffect: 'Provides three-quarters cover; DC 12 Athletics to climb', impacts: ['Abundant cover', 'Elevated positions'] },
    { name: 'Tangled Undergrowth', description: 'Dense brush and thorny vines.', mechanicalEffect: 'Difficult terrain; 1d4 piercing damage per 10 feet moved', impacts: ['Slows movement', 'Reveals position'] },
    { name: 'Fallen Logs', description: 'Massive fallen trees create barriers.', mechanicalEffect: 'DC 10 Athletics to climb over; provides cover', impacts: ['Creates barriers', 'Elevated positions'] },
    { name: 'Forest Canopy', description: 'Interlocking branches high above.', mechanicalEffect: 'Half cover from above; limits flying movement', impacts: ['Aerial hazards', 'Reduced light'] },
    { name: 'Hidden Clearings', description: 'Small open areas within the forest.', mechanicalEffect: 'No special mechanics; open ground for combat', impacts: ['Open combat areas', 'Surprise opportunities'] },
  ],
  'Underground Cave': [
    { name: 'Stalactites/Stalagmites', description: 'Stone formations from floor and ceiling.', mechanicalEffect: 'Provides cover; falling stalactites deal 2d6 damage', impacts: ['Natural pillars', 'Falling hazard'] },
    { name: 'Underground Lake', description: 'Dark still water fills part of the cavern.', mechanicalEffect: 'DC 12 Athletics to swim; hidden depths', impacts: ['Water barrier', 'Potential drowning'] },
    { name: 'Narrow Tunnels', description: 'Tight passages between chambers.', mechanicalEffect: 'Single file only; Medium creatures squeeze', impacts: ['Creates chokepoints', 'Limits larger creatures'] },
    { name: 'Crystal Formations', description: 'Glowing crystals embedded in walls.', mechanicalEffect: 'Dim light; crystals worth 1d10 × 10 gp', impacts: ['Natural light', 'Valuable treasure'] },
    { name: 'Pit Traps', description: 'Natural shafts in the cave floor.', mechanicalEffect: 'DC 14 Perception to spot; 2d6 falling damage', impacts: ['Hidden hazards', 'Vertical movement'] },
  ],
  'Desert Ruins': [
    { name: 'Crumbling Walls', description: 'Half-standing ancient structures.', mechanicalEffect: 'Provides half cover; can collapse (DC 15 check)', impacts: ['Cover available', 'Collapse hazard'] },
    { name: 'Sand Drifts', description: 'Deep sand piled against structures.', mechanicalEffect: 'Difficult terrain; can hide objects/creatures', impacts: ['Slows movement', 'Hides threats'] },
    { name: 'Ancient Pillars', description: 'Standing columns of carved stone.', mechanicalEffect: 'Provides three-quarters cover; can be toppled', impacts: ['Solid cover', 'Potential traps'] },
    { name: 'Buried Chambers', description: 'Partially exposed underground rooms.', mechanicalEffect: 'Enclosed spaces; potential for other hazards', impacts: ['Indoor combat', 'Limited exits'] },
    { name: 'Collapsing Floors', description: 'Weak spots in ancient stonework.', mechanicalEffect: 'DC 13 Dexterity save or fall 10 feet', impacts: ['Unexpected hazards', 'Multi-level combat'] },
  ],
  'Swamp Marsh': [
    { name: 'Quicksand Pools', description: 'Deceptive patches of liquid mud.', mechanicalEffect: 'DC 12 Strength save or sink; 1d4 turns to escape', impacts: ['Movement trap', 'Potential drowning'] },
    { name: 'Root Mazes', description: 'Tangled mangrove roots above water.', mechanicalEffect: 'Difficult terrain; provides half cover', impacts: ['Slows movement', 'Natural cover'] },
    { name: 'Raised Hummocks', description: 'Small islands of solid ground.', mechanicalEffect: 'Elevated 3-5 feet; dry ground', impacts: ['Tactical positions', 'Limited space'] },
    { name: 'Hanging Moss', description: 'Drapes of vegetation from trees.', mechanicalEffect: 'Light obscurement; can hide small creatures', impacts: ['Visual cover', 'Hiding spots'] },
    { name: 'Deep Channels', description: 'Hidden waterways through the marsh.', mechanicalEffect: 'DC 10 Perception to spot; swimming required', impacts: ['Unexpected depth', 'Water hazards'] },
  ],
  'Coastal Cliff': [
    { name: 'Narrow Ledges', description: 'Thin paths along the cliff face.', mechanicalEffect: 'Single file; DC 11 Acrobatics if running', impacts: ['Chokepoints', 'Falling hazard'] },
    { name: 'Sea Caves', description: 'Caverns at the base of the cliffs.', mechanicalEffect: 'Enclosed space; fills with tide', impacts: ['Enclosed combat', 'Time pressure'] },
    { name: 'Rocky Outcrops', description: 'Protrusions from the cliff face.', mechanicalEffect: 'Provides cover; can reach by climbing', impacts: ['Cover positions', 'Elevation options'] },
    { name: 'Surf Zone', description: 'Waves crash against the rocks.', mechanicalEffect: 'DC 12 Strength save if hit by wave; 1d6 bludgeoning', impacts: ['Random hazard', 'Knockback risk'] },
    { name: 'Rope Bridges', description: 'Ancient bridges between pillars.', mechanicalEffect: 'Single file; can be cut (AC 10, 10 HP)', impacts: ['Chokepoints', 'Collapse hazard'] },
  ],
  'Urban Alley': [
    { name: 'Market Stalls', description: 'Wooden structures and goods.', mechanicalEffect: 'Provides half cover; can be tipped over', impacts: ['Cover options', 'Improvised weapons'] },
    { name: 'Narrow Passages', description: 'Tight gaps between buildings.', mechanicalEffect: 'Single file; grants half cover from ranged', impacts: ['Chokepoints', 'Melee focus'] },
    { name: 'Overhanging Balconies', description: 'Second-story overhangs.', mechanicalEffect: 'Elevated position; DC 12 Athletics to reach', impacts: ['Height advantage', 'Cover below'] },
    { name: 'Stacked Crates', description: 'Goods piled for transport.', mechanicalEffect: 'Provides half cover; can be climbed', impacts: ['Cover and height', 'Unstable platforms'] },
    { name: 'Sewer Grates', description: 'Iron grates over underground passages.', mechanicalEffect: 'Escape route; DC 15 Strength to lift', impacts: ['Exit options', 'Hiding spots'] },
  ],
  'Temple Chamber': [
    { name: 'Broken Pillars', description: 'Collapsed columns create obstacles.', mechanicalEffect: 'Provides three-quarters cover; difficult terrain', impacts: ['Abundant cover', 'Movement limits'] },
    { name: 'Altars', description: 'Stone altars with carved symbols.', mechanicalEffect: 'Provides half cover; may have magical effects', impacts: ['Cover positions', 'Ritual sites'] },
    { name: 'Raised Dais', description: 'Elevated platform at one end.', mechanicalEffect: '5 feet elevation; grants advantage on melee from above', impacts: ['Tactical position', 'Commanding view'] },
    { name: 'Pew Rows', description: 'Ancient seating in rows.', mechanicalEffect: 'Provides half cover; difficult terrain to cross', impacts: ['Barriers', 'Cover options'] },
    { name: 'Statues', description: 'Stone guardians line the walls.', mechanicalEffect: 'Provides three-quarters cover; may animate', impacts: ['Solid cover', 'Potential enemies'] },
  ],
  'River Crossing': [
    { name: 'Rapids', description: 'Fast-moving water with dangerous currents.', mechanicalEffect: 'DC 13 Strength save or swept downstream; 2d6 bludgeoning', impacts: ['Water hazard', 'Movement risk'] },
    { name: 'Natural Bridge', description: 'A fallen tree spans the river.', mechanicalEffect: 'Single file; DC 10 Acrobatics if running', impacts: ['Chokepoint', 'Falling hazard'] },
    { name: 'Rocky Islands', description: 'Stones break the water surface.', mechanicalEffect: 'DC 11 Acrobatics to hop between; half cover', impacts: ['Stepping stones', 'Partial cover'] },
    { name: 'Shallow Ford', description: 'A calmer, shallower section.', mechanicalEffect: 'Difficult terrain through water; can be waded', impacts: ['Safe crossing', 'Slows movement'] },
    { name: 'Overhanging Trees', description: 'Branches extend over the water.', mechanicalEffect: 'DC 12 Athletics to swing across; provides cover', impacts: ['Alternative crossing', 'Cover from above'] },
  ],
  'Frozen Tundra': [
    { name: 'Ice Sheets', description: 'Vast expanses of slick ice.', mechanicalEffect: 'DC 10 Acrobatics or slide 10 feet; difficult terrain', impacts: ['Slippery movement', 'Unpredictable sliding'] },
    { name: 'Snow Drifts', description: 'Deep snow piles against rocks.', mechanicalEffect: 'Difficult terrain; can hide creatures', impacts: ['Slows movement', 'Concealment'] },
    { name: 'Frozen Pond', description: 'A frozen body of water.', mechanicalEffect: 'DC 12 Perception for thin spots; 2d6 cold if breaks', impacts: ['Fragile surface', 'Cold hazard'] },
    { name: 'Glacier Wall', description: 'Massive ice formations.', mechanicalEffect: 'DC 15 Athletics to climb; full cover behind', impacts: ['Vertical terrain', 'Full cover'] },
    { name: 'Blizzard Zone', description: 'Area of constant snow and wind.', mechanicalEffect: 'Heavy obscurement; cold damage each round', impacts: ['Limited visibility', 'Cold exposure'] },
  ],
  'Jungle Temple': [
    { name: 'Overgrown Ruins', description: 'Stone structures wrapped in vines.', mechanicalEffect: 'Difficult terrain; climbing vines DC 11 Athletics', impacts: ['Slows movement', 'Climbing options'] },
    { name: 'Stone Platforms', description: 'Raised stone platforms above the jungle floor.', mechanicalEffect: '5-10 feet elevation; requires climbing', impacts: ['Height advantage', 'Ritual spaces'] },
    { name: 'Water Channels', description: 'Ancient waterways through the temple.', mechanicalEffect: 'Difficult terrain; potential for water creatures', impacts: ['Water hazards', 'Ambush points'] },
    { name: 'Collapsed Sections', description: 'Parts of the temple have caved in.', mechanicalEffect: 'Difficult terrain; falling debris hazard', impacts: ['Obstacles', 'Cover options'] },
    { name: 'Sacred Pools', description: 'Reflecting pools with mysterious properties.', mechanicalEffect: 'May grant visions or healing; can be holy ground', impacts: ['Magical potential', 'Ritual site'] },
  ],
  'Abandoned Mine': [
    { name: 'Mine Carts', description: 'Rusted carts on old tracks.', mechanicalEffect: 'Provides half cover; can be pushed for movement', impacts: ['Mobile cover', 'Transport potential'] },
    { name: 'Support Beams', description: 'Wooden supports holding up the ceiling.', mechanicalEffect: 'Full cover; can be destroyed (collapse risk)', impacts: ['Cover available', 'Collapse hazard'] },
    { name: 'Ore Chutes', description: 'Steep passages for moving ore.', mechanicalEffect: 'Slide down quickly; difficult to climb up', impacts: ['Quick descent', 'Escape route'] },
    { name: 'Flooded Sections', description: 'Parts of the mine filled with water.', mechanicalEffect: 'Swimming required; potential for drowning', impacts: ['Water hazard', 'Limited visibility'] },
    { name: 'Vertical Shafts', description: 'Deep pits with ladder access.', mechanicalEffect: 'DC 12 Athletics to climb; falling damage', impacts: ['Vertical movement', 'Falling hazard'] },
  ],
  'Haunted Manor': [
    { name: 'Rotting Floorboards', description: 'Decayed wooden floors with weak spots.', mechanicalEffect: 'DC 12 Dexterity save or fall through; 1d6 damage', impacts: ['Movement hazard', 'Secret areas below'] },
    { name: 'Grand Staircase', description: 'A sweeping staircase to upper floors.', mechanicalEffect: 'Elevated position; difficult terrain if broken', impacts: ['Height advantage', 'Focal point'] },
    { name: 'Hidden Passages', description: 'Walls that swing open to reveal corridors.', mechanicalEffect: 'DC 15 Investigation to find; escape routes', impacts: ['Surprise potential', 'Hidden movement'] },
    { name: 'Dusty Furniture', description: 'Cobweb-covered chairs and tables.', mechanicalEffect: 'Provides half cover; can be tipped for barrier', impacts: ['Cover options', 'Improvised barriers'] },
    { name: 'Phantom Lights', description: 'Eerie lights that move on their own.', mechanicalEffect: 'Dim light; may reveal hidden things', impacts: ['Unsettling atmosphere', 'Reveals secrets'] },
  ],
  'Ancient Bridge': [
    { name: 'Narrow Span', description: 'A thin walkway over a great drop.', mechanicalEffect: 'Single file; DC 10 Acrobatics when running', impacts: ['Chokepoint', 'Falling hazard'] },
    { name: 'Collapsed Sections', description: 'Parts of the bridge have fallen away.', mechanicalEffect: 'DC 13 Athletics to jump across; falling damage', impacts: ['Jumping required', 'Falling risk'] },
    { name: 'Guardian Statues', description: 'Stone guardians at intervals.', mechanicalEffect: 'Full cover; may animate to defend bridge', impacts: ['Cover positions', 'Potential enemies'] },
    { name: 'Support Pillars', description: 'Massive pillars rising from below.', mechanicalEffect: 'Can be climbed; provides full cover', impacts: ['Climbing options', 'Solid cover'] },
    { name: 'Wind Tunnels', description: 'Strong winds funnel through the bridge.', mechanicalEffect: 'DC 12 Strength save or pushed; ranged disadvantage', impacts: ['Movement hazard', 'Ranged penalty'] },
  ],
  'Crystalline Cavern': [
    { name: 'Crystal Formations', description: 'Massive crystals jutting from walls.', mechanicalEffect: 'Full cover; reflects light and magic', impacts: ['Solid cover', 'Magic interactions'] },
    { name: 'Resonant Chambers', description: 'Areas where sound amplifies.', mechanicalEffect: 'Thunder damage doubled; alerts all creatures', impacts: ['Sound sensitivity', 'Alert risk'] },
    { name: 'Light Refraction', description: 'Crystals split light into beams.', mechanicalEffect: 'Bright light in patterns; may reveal invisible', impacts: ['Light patterns', 'Invisibility counter'] },
    { name: 'Crystal Bridges', description: 'Natural crystal spans over chasms.', mechanicalEffect: 'Transparent; DC 11 Acrobatics if cracked', impacts: ['Crossing points', 'Visibility through'] },
    { name: 'Geode Chambers', description: 'Hollow crystals large enough to enter.', mechanicalEffect: 'Full cover inside; may contain treasures', impacts: ['Hiding spots', 'Treasure locations'] },
  ],
  'Burning Wastes': [
    { name: 'Lava Flows', description: 'Rivers of molten rock crisscrossing the land.', mechanicalEffect: '5d10 fire damage if touched; radiates heat', impacts: ['Fire hazard', 'Barrier'] },
    { name: 'Ash Dunes', description: 'Hills of soft volcanic ash.', mechanicalEffect: 'Difficult terrain; can hide creatures', impacts: ['Slows movement', 'Concealment'] },
    { name: 'Smoking Fissures', description: 'Cracks in the ground emitting toxic gas.', mechanicalEffect: 'DC 13 Con save or poisoned; 1d6 poison damage', impacts: ['Poison hazard', 'Visibility reduction'] },
    { name: 'Obsidian Fields', description: 'Fields of sharp volcanic glass.', mechanicalEffect: '1d4 piercing per 10 feet; difficult terrain', impacts: ['Movement damage', 'Difficult terrain'] },
    { name: 'Fire Geysers', description: 'Vents that erupt with flames.', mechanicalEffect: '3d6 fire damage; DC 14 Dexterity save', impacts: ['Random hazard', 'Fire damage'] },
  ],
  'Sunken Ruins': [
    { name: 'Submerged Walls', description: 'Underwater stone structures.', mechanicalEffect: 'Full cover; swimming required', impacts: ['Underwater cover', 'Swimming needed'] },
    { name: 'Air Pockets', description: 'Trapped air in collapsed chambers.', mechanicalEffect: 'Breathing spots; limited time supply', impacts: ['Respite spots', 'Time pressure'] },
    { name: 'Coral Growth', description: 'Coral covering the ancient stones.', mechanicalEffect: 'Difficult terrain; 1d4 piercing if touched', impacts: ['Slows movement', 'Damage hazard'] },
    { name: 'Underwater Tunnels', description: 'Passages leading deeper into the ruins.', mechanicalEffect: 'Swimming required; may lead to air chambers', impacts: ['Exploration routes', 'Potential traps'] },
    { name: 'Current Zones', description: 'Areas with strong water currents.', mechanicalEffect: 'DC 13 Strength save or moved 20 feet', impacts: ['Movement control', 'Disorientation'] },
  ],
  'Floating Sky Island': [
    { name: 'Cloud Bridges', description: 'Semi-solid cloud formations connecting islands.', mechanicalEffect: 'DC 12 Acrobatics; may dissipate under weight', impacts: ['Unstable crossing', 'Falling hazard'] },
    { name: 'Floating Rocks', description: 'Smaller rocks drifting around the island.', mechanicalEffect: 'Can be used as stepping stones; may drift away', impacts: ['Mobile platforms', 'Unpredictable movement'] },
    { name: 'Wind Barriers', description: 'Strong updrafts around the island edges.', mechanicalEffect: 'DC 14 Strength save near edges; can slow falls', impacts: ['Edge protection', 'Falling mitigation'] },
    { name: 'Ancient Structures', description: 'Ruins of those who once lived here.', mechanicalEffect: 'Cover from elements; may contain secrets', impacts: ['Cover available', 'Exploration potential'] },
    { name: 'Sky Crystals', description: 'Crystalline formations with anti-gravity properties.', mechanicalEffect: 'Grants limited flight; valuable and rare', impacts: ['Flight potential', 'Treasure value'] },
  ],
};

export const ENVIRONMENTAL_MECHANICS: Record<string, { name: string; trigger: string; effect: string; damageType?: string; damageDice?: string; saveType: string; saveDC: number; areaOfEffect: string }[]> = {
  'Mountain Pass': [
    { name: 'Rockslide', trigger: 'Loud noise or impact', effect: 'Boulders cascade down slopes', damageType: 'bludgeoning', damageDice: '4d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot radius' },
    { name: 'Gale Winds', trigger: 'Every 2d4 rounds', effect: 'Powerful winds sweep through the pass', saveType: 'STR', saveDC: 13, areaOfEffect: 'Entire area', damageDice: '0' },
    { name: 'Avalanche', trigger: 'Prolonged combat (4+ rounds)', effect: 'Snow and ice cascade down', damageType: 'cold', damageDice: '6d6', saveType: 'DEX', saveDC: 16, areaOfEffect: '40-foot wide path' },
    { name: 'Thin Air', trigger: 'Constant', effect: 'Altitude causes exhaustion', saveType: 'CON', saveDC: 12, areaOfEffect: 'Entire area', damageDice: '0' },
  ],
  'Volcanic Field': [
    { name: 'Geyser Eruption', trigger: 'Every 1d4 rounds', effect: 'Scalding water and steam erupt', damageType: 'fire', damageDice: '3d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '10-foot radius' },
    { name: 'Lava Surge', trigger: '2d6 rounds', effect: 'Molten rock flows across the battlefield', damageType: 'fire', damageDice: '8d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot line' },
    { name: 'Toxic Fumes', trigger: 'Wind direction change', effect: 'Poisonous gas rolls through', damageType: 'poison', damageDice: '2d6', saveType: 'CON', saveDC: 13, areaOfEffect: '30-foot radius' },
    { name: 'Ash Fall', trigger: 'Every 3 rounds', effect: 'Volcanic ash rains down', saveType: 'CON', saveDC: 11, areaOfEffect: 'Entire area', damageDice: '0' },
  ],
  'Icy Fjord': [
    { name: 'Ice Break', trigger: 'Heavy impact or 3+ creatures in area', effect: 'Ice cracks and breaks', damageType: 'cold', damageDice: '3d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '15-foot radius' },
    { name: 'Glacial Calving', trigger: '4d6 rounds', effect: 'Massive ice chunk falls from glacier', damageType: 'bludgeoning', damageDice: '10d6', saveType: 'DEX', saveDC: 16, areaOfEffect: '20-foot square' },
    { name: 'Freezing Spray', trigger: 'Strong winds', effect: 'Water spray freezes on contact', damageType: 'cold', damageDice: '1d6', saveType: 'CON', saveDC: 12, areaOfEffect: '30-foot cone' },
    { name: 'Whiteout', trigger: '1d4+2 rounds', effect: 'Blizzard conditions reduce visibility', saveType: 'WIS', saveDC: 13, areaOfEffect: 'Entire area', damageDice: '0' },
  ],
  'Dense Forest': [
    { name: 'Falling Branches', trigger: 'Wind or impact', effect: 'Dead branches crash down', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'DEX', saveDC: 12, areaOfEffect: '5-foot radius' },
    { name: 'Root Trip', trigger: 'Movement through undergrowth', effect: 'Hidden roots catch feet', saveType: 'DEX', saveDC: 11, areaOfEffect: 'Single creature', damageDice: '0' },
    { name: 'Forest Fire', trigger: 'Fire damage in area', effect: 'Flames spread through dry undergrowth', damageType: 'fire', damageDice: '3d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '20-foot radius' },
    { name: 'Poisonous Spores', trigger: 'Disturbing fungi', effect: 'Toxic spores released', damageType: 'poison', damageDice: '2d4', saveType: 'CON', saveDC: 13, areaOfEffect: '10-foot radius' },
  ],
  'Underground Cave': [
    { name: 'Cave-In', trigger: 'Loud noise or structural damage', effect: 'Ceiling collapses', damageType: 'bludgeoning', damageDice: '4d10', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot radius' },
    { name: 'Gas Pocket', trigger: 'Open flame or spark', effect: 'Explosive gas ignites', damageType: 'fire', damageDice: '5d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '30-foot radius' },
    { name: 'Flooding', trigger: '2d6 rounds', effect: 'Water rises rapidly', saveType: 'STR', saveDC: 13, areaOfEffect: 'Entire area', damageDice: '0' },
    { name: 'Stalactite Fall', trigger: 'Vibration or impact', effect: 'Stone spikes crash down', damageType: 'piercing', damageDice: '2d6', saveType: 'DEX', saveDC: 12, areaOfEffect: '10-foot radius' },
  ],
  'Desert Ruins': [
    { name: 'Sandstorm', trigger: '1d4+1 rounds', effect: 'Blowing sand reduces visibility', saveType: 'CON', saveDC: 13, areaOfEffect: 'Entire area', damageDice: '0' },
    { name: 'Quicksand', trigger: 'Entering the area', effect: 'Ground gives way to sand trap', saveType: 'STR', saveDC: 12, areaOfEffect: '10-foot square', damageDice: '0' },
    { name: 'Structural Collapse', trigger: 'Heavy damage to ruins', effect: 'Walls and ceilings fall', damageType: 'bludgeoning', damageDice: '5d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '15-foot radius' },
    { name: 'Heat Wave', trigger: 'Midday hours', effect: 'Intense heat exhausts creatures', damageType: 'fire', damageDice: '1d6', saveType: 'CON', saveDC: 12, areaOfEffect: 'Entire area' },
  ],
  'Swamp Marsh': [
    { name: 'Quicksand Expansion', trigger: 'Movement near quicksand', effect: 'Quicksand spreads', saveType: 'DEX', saveDC: 13, areaOfEffect: '15-foot radius', damageDice: '0' },
    { name: 'Toxic Bog', trigger: 'Disturbing stagnant water', effect: 'Poisonous gases released', damageType: 'poison', damageDice: '2d6', saveType: 'CON', saveDC: 13, areaOfEffect: '20-foot radius' },
    { name: 'Rising Water', trigger: 'Rain or dam break', effect: 'Water level rises', saveType: 'STR', saveDC: 11, areaOfEffect: 'Entire area', damageDice: '0' },
    { name: 'Insect Swarm', trigger: 'Disturbing nests', effect: 'Biting insects attack', damageType: 'piercing', damageDice: '1d4', saveType: 'CON', saveDC: 11, areaOfEffect: '10-foot radius' },
  ],
  'Coastal Cliff': [
    { name: 'Rogue Wave', trigger: '1d6 rounds', effect: 'Massive wave crashes onto rocks', damageType: 'bludgeoning', damageDice: '4d6', saveType: 'STR', saveDC: 15, areaOfEffect: '30-foot line from water' },
    { name: 'Rockfall', trigger: 'Impact on cliff face', effect: 'Loose rocks cascade down', damageType: 'bludgeoning', damageDice: '3d6', saveType: 'DEX', saveDC: 13, areaOfEffect: '10-foot radius' },
    { name: 'Tidal Surge', trigger: '2d4 rounds', effect: 'Tide rises rapidly', saveType: 'STR', saveDC: 12, areaOfEffect: 'Lower areas flood', damageDice: '0' },
    { name: 'Slippery When Wet', trigger: 'Rain or spray', effect: 'Surfaces become treacherous', saveType: 'DEX', saveDC: 12, areaOfEffect: 'Wet surfaces', damageDice: '0' },
  ],
  'Urban Alley': [
    { name: 'Crowd Panic', trigger: 'Combat starts', effect: 'Civilians flee in terror', saveType: 'CHA', saveDC: 12, areaOfEffect: 'Streets clear', damageDice: '0' },
    { name: 'Building Collapse', trigger: 'Structural damage', effect: 'Part of a building falls', damageType: 'bludgeoning', damageDice: '6d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot square' },
    { name: 'Fire Spread', trigger: 'Fire damage in area', effect: 'Flames spread to buildings', damageType: 'fire', damageDice: '3d6', saveType: 'DEX', saveDC: 13, areaOfEffect: '10-foot radius' },
    { name: 'City Watch', trigger: '3d6 rounds of combat', effect: 'Guards respond to disturbance', saveType: 'CHA', saveDC: 14, areaOfEffect: 'Guards arrive', damageDice: '0' },
  ],
  'Temple Chamber': [
    { name: 'Divine Wrath', trigger: 'Desecration of altar', effect: 'Magical energy discharges', damageType: 'radiant', damageDice: '4d8', saveType: 'WIS', saveDC: 15, areaOfEffect: '30-foot radius' },
    { name: 'Ancient Trap', trigger: 'Stepping on pressure plate', effect: 'Mechanical trap activates', damageType: 'piercing', damageDice: '3d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '10-foot square' },
    { name: 'Haunting Manifestation', trigger: '1d4 rounds', effect: 'Spirits materialize', saveType: 'WIS', saveDC: 13, areaOfEffect: '20-foot radius', damageDice: '0' },
    { name: 'Collapsing Floor', trigger: 'Heavy weight on weak spot', effect: 'Floor gives way', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'DEX', saveDC: 12, areaOfEffect: '15-foot square' },
  ],
  'River Crossing': [
    { name: 'Flash Flood', trigger: '1d4+2 rounds', effect: 'Water level rises suddenly', damageType: 'bludgeoning', damageDice: '3d6', saveType: 'STR', saveDC: 14, areaOfEffect: 'River banks' },
    { name: 'Sweeping Current', trigger: 'Entering deep water', effect: 'Current pulls creatures downstream', saveType: 'STR', saveDC: 13, areaOfEffect: 'Deep water', damageDice: '0' },
    { name: 'Logjam Break', trigger: 'Heavy impact on debris', effect: 'Accumulated debris rushes downstream', damageType: 'bludgeoning', damageDice: '4d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot line' },
    { name: 'Water Snake Nest', trigger: 'Disturbing the bank', effect: 'Venomous snakes swarm', damageType: 'poison', damageDice: '2d4', saveType: 'CON', saveDC: 12, areaOfEffect: '10-foot radius' },
  ],
  'Frozen Tundra': [
    { name: 'Blizzard', trigger: '1d6 rounds', effect: 'Visibility drops and cold intensifies', damageType: 'cold', damageDice: '1d6', saveType: 'CON', saveDC: 13, areaOfEffect: 'Entire area' },
    { name: 'Avalanche', trigger: 'Loud noise or warmth', effect: 'Snow cascades down slopes', damageType: 'cold', damageDice: '6d6', saveType: 'DEX', saveDC: 16, areaOfEffect: '40-foot wide path' },
    { name: 'Frozen Lake Crack', trigger: 'Multiple creatures in area', effect: 'Ice gives way beneath', damageType: 'cold', damageDice: '3d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '20-foot radius' },
    { name: 'Whiteout', trigger: '2d4 rounds', effect: 'Snow blinds all creatures', saveType: 'CON', saveDC: 12, areaOfEffect: 'Entire area', damageDice: '0' },
  ],
  'Jungle Temple': [
    { name: 'Pollen Cloud', trigger: 'Disturbing flowering plants', effect: 'Hallucinogenic pollen fills air', damageType: 'poison', damageDice: '1d4', saveType: 'CON', saveDC: 13, areaOfEffect: '15-foot radius' },
    { name: 'Trap Floor', trigger: 'Stepping on wrong tile', effect: 'Floor tilts into pit', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '10-foot square' },
    { name: 'Vine Strangle', trigger: '1d4 rounds', effect: 'Animated vines grab creatures', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'STR', saveDC: 13, areaOfEffect: '20-foot radius' },
    { name: 'Monsoon Downpour', trigger: '3d6 rounds', effect: 'Heavy rain reduces visibility', saveType: 'CON', saveDC: 11, areaOfEffect: 'Entire area', damageDice: '0' },
  ],
  'Abandoned Mine': [
    { name: 'Cave-In', trigger: 'Loud noise or damage to supports', effect: 'Ceiling collapses', damageType: 'bludgeoning', damageDice: '4d10', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot radius' },
    { name: 'Gas Pocket', trigger: 'Open flame', effect: 'Explosive gas ignites', damageType: 'fire', damageDice: '5d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '30-foot radius' },
    { name: 'Flooding', trigger: '2d6 rounds', effect: 'Water rises rapidly', saveType: 'STR', saveDC: 13, areaOfEffect: 'Lower sections', damageDice: '0' },
    { name: 'Unstable Rails', trigger: 'Stepping on tracks', effect: 'Mine carts roll unexpectedly', damageType: 'bludgeoning', damageDice: '2d8', saveType: 'DEX', saveDC: 12, areaOfEffect: '10-foot line' },
  ],
  'Haunted Manor': [
    { name: 'Poltergeist Activity', trigger: '1d4 rounds', effect: 'Objects fly through the air', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'DEX', saveDC: 13, areaOfEffect: '30-foot radius' },
    { name: 'Manifest Fear', trigger: 'Frightened creature', effect: 'Worst fear appears as illusion', saveType: 'WIS', saveDC: 15, areaOfEffect: 'Single creature', damageDice: '0' },
    { name: 'Ghostly Possession', trigger: 'Touching cursed object', effect: 'Spirit attempts to possess', saveType: 'CHA', saveDC: 14, areaOfEffect: 'Single creature', damageDice: '0' },
    { name: 'Floor Collapse', trigger: 'Heavy weight', effect: 'Rotting floor gives way', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'DEX', saveDC: 12, areaOfEffect: '15-foot square' },
  ],
  'Ancient Bridge': [
    { name: 'Section Collapse', trigger: '2d4 rounds of combat', effect: 'Part of bridge falls away', damageType: 'bludgeoning', damageDice: '6d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot section' },
    { name: 'High Winds', trigger: 'Every 1d4 rounds', effect: 'Gusts threaten to blow creatures off', saveType: 'STR', saveDC: 14, areaOfEffect: 'Entire bridge', damageDice: '0' },
    { name: 'Guardian Awakening', trigger: 'Desecration or combat', effect: 'Statues animate briefly', damageType: 'bludgeoning', damageDice: '3d6', saveType: 'DEX', saveDC: 14, areaOfEffect: 'Near statue' },
    { name: 'Structural Shake', trigger: 'Heavy impact', effect: 'Bridge sways dangerously', saveType: 'DEX', saveDC: 12, areaOfEffect: 'Entire bridge', damageDice: '0' },
  ],
  'Crystalline Cavern': [
    { name: 'Sonic Resonance', trigger: 'Loud noise', effect: 'Crystals amplify and reflect sound', damageType: 'thunder', damageDice: '3d8', saveType: 'CON', saveDC: 14, areaOfEffect: '40-foot radius' },
    { name: 'Light Burst', trigger: 'Bright light on crystals', effect: 'Reflected light blinds creatures', saveType: 'CON', saveDC: 13, areaOfEffect: '30-foot cone', damageDice: '0' },
    { name: 'Crystal Growth', trigger: '1d6 rounds', effect: 'Crystals rapidly grow, blocking paths', saveType: 'DEX', saveDC: 12, areaOfEffect: '10-foot radius', damageDice: '0' },
    { name: 'Shattering', trigger: 'Thunder damage', effect: 'Crystals shatter into shrapnel', damageType: 'piercing', damageDice: '4d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot radius' },
  ],
  'Burning Wastes': [
    { name: 'Lava Surge', trigger: '2d6 rounds', effect: 'Lava flows across battlefield', damageType: 'fire', damageDice: '8d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '20-foot line' },
    { name: 'Toxic Gas', trigger: 'Wind change', effect: 'Poisonous fumes roll through', damageType: 'poison', damageDice: '3d6', saveType: 'CON', saveDC: 14, areaOfEffect: '40-foot radius' },
    { name: 'Ash Storm', trigger: '1d4 rounds', effect: 'Choking ash fills the air', damageType: 'fire', damageDice: '1d6', saveType: 'CON', saveDC: 12, areaOfEffect: 'Entire area' },
    { name: 'Ground Collapse', trigger: 'Heavy weight', effect: 'Thin crust breaks over lava', damageType: 'fire', damageDice: '5d6', saveType: 'DEX', saveDC: 14, areaOfEffect: '10-foot radius' },
  ],
  'Sunken Ruins': [
    { name: 'Current Surge', trigger: '1d4 rounds', effect: 'Strong current pulls creatures', saveType: 'STR', saveDC: 14, areaOfEffect: '30-foot line', damageDice: '0' },
    { name: 'Air Pocket Depletion', trigger: '3 rounds in pocket', effect: 'Oxygen runs low', saveType: 'CON', saveDC: 13, areaOfEffect: 'Air pocket', damageDice: '0' },
    { name: 'Predator Attraction', trigger: 'Blood in water', effect: 'Aquatic predators arrive', damageType: 'piercing', damageDice: '3d6', saveType: 'DEX', saveDC: 13, areaOfEffect: '20-foot radius' },
    { name: 'Structure Collapse', trigger: 'Heavy damage to ruins', effect: 'Underwater rubble falls', damageType: 'bludgeoning', damageDice: '4d6', saveType: 'DEX', saveDC: 15, areaOfEffect: '15-foot radius' },
  ],
  'Floating Sky Island': [
    { name: 'Wind Shear', trigger: '1d4 rounds', effect: 'Sudden downdraft threatens flyers', damageType: 'bludgeoning', damageDice: '2d6', saveType: 'STR', saveDC: 14, areaOfEffect: 'Near edges' },
    { name: 'Island Drift', trigger: '3d6 rounds', effect: 'Island shifts position', saveType: 'DEX', saveDC: 12, areaOfEffect: 'Entire area', damageDice: '0' },
    { name: 'Gravity Flux', trigger: '1d6 rounds', effect: 'Gravity temporarily weakens', saveType: 'DEX', saveDC: 13, areaOfEffect: '20-foot radius', damageDice: '0' },
    { name: 'Cloud Dissipation', trigger: 'Heavy weight on cloud bridge', effect: 'Cloud bridge fades', damageType: 'bludgeoning', damageDice: '4d6', saveType: 'DEX', saveDC: 15, areaOfEffect: 'Cloud section' },
  ],
};

// ============== ENEMY TABLES ==============

export const ENEMY_TYPES: Record<string, { name: string; type: string; cr: string; xp: number; size: string; abilities: string[]; tactics: string[] }[]> = {
  'Mountain Pass': [
    { name: 'Mountain Troll', type: 'Giant', cr: '5', xp: 1800, size: 'Large', abilities: ['Keen Smell', 'Regeneration'], tactics: ['Throws boulders from height', 'Blocks narrow passages', 'Uses cliffs to separate party'] },
    { name: 'Harpy', type: 'Monstrosity', cr: '1', xp: 200, size: 'Medium', abilities: ['Flying', 'Luring Song'], tactics: ['Attacks from above', 'Lures characters off ledges', 'Uses wind to advantage'] },
    { name: 'Griffon', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Flying', 'Keen Sight'], tactics: ['Dive attacks', 'Carries prey away', 'Nests on high ledges'] },
    { name: 'Aarakocra Scout', type: 'Humanoid', cr: '1/4', xp: 50, size: 'Medium', abilities: ['Flying', 'Dive Attack'], tactics: ['Aerial harassment', 'Flies out of reach', 'Uses ranged weapons'] },
    { name: 'Stone Giant', type: 'Giant', cr: '7', xp: 2900, size: 'Huge', abilities: ['Stone Camouflage', 'Thrown Rock'], tactics: ['Hides as stone', 'Throws boulders', 'Uses terrain as cover'] },
  ],
  'Volcanic Field': [
    { name: 'Fire Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Medium', abilities: ['Fire Form', 'Illumination', 'Water Susceptibility'], tactics: ['Moves through lava', 'Ignites flammable objects', 'Surrounds targets'] },
    { name: 'Magma Mephit', type: 'Elemental', cr: '1/2', xp: 100, size: 'Small', abilities: ['Death Burst', 'Fire Breath'], tactics: ['Groups together', 'Uses lava for cover', 'Ambushes from pools'] },
    { name: 'Salamander', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Heated Body', 'Heated Weapon'], tactics: ['Drags foes into lava', 'Uses reach advantage', 'Takes cover in heat vents'] },
    { name: 'Azer', type: 'Elemental', cr: '2', xp: 450, size: 'Medium', abilities: ['Heated Body', 'Heated Weapons', 'Fire Resistance'], tactics: ['Fights in formation', 'Uses thermal vents', 'Ignores lava hazards'] },
    { name: 'Lava Beast', type: 'Elemental', cr: '3', xp: 700, size: 'Large', abilities: ['Lava Swim', 'Heat Aura'], tactics: ['Emerges from lava', 'Grapples targets', 'Retreats to lava pools'] },
  ],
  'Icy Fjord': [
    { name: 'Ice Troll', type: 'Giant', cr: '6', xp: 2300, size: 'Large', abilities: ['Regeneration', 'Keen Smell'], tactics: ['Hides in ice formations', 'Uses slippery terrain', 'Pushes enemies toward water'] },
    { name: 'Frost Giant', type: 'Giant', cr: '8', xp: 3900, size: 'Huge', abilities: ['Cold Resistance', 'Thrown Rock'], tactics: ['Throws boulders from ice floes', 'Breaks ice under enemies', 'Uses blizzards for cover'] },
    { name: 'Ice Mephit', type: 'Elemental', cr: '1/2', xp: 100, size: 'Small', abilities: ['Death Burst', 'Frost Breath'], tactics: ['Swarm tactics', 'Hides in snow', 'Targets prone enemies'] },
    { name: 'Winter Wolf', type: 'Monstrosity', cr: '3', xp: 700, size: 'Large', abilities: ['Cold Breath', 'Pack Tactics', 'Keen Hearing/Smell'], tactics: ['Flanking maneuvers', 'Trips enemies on ice', 'Howls for reinforcements'] },
    { name: 'Water Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Water Form', 'Whelm'], tactics: ['Emerges from fjord', 'Whelms targets', 'Fills ice cracks'] },
  ],
  'Dense Forest': [
    { name: 'Orc Raider', type: 'Humanoid', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Aggressive', 'Sunlight Sensitivity'], tactics: ['Hit and run', 'Uses trees for cover', 'Ambushes from undergrowth'] },
    { name: 'Dire Wolf', type: 'Beast', cr: '1', xp: 200, size: 'Large', abilities: ['Keen Hearing/Smell', 'Pack Tactics'], tactics: ['Flanking', 'Trips prone targets', 'Drags separated prey'] },
    { name: 'Treant', type: 'Plant', cr: '9', xp: 5000, size: 'Huge', abilities: ['Animate Trees', 'False Appearance'], tactics: ['Appears as normal tree', 'Commands other trees', 'Throws boulders'] },
    { name: 'Dryad', type: 'Fey', cr: '1', xp: 200, size: 'Medium', abilities: ['Fey Charm', 'Tree Stride'], tactics: ['Charms from hiding', 'Escapes via trees', 'Uses forest for cover'] },
    { name: 'Owlbear', type: 'Monstrosity', cr: '3', xp: 700, size: 'Large', abilities: ['Keen Sight/Smell'], tactics: ['Rage-driven attacks', 'Grapples with beak', 'Territorial aggression'] },
  ],
  'Underground Cave': [
    { name: 'Gargoyle', type: 'Construct', cr: '2', xp: 450, size: 'Medium', abilities: ['False Appearance', 'Damage Resistances'], tactics: ['Poses as statue', 'Drops from ceiling', 'Targets isolated prey'] },
    { name: 'Hook Horror', type: 'Monstrosity', cr: '3', xp: 700, size: 'Medium', abilities: ['Echolocation', 'Hooks'], tactics: ['Climbs walls', 'Hooks targets', 'Fights in darkness'] },
    { name: 'Roper', type: 'Monstrosity', cr: '5', xp: 1800, size: 'Large', abilities: ['False Appearance', 'Tendrils', 'Sticky Strands'], tactics: ['Appears as stalagmite', 'Pulls prey with tendrils', 'Targets light sources'] },
    { name: 'Bugbear', type: 'Humanoid', cr: '1', xp: 200, size: 'Medium', abilities: ['Brave', 'Surprise Attack'], tactics: ['Ambushes from shadows', 'Silent movement', 'Strikes from hiding'] },
    { name: 'Carrion Crawler', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Keen Smell', 'Paralyzing Tentacles'], tactics: ['Drops from ceiling', 'Paralyzes multiple targets', 'Feeds on paralyzed prey'] },
  ],
  'Desert Ruins': [
    { name: 'Mummy', type: 'Undead', cr: '3', xp: 700, size: 'Medium', abilities: ['Dreadful Glare', 'Rotting Fist'], tactics: ['Guards tombs', 'Uses dreadful gaze', 'Pursues relentlessly'] },
    { name: 'Gargoyle', type: 'Construct', cr: '2', xp: 450, size: 'Medium', abilities: ['False Appearance'], tactics: ['Perches on ruins', 'Drops on passersby', 'Immune to non-magic weapons'] },
    { name: 'Ankheg', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Acid Spray', 'Burrow'], tactics: ['Burrows beneath sand', 'Ambushes from below', 'Grapples with mandibles'] },
    { name: 'Skeleton', type: 'Undead', cr: '1/4', xp: 50, size: 'Medium', abilities: ['Damage Vulnerabilities'], tactics: ['Swarm tactics', 'Uses ancient weapons', 'Obeys deathless commander'] },
    { name: 'Jackalwere', type: 'Fiend', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Shapechanger', 'Sleep Gaze', 'Keen Senses'], tactics: ['Appears as jackal', 'Puts prey to sleep', 'Fights in packs'] },
  ],
  'Swamp Marsh': [
    { name: 'Bullywug', type: 'Humanoid', cr: '1/4', xp: 50, size: 'Medium', abilities: ['Amphibious', 'Speak with Frogs', 'Standing Leap'], tactics: ['Hides in mud', 'Swarm tactics', 'Uses water escape routes'] },
    { name: 'Black Dragon Wyrmling', type: 'Dragon', cr: '2', xp: 450, size: 'Medium', abilities: ['Acid Breath', 'Amphibious'], tactics: ['Acid breath on grouped enemies', 'Swims to escape', 'Fights from water'] },
    { name: 'Hydra', type: 'Monstrosity', cr: '8', xp: 3900, size: 'Huge', abilities: ['Multiple Heads', 'Reactive Heads', 'Regeneration'], tactics: ['Multiple attacks per round', 'Retaliates against attackers', 'Regrows heads'] },
    { name: 'Lizardfolk', type: 'Humanoid', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Hold Breath', 'Natural Armor'], tactics: ['Fights in water', 'Uses natural weapons', 'Cunning ambush'] },
    { name: 'Shambling Mound', type: 'Plant', cr: '5', xp: 1800, size: 'Large', abilities: ['Lightning Absorption', 'Engulf', 'False Appearance'], tactics: ['Appears as debris', 'Engulfs targets', 'Absorbs lightning'] },
  ],
  'Coastal Cliff': [
    { name: 'Sahuagin', type: 'Humanoid', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Blood Frenzy', 'Limited Amphibiousness', 'Shark Telepathy'], tactics: ['Fights in water', 'Enters blood frenzy', 'Commands sharks'] },
    { name: 'Merrow', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Amphibious', 'Darkvision'], tactics: ['Ambushes from water', 'Drags targets underwater', 'Uses harpoon'] },
    { name: 'Water Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Water Form', 'Whelm'], tactics: ['Emerges from waves', 'Whelms targets', 'Reforms if dispersed'] },
    { name: 'Harpy', type: 'Monstrosity', cr: '1', xp: 200, size: 'Medium', abilities: ['Flying', 'Luring Song'], tactics: ['Nests on cliffs', 'Lures targets off edges', 'Aerial attacks'] },
    { name: 'Sea Hag', type: 'Fey', cr: '2', xp: 450, size: 'Medium', abilities: ['Horrific Appearance', 'Death Glare', 'Amphibious'], tactics: ['Hides in sea caves', 'Uses death glare', 'Illusionary appearance'] },
  ],
  'Urban Alley': [
    { name: 'Thug', type: 'Humanoid', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Pack Tactics'], tactics: ['Fights in groups', 'Uses terrain for cover', 'Flees when outmatched'] },
    { name: 'Ruffian', type: 'Humanoid', cr: '1/4', xp: 50, size: 'Medium', abilities: [], tactics: ['Numbers advantage', 'Uses improvised weapons', 'Cheap shots'] },
    { name: 'Spy', type: 'Humanoid', cr: '1', xp: 200, size: 'Medium', abilities: ['Cunning Action', 'Sneak Attack'], tactics: ['Blends with crowd', 'Strikes from hiding', 'Escapes via rooftops'] },
    { name: 'Bandit Captain', type: 'Humanoid', cr: '2', xp: 450, size: 'Medium', abilities: [], tactics: ['Commands gang', 'Uses terrain', 'Takes hostages'] },
    { name: 'Assassin', type: 'Humanoid', cr: '8', xp: 3900, size: 'Medium', abilities: ['Assassinate', 'Evasion', 'Sneak Attack'], tactics: ['Strikes from surprise', 'Poisons weapons', 'Disguises as civilian'] },
  ],
  'Temple Chamber': [
    { name: 'Cultist', type: 'Humanoid', cr: '1/8', xp: 25, size: 'Medium', abilities: ['Dark Devotion'], tactics: ['Fanatical fighting', 'Uses numbers', 'Fearless'] },
    { name: 'Cult Fanatic', type: 'Humanoid', cr: '2', xp: 450, size: 'Medium', abilities: ['Dark Devotion', 'Spellcasting'], tactics: ['Commands cultists', 'Uses hold person', 'Channels divine magic'] },
    { name: 'Specter', type: 'Undead', cr: '1', xp: 200, size: 'Medium', abilities: ['Incorporeal Movement', 'Sunlight Sensitivity'], tactics: ['Passes through walls', 'Drains life', 'Avoids sunlight'] },
    { name: 'Wight', type: 'Undead', cr: '3', xp: 700, size: 'Medium', abilities: ['Sunlight Sensitivity', 'Life Drain'], tactics: ['Guards tomb', 'Commands undead', 'Drains life'] },
    { name: 'Guardian Naga', type: 'Monstrosity', cr: '10', xp: 5900, size: 'Large', abilities: ['Rejuvenation', 'Spellcasting', 'Poison Breath'], tactics: ['Protects sacred areas', 'Uses spells wisely', 'Poison breath on groups'] },
  ],
  'River Crossing': [
    { name: 'River Troll', type: 'Giant', cr: '4', xp: 1100, size: 'Large', abilities: ['Regeneration', 'Keen Smell', 'Amphibious'], tactics: ['Hides underwater', 'Grabs from below', 'Retreats to deep water'] },
    { name: 'Nixie', type: 'Fey', cr: '1/4', xp: 50, size: 'Small', abilities: ['Water Breathing', 'Charm Person'], tactics: ['Lures into water', 'Uses current', 'Calls for help'] },
    { name: 'Giant Otter', type: 'Beast', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Hold Breath', 'Keen Smell'], tactics: ['Pack tactics', 'Distracts prey', 'Flanking attacks'] },
    { name: 'Water Weird', type: 'Elemental', cr: '3', xp: 700, size: 'Large', abilities: ['Invisible in Water', 'Water Form', 'Constrict'], tactics: ['Hides in currents', 'Constricts swimmers', 'Reforms in water'] },
    { name: 'Naga Guardian', type: 'Monstrosity', cr: '5', xp: 1800, size: 'Large', abilities: ['Amphibious', 'Poison Breath', 'Spellcasting'], tactics: ['Guards river crossing', 'Uses spells to control', 'Poisons water'] },
  ],
  'Frozen Tundra': [
    { name: 'Frost Wight', type: 'Undead', cr: '3', xp: 700, size: 'Medium', abilities: ['Cold Resistance', 'Life Drain', 'Sunlight Sensitivity'], tactics: ['Hides in snow', 'Drains warmth', 'Commands winter wolves'] },
    { name: 'Remorhaz', type: 'Monstrosity', cr: '11', xp: 7200, size: 'Huge', abilities: ['Heated Body', 'Swallow', 'Burst'], tactics: ['Burrows under snow', 'Swallows prey', 'Heats up when damaged'] },
    { name: 'Ice Mephit', type: 'Elemental', cr: '1/2', xp: 100, size: 'Small', abilities: ['Death Burst', 'Frost Breath', 'False Appearance'], tactics: ['Hides as ice', 'Groups together', 'Uses frost breath'] },
    { name: 'Winter Wolf', type: 'Monstrosity', cr: '3', xp: 700, size: 'Large', abilities: ['Cold Breath', 'Pack Tactics', 'Keen Senses'], tactics: ['Flanking maneuvers', 'Trips on ice', 'Howls for pack'] },
    { name: 'Young White Dragon', type: 'Dragon', cr: '6', xp: 2300, size: 'Large', abilities: ['Cold Breath', 'Ice Walk', 'Darkvision'], tactics: ['Aerial attacks', 'Freezes targets', 'Uses blizzard'] },
  ],
  'Jungle Temple': [
    { name: 'Yuan-ti Pureblood', type: 'Humanoid', cr: '1', xp: 200, size: 'Medium', abilities: ['Innate Spellcasting', 'Magic Resistance', 'Poison Immunity'], tactics: ['Uses poison', 'Casts suggestion', 'Deceives party'] },
    { name: 'Giant Ape', type: 'Beast', cr: '7', xp: 2900, size: 'Large', abilities: ['Athletic', 'Keen Senses'], tactics: ['Swings from vines', 'Throws objects', 'Territorial'] },
    { name: 'Vine Blight', type: 'Plant', cr: '1/2', xp: 100, size: 'Medium', abilities: ['False Appearance', 'Constrict', 'Entangle'], tactics: ['Appears as vines', 'Grabs prey', 'Calls other blights'] },
    { name: 'Jungle Lizardfolk', type: 'Humanoid', cr: '1', xp: 200, size: 'Medium', abilities: ['Hold Breath', 'Natural Armor', 'Cunning Artisan'], tactics: ['Ambushes from water', 'Uses poison weapons', 'Climbing'] },
    { name: 'Couatl', type: 'Celestial', cr: '4', xp: 1100, size: 'Medium', abilities: ['Flying', 'Spellcasting', 'Psychic Shield'], tactics: ['Tests party virtue', 'Uses illusion', 'Protects temple'] },
  ],
  'Abandoned Mine': [
    { name: 'Derro', type: 'Humanoid', cr: '1/4', xp: 50, size: 'Small', abilities: ['Insanity', 'Sunlight Sensitivity', 'Magic Resistance'], tactics: ['Uses poison', 'Surprise attacks', 'Fights in groups'] },
    { name: 'Cave Fisher', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Spider Climb', 'Filament', 'Adhesive'], tactics: ['Drops from ceiling', 'Snags prey', 'Drags victims up'] },
    { name: 'Ore Golem', type: 'Construct', cr: '4', xp: 1100, size: 'Large', abilities: ['Immutable Form', 'Magic Resistance', 'Berserk'], tactics: ['Guards mine', 'Single-minded attacks', 'Indestructible'], abilities: ['Immutable Form', 'Magic Resistance'] },
    { name: 'Darkmantle', type: 'Monstrosity', cr: '1/2', xp: 100, size: 'Small', abilities: ['False Appearance', 'Darkness Aura'], tactics: ['Drops on prey', 'Creates darkness', 'Constricts'] },
    { name: 'Earth Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Earth Glide', 'Siege Monster'], tactics: ['Emerges from walls', 'Traps creatures', 'Earth glide'] },
  ],
  'Haunted Manor': [
    { name: 'Ghost', type: 'Undead', cr: '4', xp: 1100, size: 'Medium', abilities: ['Ethereal Sight', 'Incorporeal Movement', 'Possession'], tactics: ['Possesses weak-willed', 'Phase through walls', 'Frightening presence'] },
    { name: 'Specter', type: 'Undead', cr: '1', xp: 200, size: 'Medium', abilities: ['Incorporeal Movement', 'Sunlight Sensitivity'], tactics: ['Drains life', 'Passes through walls', 'Avoids sunlight'] },
    { name: 'Poltergeist', type: 'Undead', cr: '2', xp: 450, size: 'Medium', abilities: ['Invisible', 'Telekinetic Force', 'Sunlight Sensitivity'], tactics: ['Throws objects', 'Remains invisible', 'Targets lights'] },
    { name: 'Will-o\'-Wisp', type: 'Undead', cr: '2', xp: 450, size: 'Small', abilities: ['Incorporeal Movement', 'Variable Illumination', 'Consume Life'], tactics: ['Lures into danger', 'Shocks prey', 'Invisible in light'] },
    { name: 'Wraith', type: 'Undead', cr: '5', xp: 1800, size: 'Medium', abilities: ['Incorporeal Movement', 'Sunlight Sensitivity', 'Life Drain', 'Create Spawn'], tactics: ['Commands ghosts', 'Drains life', 'Creates new wraiths'] },
  ],
  'Ancient Bridge': [
    { name: 'Stone Golem', type: 'Construct', cr: '10', xp: 5900, size: 'Large', abilities: ['Immutable Form', 'Magic Resistance', 'Slow'], tactics: ['Guards bridge', 'Slows intruders', 'Incredible strength'] },
    { name: 'Griffon', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Flying', 'Keen Sight'], tactics: ['Dive attacks', 'Nests on pillars', 'Aerial superiority'] },
    { name: 'Pegasus', type: 'Celestial', cr: '2', xp: 450, size: 'Large', abilities: ['Flying', 'Hooves'], tactics: ['Aerial attacks', 'Kicks from above', 'May be friendly'] },
    { name: 'Wyvern', type: 'Dragon', cr: '6', xp: 2300, size: 'Large', abilities: ['Flying', 'Poison Stinger', 'Darkvision'], tactics: ['Flyby attacks', 'Stings prey', 'Grabs and drops'] },
    { name: 'Air Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Air Form', 'Whirlwind'], tactics: ['Pushes off bridge', 'Whirlwind attack', 'Formless movement'] },
  ],
  'Crystalline Cavern': [
    { name: 'Crystal Golem', type: 'Construct', cr: '6', xp: 2300, size: 'Large', abilities: ['Immutable Form', 'Reflective Carapace', 'Magic Resistance'], tactics: ['Reflects spells', 'Shatters when damaged', 'Guards cavern'] },
    { name: 'Earth Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Earth Glide', 'Siege Monster'], tactics: ['Emerges from crystal', 'Traps creatures', 'Earth glide'] },
    { name: 'Flail Snail', type: 'Elemental', cr: '3', xp: 700, size: 'Large', abilities: ['Shell Defense', 'Scintillating Shell', 'Flail Tentacles'], tactics: ['Uses flails', 'Shell defense', 'Light warping'] },
    { name: 'Cave Fisher', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Spider Climb', 'Filament'], tactics: ['Drops from crystals', 'Snags prey', 'Climbs walls'] },
    { name: 'Nothic', type: 'Aberration', cr: '2', xp: 450, size: 'Medium', abilities: ['Insanity', 'Rotting Gaze', 'Keen Sight'], tactics: ['Uses rotting gaze', 'Reads thoughts', 'Insane mutterings'] },
  ],
  'Burning Wastes': [
    { name: 'Fire Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Medium', abilities: ['Fire Form', 'Illumination', 'Water Susceptibility'], tactics: ['Moves through lava', 'Ignites objects', 'Surrounds targets'] },
    { name: 'Salamander', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Heated Body', 'Heated Weapon'], tactics: ['Drags into lava', 'Uses reach', 'Heat vents'] },
    { name: 'Fire Giant', type: 'Giant', cr: '9', xp: 5000, size: 'Huge', abilities: ['Fire Resistance', 'Heated Weapon'], tactics: ['Forges weapons', 'Throws boulders', 'Uses heat'] },
    { name: 'Magma Mephit', type: 'Elemental', cr: '1/2', xp: 100, size: 'Small', abilities: ['Death Burst', 'Fire Breath'], tactics: ['Swarm tactics', 'Lava ambush', 'Groups together'] },
    { name: 'Efreeti', type: 'Elemental', cr: '11', xp: 7200, size: 'Large', abilities: ['Flying', 'Spellcasting', 'Fire Immunity'], tactics: ['Uses wishes sparingly', 'Fire magic', 'Captures foes'] },
  ],
  'Sunken Ruins': [
    { name: 'Sahuagin', type: 'Humanoid', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Blood Frenzy', 'Amphibious', 'Shark Telepathy'], tactics: ['Fights underwater', 'Blood frenzy', 'Commands sharks'] },
    { name: 'Merrow', type: 'Monstrosity', cr: '2', xp: 450, size: 'Large', abilities: ['Amphibious', 'Darkvision'], tactics: ['Ambushes from depths', 'Drags underwater', 'Uses harpoon'] },
    { name: 'Water Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Water Form', 'Whelm'], tactics: ['Whelms targets', 'Fills chambers', 'Reforms if dispersed'] },
    { name: 'Reef Shark', type: 'Beast', cr: '1/2', xp: 100, size: 'Medium', abilities: ['Pack Tactics', 'Water Breathing'], tactics: ['Swarm attacks', 'Blood frenzy', 'Circling'] },
    { name: 'Dragon Turtle', type: 'Dragon', cr: '17', xp: 18000, size: 'Gargantuan', abilities: ['Amphibious', 'Steam Breath', 'Shell Defense'], tactics: ['Capsizes boats', 'Steam breath', 'Demanding tribute'] },
  ],
  'Floating Sky Island': [
    { name: 'Air Elemental', type: 'Elemental', cr: '5', xp: 1800, size: 'Large', abilities: ['Air Form', 'Whirlwind'], tactics: ['Pushes off island', 'Whirlwind attack', 'Formless movement'] },
    { name: 'Pegasus', type: 'Celestial', cr: '2', xp: 450, size: 'Large', abilities: ['Flying', 'Hooves'], tactics: ['Aerial attacks', 'Kicks from above', 'May ally with good creatures'] },
    { name: 'Cockatrice', type: 'Monstrosity', cr: '1/2', xp: 100, size: 'Small', abilities: ['Flying', 'Petrifying Bite'], tactics: ['Petrifies prey', 'Hit and run', 'Nests on cliffs'] },
    { name: 'Gargoyle', type: 'Construct', cr: '2', xp: 450, size: 'Medium', abilities: ['False Appearance', 'Flying'], tactics: ['Perches on ruins', 'Drops from above', 'Immune to non-magic'] },
    { name: 'Cloud Giant', type: 'Giant', cr: '9', xp: 5000, size: 'Huge', abilities: ['Flying', 'Spellcasting', 'Keen Smell'], tactics: ['Throws boulders', 'Uses fog clouds', 'Commands weather'] },
  ],
};

// ============== TACTICAL ELEMENTS ==============

export const TACTICAL_ELEMENTS = [
  { name: 'Partial Cover', type: 'cover', description: 'Low walls, crates, or debris provide +2 AC and DEX save bonus.' },
  { name: 'Full Cover', type: 'cover', description: 'Solid obstacles block line of sight entirely.' },
  { name: 'Elevated Position', type: 'terrain', description: 'Higher ground grants advantage on melee attacks against lower targets.' },
  { name: 'Chokepoint', type: 'terrain', description: 'Narrow passage forces single-file movement, creating a bottleneck.' },
  { name: 'Difficult Terrain', type: 'terrain', description: 'Rubble, mud, or debris costs double movement.' },
  { name: 'Slippery Surface', type: 'hazard', description: 'Ice or wet stone requires DC 10 Dexterity save or fall prone.' },
  { name: 'Flammable Objects', type: 'hazard', description: 'Can be ignited to create fire damage or smoke.' },
  { name: 'Collapsible Structure', type: 'hazard', description: 'Can be brought down with sufficient damage.' },
  { name: 'Hidden Cache', type: 'objective', description: 'Secret compartment containing treasure or supplies.' },
  { name: 'Prisoner/VIP', type: 'objective', description: 'NPC that must be rescued or protected.' },
  { name: 'Ancient Mechanism', type: 'objective', description: 'Puzzle or lever that changes the battlefield.' },
  { name: 'Retreat Route', type: 'terrain', description: 'Hidden exit or escape path.' },
];

// ============== REWARDS ==============

export const REWARD_TYPES = {
  treasure: [
    { description: 'Copper coins scattered around the area', minValue: 10, maxValue: 100 },
    { description: 'Silver pieces in a hidden pouch', minValue: 20, maxValue: 200 },
    { description: 'Gold coins in a lockbox', minValue: 50, maxValue: 500 },
    { description: 'Gems worth their weight in gold', minValue: 100, maxValue: 1000 },
    { description: 'Art object of moderate value', minValue: 25, maxValue: 750 },
    { description: 'Rare art piece worth a fortune', minValue: 500, maxValue: 5000 },
  ],
  item: [
    { description: 'Potion of Healing', rarity: 'common' },
    { description: 'Spell scroll (1st level spell)', rarity: 'common' },
    { description: '+1 Weapon', rarity: 'uncommon' },
    { description: 'Bag of Holding', rarity: 'uncommon' },
    { description: '+1 Armor', rarity: 'uncommon' },
    { description: 'Cloak of Elvenkind', rarity: 'uncommon' },
    { description: 'Wand of Magic Missiles', rarity: 'uncommon' },
    { description: 'Weapon of Warning', rarity: 'uncommon' },
  ],
  story: [
    { description: 'Information about the villain\'s plans' },
    { description: 'Map to a hidden location' },
    { description: 'Key to a locked area' },
    { description: 'Letter revealing a conspiracy' },
    { description: 'Prisoner with valuable knowledge' },
    { description: 'Magical sign pointing the way forward' },
  ],
};

// ============== DYNAMIC CHANGES ==============

export const DYNAMIC_CHANGES = [
  { name: 'Reinforcements Arrive', trigger: 'Combat exceeds 4 rounds', timing: 'Start of round 5', effect: '1d4 additional enemies enter the battle', tacticalImplication: 'Party must finish quickly or face overwhelming odds' },
  { name: 'Environmental Shift', trigger: 'Prolonged combat', timing: 'Roll 1d6 each round after round 3', effect: 'Terrain changes (fog, water rises, etc.)', tacticalImplication: 'Adjusts battlefield, may favor one side' },
  { name: 'Third Party Arrives', trigger: '1d6+2 rounds', timing: 'When rolled', effect: 'Neutral faction enters the conflict', tacticalImplication: 'Creates chaos, may ally with either side' },
  { name: 'Catastrophe', trigger: 'Critical hit on terrain', timing: 'Immediate', effect: 'Major environmental collapse', tacticalImplication: 'Changes entire battlefield layout' },
  { name: 'Time Pressure', trigger: 'Combat starts', timing: '1d4+2 rounds', effect: 'External threat forces conclusion', tacticalImplication: 'One side must retreat or finish quickly' },
  { name: 'Moral Victory', trigger: 'Half enemies defeated', timing: 'Immediate', effect: 'Remaining enemies may flee or surrender', tacticalImplication: 'Offer parley or press advantage' },
];

// ============== OUTCOMES ==============

export const OUTCOME_CONDITIONS = [
  { condition: 'All enemies defeated', result: 'Complete victory', consequences: ['Full XP', 'All treasure recovered', 'Area secured'] },
  { condition: 'Enemies flee or surrender', result: 'Partial victory', consequences: ['Reduced XP', 'Some treasure', 'May gain information'] },
  { condition: 'Party retreats', result: 'Tactical withdrawal', consequences: ['No XP from combat', 'Enemy positions strengthened', 'May return later'] },
  { condition: 'Party negotiates', result: 'Diplomatic solution', consequences: ['Reduced XP', 'Possible alliance', 'Avoided casualties'] },
  { condition: 'Pyrrhic victory', result: 'Victory at great cost', consequences: ['Full XP', 'Resources depleted', 'Need recovery time'] },
  { condition: 'Stalemate', result: 'Neither side victorious', consequences: ['Half XP', 'Enemy remains threat', 'Must regroup'] },
];

// ============== TRANSITION HOOKS ==============

export const TRANSITION_HOOKS: Record<string, { name: string; description: string; prerequisites: string[] }[]> = {
  'Mountain Pass': [
    { name: 'Hidden Cave', description: 'A concealed cave entrance leads to underground passages.', prerequisites: ['DC 15 Perception check', 'Search the cliff face'] },
    { name: 'Caravan Trail', description: 'An abandoned caravan route leads deeper into the mountains.', prerequisites: ['Track the wagon marks'] },
    { name: 'Enemy Camp', description: 'Smoke rises from a nearby valley - an enemy encampment.', prerequisites: ['Successful Perception', 'Follow the smoke'] },
  ],
  'Volcanic Field': [
    { name: 'Lava Tube', description: 'A cooled lava tunnel provides shelter... and leads somewhere.', prerequisites: ['Explore the tunnel'] },
    { name: 'Fire Cult Shrine', description: 'An obsidian shrine to a fire god emanates heat.', prerequisites: ['DC 14 Religion check', 'Investigate the shrine'] },
    { name: 'Trapped Survivor', description: 'Calls for help echo from a partially cooled lava flow.', prerequisites: ['Hear the calls', 'Risk the heat'] },
  ],
  'Icy Fjord': [
    { name: 'Frozen Ship', description: 'An ancient vessel is trapped in the ice, cargo intact.', prerequisites: ['Climb to the ship', 'Break through ice'] },
    { name: 'Underwater Cave', description: 'A dark opening below the waterline promises secrets.', prerequisites: ['Hold breath', 'Swim underwater'] },
    { name: 'Ice Golem Forge', description: 'An ancient forge used to create ice guardians.', prerequisites: ['Find the entrance', 'DC 13 History check'] },
  ],
  'Dense Forest': [
    { name: 'Druid Grove', description: 'A circle of ancient stones pulses with natural magic.', prerequisites: ['Follow the magical resonance'] },
    { name: 'Abandoned Cabin', description: 'A hunter\'s cabin, long abandoned, but recently used.', prerequisites: ['Investigate the clearing'] },
    { name: 'Animal Trail', description: 'A game trail leads deeper into the forest.', prerequisites: ['Survival check to follow'] },
  ],
  'Underground Cave': [
    { name: 'Hidden Vault', description: 'Behind a stalagmite, a sealed door awaits.', prerequisites: ['DC 16 Perception', 'Find the mechanism'] },
    { name: 'Underdark Passage', description: 'The cave connects to the vast Underdark.', prerequisites: ['Follow the draft', 'Survival check'] },
    { name: 'Crystal Chamber', description: 'A room filled with valuable crystals and... something else.', prerequisites: ['Notice the glow'] },
  ],
  'Desert Ruins': [
    { name: 'Buried Entrance', description: 'Sand has hidden a passage to the lower levels.', prerequisites: ['Clear the sand', 'DC 14 Investigation'] },
    { name: 'Ancient Library', description: 'A preserved chamber contains forgotten knowledge.', prerequisites: ['Find the hidden door', 'Read ancient texts'] },
    { name: 'Oasis', description: 'A hidden spring provides water and respite.', prerequisites: ['Follow bird flight patterns'] },
  ],
  'Swamp Marsh': [
    { name: 'Witch\'s Hut', description: 'A shack on stilts, surrounded by strange totems.', prerequisites: ['Navigate the marsh', 'Approach carefully'] },
    { name: 'Sunken Temple', description: 'The top of a submerged temple breaks the surface.', prerequisites: ['Swim down', 'Find entrance'] },
    { name: 'Dryad\'s Tree', description: 'An ancient tree radiates a peaceful aura.', prerequisites: ['Sense the magic', 'Commune with nature'] },
  ],
  'Coastal Cliff': [
    { name: 'Smuggler\'s Cove', description: 'A hidden cove with a beached smuggling vessel.', prerequisites: ['Climb down', 'Find the path'] },
    { name: 'Lighthouse Ruins', description: 'An old lighthouse stands, its light long dark.', prerequisites: ['Investigate the structure'] },
    { name: 'Sea Cave Network', description: 'Tunnels connect sea caves to the mainland.', prerequisites: ['Explore at low tide'] },
  ],
  'Urban Alley': [
    { name: 'Thieves\' Guild Entrance', description: 'A hidden door leads to the criminal underground.', prerequisites: ['Know the signal', 'Bribe the right person'] },
    { name: 'Sewer Access', description: 'The sewers connect to multiple buildings.', prerequisites: ['Lift the grate', 'Brave the smell'] },
    { name: 'Rooftop Escape', description: 'The rooftops offer a parallel pathway.', prerequisites: ['Climb up', 'DC 12 Acrobatics'] },
  ],
  'Temple Chamber': [
    { name: 'Secret Passage', description: 'Behind the altar, stairs lead down.', prerequisites: ['Find the trigger', 'DC 15 Investigation'] },
    { name: 'Divine Vision', description: 'A mystic pool shows glimpses of things to come.', prerequisites: ['Touch the water', 'Make an offering'] },
    { name: 'Guardian\'s Chamber', description: 'A locked room holds the temple\'s treasures.', prerequisites: ['Solve the riddle', 'Find the key'] },
  ],
  'River Crossing': [
    { name: 'Island Sanctuary', description: 'A small island mid-river holds a hermit\'s shelter.', prerequisites: ['Reach the island', 'Swim or boat'] },
    { name: 'Underground Channel', description: 'A submerged tunnel leads under the river.', prerequisites: ['Hold breath', 'Find the entrance'] },
    { name: 'Waterfall Cave', description: 'Behind the waterfall, a cave entrance is hidden.', prerequisites: ['DC 14 Perception', 'Pass through waterfall'] },
  ],
  'Frozen Tundra': [
    { name: 'Ice Cave', description: 'A cave system carved into the glacier walls.', prerequisites: ['Find the entrance', 'Survive the cold'] },
    { name: 'Frozen Settlement', description: 'An abandoned village preserved in ice.', prerequisites: ['Notice the shapes', 'Approach carefully'] },
    { name: 'Hot Springs', description: 'Steam rises from a hidden valley - warmth and danger.', prerequisites: ['Follow the steam', 'Survival check'] },
  ],
  'Jungle Temple': [
    { name: 'Underground River', description: 'A subterranean river flows beneath the temple.', prerequisites: ['Find the well', 'Descend carefully'] },
    { name: 'Overgrown Passage', description: 'A hidden corridor blocked by vines leads deeper.', prerequisites: ['Cut through', 'DC 13 Survival'] },
    { name: 'Ritual Chamber', description: 'A secret room used for ancient ceremonies.', prerequisites: ['DC 15 Perception', 'Activate mechanism'] },
  ],
  'Abandoned Mine': [
    { name: 'Hidden Vein', description: 'A rich vein of precious ore leads to a new tunnel.', prerequisites: ['Mining check', 'Follow the vein'] },
    { name: 'Miner\'s Cache', description: 'A secret stash left by fleeing miners.', prerequisites: ['DC 14 Investigation', 'Find the marker'] },
    { name: 'Underground Lake', description: 'The mine breaks into a vast underground lake.', prerequisites: ['Hear the water', 'Boat or swim'] },
  ],
  'Haunted Manor': [
    { name: 'Family Crypt', description: 'A hidden crypt beneath the manor.', prerequisites: ['Find the trapdoor', 'Brave the spirits'] },
    { name: 'Attic Secrets', description: 'The attic holds evidence of dark deeds.', prerequisites: ['Climb to attic', 'Face your fears'] },
    { name: 'Basement Laboratory', description: 'A hidden lab where experiments were conducted.', prerequisites: ['Break the seal', 'DC 15 Investigation'] },
  ],
  'Ancient Bridge': [
    { name: 'Underbridge Camp', description: 'A campsite nestled under the bridge supports.', prerequisites: ['Climb down', 'Find handholds'] },
    { name: 'Hidden Watchtower', description: 'A guard tower built into the bridge structure.', prerequisites: ['DC 14 Perception', 'Find the entrance'] },
    { name: 'River Temple', description: 'A temple carved into the cliff face below.', prerequisites: ['Descend safely', 'Follow the path'] },
  ],
  'Crystalline Cavern': [
    { name: 'Crystal Garden', description: 'A chamber of impossible crystalline beauty.', prerequisites: ['Navigate the maze', 'Light source required'] },
    { name: 'Deep Spring', description: 'A pool of water with healing properties.', prerequisites: ['Find the pool', 'Make an offering'] },
    { name: 'Echo Chamber', description: 'A room where whispers reveal secrets.', prerequisites: ['Speak the right words', 'DC 13 History'] },
  ],
  'Burning Wastes': [
    { name: 'Fire Temple', description: 'A temple to a fire elemental lord.', prerequisites: ['Resist the heat', 'Make offerings'] },
    { name: 'Cool Cave', description: 'A rare shelter from the infernal heat.', prerequisites: ['Find the entrance', 'Survival check'] },
    { name: 'Obsidian Fortress', description: 'A fortress built of volcanic glass.', prerequisites: ['Approach carefully', 'Sharp footing'] },
  ],
  'Sunken Ruins': [
    { name: 'Air Chamber', description: 'A dry chamber with breathable air deep below.', prerequisites: ['Hold breath', 'Navigate underwater'] },
    { name: 'Treasure Vault', description: 'The city\'s treasury, still sealed after centuries.', prerequisites: ['Find the entrance', 'Underwater diving'] },
    { name: 'Temple Spire', description: 'The tallest building still holds secrets in its upper floors.', prerequisites: ['Swim up', 'Climb inside'] },
  ],
  'Floating Sky Island': [
    { name: 'Cloud Castle', description: 'A castle formed from solidified clouds.', prerequisites: ['Fly or climb', 'Wind timing'] },
    { name: 'Sky Dock', description: 'A docking point for skyships long grounded.', prerequisites: ['Find the platform', 'Repair mechanism'] },
    { name: 'Starlight Chamber', description: 'A room that captures starlight for magic.', prerequisites: ['Night visit', 'Ritual knowledge'] },
  ],
};

// ============== XP THRESHOLDS (for balance) ==============

export const XP_THRESHOLDS: Record<number, { easy: number; medium: number; hard: number; deadly: number }> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
};

export const CR_TO_XP: Record<string, number> = {
  '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
  '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
  '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
  '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
  '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
};

export const MONSTER_SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

export const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon',
  'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid',
  'Monstrosity', 'Ooze', 'Plant', 'Undead',
];
