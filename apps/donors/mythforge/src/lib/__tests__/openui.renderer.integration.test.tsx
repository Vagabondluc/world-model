// @vitest-environment jsdom
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { z } from 'zod';

describe('OpenUIRenderer', () => {
  let registry: any;
  let OpenUIRenderer: React.ComponentType<any>;

  beforeEach(async () => {
    cleanup();
    const regMod = await import('../openui/registry');
    registry = regMod.registry;

    const rendMod = await import('../openui/components/OpenUIRenderer');
    OpenUIRenderer = rendMod.default;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a registered component with valid props', async () => {
    const RenderedCard: React.FC<{ title: string }> = ({ title }) => <div data-testid="openui-rendered">{title}</div>;
    registry.register('RenderedCardIntegrationTest', RenderedCard, z.object({ title: z.string() }));

    render(<OpenUIRenderer componentType="RenderedCardIntegrationTest" props={{ title: 'Hello' }} />);

    const el = screen.getByTestId('openui-rendered');
    expect(el).toBeDefined();
    expect(el.textContent).toBe('Hello');
  });

  it('shows validation errors for invalid props', async () => {
    const RenderedCard: React.FC<{ title: string }> = ({ title }) => <div data-testid="openui-rendered">{title}</div>;
    registry.register('RenderedCardValidationTest', RenderedCard, z.object({ title: z.string() }));

    render(<OpenUIRenderer componentType="RenderedCardValidationTest" props={{ title: 123 }} />);

    expect(screen.getByText(/Prop validation failed/i)).toBeInTheDocument();
    expect(screen.queryByTestId('openui-rendered')).toBeNull();
  });
});
