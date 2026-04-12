import React from 'react';

export interface CategorySuggestionField {
  name?: string;
  type?: string;
  defaultValue?: unknown;
}

export interface CategorySuggestionItem {
  category?: string;
  group?: string;
  reason?: string;
  fields?: CategorySuggestionField[];
}

export interface CategorySuggestionProps {
  suggestions: CategorySuggestionItem[];
}

export default function CategorySuggestion({ suggestions }: CategorySuggestionProps) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Category Suggestions</div>
      {suggestions.length === 0 ? (
        <div style={{ fontSize: 12, color: '#666' }}>No suggestions.</div>
      ) : (
        suggestions.map((suggestion, idx) => (
          <div key={`${suggestion.category ?? 'category'}-${idx}`} style={{ marginTop: idx === 0 ? 0 : 8 }}>
            <div style={{ fontWeight: 600 }}>{suggestion.category ?? 'Unnamed category'}</div>
            {suggestion.group && <div style={{ fontSize: 12, color: '#666' }}>Group: {suggestion.group}</div>}
            {suggestion.reason && <div style={{ marginTop: 4 }}>{suggestion.reason}</div>}
          </div>
        ))
      )}
    </div>
  );
}
