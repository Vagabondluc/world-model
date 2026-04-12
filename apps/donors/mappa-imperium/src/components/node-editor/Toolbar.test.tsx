import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './Toolbar';
import { useGameStore } from '@/stores/gameStore';
import { NodeExportService } from '@/services/nodeExportService';
import { TestDataService } from '@/services/testDataService';

// Mock the game store
vi.mock('@/stores/gameStore');
vi.mock('@/services/nodeExportService');
vi.mock('@/services/testDataService');

describe('Toolbar', () => {
    const mockUseGameStore = vi.mocked(useGameStore);
    const mockExportSchema = vi.fn(() => '{"nodes":[],"connections":[]}');
    const mockImportSchema = vi.fn();
    const mockClearGraph = vi.fn();
    const mockDownloadSchema = vi.fn();
    const mockLoadSchemaFromFile = vi.fn();
    const mockConvertGraphToTestData = vi.fn(() => []);
    const mockDownloadTestData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        const mockState = {
            nodes: [],
            connections: [],
            exportSchema: mockExportSchema,
            importSchema: mockImportSchema,
            clearGraph: mockClearGraph,
        };
        mockUseGameStore.mockReturnValue(mockState as any);
        // Mock static getState method
        (mockUseGameStore as any).getState = vi.fn(() => mockState);

        vi.mocked(NodeExportService.downloadSchema).mockImplementation(mockDownloadSchema);
        vi.mocked(NodeExportService.loadSchemaFromFile).mockResolvedValue({ nodes: [], connections: [] });
        vi.mocked(TestDataService.convertGraphToTestData).mockImplementation(mockConvertGraphToTestData);
        vi.mocked(TestDataService.downloadTestData).mockImplementation(mockDownloadTestData);
    });


    describe('Export Button', () => {
        it('renders Save button with Download icon', () => {
            render(<Toolbar />);
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        it('triggers download when Save button is clicked', async () => {
            const user = userEvent.setup();
            render(<Toolbar />);

            const saveButton = screen.getByText('Save');
            await user.click(saveButton);

            expect(mockExportSchema).toHaveBeenCalled();
            expect(mockDownloadSchema).toHaveBeenCalled();
        });

        it('generates filename with current date', async () => {
            const user = userEvent.setup();
            const today = new Date().toISOString().slice(0, 10);
            render(<Toolbar />);

            const saveButton = screen.getByText('Save');
            await user.click(saveButton);

            expect(mockDownloadSchema).toHaveBeenCalledWith(
                expect.any(Object),
                `node-graph-${today}.json`
            );
        });

        it('applies dark background to Save button', () => {
            render(<Toolbar />);
            const saveButton = screen.getByText('Save').closest('button');
            expect(saveButton).toHaveClass('bg-slate-800', 'text-white');
        });
    });

    describe('Import Button', () => {
        it('renders Load button with Upload icon', () => {
            render(<Toolbar />);
            expect(screen.getByText('Load')).toBeInTheDocument();
        });

        it('triggers file input click when Load button is clicked', async () => {
            const user = userEvent.setup();
            render(<Toolbar />);

            const loadButton = screen.getByText('Load');
            await user.click(loadButton);

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();
        });

        it('calls importSchema when file is selected', async () => {
            const user = userEvent.setup();
            render(<Toolbar />);

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = new File(['{"nodes":[]}'], 'test.json', { type: 'application/json' });

            fireEvent.change(fileInput, { target: { files: [file] } });

            // Small delay for async file reading
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(NodeExportService.loadSchemaFromFile).toHaveBeenCalledWith(file);
            expect(mockImportSchema).toHaveBeenCalled();
        });

        it('resets file input after import', async () => {
            const user = userEvent.setup();
            render(<Toolbar />);

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = new File(['{"nodes":[]}'], 'test.json', { type: 'application/json' });

            await user.upload(fileInput, file);

            // Small delay for async file reading
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(fileInput.value).toBe('');
        });
    });

    describe('Clear Button', () => {
        it('renders Clear button with Trash2 icon', () => {
            render(<Toolbar />);
            expect(screen.getByText('Clear')).toBeInTheDocument();
        });

        it('disables Clear button when no nodes exist', () => {
            mockUseGameStore.mockReturnValue({
                nodes: [],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            const clearButton = screen.getByText('Clear').closest('button');
            expect(clearButton).toBeDisabled();
        });

        it('enables Clear button when nodes exist', () => {
            mockUseGameStore.mockReturnValue({
                nodes: [{ id: 'node-1', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [], config: { category: 'input', label: 'Node', icon: 'Box' } }],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            const clearButton = screen.getByText('Clear').closest('button');
            expect(clearButton).not.toBeDisabled();
        });

        it('shows confirmation dialog before clearing', async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

            mockUseGameStore.mockReturnValue({
                nodes: [{ id: 'node-1', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [], config: { category: 'input', label: 'Node', icon: 'Box' } }],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            const clearButton = screen.getByText('Clear');
            await user.click(clearButton);

            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to clear the entire graph? This cannot be undone.'
            );
            expect(mockClearGraph).toHaveBeenCalled();

            confirmSpy.mockRestore();
        });

        it('does not clear graph when confirmation is cancelled', async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

            mockUseGameStore.mockReturnValue({
                nodes: [{ id: 'node-1', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [], config: { category: 'input', label: 'Node', icon: 'Box' } }],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            const clearButton = screen.getByText('Clear');
            await user.click(clearButton);

            expect(confirmSpy).toHaveBeenCalled();
            expect(mockClearGraph).not.toHaveBeenCalled();

            confirmSpy.mockRestore();
        });
    });

    describe('Button States', () => {
        it('applies disabled styling to Clear button when disabled', () => {
            mockUseGameStore.mockReturnValue({
                nodes: [],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            const clearButton = screen.getByText('Clear').closest('button');
            expect(clearButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
        });

        it('applies hover styling to Load button', () => {
            render(<Toolbar />);
            const loadButton = screen.getByText('Load').closest('button');
            expect(loadButton).toHaveClass('hover:text-blue-600', 'hover:bg-blue-50');
        });

        it('applies hover styling to Clear button', () => {
            mockUseGameStore.mockReturnValue({
                nodes: [{ id: 'node-1', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [], config: { category: 'input', label: 'Node', icon: 'Box' } }],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            const clearButton = screen.getByText('Clear').closest('button');
            expect(clearButton).toHaveClass('hover:text-red-600', 'hover:bg-red-50');
        });

        it('applies hover styling to Save button', () => {
            render(<Toolbar />);
            const saveButton = screen.getByText('Save').closest('button');
            expect(saveButton).toHaveClass('hover:bg-slate-700');
        });
    });

    describe('Icon Rendering', () => {
        it('renders Download icon in Save button', () => {
            render(<Toolbar />);
            const saveButton = screen.getByText('Save').closest('button');
            expect(saveButton).toContainHTML('svg');
        });

        it('renders Upload icon in Load button', () => {
            render(<Toolbar />);
            const loadButton = screen.getByText('Load').closest('button');
            expect(loadButton).toContainHTML('svg');
        });

        it('renders Trash2 icon in Clear button', () => {
            render(<Toolbar />);
            const clearButton = screen.getByText('Clear').closest('button');
            expect(clearButton).toContainHTML('svg');
        });

        it('renders Code icon in Export Data button', () => {
            render(<Toolbar />);
            const exportDataButton = screen.getByText('Export Data').closest('button');
            expect(exportDataButton).toContainHTML('svg');
        });

        it('renders all icons with consistent size', () => {
            render(<Toolbar />);
            const icons = document.querySelectorAll('svg');
            icons.forEach(icon => {
                expect(icon).toHaveAttribute('width', '14');
                expect(icon).toHaveAttribute('height', '14');
            });
        });
    });

    describe('Export Data Button', () => {
        it('renders Export Data button with Code icon', () => {
            render(<Toolbar />);
            expect(screen.getByText('Export Data')).toBeInTheDocument();
        });

        it('triggers test data export when Export Data button is clicked', async () => {
            const user = userEvent.setup();
            render(<Toolbar />);

            const exportDataButton = screen.getByText('Export Data');
            await user.click(exportDataButton);

            expect(mockConvertGraphToTestData).toHaveBeenCalled();
            expect(mockDownloadTestData).toHaveBeenCalled();
        });

        it('applies amber color to Export Data button', () => {
            render(<Toolbar />);
            const exportDataButton = screen.getByText('Export Data').closest('button');
            expect(exportDataButton).toHaveClass('text-amber-600');
        });
    });

    describe('Node Count Display', () => {
        it('displays node count in toolbar', () => {
            mockUseGameStore.mockReturnValue({
                nodes: [
                    { id: 'node-1', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [], config: { category: 'input', label: 'Node', icon: 'Box' } },
                    { id: 'node-2', type: 'dataInput', position: { x: 0, y: 0 }, data: {}, inputs: [], outputs: [], config: { category: 'input', label: 'Node', icon: 'Box' } },
                ],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            expect(screen.getByText('2 Elements')).toBeInTheDocument();
        });

        it('displays 0 Elements when no nodes exist', () => {
            mockUseGameStore.mockReturnValue({
                nodes: [],
                connections: [],
                exportSchema: mockExportSchema,
                importSchema: mockImportSchema,
                clearGraph: mockClearGraph,
            } as any);

            render(<Toolbar />);
            expect(screen.getByText('0 Elements')).toBeInTheDocument();
        });
    });

    describe('Title Display', () => {
        it('renders Node Editor title', () => {
            render(<Toolbar />);
            expect(screen.getByText('Node Editor')).toBeInTheDocument();
        });

        it('applies bold styling to title', () => {
            render(<Toolbar />);
            const title = screen.getByText('Node Editor');
            expect(title).toHaveClass('font-bold');
        });

        it('applies small font size to title', () => {
            render(<Toolbar />);
            const title = screen.getByText('Node Editor');
            expect(title).toHaveClass('text-sm');
        });
    });
});
