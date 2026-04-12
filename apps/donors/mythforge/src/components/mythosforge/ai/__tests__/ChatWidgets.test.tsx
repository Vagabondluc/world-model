// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessageBubble } from '../ChatWidgets';
import type { ChatMessage } from '@/lib/types';

describe('ChatWidgets structured output rendering', () => {
  it('renders category and graph analysis blocks', () => {
    const msg: ChatMessage = {
      id: 'msg-1',
      role: 'assistant',
      content: 'Structured output attached.',
      mode: 'lorekeeper',
      timestamp: Date.now(),
      components: [
        {
          type: 'category_suggestion',
          data: {
            suggestions: [
              {
                category: 'Shadow Market',
                group: 'Custom',
                reason: 'Useful for secret trade routes.',
                fields: [
                  { name: 'secrecy', type: 'number' },
                ],
              },
            ],
          },
        },
        {
          type: 'graph_analysis',
          data: {
            summary: 'The graph is connected with two minor orphan nodes.',
            orphanCount: 2,
            orphanTitles: ['The Lost Bell', 'The Silent Dock'],
          },
        },
      ],
    };

    render(<ChatMessageBubble msg={msg} modeColor="accent-gold" />);

    expect(screen.getByText('Category Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Shadow Market')).toBeInTheDocument();
    expect(screen.getByText('Graph Analysis')).toBeInTheDocument();
    expect(screen.getByText(/two minor orphan nodes/i)).toBeInTheDocument();
  });
});

