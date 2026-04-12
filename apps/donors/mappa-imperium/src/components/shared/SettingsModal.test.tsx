
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from './SettingsModal';
import { AppSettings } from '@/types';

// Mock types
const mockSettings: AppSettings = {
    markdownFormat: 'regular',
    mapRender: { mode: 'svg', theme: 'classic' },
    colorBlindMode: 'none'
};

describe('SettingsModal Component', () => {
    it('does not render when isOpen is false', () => {
        const { queryByText } = render(
            <SettingsModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} currentSettings={mockSettings} />
        );
        expect(queryByText('Application Settings')).not.toBeInTheDocument();
    });

    it('renders and shows settings when Open', () => {
        render(
            <SettingsModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} currentSettings={mockSettings} />
        );
        expect(screen.getByText('Application Settings')).toBeInTheDocument();
        // Check for accessibility option
        expect(screen.getByText('Accessibility / Color Blind Mode')).toBeInTheDocument();
    });

    it('updates Color Blind Mode state', () => {
        const handleSave = vi.fn();
        render(
            <SettingsModal isOpen={true} onClose={vi.fn()} onSave={handleSave} currentSettings={mockSettings} />
        );

        // Find select for color blind mode
        // Since there are multiple selects, we can look by label text but easier to use combobox + text
        // Or simpler: getAllByRole('combobox') since labels are distinct
        const selects = screen.getAllByRole('combobox');
        // Assuming order: Base Mode, Theme, ColorBlind
        const colorBlindSelect = selects[2];

        fireEvent.change(colorBlindSelect, { target: { value: 'deuteranopia' } });

        // Find Save button
        const saveBtn = screen.getByText('Apply Changes');
        fireEvent.click(saveBtn);

        expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({
            colorBlindMode: 'deuteranopia'
        }));
    });
});
