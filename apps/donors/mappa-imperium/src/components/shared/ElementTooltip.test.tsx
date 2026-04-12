/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import ElementTooltip from './ElementTooltip';

describe('ElementTooltip', () => {
    it('renders children', () => {
        render(<ElementTooltip element={{ id: '1', name: 'El', type: 'Resource', owner: 1, era: 1, data: {} as any }}><span>Child</span></ElementTooltip>);
        expect(screen.getByText('Child')).toBeInTheDocument();
    });
});
