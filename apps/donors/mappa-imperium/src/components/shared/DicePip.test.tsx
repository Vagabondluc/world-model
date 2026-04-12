/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import DicePip from './DicePip';

describe('DicePip', () => {
    it('renders with value', () => {
        render(<DicePip value={6} />);
        expect(screen.getByText('6')).toBeInTheDocument();
    });
});
