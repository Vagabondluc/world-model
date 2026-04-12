import React from 'react';
import { z } from 'zod';
import { registry } from '../registry';

interface OpenUIRendererProps {
  componentType: string;
  props: Record<string, unknown>;
}

/**
 * Dynamic renderer that looks up a registered component and validates props against the
 * component's Zod schema before rendering. If validation fails it renders a helpful
 * error box so tooling can show the problem to the user.
 */
export default function OpenUIRenderer({ componentType, props }: OpenUIRendererProps) {
  const entry = registry.get(componentType);
  if (!entry) {
    return (
      <div style={{ border: '1px dashed #c33', padding: 12, borderRadius: 6 }}>
        Unknown component: <strong>{componentType}</strong>
      </div>
    );
  }

  const parseResult = entry.propSchema?.safeParse
    ? entry.propSchema.safeParse(props)
    : { success: true as const };

  if (!parseResult.success) {
    const issues = 'error' in parseResult ? (parseResult.error as z.ZodError).issues ?? [] : [];
    return (
      <div style={{ border: '1px solid #f3c', padding: 12, borderRadius: 6, background: '#fff6f8' }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Prop validation failed for {componentType}</div>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(issues, null, 2)}</pre>
      </div>
    );
  }

  const Component = entry.component as React.ComponentType<Record<string, unknown>>;
  return (
    <RenderErrorBoundary componentType={componentType}>
      <Component {...props} />
    </RenderErrorBoundary>
  );
}

class RenderErrorBoundary extends React.Component<
  { componentType: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ border: '1px solid #f00', padding: 12, borderRadius: 6, background: '#fff0f0' }}>
          Error rendering component: {this.state.error.message}
        </div>
      );
    }

    return this.props.children;
  }
}
