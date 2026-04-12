'use client';

import dynamic from 'next/dynamic';

export interface MarkdownEditorProps {
  /** The markdown content to edit */
  value: string;
  /** Fires on every change */
  onChange: (_value: string) => void;
  /** externally controlled: true = raw markdown textarea, false = rich WYSIWYG */
  isRawMode: boolean;
}

/**
 * Dynamic wrapper for MDXEditor.
 *
 * MDXEditor uses browser-only APIs (contentEditable, Selection, etc.)
 * so it MUST be loaded client-side only via next/dynamic with ssr: false.
 */
export const MarkdownEditor = dynamic<MarkdownEditorProps>(
  () => import('./MarkdownEditorInner').then((mod) => mod.MarkdownEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 bg-void-900 rounded-lg border border-white/[0.06] flex items-center justify-center">
        <span className="text-ash-600 text-sm">Loading editor…</span>
      </div>
    ),
  }
);
