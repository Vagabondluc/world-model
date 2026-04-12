// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NarrativeCard } from '../../components/narrative-kit/NarrativeCard';
import { ChroniclerView } from '../../components/npc/ChroniclerView';

/**
 * Component Snapshot Tests
 * 
 * These tests capture the rendered output of key components to ensure
 * that refactoring doesn't change their visual structure.
 */

describe('NarrativeCard Snapshots', () => {
    it('should render with minimal props', () => {
        const { container } = render(
            <NarrativeCard>
                <div>Test content</div>
            </NarrativeCard>
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with variant props', () => {
        const { container } = render(
            <NarrativeCard
                variant="parchment"
                className="test-card"
            >
                <div>Full card content</div>
            </NarrativeCard>
        );
        expect(container).toMatchSnapshot();
    });

    it('should render in compact state', () => {
        const { container } = render(
            <NarrativeCard
                variant="compact"
            >
                <div>Compact content</div>
            </NarrativeCard>
        );
        expect(container).toMatchSnapshot();
    });
});

describe('ChroniclerView Snapshots', () => {
    it('should render empty state', () => {
        const { container } = render(<ChroniclerView />);
        expect(container).toMatchSnapshot();
    });

    it('should render with onBack handler', () => {
        const { container } = render(<ChroniclerView onBack={() => {}} />);
        expect(container).toMatchSnapshot();
    });
});
