import { useEnsembleStore, FileNode } from '../../stores/ensembleStore';
import { EnsembleService } from '../../services/ensembleService';

export class ContextManager {
    /**
     * Get the full text content of the currently open file.
     */
    static getActiveFileContext(): string {
        const state = useEnsembleStore.getState();
        if (!state.fileContent) return "";

        return `Current File: ${state.currentFile}\n\nContent:\n${state.fileContent.content}`;
    }

    /**
     * Build the full prompt including context and user instruction.
     */
    static buildRAGPrompt(userPrompt: string): string {
        const activeDoc = this.getActiveFileContext();

        return `
You are an expert D&D Dungeon Master and world builder. 
Use the following context from the user's campaign vault to inform your response.

### CONTEXT
${activeDoc}

### USER REQUEST
${userPrompt}

### INSTRUCTIONS
- Respond in markdown.
- Reference existing NPCs, locations, or items if found in the context.
- If the context doesn't contain the answer, use your creative skills to expand the world while staying consistent with the provided tones.
`.trim();
    }
}
