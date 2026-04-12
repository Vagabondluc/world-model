/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import HelpTooltip from './HelpTooltip';

describe('HelpTooltip', () => {
    it('renders trigger', () => {
        render(<HelpTooltip text="Help info" />);
        expect(screen.getByText('[?]')).toBeInTheDocument();
    });
});
