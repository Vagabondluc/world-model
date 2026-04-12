import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorCard } from './ErrorCard';
import { useGameStore } from '@mi/stores/gameStore';
import { GraphError, NodeId } from '@mi/types/nodeEditor.types';

// Mock the game store
vi.mock('@/stores/gameStore');

describe('ErrorCard', () => {
    const mockUseGameStore = vi.mocked(useGameStore);
    const mockSelectNode = vi.fn();
    const mockSelectConnection = vi.fn();
    const mockOnDismiss = vi.fn();

    const createMockError = (id: string, type: GraphError['type'], message: string): GraphError => ({
        id,
        type,
        message,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseGameStore.mockReturnValue({
            selectNode: mockSelectNode,
            selectConnection: mockSelectConnection,
        } as any);
    });

    describe('Display Individual Error with Context', () => {
        it('renders error message', () => {
            const mockError = createMockError('node-1', 'node', 'Invalid node configuration');

            render(<ErrorCard error={mockError} />);

            expect(screen.getByText('Invalid node configuration')).toBeInTheDocument();
        });

        it('renders AlertCircle icon', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} />);

            const iconContainer = document.querySelector('.text-red-500');
            expect(iconContainer).toContainHTML('svg');
        });

        it('applies red border-left styling', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} />);

            const card = document.querySelector('.border-l-4');
            expect(card).toHaveClass('border-red-500');
        });
    });

    describe('"Fix" Button (Jump to Source)', () => {
        it('renders "Jump to source" button for errors with id', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} />);

            expect(screen.getByText('Jump to source')).toBeInTheDocument();
        });

        it('calls selectNode when jumping to node error', async () => {
            const user = userEvent.setup();
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} />);

            const jumpButton = screen.getByText('Jump to source');
            await user.click(jumpButton);

            expect(mockSelectNode).toHaveBeenCalledWith('node-1');
        });

        it('calls selectConnection when jumping to connection error', async () => {
            const user = userEvent.setup();
            const mockError = createMockError('conn-1', 'connection', 'Test error');

            render(<ErrorCard error={mockError} />);

            const jumpButton = screen.getByText('Jump to source');
            await user.click(jumpButton);

            expect(mockSelectConnection).toHaveBeenCalledWith('conn-1');
        });

        it('does not render jump button for errors without id', () => {
            const mockError = createMockError('', 'graph', 'Graph error');

            render(<ErrorCard error={mockError} />);

            expect(screen.queryByText('Jump to source')).not.toBeInTheDocument();
        });

        it('renders Target icon in jump button', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} />);

            const jumpButton = screen.getByText('Jump to source').parentElement;
            expect(jumpButton).toContainHTML('svg');
        });
    });

    describe('Error Visualization on Nodes', () => {
        it('displays node error with red border styling', () => {
            const mockError = createMockError('node-1', 'node', 'Node error');

            render(<ErrorCard error={mockError} />);

            const card = document.querySelector('.border-l-4');
            expect(card).toHaveClass('border-red-500');
        });

        it('displays AlertCircle icon for node errors', () => {
            const mockError = createMockError('node-1', 'node', 'Node error');

            render(<ErrorCard error={mockError} />);

            const icon = document.querySelector('.text-red-500');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('Error Visualization on Ports', () => {
        it('renders error message for port-related errors', () => {
            const mockError = createMockError('node-1', 'node', 'Invalid port connection');

            render(<ErrorCard error={mockError} />);

            expect(screen.getByText('Invalid port connection')).toBeInTheDocument();
        });
    });

    describe('Error Visualization on Connections', () => {
        it('renders connection error with jump functionality', async () => {
            const user = userEvent.setup();
            const mockError = createMockError('conn-1', 'connection', 'Invalid connection type');

            render(<ErrorCard error={mockError} />);

            expect(screen.getByText('Invalid connection type')).toBeInTheDocument();

            const jumpButton = screen.getByText('Jump to source');
            await user.click(jumpButton);

            expect(mockSelectConnection).toHaveBeenCalledWith('conn-1');
        });
    });

    describe('Dismiss Functionality', () => {
        it('renders dismiss button when onDismiss prop is provided', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} onDismiss={mockOnDismiss} />);

            const dismissButton = document.querySelector('.text-slate-400');
            expect(dismissButton).toBeInTheDocument();
        });

        it('calls onDismiss when dismiss button is clicked', async () => {
            const user = userEvent.setup();
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} onDismiss={mockOnDismiss} />);

            const dismissButton = document.querySelector('.text-slate-400') as HTMLElement;
            await user.click(dismissButton);

            expect(mockOnDismiss).toHaveBeenCalledTimes(1);
        });

        it('does not render dismiss button when onDismiss is not provided', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} />);

            const dismissButton = document.querySelector('.text-slate-400');
            expect(dismissButton).not.toBeInTheDocument();
        });

        it('renders X icon in dismiss button', () => {
            const mockError = createMockError('node-1', 'node', 'Test error');

            render(<ErrorCard error={mockError} onDismiss={mockOnDismiss} />);

            const dismissButton = document.querySelector('.text-slate-400');
            expect(dismissButton).toContainHTML('svg');
        });
    });
});
