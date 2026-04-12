
export const AI_MODELS = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast, efficient, good for most generation tasks. (Default)' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro (Preview)', description: 'Complex reasoning, deeper creative output, and advanced logic.' },
    { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite', description: 'Extremely fast and lightweight, best for simple high-volume tasks.' },
    { id: 'dummy', name: 'Dummy AI', description: 'Returns instant, pre-defined test data (No API usage).' }
];

export const LLM_CONFIG = {
    languages: {
      'en': { instruction: 'Generate ALL content in English. Use clear, descriptive language.' },
      'es': { instruction: 'Generate ALL content in Spanish (Español). Translate all names, descriptions, dialogue, and narrative text to Spanish.' },
      'fr': { instruction: 'Generate ALL content in French (Français). Translate all names, descriptions, dialogue, and narrative text to French.' },
      'de': { instruction: 'Generate ALL content in German (Deutsch). Translate all names, descriptions, dialogue, and narrative text to German.' },
      'it': { instruction: 'Generate ALL content in Italian (Italiano). Translate all names, descriptions, dialogue, and narrative text to Italian.' },
      'pt': { instruction: 'Generate ALL content in Portuguese (Português). Translate all names, descriptions, dialogue, and narrative text to Portuguese.' },
      'ja': { instruction: 'Generate ALL content in Japanese (日本語). Translate all names, descriptions, dialogue, and narrative text to Japanese.' },
      'ko': { instruction: 'Generate ALL content in Korean (한국어). Translate all names, descriptions, dialogue, and narrative text to Korean.' },
      'zh': { instruction: 'Generate ALL content in Chinese (中文). Translate all names, descriptions, dialogue, and narrative text to Chinese.' },
      'ru': { instruction: 'Generate ALL content in Russian (Русский). Translate all names, descriptions, dialogue, and narrative text to Russian.' },
      'ar': { instruction: 'Generate ALL content in Arabic (العربية). Translate all names, descriptions, dialogue, and narrative text to Arabic.' },
      'hi': { instruction: 'Generate ALL content in Hindi (हिन्दी). Translate all names, descriptions, dialogue, and narrative text to Hindi.' },
      'nl': { instruction: 'Generate ALL content in Dutch (Nederlands). Translate all names, descriptions, dialogue, and narrative text to Dutch.' },
      'sv': { instruction: 'Generate ALL content in Swedish (Svenska). Translate all names, descriptions, dialogue, and narrative text to Swedish.' },
      'no': { instruction: 'Generate ALL content in Norwegian (Norsk). Translate all names, descriptions, dialogue, and narrative text to Norwegian.' },
      'da': { instruction: 'Generate ALL content in Danish (Dansk). Translate all names, descriptions, dialogue, and narrative text to Danish.' },
      'fi': { instruction: 'Generate ALL content in Finnish (Suomi). Translate all names, descriptions, dialogue, and narrative text to Finnish.' },
      'pl': { instruction: 'Generate ALL content in Polish (Polski). Translate all names, descriptions, dialogue, and narrative text to Polish.' }
    },
    genres: {
      'fantasy': { instruction: 'Create content in the High Fantasy genre. Include magic systems, mythical creatures, epic quests, and heroic adventures.' },
      'dark-fantasy': { instruction: 'Create content in the Dark Fantasy genre. Blend fantasy with horror, moral ambiguity, and grim themes.' },
      'grimdark': { instruction: 'Create content in the Grimdark genre. Feature a morally complex world where heroism is rare, corruption is common, and hope is scarce.' },
      'urban-fantasy': { instruction: 'Create content in the Urban Fantasy genre. Modern settings with supernatural elements hidden in plain sight.' },
      'horror': { instruction: 'Create content in the Horror genre. Focus on fear, suspense, supernatural threats, and atmospheric dread.' },
      'lovecraftian': { instruction: 'Create content in the Lovecraftian genre. Cosmic horror with unknowable entities and existential dread.' },
      'historical': { instruction: 'Create content in Historical settings with period-accurate details, customs, and social structures.' },
      'mystery': { instruction: 'Create content in the Mystery genre. Focus on investigation, puzzle-solving, and gradual revelation.' }
    },
    rulesets: {
      'dnd5e': { instruction: 'Format content for D&D 5th Edition. Use bounded accuracy, class-based progression, advantage/disadvantage mechanics.' }
    },
    challengeRatings: {
      '0-2': { instruction: 'Design encounters for beginning characters using CR 0-2 creatures (Levels 1-4). Simple tactics and basic mechanics.' },
      '3-5': { instruction: 'Design encounters for intermediate characters using CR 3-5 creatures (Levels 5-8). Moderate complexity and environmental challenges.' },
      '6-8': { instruction: 'Design encounters for experienced characters using CR 6-8 creatures (Levels 9-12). Complex tactics and multi-stage encounters.' },
      '9-12': { instruction: 'Design encounters for veteran characters using CR 9-12 creatures (Levels 13-16). Sophisticated tactics and reality-altering effects.' },
      '13-16': { instruction: 'Design encounters for heroic characters using CR 13-16 creatures (Levels 17-20). World-threatening scenarios and planar effects.' },
      '17-20': { instruction: 'Design encounters for epic level characters using CR 17-20 creatures. Cosmic threats and divine intervention.' },
      '21+': { instruction: 'Design encounters for legendary characters using CR 21+ creatures. Multiversal threats and god-like entities.' },
      'mixed': { instruction: 'Design encounters with scalable challenge ratings adaptable to various party levels and compositions.' }
    },
    tones: {
      'heroic': { instruction: 'Maintain heroic adventure tone with clear morality, noble deeds, and triumphant victories against evil.' },
      'gritty': { instruction: 'Maintain gritty realistic tone with moral ambiguity, harsh consequences, and difficult survival themes.' },
      'comedic': { instruction: 'Maintain comedic tone with lighthearted situations, witty dialogue, and amusing character interactions.' },
      'political': { instruction: 'Focus on political intrigue with conspiracies, social maneuvering, and complex negotiations.' },
      'exploration': { instruction: 'Focus on exploration with discovery, wonder, mapping unknown territories, and uncovering ancient secrets.' },
      'survival': { instruction: 'Focus on survival horror with resource scarcity, environmental threats, and desperate decision-making.' },
      'mystery': { instruction: 'Focus on mystery and investigation with puzzles, clues, logical deduction, and gradual revelation.' },
      'social': { instruction: 'Focus on social drama with character relationships, emotional conflicts, and interpersonal dynamics.' },
      'combat': { instruction: 'Focus on combat with tactical encounters, military themes, and strategic warfare.' },
      'slice-of-life': { instruction: 'Focus on slice of life with everyday moments, character development, and peaceful interludes.' }
    },
    narrativeTechniques: {
      'chekhov': { instruction: 'Apply Chekhov\'s Gun principle: Every introduced element must serve the plot later. Remove irrelevant details and ensure all story elements pay off.' },
      'red-herring': { instruction: 'Include Red Herrings: Plant false clues and misdirection to create suspense. Lead characters down wrong paths before revealing the truth.' },
      'foreshadowing': { instruction: 'Use Foreshadowing: Plant subtle hints about future events to build anticipation and make later reveals feel inevitable.' },
      'dramatic-irony': { instruction: 'Create Dramatic Irony: Arrange situations where players know something characters don\'t, creating tension and engagement.' },
      'in-medias-res': { instruction: 'Begin In Medias Res: Start scenarios in the middle of action or conflict, then reveal context gradual exposition.' },
      'cliffhanger': { instruction: 'End with Cliffhangers: Conclude sessions with unresolved tension and dramatic questions that demand resolution.' },
      'deus-ex-machina': { instruction: 'Employ Deus Ex Machina carefully: Use unexpected interventions to resolve impossible situations, but ensure proper foreshadowing.' },
      'circular-narrative': { instruction: 'Create Circular Narratives: Design endings that connect back to beginnings meaningfully, showing character growth despite return.' },
      'tragic-flaw': { instruction: 'Give characters Tragic Flaws: Assign meaningful weaknesses that drive conflict and make characters relatable yet doomed.' },
      'moral-dilemma': { instruction: 'Present Moral Dilemmas: Create choices between equally valid ethical positions with no clearly "right" answer.' }
    }
};

export const NARRATIVE_TECHNIQUES_DATA = [
    { id: 'chekhov', name: 'Chekhov\'s Gun', description: 'Every element introduced must be relevant later', enabled: true },
    { id: 'red-herring', name: 'Red Herring', description: 'Misleading clues that distract from the truth', enabled: true },
    { id: 'mcguffin', name: 'MacGuffin', description: 'Object that drives the plot but isn\'t intrinsically important', enabled: true, warning: true, tooltip: 'A MacGuffin is a plot device - an object, goal, or other motivating element that drives the story forward but whose specific nature isn\'t crucial. Examples: the One Ring, the Death Star plans, a treasure map. Most D&D campaigns naturally include MacGuffins (quest items, artifacts to find, villains to stop), so this technique is usually already present in your adventure.' },
    { id: 'dramatic-irony', name: 'Dramatic Irony', description: 'Audience knows something characters don\'t', enabled: true },
    { id: 'unreliable-narrator', name: 'Unreliable Narrator', description: 'Information source that cannot be trusted', enabled: false, tooltip: 'TTRPGs don\'t have traditional narrators - the GM presents information directly. This concept is better handled through unreliable NPCs or misleading evidence.' },
    { id: 'plot-twist', name: 'Plot Twist', description: 'Unexpected story development', enabled: true, warning: true, tooltip: 'A plot twist is an unexpected turn in the story that recontextualizes previous events. While possible in TTRPGs, this structure can be challenging since players are active participants rather than passive audience members.' },
    { id: 'in-medias-res', name: 'In Medias Res', description: 'Starting in the middle of action', enabled: true },
    { id: 'frame-story', name: 'Frame Story', description: 'Story within a story', enabled: true, warning: true, tooltip: 'A frame story is a narrative technique where one story contains or introduces another story. Examples include flashbacks, stories told by NPCs, or adventures within adventures. While possible in TTRPGs, this structure can be challenging since players are active participants rather than passive audience members.' },
    { id: 'parallel-structure', name: 'Parallel Structure', description: 'Multiple storylines that mirror each other', enabled: true, warning: true, tooltip: 'Parallel structure involves multiple storylines that develop simultaneously and often mirror or contrast with each other. While effective in literature, this technique can be complex in TTRPGs where the party typically experiences events together. The Plot Method system usually handles multiple plot threads more effectively for tabletop play.' },
    { id: 'cliffhanger', name: 'Cliffhanger', description: 'Suspenseful ending that demands resolution', enabled: true },
    { id: 'deus-ex-machina', name: 'Deus Ex Machina', description: 'Unexpected power or event saves the day', enabled: true },
    { id: 'circular-narrative', name: 'Circular Narrative', description: 'Story ends where it began', enabled: true },
    { id: 'ensemble-cast', name: 'Ensemble Cast', description: 'Multiple main characters with equal importance', enabled: false, tooltip: 'D&D naturally has an ensemble cast - the player characters are already the protagonists. This is built into the TTRPG format.' },
    { id: 'tragic-flaw', name: 'Tragic Flaw (Hamartia)', description: 'Character weakness that leads to their downfall', enabled: true },
    { id: 'moral-dilemma', name: 'Moral Dilemma', description: 'Choice between two equally valid moral positions', enabled: true }
];
