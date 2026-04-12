
interface PromptSection {
    id: string;
    title: string;
    content: string;
    priority: number;
    isValid: boolean;
}

type InstructionEntry = { instruction: string };
type LlmConfig = {
    languages: Record<string, InstructionEntry>;
    genres: Record<string, InstructionEntry>;
    rulesets: Record<string, InstructionEntry>;
    challengeRatings: Record<string, InstructionEntry>;
    tones: Record<string, InstructionEntry>;
    narrativeTechniques: Record<string, InstructionEntry>;
};

export class SystemPromptBuilder {
    private sections: PromptSection[] = [];
    private readonly maxTokens = 8000; // Conservative limit for context
    
    addLanguageSection(language: string, config: LlmConfig): this {
      if (language && config.languages[language]) {
        this.sections.push({
          id: 'language',
          title: 'Language Settings',
          content: config.languages[language].instruction,
          priority: 10,
          isValid: true
        });
      }
      return this;
    }
    
    addGenreSection(genre: string, config: LlmConfig): this {
      if (genre && config.genres[genre]) {
        this.sections.push({
          id: 'genre',
          title: 'Genre and Setting',
          content: config.genres[genre].instruction,
          priority: 9,
          isValid: true
        });
      }
      return this;
    }
    
    addRulesetSection(ruleset: string, crRange: string, config: LlmConfig): this {
      if (ruleset && config.rulesets[ruleset]) {
        let content = config.rulesets[ruleset].instruction;
        
        if (crRange && config.challengeRatings[crRange] && ruleset === 'dnd5e') {
          content += '\n' + config.challengeRatings[crRange].instruction;
        }
        
        this.sections.push({
          id: 'ruleset',
          title: 'Game System',
          content,
          priority: 8,
          isValid: true
        });
      }
      return this;
    }
    
    addToneSection(tone: string, config: LlmConfig): this {
      if (tone && config.tones[tone]) {
        this.sections.push({
          id: 'tone',
          title: 'Campaign Tone',
          content: config.tones[tone].instruction,
          priority: 7,
          isValid: true
        });
      }
      return this;
    }
    
    addNarrativeTechniques(techniques: string[], integration: string, config: LlmConfig): this {
      if (techniques.length > 0) {
        const validTechniques = techniques.filter(t => config.narrativeTechniques[t]);
        
        if (validTechniques.length > 0) {
          let content = "Incorporate these storytelling devices into your content during initial plot and hook generation:\n\n";
          
          validTechniques.forEach(technique => {
            content += `- ${config.narrativeTechniques[technique].instruction}\n`;
          });
          
          if (integration?.trim()) {
            content += `\n**Narrative Integration Instructions:**\n${integration.trim()}\n`;
          }
          
          content += "\n**Important:** These narrative techniques should only be applied during Steps 1-2 (plot and hook generation). For Steps 3+ (scene development, NPC details, etc.), focus on executing the story elements already established in the plot rather than adding new narrative devices.";
          
          this.sections.push({
            id: 'narrative',
            title: 'Narrative Techniques (For Steps 1-2 Only)',
            content,
            priority: 6,
            isValid: true
          });
        }
      }
      return this;
    }
    
    addGeneralGuidelines(): this {
      const guidelines = `- CRITICAL: Always create specific, original, and thematically appropriate names for all characters, locations, items, and factions. Avoid generic placeholders.
- Consider causes and consequences in a layered fashion - every action should have logical ramifications.
- Be explicit, concise, and include specific details rather than vague descriptions.
- Create engaging, immersive content that respects player agency.
- Maintain consistency with established lore and chosen mechanics.
- Provide clear hooks and motivations for player characters.
- Balance challenge with character capabilities and experience level.
- Focus on collaborative storytelling and meaningful player choices.
- Ensure all content serves the narrative and enhances the game experience.`;
  
      this.sections.push({
        id: 'guidelines',
        title: 'General Guidelines',
        content: guidelines,
        priority: 5,
        isValid: true
      });
      return this;
    }
    
    build(): string {
      const sortedSections = this.sections
        .filter(s => s.isValid)
        .sort((a, b) => b.priority - a.priority);
      
      if (sortedSections.length === 0) {
        return "";
      }
      
      let prompt = "# System Instructions\n\n";
      
      sortedSections.forEach(section => {
        prompt += `## ${section.title}\n${section.content}\n\n`;
      });
      
      prompt += "---\n";
      
      if (this.estimateTokens(prompt) > this.maxTokens) {
        console.warn('System prompt may exceed token limits. Consider reducing configuration complexity.');
      }
      
      return prompt;
    }
    
    private estimateTokens(text: string): number {
      return Math.ceil(text.length / 4);
    }
}
