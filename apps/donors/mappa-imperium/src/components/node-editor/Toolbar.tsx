/**
 * Node Editor Toolbar
 * Provides global actions: Import, Export, Clear.
 */

import React, { useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { NodeExportService } from '@/services/nodeExportService';
import { TestDataService } from '@/services/testDataService';
import { Trash2, Download, Upload, Code } from 'lucide-react';
import { NodeEditorSchema } from '@/types/nodeEditor.types';

export const Toolbar: React.FC = () => {
    const {
        nodes,
        importSchema,
        exportSchema,
        clearGraph
    } = useGameStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleExport = () => {
        try {
            const jsonString = exportSchema();
            // The store returns a JSON string, but our service expects an object if we want it to verify/stringify again.
            // Or we can adjust service. Let's parse it back to object for the service to handle "download object".
            // Implementation detail: Service creates Blob from stringified object.
            const schema: NodeEditorSchema = JSON.parse(jsonString);
            const filename = `node-graph-${new Date().toISOString().slice(0, 10)}.json`;
            NodeExportService.downloadSchema(schema, filename);
        } catch (e) {
            console.error("Export failed:", e);
            alert("Failed to export schema.");
        }
    };

    const handleExportTestData = () => {
        try {
            // 1. Get current nodes/connections from store (hook already gives us 'nodes')
            // We also need connections for the service but currently it doesn't use them.
            // Let's get them from store just in case.
            const { connections } = useGameStore.getState();

            const elements = TestDataService.convertGraphToTestData(nodes, connections);
            console.log("Exported Elements:", elements);
            TestDataService.downloadTestData(elements);
        } catch (e) {
            console.error("Test Data Export failed:", e);
            alert("Failed to export test data.");
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const schema = await NodeExportService.loadSchemaFromFile(file);
            importSchema(schema);
            // Reset input so same file can be selected again if needed
            e.target.value = '';
        } catch (err: any) {
            console.error("Import failed:", err);
            alert(`Failed to import file: ${err.message}`);
        }
    };

    const handleClear = () => {
        if (nodes.length > 0) {
            if (confirm("Are you sure you want to clear the entire graph? This cannot be undone.")) {
                clearGraph();
            }
        }
    };

    return (
        <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 justify-between shrink-0 z-30 relative">

            {/* Left: Title / Status */}
            <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 text-sm">Node Editor</span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500">{nodes.length} Elements</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileChange}
                />

                <button
                    onClick={handleExportTestData}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
                    title="Export as Test Data"
                >
                    <Code size={14} />
                    Export Data
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                    onClick={handleClear}
                    disabled={nodes.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear Graph"
                >
                    <Trash2 size={14} />
                    Clear
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                    onClick={handleImportClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Load JSON"
                >
                    <Upload size={14} />
                    Load
                </button>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 rounded transition-colors shadow-sm"
                    title="Save JSON"
                >
                    <Download size={14} />
                    Save
                </button>
            </div>
        </div>
    );
};
