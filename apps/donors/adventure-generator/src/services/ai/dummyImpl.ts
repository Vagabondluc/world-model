
import { z } from "zod";
import { DUMMY_HOOKS, DUMMY_OUTLINE, DUMMY_CREATURE, DUMMY_DUNGEON, DUMMY_BATTLEMAP, DUMMY_SETTLEMENT, DUMMY_SPECIAL_LOCATION, DUMMY_SCENE, DUMMY_MAJOR_NPC, DUMMY_MINOR_NPC, DUMMY_FACTION } from '../../data/dummyContent';
import { generatePlaceholderImage } from "../../utils/aiHelpers";

type PromptMapping = {
    keywords: string[];
    data: unknown;
};

export class DummyImpl {
    private promptMap: PromptMapping[] = [
        { keywords: ['origin of the problem', 'unique positioning'], data: DUMMY_HOOKS },
        { keywords: ['comprehensive adventure plan', 'four top-level keys'], data: DUMMY_OUTLINE },
        { keywords: ['invent a new monster'], data: DUMMY_CREATURE },
        { keywords: ['creature concept'], data: DUMMY_CREATURE },
        { keywords: ['dungeon named'], data: DUMMY_DUNGEON },
        { keywords: ['battlefield options'], data: DUMMY_BATTLEMAP },
        { keywords: ['profile for the settlement'], data: DUMMY_SETTLEMENT },
        { keywords: ['special location named'], data: DUMMY_SPECIAL_LOCATION },
        { keywords: ['scene:', 'introduction, multiple points of interaction'], data: DUMMY_SCENE },
        { keywords: ['major npc'], data: DUMMY_MAJOR_NPC },
        { keywords: ['antagonist'], data: DUMMY_MAJOR_NPC },
        { keywords: ['minor npc'], data: DUMMY_MINOR_NPC },
        { keywords: ['profile for the faction'], data: DUMMY_FACTION },
    ];
    
    async generateStructured<T>(prompt: string, zodSchema: z.ZodType<T>): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return this.getDummyData(prompt) as T;
    }

    async generateText(prompt: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return "This is standard dummy text content generated without calling the AI API.";
    }

    async streamText(
        prompt: string,
        modelName?: string,
        systemInstruction?: string,
        onProgress?: (text: string) => void
    ): Promise<string> {
        const dummyStatblock = `
### Crystal Vanguard (CR 5)
*Large Elemental, Neutral*
___
- **Armor Class** 17 (natural armor)
- **Hit Points** 85 (10d10 + 30)
- **Speed** 30 ft., burrow 30 ft.
___
| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 20 (+5) | 10 (+0) | 16 (+3) | 6 (-2) | 10 (+0) | 6 (-2) |
___
- **Damage Resistances** bludgeoning, piercing, and slashing from nonmagical attacks
- **Damage Immunities** poison
- **Condition Immunities** exhaustion, paralyzed, petrified, poisoned, unconscious
- **Senses** darkvision 60 ft., tremorsense 60 ft., passive Perception 10
- **Languages** Terran
___
***Illumination.*** The vanguard sheds dim light in a 10-foot radius.
***Siege Monster.*** The vanguard deals double damage to objects and structures.

### Actions
***Multiattack.*** The vanguard makes two slam attacks.
***Slam.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 14 (2d8 + 5) bludgeoning damage plus 4 (1d8) radiant damage.
***Crystalline Burst (Recharge 5–6).*** The vanguard releases a burst of blinding light. Each creature within 20 feet of it must make a DC 14 Constitution saving throw. On a failure, a creature takes 22 (4d10) radiant damage and is blinded for 1 minute. On a success, a creature takes half as much damage and isn't blinded.
`;
        const chunkSize = 20;
        for (let i = 0; i < dummyStatblock.length; i += chunkSize) {
            await new Promise(resolve => setTimeout(resolve, 30));
            if (onProgress) onProgress(dummyStatblock.substring(0, i + chunkSize));
        }
        return dummyStatblock;
    }

    async generateImage(prompt: string): Promise<string | null> {
         await new Promise(resolve => setTimeout(resolve, 1000));
         return generatePlaceholderImage(prompt, "Dummy Mode Image");
    }

    private getDummyData(prompt: string): unknown {
        const lowerPrompt = prompt.toLowerCase();
        for (const mapping of this.promptMap) {
            if (mapping.keywords.every(kw => lowerPrompt.includes(kw))) {
                return mapping.data;
            }
        }
        console.warn(`DummyImpl: No matching prompt found for: "${prompt.substring(0, 100)}..."`);
        return { details: "Generic dummy data response. Prompt type unrecognized by DummyImpl." };
    }
}
