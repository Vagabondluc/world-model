import { AdventureGenerationError, AIServiceError } from './errorUtils';

export const generateId = () => crypto.randomUUID();

export const cleanAiStatblockResponse = (text: string): string => {
    if (!text) return '';
    let statblockText = text.trim();
    // Failsafe: Find the start of the actual markdown statblock and discard any preceding commentary.
    const statblockStartIndex = statblockText.indexOf('###');
    if (statblockStartIndex > 0) {
        statblockText = statblockText.substring(statblockStartIndex);
    }
    return statblockText;
};

export const getErrorMessage = (error: Error, context: string): string => {
    if (error instanceof AdventureGenerationError) {
        return `Error during ${error.operation}: ${error.message} (Context: ${error.context})`;
    }
    if (error instanceof AIServiceError) {
        return `AI service error (${error.model}): ${error.message}. Please try again.`;
    }

    const lowerCaseMessage = error.message.toLowerCase();
    if (lowerCaseMessage.includes('network') || lowerCaseMessage.includes('fetch')) {
        return `Network error while ${context}. Check your internet connection and try again.`;
    }
    if (lowerCaseMessage.includes('rate') || lowerCaseMessage.includes('quota') || lowerCaseMessage.includes('429')) {
        return `API rate limit exceeded while ${context}. Please wait a moment before trying again.`;
    }
    if (lowerCaseMessage.includes('token') || lowerCaseMessage.includes('auth') || lowerCaseMessage.includes('401') || lowerCaseMessage.includes('403')) {
        return `API authentication failed while ${context}. Please check your API key configuration.`;
    }
    if (lowerCaseMessage.includes('json') || lowerCaseMessage.includes('parse')) {
        return `Invalid response received while ${context}. The AI service may be experiencing issues.`;
    }
    return `Failed to ${context}: ${error.message}. Please try again.`;
};

export const sanitizeImageUrl = (url: string): string => {
    if (!url) return '';
    const trimmedUrl = url.trim();

    // Regex to find the first URL-like string.
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = trimmedUrl.match(urlRegex);

    let cleanUrl = match ? match[0] : trimmedUrl;

    // Clean up trailing characters after a valid image extension.
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    for (const ext of imageExtensions) {
        const extIndex = cleanUrl.toLowerCase().indexOf(ext);
        if (extIndex !== -1) {
            cleanUrl = cleanUrl.substring(0, extIndex + ext.length);
            break;
        }
    }

    // Handle Imgur page URLs (e.g., imgur.com/abc) to direct image URLs (i.imgur.com/abc.jpeg)
    if (!cleanUrl.match(/i\.imgur\.com/)) {
        const imgurPageMatch = cleanUrl.match(/imgur\.com\/([a-zA-Z0-9]{5,})/);
        if (imgurPageMatch) {
            const imageId = imgurPageMatch[1];
            // Avoid converting URLs that are already direct links but don't use i.imgur.com, or album links.
            if (!imageId.includes('.')) {
                cleanUrl = `https://i.imgur.com/${imageId}.jpeg`;
            }
        }
    }

    return cleanUrl;
};

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: number | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};
