import React from 'react';

export interface RelationshipSuggestionProps {
  sourceTitle: string;
  targetTitle: string;
  relationshipType: string;
  reason?: string;
}

export default function RelationshipSuggestion({ sourceTitle, targetTitle, relationshipType, reason }: RelationshipSuggestionProps) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Relationship Suggestion</div>
      <div>{sourceTitle} → {targetTitle}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>Type: {relationshipType}</div>
      {reason && <div style={{ marginTop: 6 }}>{reason}</div>}
    </div>
  );
}
