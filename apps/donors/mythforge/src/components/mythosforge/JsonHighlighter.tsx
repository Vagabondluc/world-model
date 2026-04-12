'use client';

import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register only JSON language to minimize bundle size
SyntaxHighlighter.registerLanguage('json', json);

interface JsonHighlighterProps {
  code: string;
}

export function JsonHighlighter({ code }: JsonHighlighterProps) {
  return (
    <SyntaxHighlighter
      language="json"
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        lineHeight: '1.5',
        background: 'transparent',
      }}
      showLineNumbers
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
}
