// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('OpenUI — components', () => {
  it('renders a registered structured block component', async () => {
    await import('../components');
    const { default: OpenUIRenderer } = await import('../components/OpenUIRenderer');

    render(
      <OpenUIRenderer
        componentType="GraphAnalysis"
        props={{
          summary: 'The graph is connected.',
          orphanCount: 1,
          orphanTitles: ['The Lost Bell'],
        }}
      />,
    );

    expect(screen.getByText('Graph Analysis')).toBeInTheDocument();
    expect(screen.getByText(/The graph is connected/i)).toBeInTheDocument();
    expect(screen.getByText(/The Lost Bell/i)).toBeInTheDocument();
  });
});

