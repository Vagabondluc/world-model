import DOMPurify from 'dompurify';

const BASIC_TAGS = [
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'ul'
];

const BASIC_ATTR = ['class', 'href', 'rel', 'target'];

export const sanitizeHtml = (
    html: string,
    options?: { allowBasicFormatting?: boolean }
): string => {
    if (!html) return '';
    if (options?.allowBasicFormatting) {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: BASIC_TAGS,
            ALLOWED_ATTR: BASIC_ATTR
        });
    }
    return DOMPurify.sanitize(html);
};
