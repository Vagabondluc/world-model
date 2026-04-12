import React from 'react';
import { X, Trash2, Upload, Calendar, FileText } from 'lucide-react';
import { SavedEraGraph } from '@/types/nodeEditor.types';

interface LoadEraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    saves: SavedEraGraph[];
    currentEraName: string;
}

export const LoadEraModal: React.FC<LoadEraModalProps> = ({
    isOpen,
    onClose,
    onLoad,
    onDelete,
    saves,
    currentEraName
}) => {
    if (!isOpen) return null;

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                    <h3 className="font-semibold text-slate-800">Load {currentEraName} Graph</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
                    {saves.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <FileText size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No saved graphs found</p>
                            <p className="text-sm mt-1">
                                Saves for {currentEraName} will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {saves.map((save) => (
                                <div
                                    key={save.id}
                                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex items-start justify-between"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-slate-800 truncate">
                                                {save.name}
                                            </h4>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                v{save.version}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {formatDate(save.timestamp)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                {save.schema.nodes.length} Nodes
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => onLoad(save.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
                                        >
                                            <Upload size={14} />
                                            Load
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete "${save.name}"?`)) {
                                                    onDelete(save.id);
                                                }
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Save"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
