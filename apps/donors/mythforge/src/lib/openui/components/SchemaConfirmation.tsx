import React from 'react';

export interface SchemaConfirmationProps {
  title: string;
  description: string;
  field?: string;
  fieldType?: string;
  required?: boolean;
}

export default function SchemaConfirmation({ title, description, field, fieldType, required }: SchemaConfirmationProps) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Schema Confirmation</div>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ marginTop: 4 }}>{description}</div>
      {(field || fieldType) && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          {field && <span>Field: {field}</span>}
          {field && fieldType && <span> • </span>}
          {fieldType && <span>Type: {fieldType}</span>}
          {typeof required === 'boolean' && <span> • Required: {String(required)}</span>}
        </div>
      )}
    </div>
  );
}
