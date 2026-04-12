import React from 'react';

export interface ConsistencyIssueProps {
  severity: string;
  title: string;
  description: string;
  entityIds?: string[];
  entityTitles?: string[];
}

export default function ConsistencyIssue({ severity, title, description, entityIds = [], entityTitles = [] }: ConsistencyIssueProps) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Consistency Issue</div>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>Severity: {severity}</div>
      <div style={{ marginTop: 6 }}>{description}</div>
      {entityTitles.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12 }}>
          Entities: {entityTitles.join(', ')}
        </div>
      )}
      {entityIds.length > 0 && (
        <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
          IDs: {entityIds.join(', ')}
        </div>
      )}
    </div>
  );
}
