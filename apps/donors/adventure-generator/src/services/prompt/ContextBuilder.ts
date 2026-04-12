
export class ContextBuilder {
    private sections: { title: string; content: string; priority: number }[] = [];
    private readonly maxContextLength = 4000;
    
    addWorldInfo(worldInfo: string): this {
      if (worldInfo?.trim()) {
        this.sections.push({
          title: 'World & Setting Information',
          content: worldInfo.trim(),
          priority: 10
        });
      }
      return this;
    }
    
    addPlayerInfo(playerInfo: string): this {
      if (playerInfo?.trim()) {
        this.sections.push({
          title: 'Player Character Information',
          content: playerInfo.trim(),
          priority: 9
        });
      }
      return this;
    }
    
    addNpcInfo(npcInfo: string): this {
      if (npcInfo?.trim()) {
        this.sections.push({
          title: 'Existing NPC Information',
          content: npcInfo.trim(),
          priority: 8
        });
      }
      return this;
    }
    
    addSessionContext(sessionContext: string): this {
      if (sessionContext?.trim()) {
        this.sections.push({
          title: 'Session-Specific Context',
          content: sessionContext.trim(),
          priority: 7
        });
      }
      return this;
    }
    
    build(): string {
      if (this.sections.length === 0) {
        return "";
      }
      
      const sortedSections = this.sections.sort((a, b) => b.priority - a.priority);
      
      let context = "--- CAMPAIGN CONTEXT ---\nThis section contains established information about the campaign world, characters, and current situation. Use it as the foundation for your generation.\n\n";
      
      for (const section of sortedSections) {
        const sectionText = `## ${section.title}\n${section.content}\n\n`;
        
        if ((context + sectionText).length > this.maxContextLength) {
          console.warn(`Context truncated to fit limits. Section "${section.title}" partially omitted.`);
          const remainingSpace = this.maxContextLength - context.length - 50;
          if (remainingSpace > 0) {
            context += `## ${section.title}\n${section.content.substring(0, remainingSpace)}...\n\n`;
          }
          break;
        }
        
        context += sectionText;
      }
      
      context += "--------------------------\n\n";
      return context;
    }
}
