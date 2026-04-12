
export interface LinkToken {
    type: 'link';
    id: string;
    text: string;
}

export interface TextToken {
    type: 'text';
    content: string;
}

export type Token = LinkToken | TextToken;

/**
 * Scans text for mentions of specific entities and returns a tokenized array.
 * Used to render clickable links in lore descriptions.
 * 
 * @param text The raw text content to scan.
 * @param entities Array of entities to look for (id and title).
 * @returns Array of Tokens (text or link).
 */
export const tokenizeText = (text: string, entities: { id: string, title: string }[]): Token[] => {
    if (!text) return [];
    if (!entities || entities.length === 0) return [{ type: 'text', content: text }];

    // Filter out entities with very short names (e.g. "A", "The") to avoid noise.
    // Sort by length descending so longer phrases match first (e.g. "King Arthur" before "King").
    const sortedEntities = [...entities]
        .filter(e => e.title && e.title.length > 2) 
        .sort((a, b) => b.title.length - a.title.length);
    
    if (sortedEntities.length === 0) return [{ type: 'text', content: text }];

    const entityMap = new Map<string, string>();
    sortedEntities.forEach(e => entityMap.set(e.title.toLowerCase(), e.id));

    // Create regex pattern. \b ensures whole word matches.
    // We escape the titles to ensure regex safety.
    const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Optimization: If list is huge, this regex can get large. 
    // For typical campaign sizes (<1000 entities), this is performant enough.
    const patternString = `\\b(${sortedEntities.map(e => escapeRegExp(e.title)).join('|')})\\b`;
    const pattern = new RegExp(patternString, 'gi');

    const tokens: Token[] = [];
    let lastIndex = 0;

    // Use replace as a way to iterate matches with offsets
    text.replace(pattern, (match, ...args) => {
        // The offset is the second-to-last argument in string.replace callback
        const offset = args[args.length - 2] as number;

        // Add text before the match
        if (offset > lastIndex) {
            tokens.push({ type: 'text', content: text.substring(lastIndex, offset) });
        }

        // Add the link
        const id = entityMap.get(match.toLowerCase());
        if (id) {
            tokens.push({ type: 'link', id, text: match });
        } else {
            // Fallback if map lookup fails (shouldn't happen given regex construction)
            tokens.push({ type: 'text', content: match });
        }

        lastIndex = offset + match.length;
        return match;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        tokens.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return tokens;
};
