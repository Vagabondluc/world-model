import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorOverlay } from './ErrorOverlay';
import { useGameStore } from '@/stores/gameStore';
import { GraphError } from '@/types/nodeEditor.types';

// Mock the game store
vi.mock('@/stores/gameStore');

describe('ErrorOverlay', () => {
    const mockUseGameStore = vi.mocked(useGameStore);
    const mockSelectNode = vi.fn();
    const mockSelectConnection = vi.fn();

    const createMockError = (id: string, type: GraphError['type'], message: string): GraphError => ({
        id,
        type,
        message,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseGameStore.mockReturnValue({
            validationErrors: [],
            selectNode: mockSelectNode,
            selectConnection: mockSelectConnection,
        } as any);
    });

    describe('Render All Errors and Warnings', () => {
        it('renders all validation errors from store', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Invalid node configuration'),
                createMockError('conn-1', 'connection', 'Invalid connection'),
                createMockError('', 'graph', 'Graph cycle detected'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            expect(screen.getByText('Invalid node configuration')).toBeInTheDocument();
            expect(screen.getByText('Invalid connection')).toBeInTheDocument();
            expect(screen.getByText('Graph cycle detected')).toBeInTheDocument();
        });

        it('renders error count in header button', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Error 1'),
                createMockError('node-2', 'node', 'Error 2'),
                createMockError('conn-1', 'connection', 'Error 3'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            expect(screen.getByText('3 Issues Found')).toBeInTheDocument();
        });

        it('renders singular form for single error', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Single error'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            expect(screen.getByText('1 Issue Found')).toBeInTheDocument();
        });
    });

    describe('Apply Error/Warning Styling', () => {
        it('applies red background to header button', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Test error'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            const headerButton = screen.getByText('1 Issue Found').closest('button');
            expect(headerButton).toHaveClass('bg-red-600', 'text-white');
        });

        it('renders AlertTriangle icon in header', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Test error'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            const iconContainer = screen.getByText('1 Issue Found').parentElement;
            expect(iconContainer).toContainHTML('svg');
        });
    });

    describe('Dismiss Functionality', () => {
        it('collapses error list when header button is clicked', async () => {
            const user = userEvent.setup();
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Test error'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            const headerButton = screen.getByText('1 Issue Found');
            await user.click(headerButton);

            // Error should be hidden after collapse
            expect(screen.queryByText('Test error')).not.toBeInTheDocument();
        });
    });

    describe('Empty State', () => {
        it('returns null when no validation errors exist', () => {
            mockUseGameStore.mockReturnValue({
                validationErrors: [],
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            const { container } = render(<ErrorOverlay />);

            expect(container.firstChild).toBeNull();
        });
    });

    describe('Multiple Errors Display', () => {
        it('displays all errors in scrollable container', () => {
            const mockErrors: GraphError[] = Array.from({ length: 10 }, (_, i) =>
                createMockError(`error-${i}`, 'node', `Error message ${i + 1}`)
            );

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            expect(screen.getByText('10 Issues Found')).toBeInTheDocument();
            expect(screen.getByText('Error message 1')).toBeInTheDocument();
            expect(screen.getByText('Error message 10')).toBeInTheDocument();
        });

        it('applies max-height and overflow-y-auto to error list', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Error 1'),
                createMockError('node-2', 'node', 'Error 2'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            const errorList = document.querySelector('.max-h-\\[300px\\].overflow-y-auto');
            expect(errorList).toBeInTheDocument();
        });
    });

    describe('Error/Warning Differentiation', () => {
        it('renders errors with red border styling', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Test error'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            const errorCard = document.querySelector('.border-l-4');
            expect(errorCard).toHaveClass('border-red-500');
        });

        it('renders all error types (node, connection, graph)', () => {
            const mockErrors: GraphError[] = [
                createMockError('node-1', 'node', 'Node error'),
                createMockError('conn-1', 'connection', 'Connection error'),
                createMockError('', 'graph', 'Graph error'),
            ];

            mockUseGameStore.mockReturnValue({
                validationErrors: mockErrors,
                selectNode: mockSelectNode,
                selectConnection: mockSelectConnection,
            } as any);

            render(<ErrorOverlay />);

            expect(screen.getByText('Node error')).toBeInTheDocument();
            expect(screen.getByText('Connection error')).toBeInTheDocument();
            expect(screen.getByText('Graph error')).toBeInTheDocument();
        });
    });
});
