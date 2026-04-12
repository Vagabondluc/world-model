import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SaveEraModal } from './SaveEraModal';
import { LoadEraModal } from './LoadEraModal';
import { SavedEraGraph } from '@/types/nodeEditor.types';

describe('Era Modals', () => {
    describe('SaveEraModal', () => {
        it('should render when open', () => {
            render(
                <SaveEraModal
                    isOpen={true}
                    onClose={() => { }}
                    onSave={() => { }}
                    currentEraName="Test Era"
                />
            );
            expect(screen.getByText('Save Test Era Graph')).toBeInTheDocument();
        });

        it('should call onSave with name', () => {
            const onSave = vi.fn();
            render(
                <SaveEraModal
                    isOpen={true}
                    onClose={() => { }}
                    onSave={onSave}
                    currentEraName="Test Era"
                />
            );

            const input = screen.getByPlaceholderText('e.g. Initial Setup v1');
            fireEvent.change(input, { target: { value: 'My Save' } });
            fireEvent.click(screen.getByText('Save Era'));

            expect(onSave).toHaveBeenCalledWith('My Save');
        });
    });

    describe('LoadEraModal', () => {
        const mockSaves: SavedEraGraph[] = [
            {
                id: '1',
                eraId: 1,
                name: 'Save 1',
                schema: { nodes: [], connections: [], globalSettings: {} } as any,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        ];

        it('should render saved items', () => {
            render(
                <LoadEraModal
                    isOpen={true}
                    onClose={() => { }}
                    onLoad={() => { }}
                    onDelete={() => { }}
                    saves={mockSaves}
                    currentEraName="Test Era"
                />
            );
            expect(screen.getByText('Save 1')).toBeInTheDocument();
        });

        it('should call onLoad when load button clicked', () => {
            const onLoad = vi.fn();
            render(
                <LoadEraModal
                    isOpen={true}
                    onClose={() => { }}
                    onLoad={onLoad}
                    onDelete={() => { }}
                    saves={mockSaves}
                    currentEraName="Test Era"
                />
            );
            fireEvent.click(screen.getByText('Load'));
            expect(onLoad).toHaveBeenCalledWith('1');
        });
    });
});
