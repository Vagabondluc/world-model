export interface NarrativeSlot {
    id: string;
    type: 'input' | 'checkbox' | 'button' | 'dropdown';
    label: string | null;
    value: string;
    choices?: string[];
}

export interface NarrativeSection {
    id: string;
    title: string | null;
    slots: NarrativeSlot[];
}

export interface NarrativeScriptDefinition {
    id: string;
    title: string;
    sections: NarrativeSection[];
    rawWireframe: string;
}

export class MarkdownNarrativeService {
    /**
     * Parses a Markdown wireframe (inside a code block) into a structured definition.
     */
    static parseWireframe(id: string, markdown: string): NarrativeScriptDefinition {
        // Extract content between ```text and ```
        const textMatch = markdown.match(/```text\s*([\s\S]*?)```/);
        const wireframe = textMatch ? textMatch[1] : markdown;

        const lines = wireframe.split('\n');

        let title = id.replace(/_/g, ' ');
        const sections: NarrativeSection[] = [];
        let currentSection: NarrativeSection = { id: 'default', title: null, slots: [] };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Detect potential section headers or titles
            // Patterns like |  [ Title ]  |
            const titleMatch = trimmedLine.match(/\|\s*\[(.*?)\]\s*\|/);
            if (titleMatch && index < 5 && !currentSection.slots.length) {
                title = titleMatch[1].split(':')[0].trim();
                return;
            }

            // Detect slots: [ Value ] or [X]
            const slotRegex = /\[(.*?)\]/g;
            let match;

            while ((match = slotRegex.exec(trimmedLine)) !== null) {
                const content = match[1].trim();
                const precedingText = trimmedLine.substring(0, match.index).split('|').pop()?.trim() || '';

                // Determine type
                let type: NarrativeSlot['type'] = 'input';
                let label: string | null = null;
                let value = content;

                if (content === 'X' || content === '' || content === ' ') {
                    type = 'checkbox';
                    value = content === 'X' ? 'true' : 'false';
                    label = precedingText.replace(/[:-]$/, '').trim();
                } else if (content === '?' || content === 'X' && precedingText === '') {
                    // Likely window controls [?] [X] - ignore
                    continue;
                } else if (content === 'Done' || content.includes('Export') || content.includes('Generate') || content.includes('Roll')) {
                    type = 'button';
                } else if (content === 'V' || content === 'v') {
                    // This is likely a dropdown trigger for the PREVIOUS slot
                    if (currentSection.slots.length > 0) {
                        currentSection.slots[currentSection.slots.length - 1].type = 'dropdown';
                    }
                    continue;
                } else {
                    // Input with label?
                    const labelMatch = precedingText.match(/([a-zA-Z0-9\s]+)[:\s-]*$/);
                    if (labelMatch) {
                        label = labelMatch[1].trim();
                    }
                }

                currentSection.slots.push({
                    id: `${index}-${match.index}`,
                    type,
                    label,
                    value
                });
            }

            // If we have "---" divider, start new section if current has slots
            if (trimmedLine.includes('---') && currentSection.slots.length > 0) {
                sections.push(currentSection);
                currentSection = { id: `section-${sections.length}`, title: null, slots: [] };
            }
        });

        if (currentSection.slots.length > 0) {
            sections.push(currentSection);
        }

        return {
            id,
            title,
            sections,
            rawWireframe: wireframe
        };
    }
}
