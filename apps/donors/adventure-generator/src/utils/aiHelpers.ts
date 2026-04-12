
/**
 * Extracts and parses a JSON object or array from a raw text string.
 * Handles Markdown code blocks (```json ... ```) and extraneous text.
 */
export const extractJson = <T = unknown>(text: string): T => {
    if (!text) throw new Error("Empty text provided for JSON extraction.");

    let cleanText = text.trim();

    // 1. Remove Markdown code blocks if present
    const markdownMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (markdownMatch) {
        cleanText = markdownMatch[1].trim();
    }

    // 2. Find the outer boundaries of the JSON object/array
    const firstOpenBrace = cleanText.indexOf('{');
    const firstOpenBracket = cleanText.indexOf('[');
    
    let startIndex = -1;
    let endIndex = -1;

    // Determine if it's likely an object or an array based on which appears first
    if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
        startIndex = firstOpenBrace;
        endIndex = cleanText.lastIndexOf('}');
    } else if (firstOpenBracket !== -1) {
        startIndex = firstOpenBracket;
        endIndex = cleanText.lastIndexOf(']');
    }

    if (startIndex !== -1 && endIndex !== -1) {
        cleanText = cleanText.substring(startIndex, endIndex + 1);
    }

    try {
        return JSON.parse(cleanText) as T;
    } catch (e) {
        // Provide a snippet of the text for debugging
        const snippet = cleanText.length > 100 ? cleanText.substring(0, 100) + "..." : cleanText;
        throw new Error(`Failed to parse JSON from AI response: ${snippet}`);
    }
};

/**
 * Generates a deterministic SVG placeholder image data URI based on a prompt string.
 * Used for providers that do not support image generation (e.g., Ollama).
 */
export const generatePlaceholderImage = (prompt: string, label: string = "Generated Image"): string => {
    // Generate a deterministic hue from the prompt
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
        hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const color1 = `hsl(${hue}, 70%, 80%)`;
    const color2 = `hsl(${(hue + 40) % 360}, 70%, 60%)`;

    const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
            </linearGradient>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="rgba(0,0,0,0.1)" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        <circle cx="256" cy="256" r="100" fill="rgba(255,255,255,0.3)" />
        <text x="50%" y="45%" font-family="sans-serif" font-weight="bold" font-size="32" text-anchor="middle" fill="#333">${label}</text>
        <text x="50%" y="55%" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#555">(Visual Placeholder)</text>
        <text x="50%" y="90%" font-family="monospace" font-size="10" text-anchor="middle" fill="#444" opacity="0.7">${prompt.substring(0, 40)}...</text>
    </svg>
    `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
};
