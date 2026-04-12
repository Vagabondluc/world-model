import React, { useState } from 'react';

/**
 * DraftCard - simple entity creation / editing card used by OpenUI
 */
export interface DraftCardProps {
  id: string;
  title?: string;
  category?: string; // EntityCategory
  attributes?: Record<string, unknown>;
  markdown?: string;
  tags?: string[];
  onSave?: () => void;
  validationErrors?: Record<string, string>;
}

export default function DraftCard(props: DraftCardProps) {
  const [title, setTitle] = useState(props.title ?? '');
  const [markdown, setMarkdown] = useState(props.markdown ?? '');

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12, maxWidth: 520 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title || 'Untitled Draft'}</h3>
        <div style={{ fontSize: 12, color: '#666' }}>{props.category ?? 'uncategorized'}</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#444' }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginTop: 8 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#444' }}>Markdown</label>
        <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={6} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginTop: 8 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#444' }}>Attributes</label>
        <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 4 }}>{JSON.stringify(props.attributes ?? {}, null, 2)}</pre>
      </div>

      {props.tags && (
        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#444' }}>Tags</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {props.tags.map((t) => (
              <span key={t} style={{ background: '#eee', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          onClick={() => {
            props.onSave?.();
          }}
        >
          Save
        </button>
      </div>

      {props.validationErrors && (
        <div style={{ marginTop: 10, color: 'red', fontSize: 12 }}>
          {Object.entries(props.validationErrors).map(([k, v]) => (
            <div key={k}>{k}: {v}</div>
          ))}
        </div>
      )}
    </div>
  );
}
