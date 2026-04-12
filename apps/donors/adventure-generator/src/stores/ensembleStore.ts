import { create } from 'zustand';
import { NodeMetadata } from '../services/persistenceMappingService';

export type EnsembleWindow = 'gm' | 'player';

export interface FileNode {
    id: string;
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
}

export interface GraphNode {
    id: string;
    label: string;
    path: string;
    type: string;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

interface EnsembleState {
    rootPath: string | null;
    currentFile: string | null;
    fileContent: {
        frontmatter: string;
        content: string;
    } | null;
    fileTree: FileNode[];
    graphData: { nodes: GraphNode[], edges: GraphEdge[] };
    activeWindow: EnsembleWindow;
    currentMetadata: NodeMetadata | null;
    isDirty: boolean;

    // Actions
    setRootPath: (path: string | null) => void;
    setFileTree: (tree: FileNode[]) => void;
    setGraphData: (data: { nodes: GraphNode[], edges: GraphEdge[] }) => void;
    setCurrentFile: (path: string | null) => void;
    setFileContent: (frontmatter: string, content: string, metadata?: NodeMetadata | null) => void;
    setDirty: (dirty: boolean) => void;
    setActiveWindow: (window: EnsembleWindow) => void;
}

export const useEnsembleStore = create<EnsembleState>((set) => ({
    rootPath: null,
    currentFile: null,
    fileContent: null,
    fileTree: [],
    graphData: { nodes: [], edges: [] },
    activeWindow: 'gm',
    currentMetadata: null,
    isDirty: false,

    setRootPath: (path) => set({ rootPath: path }),
    setFileTree: (tree) => set({ fileTree: tree }),
    setGraphData: (data) => set({ graphData: data }),
    setCurrentFile: (path) => set({ currentFile: path, isDirty: false }),
    setFileContent: (frontmatter, content, metadata) => set({
        fileContent: { frontmatter, content },
        currentMetadata: metadata || null,
        isDirty: false
    }),
    setDirty: (dirty) => set({ isDirty: dirty }),
    setActiveWindow: (window) => set({ activeWindow: window }),
}));
