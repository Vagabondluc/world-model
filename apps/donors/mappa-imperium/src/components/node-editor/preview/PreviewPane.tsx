
import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { ExecutionEngine } from '../engine/ExecutionEngine';
import { RuntimeEngine, ThreadState } from '../runtime/RuntimeEngine';
import { InteractiveNodeRenderer } from '../runtime/InteractiveNodeRenderer';
import { NodeId, NodeExecutionResult } from '@/types/nodeEditor.types';
import { ProgressBarsPreview } from './ProgressBarsPreview';
import { TablePreview } from './TablePreview';
import { JsonPreview } from './JsonPreview';
import { Loader2, AlertCircle, Play, Square, RotateCcw } from 'lucide-react';

export const PreviewPane: React.FC = () => {
    const { nodes, connections, selectedNodeId } = useGameStore();

    // Mode State
    const [mode, setMode] = useState<'edit' | 'play'>('edit');

    // Execution State
    const [results, setResults] = useState<Map<NodeId, NodeExecutionResult>>(new Map());
    const [runtimeState, setRuntimeState] = useState<ThreadState | null>(null);

    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRun, setLastRun] = useState<Date | null>(null);

    // Engines
    const executionEngineRef = useRef<ExecutionEngine>(new ExecutionEngine());
    const runtimeEngineRef = useRef<RuntimeEngine>(new RuntimeEngine());

    // --- Edit Mode: Static Preview Debounce ---
    useEffect(() => {
        if (mode === 'play') return; // Don't auto-run in play mode

        const timer = setTimeout(async () => {
            setIsExecuting(true);
            setError(null);

            try {
                // Execute Graph Statics
                const resultMap = await executionEngineRef.current.executeGraph(nodes, connections);
                setResults(resultMap);
                setLastRun(new Date());
            } catch (err: any) {
                console.error("Execution Error:", err);
                setError(err.message || "Unknown execution error");
            } finally {
                setIsExecuting(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [nodes, connections, mode]);

    // --- Play Mode: Runtime Subscription ---
    useEffect(() => {
        if (mode === 'edit') return;

        // Subscribe to runtime updates
        runtimeEngineRef.current.subscribe((state) => {
            setRuntimeState(state);
            setResults(state.results);

            if (state.status === 'failed') {
                setError(state.error || "Runtime Error");
            } else {
                setError(null);
            }
        });

        // Start the Runtime
        runtimeEngineRef.current.start(nodes, connections);

        return () => {
            // Cleanup if needed?
        };
    }, [mode]); // Re-run when switching to play mode (implicitly resets)

    // Handlers
    const togglePlayMode = () => {
        if (mode === 'edit') {
            setMode('play');
        } else {
            setMode('edit');
            setRuntimeState(null);
        }
    };

    const handleReset = () => {
        if (mode === 'play') {
            runtimeEngineRef.current.start(nodes, connections); // Restart
        }
    };

    return (
        <div className="w-[320px] bg-slate-50 border-l border-slate-200 h-full flex flex-col shadow-xl z-20 transition-all">
            {/* Header */}
            <div className={`p-4 border-b flex justify-between items-center ${mode === 'play' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                    <h2 className="text-sm font-bold flex items-center gap-2">
                        {mode === 'play' ? '🎮 Play Mode' : '👁️ Preview'}
                    </h2>
                    <div className={`text-[10px] mt-0.5 ${mode === 'play' ? 'text-slate-400' : 'text-slate-400'}`}>
                        {isExecuting ? (
                            <span className="flex items-center gap-1 text-blue-500">
                                <Loader2 size={10} className="animate-spin" /> Running...
                            </span>
                        ) : mode === 'play' ? (
                            runtimeState?.status === 'suspended' ? 'Waiting for Input...' :
                                runtimeState?.status === 'completed' ? 'Game Over' : 'Running'
                        ) : lastRun ? (
                            `Last updated: ${lastRun.toLocaleTimeString()}`
                        ) : (
                            'Waiting for changes...'
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {mode === 'play' && (
                        <button
                            onClick={handleReset}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors"
                            title="Restart"
                        >
                            <RotateCcw size={14} />
                        </button>
                    )}
                    <button
                        onClick={togglePlayMode}
                        className={`p-1.5 rounded transition-colors flex items-center gap-1 px-3 ${mode === 'play'
                                ? 'bg-red-500 hover:bg-red-600 text-white font-bold'
                                : 'bg-green-500 hover:bg-green-600 text-white font-bold'
                            }`}
                        title={mode === 'play' ? "Stop Playing" : "Start Playing"}
                    >
                        {mode === 'play' ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        <span className="text-xs uppercase tracking-wider">{mode === 'play' ? 'Stop' : 'Play'}</span>
                    </button>
                </div>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-xs flex gap-2 items-start">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <div>
                            <div className="font-semibold mb-1">Execution Failed</div>
                            {error}
                        </div>
                    </div>
                )}

                {/* --- PLAY MODE: INTERACTIVE AREA --- */}
                {mode === 'play' && runtimeState?.status === 'suspended' && runtimeState.currentNodeId && (
                    <div className="mb-6 border-b border-slate-200 pb-6">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                            Current Action
                        </div>
                        <InteractiveNodeRenderer
                            suspension={(runtimeState.results.get(runtimeState.currentNodeId) as any)?.suspension}
                            node={nodes.find(n => n.id === runtimeState.currentNodeId)!}
                            runtime={runtimeEngineRef.current}
                        />
                    </div>
                )}

                {/* --- SHARED: PROGRESS & DATA --- */}

                {/* Selected Element Preview (Edit Mode Only for now, or unified?) 
                    Keeping logic similar to before but adapted
                */}
                {!isPlaying(mode) && (() => {
                    const selectedNode = nodes.find(n => n.id === selectedNodeId);
                    if (selectedNode && [
                        'resource', 'resourceInput',
                        'deity', 'deityInput',
                        'location', 'locationInput',
                        'faction', 'factionInput',
                        'settlement', 'settlementInput',
                        'event', 'eventInput',
                        'character', 'characterInput',
                        'war', 'warInput',
                        'monument', 'monumentInput'
                    ].includes(selectedNode.type)) {
                        const element = (selectedNode.data as any).element;
                        return (
                            <div className="mb-6 border-b border-slate-200 pb-4">
                                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                                    Selected Element
                                </h3>
                                <div className="bg-white rounded p-3 text-sm shadow-sm border border-slate-100">
                                    <div className="font-bold text-slate-800 mb-1">{(selectedNode.data as any).label || 'Unnamed'}</div>
                                    <div className="text-xs text-slate-500 italic mb-2 capitalize">{selectedNode.type.replace('Input', '')}</div>

                                    {element ? (
                                        <div className="space-y-1">
                                            {Object.entries(element).map(([key, value]) => (
                                                <div key={key} className="flex justify-between border-b border-slate-50 last:border-0 py-1">
                                                    <span className="text-slate-500 capitalize">{key}:</span>
                                                    <span className="font-mono text-slate-700 text-right truncate pl-2 max-w-[150px]">
                                                        {typeof value === 'object' ? '...' : String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-slate-400">No data configured</div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                {/* Progress Bars Section */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Progress Indicators
                    </h3>
                    <ProgressBarsPreview nodes={nodes} executionResults={convertToAnyMap(results)} />
                </div>

                {/* Tables Section */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Data Tables
                    </h3>
                    <TablePreview nodes={nodes} executionResults={convertToAnyMap(results)} />
                </div>

                {/* Raw JSON Debug (Collapsible ideally, but always visible for now) */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Raw Debug Output
                    </h3>
                    <JsonPreview data={results ? Object.fromEntries(results.entries()) : {}} />
                </div>

            </div>
        </div>
    );
};

// Helper
const isPlaying = (mode: string) => mode === 'play';

// Helper to bridge types for older components
const convertToAnyMap = (results: Map<NodeId, NodeExecutionResult>): Map<NodeId, any> => {
    const map = new Map<NodeId, any>();
    results.forEach((val, key) => {
        map.set(key, val.output);
    });
    return map;
};
