
export const ENCOUNTER_SETUP_DATA = {
    sensory: {
        default: [
            { sound: "An unnatural silence hangs in the air.", smell: "The sharp scent of ozone, like a recent lightning strike.", feel: "A strange vibration thrums through the soles of your feet." },
            { sound: "A rhythmic dripping echoes from somewhere in the darkness.", smell: "The cloying sweet smell of decay.", feel: "The air is unnaturally cold in this specific area." },
            { sound: "The faint sound of chanting, just on the edge of hearing.", smell: "A strange, coppery tang hangs in the air.", feel: "A feeling of being watched from unseen eyes." }
        ]
    },
    clues: {
        default: [
            "A discarded weapon, still clean.",
            "Fresh tracks leading into the area, but none leading out.",
            "An ornate, but broken, holy symbol lies half-buried in the mud.",
            "A discarded map with a prominent location circled in red.",
        ]
    },
    stakes: {
        default: [
            "If the party fails, the artifact will be lost forever.",
            "Innocents will be caught in the crossfire if the situation escalates.",
            "A valuable artifact will fall into the wrong hands.",
            "The balance of power in the region will be irrevocably shifted.",
        ]
    }
};

export const ENCOUNTER_APPROACH_DATA = {
    styles: {
        Direct: {
            description: "A direct, forceful approach.",
            skillChallenges: ["athletics checks to overcome physical barriers", "intimidation checks to scare off lookouts"],
            narrativeTemplates: ["You march openly towards the entrance...", "Ignoring subtlety, you advance..."]
        },
        Stealthy: {
            description: "A quiet, unseen approach.",
            skillChallenges: ["stealth checks to bypass patrols", "acrobatics checks to navigate treacherous terrain silently"],
            narrativeTemplates: ["Sticking to the shadows, you creep closer...", "You move like ghosts through the undergrowth..."]
        },
        Deceptive: {
            description: "Using trickery or disguise.",
            skillChallenges: ["deception checks to fool guards", "performance checks to maintain a disguise"],
            narrativeTemplates: ["With your disguises donned, you walk brazenly past the sentries...", "You spin a convincing tale to the guards..."]
        },
        Investigative: {
            description: "A slow, cautious approach, gathering information.",
            skillChallenges: ["investigation checks to find a hidden path", "perception checks to spot ambushes"],
            narrativeTemplates: ["You scout the perimeter, looking for weaknesses...", "Examining the area, you notice details others might miss..."]
        }
    },
    obstacles: {
        environmental: [
            "A treacherous chasm blocks the direct path.",
            "Thick, thorny briars make movement slow and painful.",
            "A fast-flowing river must be crossed.",
            "Unstable rock formations threaten to collapse with any loud noise."
        ],
        guardians: [
            "A pair of sleepy lookouts are posted at the entrance.",
            "A trained beast patrols the area, its keen senses on alert.",
            "An animated statue stands silent vigil.",
            "A lone sentry, bored and distracted, watches the path."
        ],
        traps: [
            "A simple tripwire connected to an alarm bell.",
            "A concealed pit trap covered with leaves.",
            "Swinging logs designed to knock intruders off a narrow path.",
            "Snares hidden in the undergrowth."
        ]
    }
};

export const ENCOUNTER_TWIST_DATA = {
    types: {
        "Reinforcements": {
            description: "Unexpected enemies (or allies) arrive.",
            narrativeTemplates: [
                "A horn blows in the distance, and a second wave of {enemyTypePlural} appears from the east.",
                "Just when the battle seems won, a hulking figure smashes through the wall.",
                "The 'civilians' you were protecting draw daggers and reveal themselves as cultists."
            ],
            mechanicsTemplates: [
                "At the start of the third round, 1d4 {enemyTypePlural} arrive as reinforcements.",
                "The leader's death summons a more powerful entity.",
                "The seemingly neutral third party joins the fray against the characters."
            ]
        },
        "Betrayal": {
            description: "An ally reveals their true, hostile intentions.",
            narrativeTemplates: [
                "The trusted guide {importantNPC} smiles wickedly and casts a spell at the party's healer.",
                "{clientName}, who hired you for this, appears with the enemy leader, a bag of gold in their hand.",
                "The 'captured prisoner' you just freed suddenly attacks you from behind."
            ],
            mechanicsTemplates: [
                "The turncoat ally uses their most powerful ability on a vulnerable party member.",
                "The betrayal grants the enemies a surprise round.",
                "The betrayer reveals a hidden weakness of the party they learned while traveling with them."
            ]
        },
        "Environmental Shift": {
            description: "The battlefield dramatically changes (e.g., collapses, floods).",
            narrativeTemplates: [
                "The ground shudders violently, and a deep fissure cracks open, splitting the battlefield in two.",
                "A sudden flash flood roars down the canyon, turning the area into a raging river.",
                "The ancient magic holding this chamber together fails, and chunks of the ceiling begin to crash down."
            ],
            mechanicsTemplates: [
                "The area becomes difficult terrain. At the start of each round, creatures must make a DC 13 Dexterity save or be knocked prone.",
                "A 20-foot wide chasm opens. Creatures on the line must make a DC 15 Dexterity save to avoid falling.",
                "The area is now lightly obscured by thick dust. All light sources are dimmed."
            ]
        },
        "Mistaken Identity": {
            description: "The 'enemy' is not who the party thought they were.",
            narrativeTemplates: [
                "As you strike the final blow, the 'monster's' form dissolves, revealing the enchanted local sheriff.",
                "The 'bandits' are actually desperate refugees, stealing food to survive.",
                "The creature you're fighting is a mother protecting her young, hidden just out of sight."
            ],
            mechanicsTemplates: [
                "The 'enemy' stops fighting and begins pleading for its life, revealing its true nature.",
                "A previously unseen element (like starving children) becomes visible, re-contextualizing the fight.",
                "An illusion fades, showing the 'monsters' are actually the town guard under a curse."
            ]
        },
        "Sudden Morality Shift": {
            description: "The goal of the encounter becomes morally ambiguous.",
            narrativeTemplates: [
                "The 'evil artifact' you were sent to destroy is actually containing a much greater evil.",
                "The 'villain' explains their actions, and you realize they might be the lesser of two evils.",
                "To stop the ritual, you'll have to sacrifice an innocent person."
            ],
            mechanicsTemplates: [
                "A new objective appears: 'Protect the artifact' instead of 'Destroy it'.",
                "The enemy leader offers a truce, presenting a compelling argument that changes the party's goal.",
                "A timer begins, forcing a choice between two bad outcomes."
            ]
        },
    }
};

export const ENCOUNTER_CHALLENGE_DATA = {
    combat: {
        tactics: [
            { name: "Ambush", description: "Enemies strike from hidden positions, gaining a surprise round if undetected." },
            { name: "Combined Arms", description: "A mix of melee combatants and ranged artillery work together to control the battlefield." },
            { name: "Phalanx", description: "A defensive formation of soldiers with shields protects weaker spellcasters or leaders." },
            { name: "Pincer Movement", description: "Enemies attempt to flank the party, attacking from multiple sides." },
            { name: "Hit and Run", description: "Skirmishers attack and then use their movement to retreat to cover." }
        ],
        objectives: [
            "Survive for a certain number of rounds.",
            "Protect a vulnerable NPC or object.",
            "Disable a magical device before it activates.",
            "Prevent the enemy leader from escaping.",
            "Defeat all enemies."
        ]
    },
    puzzle: {
        types: [
            "A series of pressure plates must be activated in the correct sequence.",
            "Levers must be pulled in an order hinted at by a nearby riddle.",
            "A beam of light must be reflected using mirrors to strike a specific rune.",
            "A musical sequence must be repeated on a set of magical chimes."
        ]
    },
    social: {
        goals: [
            "Negotiate a truce between two warring factions.",
            "Intimidate a guard captain into abandoning his post.",
            "Deceive a noble into revealing a dark secret.",
            "Persuade a powerful entity to grant a boon."
        ]
    }
};

export const ENCOUNTER_CLIMAX_DATA = {
    types: {
        "Boss Fight": {
            description: "A final, dramatic confrontation with the primary antagonist.",
            narrativeTemplates: [
                "The chamber opens into a grand arena where {antagonist} awaits, a cruel smile on their face.",
                "At the heart of the corruption, {antagonist} performs the final gestures of their dark ritual.",
                "Cornered and with nowhere left to run, {antagonist} turns to make their final stand."
            ],
            mechanicsTemplates: [
                "The boss has Legendary Actions and a special 'Desperation' move when reduced to 25% HP.",
                "The environment is dynamic; at the start of each round, a new hazard appears (e.g., lava plume, falling pillar).",
                "The boss is protected by a shield that must be disabled by interacting with three pylons around the room."
            ]
        },
        "Moral Choice": {
            description: "The party must make a difficult decision with lasting consequences.",
            narrativeTemplates: [
                "You have the villain cornered, but they reveal that their defeat will unleash an even greater evil.",
                "To save the town, you must destroy the artifact, but you learn it is the only thing keeping a beloved NPC alive.",
                "Two vital objectives are in peril at once, and you can only save one."
            ],
            mechanicsTemplates: [
                "A non-combat challenge where the party must choose between two mutually exclusive outcomes.",
                "A timed event forces a difficult choice under pressure.",
                "The 'enemy' offers a compelling argument, forcing a social/persuasion challenge to find a third option."
            ]
        },
        "Dramatic Escape": {
            description: "The goal is not to win, but to survive and escape a collapsing location or overwhelming force.",
            narrativeTemplates: [
                "With the ritual complete, the temple begins to collapse around you. Your only goal is to get out alive!",
                "You have what you came for, but now an endless horde of {enemyTypePlural} pours into the chamber. You can't fight them all.",
                "The volcano erupts, and a river of lava is rapidly approaching. Flee!"
            ],
            mechanicsTemplates: [
                "A skill challenge to navigate a collapsing environment.",
                "A chase sequence against a relentless foe or environmental hazard.",
                "A 'hold the line' objective where the party must defend a point for a certain number of rounds until an escape route opens."
            ]
        },
    }
};

export const ENCOUNTER_AFTERMATH_DATA = {
    types: {
        "Success": {
            description: "The party achieved their primary objective.",
            narrativeTemplates: [
                "In the quiet that follows, the party takes stock of their victory. The main threat is neutralized.",
                "With the enemy vanquished, the party can claim their reward and the gratitude of those they saved."
            ],
            mechanicsTemplates: [
                "The party receives a substantial treasure parcel appropriate for the encounter's difficulty.",
                "A key NPC offers a new quest, impressed by the party's success.",
                "A new area is unlocked, or a path forward is now clear."
            ]
        },
        "Partial Success": {
            description: "The party succeeded, but at a cost.",
            narrativeTemplates: [
                "You succeeded, but not without a price. An important item was destroyed, or an ally was lost.",
                "Though the main enemy is defeated, a new, unforeseen complication has arisen from your actions."
            ],
            mechanicsTemplates: [
                "The main reward is secured, but a secondary objective was failed.",
                "An allied faction is pleased, but another is now hostile.",
                "The party is weakened or has lost important resources."
            ]
        },
        "Failure": {
            description: "The party failed to achieve their primary objective.",
            narrativeTemplates: [
                "Beaten and bruised, the party is forced to retreat, the objective left unsecured.",
                "The enemy has achieved their goal, and the consequences are immediately apparent."
            ],
            mechanicsTemplates: [
                "The enemy escapes with the artifact or completes the ritual.",
                "The party must now deal with the immediate fallout of their failure.",
                "A friendly NPC is captured or killed."
            ]
        }
    }
};
