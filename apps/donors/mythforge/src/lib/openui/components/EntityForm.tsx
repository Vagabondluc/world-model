import React, { useState } from 'react';
import { ZodSchema } from 'zod';

interface Entity {
  id?: string;
  [k: string]: unknown;
}

interface EntityFormProps {
  category: string; // EntityCategory
  initialData?: Partial<Entity>;
  onSubmit: (_data: Entity) => void;
  schema?: ZodSchema<Entity>;
}

/**
 * Minimal dynamic form. If a Zod schema is provided it will be used to validate the
 * final payload. For rapid development the form shows a JSON editor so arbitrary
 * entity shapes are supported without heavy UI generation logic.
 */
export default function EntityForm({ category, initialData = {}, onSubmit, schema }: EntityFormProps) {
  const [jsonText, setJsonText] = useState(JSON.stringify(initialData, null, 2));
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (schema) {
        const result = schema.safeParse(parsed);
        if (!result.success) {
          setError(JSON.stringify(result.error.format(), null, 2));
          return;
        }
      }
      setError(null);
      onSubmit(parsed);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  };

  return (
    <div style={{ border: '1px solid #e6e6e6', padding: 12, borderRadius: 6, maxWidth: 640 }}>
      <div style={{ marginBottom: 8 }}><strong>Entity Form</strong> <span style={{ color: '#666' }}>({category})</span></div>
      <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} rows={12} style={{ width: '100%', padding: 8 }} />
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
}
