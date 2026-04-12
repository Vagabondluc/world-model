import React, { useState, useEffect } from 'react';
import { useGameStore } from '@mi/stores/gameStore';
import { ERA_NAMES } from '@mi/types/nodeEditor.types';
import { ChevronDown, Save, FolderOpen, Copy } from 'lucide-react';
import { SaveEraModal } from '../shared/SaveEraModal';
import { LoadEraModal } from '../shared/LoadEraModal';

export const EraMenuBar: React.FC = () => {
    const {
        currentEraId,
        savedEras,
        nodes,
        setCurrentEra,
        saveCurrentEra,
        loadSavedEra,
        deleteSavedEra,
        refreshSavedEras,
        loadReferenceTemplate,
        exportProject,
        importProject,
        loadSampleProject,
        clearGraph
    } = useGameStore();

    const [isEraDropdownOpen, setIsEraDropdownOpen] = useState(false);
    const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

    // Initial load of saves when era changes
    useEffect(() => {
        if (currentEraId) {
            refreshSavedEras();
        }
    }, [currentEraId, refreshSavedEras]);

    // Handlers
    const handleEraSelect = (eraId: number) => {
        if (eraId === currentEraId) {
            setIsEraDropdownOpen(false);
            return;
        }

        if (nodes.length > 0) {
            if (!confirm(`Switching eras will clear the current graph. Unsaved changes will be lost. Continue?`)) {
                setIsEraDropdownOpen(false);
                return;
            }
        }

        clearGraph();
        setCurrentEra(eraId);
        setIsEraDropdownOpen(false);
    };

    const handleSave = async (name: string) => {
        if (!currentEraId) return;
        await saveCurrentEra(name);
        // Notification could be added here
    };

    const handleLoad = async (id: string) => {
        if (nodes.length > 0) {
            if (!confirm(`Loading a saved graph will replace current content. Continue?`)) {
                return;
            }
        }
        await loadSavedEra(id);
        setIsLoadModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        await deleteSavedEra(id);
    };

    // If no era selected, default to Era 1 (Myth) on mount (or handle via parent)
    useEffect(() => {
        if (currentEraId === null) {
            setCurrentEra(1);
        }
    }, [currentEraId, setCurrentEra]);

    const currentEraName = currentEraId ? ERA_NAMES[currentEraId] : 'Select Era';

    return (
        <div className="bg-white border-b border-slate-200 h-10 flex items-center justify-between px-3 shrink-0 z-20 relative shadow-sm">
            {/* Left: Era Selector */}
            <div className="relative">
                <button
                    onClick={() => {
                        setIsEraDropdownOpen(!isEraDropdownOpen);
                        setIsProjectMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-full text-xs text-slate-500 font-bold border border-slate-200">
                        {currentEraId || '?'}
                    </span>
                    {currentEraName}
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isEraDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isEraDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Select Era
                        </div>
                        {Object.entries(ERA_NAMES).map(([id, name]) => {
                            const eraId = parseInt(id);
                            const isSelected = currentEraId === eraId;
                            return (
                                <button
                                    key={eraId}
                                    onClick={() => handleEraSelect(eraId)}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                                >
                                    <span className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold border ${isSelected ? 'bg-blue-200 border-blue-300 text-blue-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                        {eraId}
                                    </span>
                                    {name}
                                    {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Project Menu */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsProjectMenuOpen(!isProjectMenuOpen);
                            setIsEraDropdownOpen(false);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors border border-transparent hover:border-slate-200 ${isProjectMenuOpen ? 'bg-slate-100' : ''}`}
                    >
                        <FolderOpen size={14} />
                        Project
                        <ChevronDown size={12} className={`transition-transform duration-200 ${isProjectMenuOpen ? 'rotate-180' : 'opacity-50'}`} />
                    </button>

                    {isProjectMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={() => {
                                    if (confirm("Export entire project (all eras)?")) {
                                        exportProject();
                                        setIsProjectMenuOpen(false);
                                    }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <Save size={14} /> Export Project
                            </button>
                            <label className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                                <FolderOpen size={14} /> Import Project
                                <input
                                    type="file"
                                    accept=".json"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (confirm("Importing a project will overwrite existing era saves. Continue?")) {
                                                importProject(file);
                                                setIsProjectMenuOpen(false);
                                            }
                                            e.target.value = ''; // Reset
                                        }
                                    }}
                                />
                            </label>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                                onClick={() => {
                                    if (confirm("Load Sample Project? This will overwrite existing saves.")) {
                                        loadSampleProject();
                                        setIsProjectMenuOpen(false);
                                    }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <Copy size={14} /> Load Sample Project
                            </button>
                        </div>
                    )}
                </div>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {currentEraId && (
                    <>
                        <button
                            onClick={() => {
                                if (confirm(`Load default template for ${currentEraName}? This will clear the current graph.`)) {
                                    loadReferenceTemplate();
                                    setIsEraDropdownOpen(false); // Close dropdown if open
                                }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Load Default Template"
                        >
                            <Copy size={14} />
                            Template
                        </button>

                        <div className="h-4 w-px bg-slate-200 mx-1" />

                        <button
                            onClick={() => setIsLoadModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors"
                            title="Load Saved Graph"
                        >
                            <FolderOpen size={14} />
                            Load
                            <span className="bg-slate-100 text-slate-500 px-1.5 rounded-full text-[10px]">
                                {savedEras.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setIsSaveModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
                            title="Save Current Graph"
                        >
                            <Save size={14} />
                            Save Era
                        </button>
                    </>
                )}
            </div>

            {/* Modals */}
            <SaveEraModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSave}
                currentEraName={currentEraName}
            />

            <LoadEraModal
                isOpen={isLoadModalOpen}
                onClose={() => setIsLoadModalOpen(false)}
                onLoad={handleLoad}
                onDelete={handleDelete}
                saves={savedEras}
                currentEraName={currentEraName}
            />

            {/* Overlay for dropdown backdrop if needed */}
            {(isEraDropdownOpen || isProjectMenuOpen) && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => {
                        setIsEraDropdownOpen(false);
                        setIsProjectMenuOpen(false);
                    }}
                />
            )}
        </div>
    );
};
