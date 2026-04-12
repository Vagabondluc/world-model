// AI Generation prompts for D&D Encounter content

export const GENERATION_PROMPTS = {
  // Environmental Scenario Prompts
  environmentDescription: (location: string, theme?: string) => `Generate a vivid D&D environment description for a "${location}" setting${theme ? ` with a ${theme} theme` : ''}. 
Include:
- Physical features (cliffs, water sources, vegetation, structures)
- Sensory details (sounds, smells, lighting)
- Atmosphere and mood
- Potential hazards visible to players
Keep it to 2-3 paragraphs, evocative but concise. Do not include mechanics or DCs.`,

  physicalFeature: (location: string, featureType?: string) => `Generate a D&D physical feature for a "${location}" setting${featureType ? ` (type: ${featureType})` : ''}.
Return JSON with:
{
  "name": "Feature name",
  "description": "Vivid description",
  "mechanicalEffect": "Game mechanic (e.g., 'DC 12 Athletics to climb')",
  "impactOnGameplay": ["impact1", "impact2"]
}`,

  environmentalMechanic: (location: string, hazardType?: string) => `Generate a D&D environmental hazard/mechanic for a "${location}" setting${hazardType ? ` (type: ${hazardType})` : ''}.
Return JSON with:
{
  "name": "Hazard name",
  "trigger": "What triggers it (e.g., 'Every 1d4 rounds')",
  "effect": "What happens",
  "damageType": "fire/cold/lightning/etc or null",
  "damageDice": "3d6 or null",
  "saveType": "DEX/CON/STR/etc",
  "saveDC": 14,
  "areaOfEffect": "10-foot radius"
}`,

  enemyForce: (location: string, challengeLevel: string, theme?: string) => `Generate D&D enemy forces for a "${location}" encounter${theme ? ` with ${theme} theme` : ''} suitable for ${challengeLevel} party.
Return JSON with:
{
  "name": "Enemy name",
  "type": "creature type (Humanoid, Beast, etc)",
  "count": 2,
  "specialAbilities": ["ability1", "ability2"],
  "tactics": ["tactical behavior 1", "tactical behavior 2"],
  "startingLocation": "Where they start"
}`,

  dynamicChange: (location: string) => `Generate a D&D dynamic environmental change for a "${location}" encounter.
Return JSON with:
{
  "name": "Change name (e.g., Avalanche)",
  "trigger": "What triggers it",
  "timing": "When it occurs",
  "effect": "What changes in the environment",
  "tacticalImplication": "How this affects combat tactics"
}`,

  outcome: (scenarioType: string) => `Generate a D&D encounter outcome for a ${scenarioType} scenario.
Return JSON with:
{
  "condition": "What condition ends the encounter this way",
  "result": "What happens",
  "consequences": ["consequence1", "consequence2"]
}`,

  transitionHook: (location: string) => `Generate a D&D adventure transition hook after a "${location}" encounter.
Return JSON with:
{
  "name": "Hook name",
  "description": "What the hook leads to",
  "prerequisites": ["what players need to do/find"]
}`,

  // Encounter Balancer Prompts
  monsterSuggestion: (partyLevel: number, difficulty: string, theme?: string, location?: string) => `Suggest D&D monsters for a ${difficulty} encounter for a level ${partyLevel} party${theme ? ` with ${theme} theme` : ''}${location ? ` in a ${location}` : ''}.
Return JSON array of 1-3 monsters:
[{
  "name": "Monster name",
  "cr": "1/4 or 1 or 2 etc",
  "xp": 50,
  "size": "Medium",
  "type": "Humanoid",
  "count": 3,
  "tactics": "Brief tactical note"
}]`,

  tacticalElement: (location?: string, encounterType?: string) => `Generate a D&D tactical element${location ? ` for a ${location}` : ''}${encounterType ? ` (${encounterType} encounter)` : ''}.
Return JSON with:
{
  "name": "Element name",
  "type": "cover/hazard/objective/terrain/other",
  "description": "Description and tactical use"
}`,

  reward: (difficulty: string, partyLevel: number) => `Generate D&D rewards for a ${difficulty} encounter for level ${partyLevel} party.
Return JSON with:
{
  "type": "treasure/xp/item/story",
  "description": "Reward description",
  "value": 100
}`,

  encounterNotes: (monsters: string[], location?: string, difficulty?: string) => `Generate D&D encounter notes and tactics for an encounter with: ${monsters.join(', ')}${location ? ` in a ${location}` : ''}${difficulty ? ` (${difficulty} difficulty)` : ''}.
Include:
- Setup description
- Monster tactics
- Environmental considerations
- Potential complications
Keep to 2-3 paragraphs.`,

  // Full Encounter Generation
  fullEnvironmentalScenario: (location: string, theme?: string, challengeLevel?: string) => `Generate a complete D&D environmental combat scenario for a "${location}" setting${theme ? ` with ${theme} theme` : ''}${challengeLevel ? ` for ${challengeLevel} party` : ''}.

Return JSON with:
{
  "name": "Scenario name",
  "description": "Vivid 2-3 paragraph environment description",
  "physicalFeatures": [
    {
      "name": "Feature name",
      "description": "Description",
      "mechanicalEffect": "DC 12 Athletics check",
      "impactOnGameplay": ["impact1", "impact2"]
    }
  ],
  "environmentalMechanics": [
    {
      "name": "Hazard name",
      "trigger": "Trigger condition",
      "effect": "What happens",
      "damageType": "fire",
      "damageDice": "2d6",
      "saveType": "DEX",
      "saveDC": 13,
      "areaOfEffect": "5-foot radius"
    }
  ],
  "enemyForces": [
    {
      "name": "Enemy name",
      "type": "Creature type",
      "count": 2,
      "specialAbilities": ["ability"],
      "tactics": ["tactic1"],
      "startingLocation": "Where they start"
    }
  ],
  "startingConditions": "Initial setup description",
  "interactionMechanics": ["How players can interact with environment"],
  "dynamicChanges": [
    {
      "name": "Change name",
      "trigger": "Trigger",
      "timing": "Timing",
      "effect": "Effect",
      "tacticalImplication": "Tactical impact"
    }
  ],
  "outcomes": [
    {
      "condition": "Victory condition",
      "result": "What happens",
      "consequences": ["consequence"]
    }
  ],
  "transitionHooks": [
    {
      "name": "Hook name",
      "description": "What it leads to",
      "prerequisites": ["what's needed"]
    }
  ]
}`,

  fullBalancedEncounter: (partyLevel: number, playerCount: number, difficulty: string, theme?: string, location?: string) => `Generate a balanced D&D combat encounter for ${playerCount} players at level ${partyLevel}, ${difficulty} difficulty${theme ? ` with ${theme} theme` : ''}${location ? ` in a ${location}` : ''}.

Return JSON with:
{
  "name": "Encounter name",
  "monsters": [
    {
      "name": "Monster name",
      "cr": "1",
      "xp": 200,
      "size": "Medium",
      "type": "Humanoid",
      "count": 3
    }
  ],
  "tacticalElements": [
    {
      "name": "Element name",
      "type": "cover/hazard/terrain/objective",
      "description": "Description"
    }
  ],
  "rewards": [
    {
      "type": "treasure/xp/item/story",
      "description": "Reward description",
      "value": 100
    }
  ],
  "notes": "Tactical notes and encounter description"
}`,
};

// Helper to parse JSON from AI response
export function parseAIJson<T>(response: string): T | null {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch {
    return null;
  }
}

// Helper to parse JSON array from AI response
export function parseAIJsonArray<T>(response: string): T[] {
  try {
    // Try to extract JSON array from response
    const arrayMatch = response.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    // Try to extract single object and wrap in array
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return [JSON.parse(objectMatch[0])];
    }
    return [];
  } catch {
    return [];
  }
}
