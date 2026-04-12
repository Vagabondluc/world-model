import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

/**
 * A simple markdown to HTML renderer. Supports headings, lists, bold, and italics.
 * Uses dangerouslySetInnerHTML, assuming the content from the Gemini API is trusted.
 */
const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {

    const renderMarkdown = (text: string) => {
        if (!text) return { __html: '' };

        // Process blocks separated by double newlines
        const blocks = text.split('\n\n');

        const htmlBlocks = blocks.map(block => {
            if (!block.trim()) return '';

            // Inline formatting function for reuse
            const formatInline = (str: string) => str
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');

            // Headers
            if (block.startsWith('# ')) return `<h2 class="text-3xl font-bold text-amber-900 mt-6 mb-4 border-b-2 border-amber-200 pb-2">${formatInline(block.substring(2))}</h2>`;
            if (block.startsWith('## ')) return `<h3 class="text-2xl font-bold text-amber-800 mt-5 mb-3 border-b border-amber-200 pb-2">${formatInline(block.substring(3))}</h3>`;
            if (block.startsWith('### ')) return `<h4 class="text-xl font-bold text-amber-800 mt-4 mb-2">${formatInline(block.substring(4))}</h4>`;

            // Lists
            const isUnorderedList = /^\s*[-*] /.test(block);
            const isOrderedList = /^\s*\d+\.\s/.test(block);

            if (isUnorderedList || isOrderedList) {
                const listItems = block.split('\n').map(item => {
                    if (!item.trim()) return '';
                    const content = item.replace(/^\s*([-*]|\d+\.)\s/, '');
                    return `<li>${formatInline(content)}</li>`;
                }).join('');
                
                const listTag = isUnorderedList ? 'ul' : 'ol';
                const listClass = isUnorderedList 
                    ? 'list-disc list-inside space-y-1 my-4 pl-4' 
                    : 'list-decimal list-inside space-y-1 my-4 pl-4';
                
                return `<${listTag} class="${listClass}">${listItems}</${listTag}>`;
            }
            
            // Paragraphs
            return `<p class="mb-4">${formatInline(block.replace(/\n/g, '<br />'))}</p>`;
        });

        return { __html: htmlBlocks.join('') };
    };

    return (
        <div 
            className="prose max-w-none text-gray-700 leading-relaxed" 
            dangerouslySetInnerHTML={renderMarkdown(content)} 
        />
    );
};

export default MarkdownRenderer;
