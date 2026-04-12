
import { DelveTheme, DelveRoomType } from '../../types/delve';

export interface RoomTemplate {
    title: string;
    description: string;
    features: string[];
}

export const ROOM_TEMPLATES: Record<DelveTheme, Record<DelveRoomType, RoomTemplate[]>> = {
    crypt: {
        guardian: [
            { title: "The Hall of Ancestors", description: "Stone alcoves line the walls, each containing a skeletal warrior standing at attention.", features: ["Sarcophagi", "Ancient inscriptions", "Pressure plates"] },
            { title: "The Gargoyle Gates", description: "Twin gargoyles perch atop a heavy iron gate, their eyes seeming to follow movement.", features: ["Iron Gate", "Gargoyle Statues", "Mosaic floor"] },
            { title: "The False Tomb", description: "A clearly visible sarcophagus sits in the center, but the dust around it is disturbed.", features: ["Decoy coffin", "Hidden arrow slits", "Tripwires"] },
            { title: "The Weeping Statue", description: "A statue of a mourning figure bleeds red water into a basin.", features: ["Blood fountain", "Slippery floor", "Holy symbol"] },
            { title: "The Bone Chute", description: "The entrance is a slide made of polished bone leading down into darkness.", features: ["Steep slide", "Pile of bones", "Echoing shaft"] }
        ],
        puzzle: [
            { title: "The Riddle of Lineage", description: "A statue holds a stone tablet with an inscription about family bloodlines.", features: ["Talking Statue", "Riddle inscription", "Offering bowl"] },
            { title: "The Broken Mural", description: "A mural depicts a royal history, but several faces are missing and lie shattered on the floor.", features: ["Fresco", "Stone fragments", "Hidden mechanism"] },
            { title: "The Weight of Soul", description: "Scales hang from the ceiling. You must balance a feather against a heart.", features: ["Golden scales", "Stone hearts", "Feathers"] },
            { title: "The Shadow Dial", description: "A light source must be positioned to cast a specific shadow on the wall.", features: ["Moveable brazier", "Gnomon", "Wall carvings"] },
            { title: "The Silent Floor", description: "Tiles on the floor are marked with runes. Some scream when stepped on.", features: ["Runed tiles", "Sound-dampening field", "Sonic trap"] }
        ],
        trick: [
            { title: "The Phantom Bridge", description: "A chasm blocks the way. A bridge appears to be there, but is an illusion.", features: ["Pit trap", "Illusory floor", "Spikes"] },
            { title: "The Greed Trap", description: "A golden idol sits on a pedestal, but lifting it triggers the ceiling to lower.", features: ["Cursed object", "Crushing ceiling", "Locking door"] },
            { title: "The Mirror of Reversal", description: "A mirror reflects the room, but the door is on the opposite wall in the reflection.", features: ["Magical mirror", "Doppelganger potential", "Secret door"] },
            { title: "The Rotting Feast", description: "A table is set with food that looks fresh but turns to dust when touched.", features: ["Illusion magic", "Poison gas", "Mimic chair"] },
            { title: "The Endless Hallway", description: "A corridor that seems to stretch forever until you walk backwards.", features: ["Teleport trap", "Looping space", "Confusion gas"] }
        ],
        climax: [
            { title: "The Lich's Inner Sanctum", description: "A grand sarcophagus rests on a raised dais. Green flame flickers in iron braziers.", features: ["Throne", "Ritual circle", "Animated dead"] },
            { title: "The Necromancer's Laboratory", description: "Tables covered in strange reagents and body parts fill the room.", features: ["Alchemical tables", "Unfinished constructs", "Dark altar"] },
            { title: "The Knight's Rest", description: "A Death Knight stands vigil over his own corpse.", features: ["Rusted weaponry", "Cursed shield", "Honor guard"] },
            { title: "The Soul Well", description: "A pit of swirling souls dominates the room, guarded by a wraith.", features: ["Soul vortex", "Negative energy zone", "Narrow walkways"] },
            { title: "The Vampire's Coffin", description: "A pristine coffin sits in a room filled with dirt from a foreign land.", features: ["Velvet coffin", "Mist", "Charmed thralls"] }
        ],
        reward: [
            { title: "The Burial Hoard", description: "Chests of ancient coin and heirlooms are stacked against the far wall.", features: ["Treasure chests", "Masterwork weapons", "Ancient tapestries"] },
            { title: "The Secret Reliquary", description: "A hidden panel reveals a small shrine containing a glowing artifact.", features: ["Magical artifact", "Scroll case", "Gemstones"] },
            { title: "The Hero's Blade", description: "A sword rests on a pedestal, untouched by time.", features: ["Magic sword", "Sunlight", "Pedestal"] },
            { title: "The Library of the Dead", description: "Scrolls containing lost history and necromantic secrets.", features: ["Spell scrolls", "History books", "Map to another dungeon"] },
            { title: "The Alchemist's Stash", description: "Potions that have aged into powerful elixirs.", features: ["Rare potions", "Gold dust", "Laboratory equipment"] }
        ]
    },
    ruin: {
        guardian: [
            { title: "The Broken Courtyard", description: "Overgrown weeds choke the cobblestones. Statues of forgotten heroes stand headless.", features: ["Rubble", "Overgrowth", "Hidden sentries"] },
            { title: "The Gatehouse Ambush", description: "Arrow slits look down upon the entrance tunnel.", features: ["Murder holes", "Portcullis", "Crossfire zone"] },
            { title: "The Collapsed Foyer", description: "Piles of debris create a maze-like entrance.", features: ["Unstable rocks", "Ambush points", "Difficult terrain"] },
            { title: "The Kennel", description: "Rusted cages that once held hounds now hold something worse.", features: ["Cages", "Bones", "Chains"] },
            { title: "The Watchtower", description: "A lone tower overlooks the approach, occupied by bandits.", features: ["High ground", "Signal bell", "Spiral stair"] }
        ],
        puzzle: [
            { title: "The Keystone Arch", description: "A collapsed archway blocks the path. Stones must be replaced to open the way.", features: ["Heavy stones", "Glyphs", "Counterweights"] },
            { title: "The Heraldry Test", description: "Four shields must be placed on the wall in order of rank.", features: ["Heraldic shields", "History check", "Hidden switch"] },
            { title: "The Sun Dial", description: "Light must be directed to hit a crystal at a specific 'time'.", features: ["Mirrors", "Sunlight shaft", "Crystal"] },
            { title: "The Water Lock", description: "A mechanism requires filling a cistern to raise a bridge.", features: ["Water pump", "Floating bridge", "Drain"] },
            { title: "The Statue's Gaze", description: "Statues must be rotated to face the correct cardinal directions.", features: ["Rotatable statues", "Compass rose", "Clicking gears"] }
        ],
        trick: [
            { title: "Weak Masonry", description: "The ceiling here sags dangerously. Several support beams look rotted.", features: ["Falling rocks", "Collapsing floor", "Dust clouds"] },
            { title: "The Tripwire Hall", description: "A pristine hallway in a ruin is suspicious. Wires are everywhere.", features: ["Crossbow trap", "Net trap", "Alarm bell"] },
            { title: "The Fake Door", description: "A door handle triggers a spear trap; the real door is secret.", features: ["Spear trap", "Secret door", "Paintings"] },
            { title: "The Crumbling Stair", description: "Stairs turn into a ramp when weight is applied.", features: ["Slide trap", "Spiked pit", "Grease"] },
            { title: "The Nest", description: "Disturbing a pile of debris releases a swarm of insects.", features: ["Insect swarm", "Difficult terrain", "Itching powder"] }
        ],
        climax: [
            { title: "The Warlord's Camp", description: "Bandits have made their base in the old great hall.", features: ["Campfire", "Loot piles", "Makeshift barricades"] },
            { title: "The Monster's Den", description: "A massive beast has made a nest in the throne room.", features: ["Gnawed bones", "Nest material", "Claw marks"] },
            { title: "The Cultist's Altar", description: "Robed figures chant around a defiled shrine.", features: ["Blood altar", "Sacrificial dagger", "Summoning circle"] },
            { title: "The Construct's Patrol", description: "An ancient guardian golem still patrols this room.", features: ["Clockwork parts", "Repair station", "Lightning rod"] },
            { title: "The Duelist's Arena", description: "A rival adventurer challenges the party to single combat.", features: ["Dueling circle", "Spectator gallery", "Weapon rack"] }
        ],
        reward: [
            { title: "The Forgotten Vault", description: "Beneath a rug, an iron trapdoor leads to a small, untouched cellar.", features: ["Old coins", "Preserved wine", "Historical documents"] },
            { title: "The Armory", description: "Racks of weapons, some still oiled and sharp.", features: ["Martial weapons", "Armor", "Whetstones"] },
            { title: "The Tax Collector's Chest", description: "An iron-bound chest hidden in a false wall.", features: ["Gold bars", "Tax ledger", "Gems"] },
            { title: "The Map Room", description: "A map on the wall reveals the location of other dungeons.", features: ["World map", "Spyglass", "Compass"] },
            { title: "The Noble's Regalia", description: "A mannequin wears a set of fine magical clothes.", features: ["Magical cloak", "Jewelry", "Signet ring"] }
        ]
    },
    cavern: {
        guardian: [
            { title: "The Webbed Entrance", description: "Thick, sticky webs block the passage. Something skitters above.", features: ["Webs", "Cocoons", "Bones"] },
            { title: "The Bear's Den", description: "A narrow cave mouth smells strongly of wet fur and musk.", features: ["Claw marks", "Fur tufts", "Growling"] },
            { title: "The Crystal Sentry", description: "Crystals vibrate when you approach, alerting nearby creatures.", features: ["Humming crystals", "Sonic damage", "Echoes"] },
            { title: "The Fungal Forest", description: "Tall mushrooms block the path, releasing spores when disturbed.", features: ["Giant mushrooms", "Spores", "Violet fungus"] },
            { title: "The Underground Lake", description: "The path ends at water. You must swim or boat across.", features: ["Dark water", "Ripples", "Boat"] }
        ],
        puzzle: [
            { title: "The Echo Chamber", description: "A vast chasm separates the path. Strange crystals hum when struck.", features: ["Resonant crystals", "Chasm", "Invisible bridge"] },
            { title: "The Wind Tunnel", description: "Gusts of wind blow constantly. Timing is key to cross.", features: ["Wind gusts", "Narrow ledge", "Bottomless pit"] },
            { title: "The Bioluminescent Code", description: "Glowing moss forms patterns that change when touched.", features: ["Glowing moss", "Color sequence", "Darkness"] },
            { title: "The Stalactite Organ", description: "Striking stalactites plays notes. A song opens the door.", features: ["Musical stalactites", "Sheet music", "Hammer"] },
            { title: "The Water Level", description: "Raising the water level allows access to a high ledge.", features: ["Dam", "Water wheel", "Floating logs"] }
        ],
        trick: [
            { title: "Fungal Spores", description: "Puffball mushrooms line the path. One wrong step releases a cloud.", features: ["Mushrooms", "Slippery floor", "Gas vents"] },
            { title: "The Slippery Slope", description: "A wet ramp sends sliders into a pool of slime.", features: ["Green slime", "Slick rock", "Acid"] },
            { title: "The Stalactite Drop", description: "Vibrations cause sharp rocks to fall from the ceiling.", features: ["Falling rocks", "Dexterity save", "Rubble"] },
            { title: "The Fool's Gold", description: "Pyrite veins lure miners into a structural collapse.", features: ["Cave-in", "Fake gold", "Support beams"] },
            { title: "The Gas Pocket", description: "Odorless gas fills the lower area. Torches cause an explosion.", features: ["Explosive gas", "Suffocation", "Low ceiling"] }
        ],
        climax: [
            { title: "The Dragon's Lair", description: "A massive creature sleeps atop a pile of shiny refuse.", features: ["Stalagmites", "Bone pile", "Natural pool"] },
            { title: "The Drow Outpost", description: "Dark elves have set up a forward camp here.", features: ["Spider motifs", "Poison", "Crossbows"] },
            { title: "The Aboleth's Pool", description: "A deep, dark lake dominates the cavern. Something ancient lurks.", features: ["Deep water", "Mind control", "Slime"] },
            { title: "The Roper's Grove", description: "What looks like stalagmites are actually hungry monsters.", features: ["Ropers", "Piercers", "Sticky strands"] },
            { title: "The Elemental Node", description: "Raw elemental energy bleeds into the material plane.", features: ["Lava/Ice", "Elementals", "Magic circle"] }
        ],
        reward: [
            { title: "The Vein of Gold", description: "A crack in the wall reveals a glittering vein of raw ore.", features: ["Raw ore", "Uncut gems", "Miner's tools"] },
            { title: "The Explorer's Remains", description: "A skeleton in rusted armor clutches a bag of holding.", features: ["Magic bag", "Journal", "Survival gear"] },
            { title: "The Crystal Grotto", description: "Crystals here are infused with arcane power.", features: ["Arcane focus", "Spell components", "Light source"] },
            { title: "The Druid's Grove", description: "Rare herbs grow around a magical spring.", features: ["Healing potions", "Herbalism kit", "Fresh water"] },
            { title: "The Dwarven Stash", description: "A small cache left by miners long ago.", features: ["Smith's tools", "Mithral", "Gemstones"] }
        ]
    },
    tower: {
        guardian: [
            { title: "The Animated Armor", description: "Suits of armor line the hallway. Their heads turn in unison.", features: ["Suits of armor", "Rug", "Portcullis"] },
            { title: "The Gargoyle Perch", description: "Stone beasts watch the spiral staircase.", features: ["Gargoyles", "Falling hazard", "Wind"] },
            { title: "The Arcane Lock", description: "A door with no handle requires a password.", features: ["Magic mouth", "Riddle", "Zap trap"] },
            { title: "The Bound Elemental", description: "A fire elemental is trapped in the furnace, guarding the way.", features: ["Furnace", "Heat metal", "Fire"] },
            { title: "The Homunculus Swarm", description: "Tiny constructs fly at intruders like angry bees.", features: ["Tiny constructs", "Poison needles", "Glass"] }
        ],
        puzzle: [
            { title: "The Library of Illusions", description: "Bookshelves stretch endlessly. Finding the right book opens the way.", features: ["Books", "Rolling ladder", "False wall"] },
            { title: "The Orrery", description: "Align the planets to match the current date.", features: ["Moving planets", "Star chart", "Clockwork"] },
            { title: "The Teleportation Circle", description: "Runes on the floor must be activated in sequence.", features: ["Runes", "Arcane checks", "Teleportation"] },
            { title: "The Mirror Room", description: "Lasers of light must be reflected to a target.", features: ["Mirrors", "Light beam", "Prisms"] },
            { title: "The Chessboard", description: "The floor is a grid. Move like a knight to survive.", features: ["Checkered floor", "Constructs", "Lightning"] }
        ],
        trick: [
            { title: "The Teleporter Trap", description: "Stepping on a rune teleports you back to the entrance.", features: ["Teleportation circle", "Frustration", "Reset"] },
            { title: "The Gravity Flip", description: "A lever reverses gravity, sending you to the ceiling.", features: ["Reverse gravity", "Spikes on ceiling", "Falling damage"] },
            { title: "The Shrinking Room", description: "The walls slowly close in.", features: ["Crushing walls", "Timer", "Hidden button"] },
            { title: "The Silence Spell", description: "A zone where no sound can be made prevents verbal spells.", features: ["Silence", "Stealth", "Casters useless"] },
            { title: "The Polimorph Trap", description: "A glyph turns the intruder into a newt for 1 hour.", features: ["Polymorph", "Tiny size", "Humiliation"] }
        ],
        climax: [
            { title: "The Summoning Circle", description: "A wizard channels energy into a glowing circle.", features: ["Arcane circle", "Storm clouds", "Floating objects"] },
            { title: "The Archmage's Study", description: "The master of the tower awaits, wands drawn.", features: ["Bookshelves", "Shield guardian", "Counterspell"] },
            { title: "The Unbound Demon", description: "A summoning went wrong; the demon is loose.", features: ["Broken circle", "Demon", "Dead summoner"] },
            { title: "The Simulacrum", description: "An ice copy of the wizard fights to the death.", features: ["Ice magic", "Shattering", "Cold"] },
            { title: "The Ritual", description: "Cultists are turning the tower into a beacon.", features: ["Chanting", "Beam of light", "Timer"] }
        ],
        reward: [
            { title: "The Wizard's Desk", description: "Cluttered with scrolls and a spellbook.", features: ["Spellbook", "Scrolls", "Ink"] },
            { title: "The Scrying Pool", description: "A basin that allows viewing of distant places.", features: ["Information", "Magic water", "Focus"] },
            { title: "The Vault of Wands", description: "A display case holding several magical wands.", features: ["Wands", "Staffs", "Identify"] },
            { title: "The Potion Cabinet", description: "Shelves lined with colorful, bubbling liquids.", features: ["Potions", "Alchemist's supplies", "Glass"] },
            { title: "The Flying Carpet", description: "A rug that hovers slightly off the ground.", features: ["Magic item", "Flight", "Pattern"] }
        ]
    },
    sewer: {
        guardian: [
            { title: "The Ooze Pit", description: "The walkway ends at a pool of green sludge.", features: ["Sludge", "Rusting grate", "Pipes"] },
            { title: "The Rat Nest", description: "Thousands of red eyes watch from the darkness.", features: ["Rat swarms", "Disease", "Squeaking"] },
            { title: "The Crocodile Gate", description: "A massive albino crocodile blocks the channel.", features: ["Water", "Teeth", "Tail slap"] },
            { title: "The Kobold Trappers", description: "Small reptilian humanoids have fortified a junction.", features: ["Slings", "Molotovs", "Barricades"] },
            { title: "The Otyugh's Trash Heap", description: "A pile of refuse moves, revealing tentacles.", features: ["Garbage", "Disease", "Grapple"] }
        ],
        puzzle: [
            { title: "The Flow Control", description: "Valves control the water level. Drain the path to proceed.", features: ["Valves", "Water gauge", "Sluice gate"] },
            { title: "The Pressure Pipe", description: "Steam blocks the way. Divert it using a pipe puzzle.", features: ["Steam", "Pipes", "Wrenches"] },
            { title: "The Filth Sifter", description: "Find the key dropped in a vat of (safe) slime.", features: ["Con save", "Search check", "Gross"] },
            { title: "The Maze of Grates", description: "Underwater tunnels connect different sections.", features: ["Holding breath", "Navigation", "Claustrophobia"] },
            { title: "The Alchemical Mix", description: "Mix colorful run-off to burn through a blockage.", features: ["Acid", "Colors", "Chemistry"] }
        ],
        trick: [
            { title: "Sewer Gas", description: "The air smells of rotten eggs. Any spark explodes.", features: ["Explosive gas", "Flammable oil", "Fire hazard"] },
            { title: "The False Bridge", description: "A wooden plank is rotten and snaps under weight.", features: ["Sewage swim", "Disease", "Fall"] },
            { title: "The Current", description: "Fast-moving water sweeps players away.", features: ["Athletics check", "Drowning", "Swept downstream"] },
            { title: "The Mimic Crate", description: "A crate floats in the water. It has teeth.", features: ["Mimic", "Surprise", "Adhesive"] },
            { title: "The Disease Cloud", description: "Puffballs release blinding spores.", features: ["Blinded", "Poisoned", "Con save"] }
        ],
        climax: [
            { title: "The King Rat's Throne", description: "A wererat sits on a throne of garbage.", features: ["Trash throne", "Waterways", "Rat swarms"] },
            { title: "The Thieves' Guild Hideout", description: "Smugglers are counting their loot.", features: ["Crates", "Thugs", "Escape boat"] },
            { title: "The Cult of Filth", description: "Worshippers of a slime demon chant in the muck.", features: ["Slime", "Ritual", "Mutation"] },
            { title: "The Aboleth's Spy", description: "A chuul guards a deep cistern.", features: ["Paralysis", "Water combat", "Pincers"] },
            { title: "The Necromancer's Dump", description: "Bodies are being raised from the city's waste.", features: ["Zombies", "Skeletons", "Corpse pile"] }
        ],
        reward: [
            { title: "The Smuggler's Stash", description: "A waterproof barrel contains stolen goods.", features: ["Stolen goods", "Marked coins", "Map"] },
            { title: "The Lost Ring", description: "A noble's signet ring glitters in the muck.", features: ["Jewelry", "Favor", "Gold"] },
            { title: "The Thief's Backpack", description: "Tools and loot left by a less fortunate adventurer.", features: ["Thieves' tools", "Potion of invisibility", "Dagger"] },
            { title: "The Secret Entrance", description: "A ladder leads up into the bank vault.", features: ["Heist hook", "Gold", "Blueprints"] },
            { title: "The Alchemist's Waste", description: "discarded but potent potions.", features: ["Random potions", "Acid vials", "Glass"] }
        ]
    },
    haunted_mansion: {
        guardian: [
            { title: "The Grand Foyer", description: "A sweeping staircase is watched by suits of armor. One shifts its head as you enter.", features: ["Grand staircase", "Animated armor", "Dusty chandelier"] },
            { title: "The Portrait Hall", description: "The eyes of the family portraits seem to follow your every move. One portrait is missing.", features: ["Family portraits", "Empty frame", "Flickering candles"] },
            { title: "The Butler's Post", description: "A ghostly butler materializes, blocking the door. 'The master is not to be disturbed,' he whispers.", features: ["Spectral butler", "Velvet rope", "Silver tray"] }
        ],
        puzzle: [
            { title: "The Musician's Ghost", description: "A dusty piano plays a sad tune on its own. The melody has a repeating flaw.", features: ["Player piano", "Sheet music", "Hidden key"] },
            { title: "The Mad Child's Nursery", description: "Alphabet blocks are scattered on the floor. They must be arranged to spell a name.", features: ["Alphabet blocks", "Rocking horse", "Creepy doll"] },
            { title: "The Astrologer's Orrery", description: "A clockwork model of the solar system is frozen. The planets must be aligned to a specific date found in a diary.", features: ["Orrery", "Diary", "Stained-glass window"] }
        ],
        trick: [
            { title: "The Shifting Rooms", description: "You enter the library, but upon exiting, find yourself back in the foyer. The house is rearranging itself.", features: ["Teleportation trap", "Shifting walls", "Disorienting architecture"] },
            { title: "The Dinner Guest", description: "A ghostly feast is laid out. Eating the food turns you into a ghost for one hour.", features: ["Illusory food", "Ethereal curse", "Poltergeists"] },
            { title: "The Mirror of Souls", description: "Looking into a large, ornate mirror shows a twisted, evil version of yourself that attempts to pull you in.", features: ["Magic mirror", "Strength save", "Trapped souls"] }
        ],
        climax: [
            { title: "The Master's Bedroom", description: "The source of the haunting, a powerful spirit, lies in a four-poster bed, waiting.", features: ["Four-poster bed", "Possessed objects", "Violent temperature drops"] },
            { title: "The Unfinished Séance", description: "In the attic, a summoning circle flares to life, containing a bound but angry entity.", features: ["Summoning circle", "Chanting ghosts", "Weakened barrier"] },
            { title: "The Grand Ballroom", description: "Phantom dancers twirl to silent music. They stop and turn as one as you enter, their eyes burning with cold light.", features: ["Ghostly dancers", "Slippery floor", "Chandelier"] }
        ],
        reward: [
            { title: "The Hidden Safe", description: "Behind a portrait is a wall safe containing the family's last remaining valuables.", features: ["Jewelry box", "Deeds and titles", "Gold bars"] },
            { title: "The Ghost's Last Will", description: "A spectral hand points to a loose floorboard. Beneath it is a will, granting the estate to whoever frees their soul.", features: ["Last will and testament", "Map to a real treasure", "Sentimental locket"] },
            { title: "The Silver Collection", description: "A dining cabinet is filled with silverware, now imbued with the house's spectral energy.", features: ["Silver weapons", "Magic items", "Fine china"] }
        ]
    }
};
