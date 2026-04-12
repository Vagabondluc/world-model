'use client';

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  toolbarPlugin,
  diffSourcePlugin,
 type MDXEditorMethods,
} from '@mdxeditor/editor';
import { useRef, useEffect, useCallback } from 'react';
import {
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertThematicBreak,
  InsertImage,
  DiffSourceToggleWrapper,
  UndoRedo,
} from '@mdxeditor/editor';

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface MarkdownEditorInnerProps {
  value: string;
  onChange: (_value: string) => void;
  isRawMode: boolean;
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export function MarkdownEditorInner({ value, onChange, isRawMode }: MarkdownEditorInnerProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  // Sync external value changes into the editor (e.g. when switching entities)
  useEffect(() => {
    const currentMD = editorRef.current?.getMarkdown();
    if (currentMD !== value) {
      editorRef.current?.setMarkdown(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (md: string) => {
      onChange(md);
    },
    [onChange]
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 [&_.mdxeditor]:flex-1 [&_.mdxeditor]:flex [&_.mdxeditor]:flex-col [&_.mdxeditor]:bg-void-900 [&_.mdxeditor]:rounded-lg [&_.mdxeditor]:border [&_.mdxeditor]:border-white/[0.06] [&_.mdxeditor]:overflow-hidden">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={handleChange}
        contentEditableClassName="prose prose-sm prose-invert max-w-none p-4 text-bone-300 leading-relaxed min-h-full focus:outline-none lore-serif
          [&_h1]:text-bone-100 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4
          [&_h2]:text-bone-100 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3
          [&_h3]:text-bone-200 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2
          [&_h4]:text-bone-300 [&_h4]:font-semibold [&_h4]:mb-1 [&_h4]:mt-2
          [&_p]:text-bone-300 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-2
          [&_ul]:text-bone-300 [&_ul]:text-sm [&_ul]:pl-4 [&_ul]:mb-2 [&_ul]:list-disc
          [&_ol]:text-bone-300 [&_ol]:text-sm [&_ol]:pl-4 [&_ol]:mb-2 [&_ol]:list-decimal
          [&_li]:text-bone-300 [&_li]:mb-0.5 [&_li]:marker:text-ash-500
          [&_strong]:text-bone-100 [&_strong]:font-semibold
          [&_em]:text-bone-400 [&_em]:italic
          [&_blockquote]:border-l-2 [&_blockquote]:border-accent-gold/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-bone-400 [&_blockquote]:my-2
          [&_hr]:border-surface-600 [&_hr]:my-4
          [&_a]:text-accent-gold [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent-gold-dim
          [&_code]:text-accent-arcane [&_code]:bg-surface-600 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
          [&_pre]:bg-void-800 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:my-2
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-xs [&_pre_code]:text-bone-400
          [&_img]:rounded-lg [&_img]:my-2 [&_img]:max-w-full
          [&_table]:w-full [&_table]:text-sm [&_table]:my-2
          [&_th]:text-bone-100 [&_th]:font-semibold [&_th]:border-b [&_th]:border-white/[0.06] [&_th]:bg-surface-700 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left
          [&_td]:border-b [&_td]:border-white/[0.06] [&_td]:px-3 [&_td]:py-1.5 [&_td]:text-bone-300"
        className="[&_.mdxeditor-toolbar]:bg-surface-700 [&_.mdxeditor-toolbar]:border-b [&_.mdxeditor-toolbar]:border-white/[0.06] [&_.mdxeditor-toolbar]:rounded-t-lg [&_.mdxeditor-toolbar]:px-2 [&_.mdxeditor-toolbar]:py-1 [&_.mdxeditor-toolbar]:flex [&_.mdxeditor-toolbar]:flex-wrap [&_.mdxeditor-toolbar]:gap-0.5
          [&_.mdxeditor-toolbar-button]:text-bone-400 [&_.mdxeditor-toolbar-button]:hover:bg-surface-600 [&_.mdxeditor-toolbar-button]:hover:text-bone-100 [&_.mdxeditor-toolbar-button]:rounded [&_.mdxeditor-toolbar-button]:w-8 [&_.mdxeditor-toolbar-button]:h-8
          [&_.mdxeditor-toolbar-button_active]:bg-accent-gold/15 [&_.mdxeditor-toolbar-button_active]:text-accent-gold
          [&_.mdxeditor-toolbar-select]:bg-surface-600 [&_.mdxeditor-toolbar-select]:border-white/[0.08] [&_.mdxeditor-toolbar-select]:text-bone-300 [&_.mdxeditor-toolbar-select]:rounded [&_.mdxeditor-toolbar-select]:h-8 [&_.mdxeditor-toolbar-select]:text-xs
          [&_.mdxeditor-root-contenteditable]:flex-1 [&_.mdxeditor-root-contenteditable]:overflow-y-auto
          [&_.mdxeditor-source-editor]:flex-1 [&_.mdxeditor-source-editor]:overflow-y-auto
          [&_.mdxeditor-source-editor-wrapper]:bg-void-900
          [&_.mdxeditor-source-editor]:text-bone-400 [&_.mdxeditor-source-editor]:font-mono [&_.mdxeditor-source-editor]:text-xs [&_.mdxeditor-source-editor]:leading-relaxed [&_.mdxeditor-source-editor]:p-4
          [&_.mdxeditor-plugin-toolbar]:bg-surface-700 [&_.mdxeditor-plugin-toolbar]:border [&_.mdxeditor-plugin-toolbar]:border-white/[0.08]
          [&_.mdxeditor-button]:text-bone-300 [&_.mdxeditor-button]:hover:bg-surface-600"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          diffSourcePlugin({ viewMode: isRawMode ? 'source' : 'rich-text' }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <InsertThematicBreak />
                <CreateLink />
                <InsertImage />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  );
}
