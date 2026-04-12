import { LoreContext, LoreTemplate } from '../chronicler/types';

/**
 * Replaces {{key}} placeholders in text with values from context.
 * Supports dot notation for nested objects (though Context is mostly flat).
 */
export function fillTemplate(text: string, context: LoreContext): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const trimmedKey = key.trim();
        // Check exact match first
        // @ts-ignore - Index signature
        let value = context[trimmedKey];

        // Check custom object if not found
        if (value === undefined && context.custom) {
            value = context.custom[trimmedKey];
        }

        // Handle eventPayload fallback
        if (value === undefined && context.eventPayload) {
            value = context.eventPayload[trimmedKey];
        }

        return value !== undefined ? String(value) : `[${trimmedKey}?]`;
    });
}

/**
 * Resolves a template (which might be a function or object) to a final string
 */
export function resolveTemplateText(
    template: LoreTemplate,
    context: LoreContext
): { title: string, body: string } {
    let title = "";
    let body = "";

    // Resolve Title
    if (typeof template.title === 'function') {
        title = template.title(context);
    } else if (typeof template.title === 'string') {
        title = fillTemplate(template.title, context);
    } else {
        // Handle { type: 'TEMPLATE', pattern: ... } if we implement complex patterns later
        title = "Untitled Chronicle";
    }

    // Resolve Text
    if (typeof template.text === 'function') {
        body = template.text(context);
    } else if (typeof template.text === 'string') {
        body = fillTemplate(template.text, context);
    } else {
        body = "The pages are blank...";
    }

    return { title, body };
}
