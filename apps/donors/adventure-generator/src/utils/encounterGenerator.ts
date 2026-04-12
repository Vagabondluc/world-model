
import { EncounterSceneNode, EncounterMechanics } from '../schemas/encounter';
import { ENCOUNTER_SETUP_DATA, ENCOUNTER_APPROACH_DATA, ENCOUNTER_TWIST_DATA, ENCOUNTER_CHALLENGE_DATA, ENCOUNTER_CLIMAX_DATA, ENCOUNTER_AFTERMATH_DATA } from '../data/encounterData';
import { generateId } from './helpers';
import { MONSTER_TABLES } from '../data/delve/monsterTables';
import { MonsterTier, DelveTheme } from '../types/delve';

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Map difficulty string to a simple tier logic for now
function getTierFromDifficulty(difficulty: string): MonsterTier {
    if (difficulty === 'Deadly') return 'tier4';
    if (difficulty === 'Hard') return 'tier3';
    if (difficulty === 'Medium') return 'tier2';
    return 'tier1';
}

function getMonstersForChallenge(difficulty: string, theme: string = 'ruin'): { name: string, count: number, role: string, cr: string }[] {
    const tier = getTierFromDifficulty(difficulty);
    // Use Delve Monster Tables as a rich source
    const encounterSet = MONSTER_TABLES[theme as DelveTheme] ? MONSTER_TABLES[theme as DelveTheme][tier] : MONSTER_TABLES['ruin'][tier];
    
    const minions = encounterSet.minions;
    const boss = encounterSet.boss;

    const combatants = [];
    
    // 1 Boss/Leader
    combatants.push({
        name: getRandomItem(boss),
        count: 1,
        role: "Leader",
        cr: "Unknown" // Placeholder, would need full monster DB lookup
    });

    // 2-5 Minions
    const minionCount = Math.floor(Math.random() * 4) + 2;
    combatants.push({
        name: getRandomItem(minions),
        count: minionCount,
        role: "Minion",
        cr: "Unknown"
    });

    return combatants;
}

export function generateSetupNode(locationContext: string, factionContexts: string[]): EncounterSceneNode {
    const sensory = getRandomItem(ENCOUNTER_SETUP_DATA.sensory.default);
    const clue = getRandomItem(ENCOUNTER_SETUP_DATA.clues.default);
    const stake = getRandomItem(ENCOUNTER_SETUP_DATA.stakes.default);

    const narrative = `The scene is set: ${locationContext}. ${clue} The stakes are high: ${stake}`;

    return {
        id: generateId(),
        stage: 'Setup',
        narrative: narrative,
        sensory: sensory,
        thematicTags: ['setup', ...factionContexts],
        emotionalShift: 'Anticipation',
        mechanics: { environment: locationContext },
        features: [],
        continuityRefs: []
    };
}

export function generateApproachNode(approachMode: string, selectedObstacles: string[]): EncounterSceneNode {
    const styleData = ENCOUNTER_APPROACH_DATA.styles[approachMode as keyof typeof ENCOUNTER_APPROACH_DATA.styles];
    if (!styleData) {
        const fallbackNarrative = "You proceed cautiously, unsure of the best path forward.";
        return {
            id: generateId(),
            stage: 'Approach',
            narrative: fallbackNarrative,
            thematicTags: ['approach', 'cautious'],
            emotionalShift: 'Uncertainty',
            mechanics: { environment: 'The path is unclear.' },
            sensory: { sound: "An unsettling quiet.", smell: "The air is stagnant.", feel: "A sense of hesitation." },
            features: [],
            continuityRefs: []
        };
    }

    const narrativeTemplate = getRandomItem(styleData.narrativeTemplates);
    const obstaclesNarrative = selectedObstacles.length > 0
        ? `You must contend with: ${selectedObstacles.join('; ')}.`
        : "The path seems clear for now.";

    const narrative = `${narrativeTemplate} ${obstaclesNarrative}`;
    
    const mechanics = {
        environment: `Skill challenges may include: ${styleData.skillChallenges.join(' or ')}. Obstacles present: ${selectedObstacles.join(', ') || 'none'}.`
    };

    return {
        id: generateId(),
        stage: 'Approach',
        narrative: narrative,
        thematicTags: ['approach', approachMode.toLowerCase()],
        emotionalShift: 'Rising Tension',
        mechanics: mechanics,
        sensory: {
            sound: "The rustle of leaves or the distant clatter of arms.",
            smell: "The scent of damp earth and stale air.",
            feel: "A cool breeze raises goosebumps on your skin."
        },
        features: [],
        continuityRefs: []
    };
}

export function generateTwistNode(twistType: string): EncounterSceneNode {
    const twistData = ENCOUNTER_TWIST_DATA.types[twistType as keyof typeof ENCOUNTER_TWIST_DATA.types];
    
    if (!twistData) {
        const description = "An unexpected event occurs.";
        const narrative = `Just as things seem to be going according to plan, the situation changes drastically. ${description}`;
        return {
            id: generateId(),
            stage: 'Twist',
            narrative: narrative,
            thematicTags: ['twist', twistType.toLowerCase().replace(/\s/g, '_')],
            emotionalShift: 'Surprise/Shock',
            mechanics: { environment: "The rules of the encounter have suddenly changed." },
            sensory: { sound: "A sudden sound.", smell: "Strange magic.", feel: "A shift in temperature." },
            features: [],
            continuityRefs: []
        };
    }
    
    const narrativeTemplate = getRandomItem(twistData.narrativeTemplates);
    const mechanicsDescription = getRandomItem(twistData.mechanicsTemplates);

    const filledNarrative = narrativeTemplate.replace(/{enemyTypePlural}/g, 'reinforcements').replace(/{importantNPC}/g, 'an ally').replace(/{clientName}/g, 'your patron');
    const filledMechanics = mechanicsDescription.replace(/{enemyTypePlural}/g, 'foes');

    return {
        id: generateId(),
        stage: 'Twist',
        narrative: filledNarrative,
        thematicTags: ['twist', twistType.toLowerCase().replace(/\s/g, '_')],
        emotionalShift: 'Surprise/Shock',
        mechanics: { environment: filledMechanics },
        sensory: { sound: "A sudden, unexpected sound.", smell: "Ozone or blood.", feel: "A sudden tremor." },
        features: [],
        continuityRefs: []
    };
}

export function generateChallengeNode(challengeType: string, difficulty: string): EncounterSceneNode {
    let narrative = "";
    let mechanics: EncounterMechanics = {};
    const thematicTags = ['challenge', challengeType.toLowerCase()];

    switch(challengeType) {
        case 'Combat':
            const tactic = getRandomItem(ENCOUNTER_CHALLENGE_DATA.combat.tactics);
            const objective = getRandomItem(ENCOUNTER_CHALLENGE_DATA.combat.objectives);
            const monsters = getMonstersForChallenge(difficulty, 'ruin'); // Defaulting to ruin theme for now
            
            // Narrative construction from structured data
            const monsterDesc = monsters.map(m => `${m.count}x ${m.name}`).join(' and ');
            narrative = `The core challenge is a combat encounter against ${monsterDesc}. The enemies will use a ${tactic.name} tactic. The party's objective is to: ${objective}`;
            
            mechanics = {
                combatants: monsters, // Now structured!
                environment: `Tactic: ${tactic.description}. Objective: ${objective}. Difficulty: ${difficulty}.`
            };
            break;
        case 'Puzzle':
            const puzzleType = getRandomItem(ENCOUNTER_CHALLENGE_DATA.puzzle.types);
            narrative = `The party faces an intricate puzzle. ${puzzleType}`;
            mechanics = { environment: `A complex puzzle involving logic and perception. The difficulty is ${difficulty}.` };
            break;
        case 'Social':
            const socialGoal = getRandomItem(ENCOUNTER_CHALLENGE_DATA.social.goals);
            narrative = `A tense social encounter unfolds. The party must: ${socialGoal}`;
            mechanics = { environment: `A social challenge requiring charisma and wit. Difficulty is ${difficulty}.` };
            break;
        default:
            narrative = "The party faces an unexpected challenge.";
            mechanics = { environment: 'A generic challenge.' };
    }

    return {
        id: generateId(),
        stage: 'Challenge',
        narrative,
        thematicTags,
        emotionalShift: 'Confrontation',
        mechanics,
        sensory: {
            sound: "The clash of steel or the tense silence of a standoff.",
            smell: "The scent of ozone, blood, or heavy perfume.",
            feel: "A surge of adrenaline as the challenge begins."
        },
        features: [],
        continuityRefs: []
    };
}

export function generateClimaxNode(climaxType: string): EncounterSceneNode {
    const climaxData = ENCOUNTER_CLIMAX_DATA.types[climaxType as keyof typeof ENCOUNTER_CLIMAX_DATA.types];

    if (!climaxData) {
        return {
            id: generateId(),
            stage: 'Climax',
            narrative: "The encounter reaches its peak.",
            thematicTags: ['climax', 'generic'],
            emotionalShift: 'Peak Tension',
            mechanics: { environment: 'The final confrontation happens.' },
            sensory: { sound: 'A deafening crescendo.', smell: 'Resolution or doom.', feel: 'Final surge.' },
            features: [],
            continuityRefs: [],
        };
    }
    
    const narrativeTemplate = getRandomItem(climaxData.narrativeTemplates);
    const mechanicsDescription = getRandomItem(climaxData.mechanicsTemplates);

    const filledNarrative = narrativeTemplate.replace(/{antagonist}/g, 'the antagonist').replace(/{enemyTypePlural}/g, 'foes');
    
    return {
        id: generateId(),
        stage: 'Climax',
        narrative: filledNarrative,
        thematicTags: ['climax', climaxType.toLowerCase().replace(/\s/g, '_')],
        emotionalShift: 'Peak Tension',
        mechanics: { environment: mechanicsDescription },
        sensory: { sound: "A deafening crescendo.", smell: "Ozone or magic.", feel: "A final surge of adrenaline." },
        features: [],
        continuityRefs: []
    };
}

export function generateAftermathNode(aftermathType: string): EncounterSceneNode {
    const aftermathData = ENCOUNTER_AFTERMATH_DATA.types[aftermathType as keyof typeof ENCOUNTER_AFTERMATH_DATA.types];

    if (!aftermathData) {
        return {
            id: generateId(),
            stage: 'Aftermath',
            narrative: "The dust settles.",
            thematicTags: ['aftermath', 'resolution'],
            emotionalShift: 'Reflection',
            mechanics: { environment: 'The encounter is over.' },
            sensory: { sound: 'Ringing silence.', smell: 'Blood/ozone.', feel: 'Weariness.' },
            features: [],
            continuityRefs: [],
        };
    }

    const narrativeTemplate = getRandomItem(aftermathData.narrativeTemplates);
    const mechanicsDescription = getRandomItem(aftermathData.mechanicsTemplates);
    
    return {
        id: generateId(),
        stage: 'Aftermath',
        narrative: narrativeTemplate,
        thematicTags: ['aftermath', aftermathType.toLowerCase().replace(/\s/g, '_')],
        emotionalShift: 'Resolution/Reflection',
        mechanics: { environment: mechanicsDescription },
        sensory: { sound: "The ringing silence after a great noise.", smell: "Coppery tang of blood.", feel: "Bone-deep weariness." },
        features: [],
        continuityRefs: []
    };
}
