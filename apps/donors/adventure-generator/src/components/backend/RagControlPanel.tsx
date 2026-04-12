import React, { useState, useEffect } from 'react';
import { Database, FolderSearch, RefreshCw, Upload, Trash2, FileText } from 'lucide-react';
import { useBackendStore } from '../../stores/backendStore';
import { useUserStore } from '../../stores/userStore';

interface RagDocument {
    id: string;
    filename: string;
    chunks: number;
    upload_date: string;
}

export const RagControlPanel: React.FC = () => {
    const {
        baseUrl,
        isConnected,
        ragPersistPath,
        fetchRagConfig,
        updateRagConfig,
        indexDirectory
    } = useBackendStore();

    const [documents, setDocuments] = useState<RagDocument[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isIndexing, setIsIndexing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editPath, setEditPath] = useState(ragPersistPath);

    const { userRole } = useUserStore();

    const fetchDocuments = async () => {
        if (!isConnected) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${baseUrl}/rag/documents`);
            if (response.ok) {
                const data = await response.json();
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error("Failed to fetch RAG documents", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected) {
            fetchDocuments();
            fetchRagConfig();
        }
    }, [isConnected, baseUrl, fetchRagConfig]);

    useEffect(() => {
        setEditPath(ragPersistPath);
    }, [ragPersistPath]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !isConnected) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${baseUrl}/rag/upload`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                await fetchDocuments();
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleIndexFolder = async () => {
        const path = prompt("Enter full folder path to index:", "d:/antigravity/dnd adventure generator/lore");
        if (!path) return;

        setIsIndexing(true);
        try {
            const result = await indexDirectory(path);
            if (result.success) {
                alert(`Successfully indexed ${result.count} documents.`);
                await fetchDocuments();
            } else {
                alert("Indexing failed. Check console for details.");
            }
        } catch (error) {
            console.error("Index folder error", error);
        } finally {
            setIsIndexing(false);
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm(`Remove ${filename} from knowledge base?`)) return;

        try {
            const response = await fetch(`${baseUrl}/rag/documents/${filename}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchDocuments();
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className={`p-5 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5 ${userRole === 'GM' ? 'bg-white/5' : 'bg-gradient-to-br from-blue-900/10 to-cyan-900/5'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Database className="w-5 h-5" />
                    <h3 className="font-bold">{userRole === 'GM' ? 'Campaign Documents' : 'Knowledge Base (RAG)'}</h3>
                </div>
                <button
                    onClick={fetchDocuments}
                    className={`text-cyan-500/60 hover:text-cyan-400 transition-colors ${isLoading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Configuration Section (Admin Only) */}
                {userRole === 'Admin' && (
                    <div className="bg-black/20 rounded-lg p-3 border border-white/5 space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Chroma Persistence Folder</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={editPath}
                                onChange={(e) => setEditPath(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-slate-100 flex-1 outline-none focus:border-cyan-500/50"
                            />
                            <button
                                onClick={() => updateRagConfig(editPath)}
                                className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-[10px] font-bold hover:bg-cyan-500/30 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                )}

                {/* Indexing Section */}
                {userRole !== 'GM' && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleUpload}
                                disabled={isUploading || !isConnected}
                                className="hidden"
                                id="rag-upload"
                                accept=".txt,.md,.pdf"
                            />
                            <label
                                htmlFor="rag-upload"
                                className={`
                                    flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border border-dashed text-[10px] transition-all cursor-pointer text-center
                                    ${isUploading
                                        ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-500/50 cursor-wait'
                                        : 'bg-cyan-500/5 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50'}
                                `}
                            >
                                {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                <span>{isUploading ? 'Indexing...' : 'Upload File'}</span>
                            </label>
                        </div>

                        <button
                            onClick={handleIndexFolder}
                            disabled={isIndexing || !isConnected}
                            className={`
                                flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border border-dashed text-[10px] transition-all text-center
                                ${isIndexing
                                    ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-500/50 cursor-wait'
                                    : 'bg-purple-500/5 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50'}
                            `}
                        >
                            {isIndexing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FolderSearch className="w-4 h-4" />}
                            <span>{isIndexing ? 'Indexing Folder...' : 'Index Entire Folder'}</span>
                        </button>
                    </div>
                )}

                {/* Simple Add Doc for GM */}
                {userRole === 'GM' && (
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleUpload}
                            disabled={isUploading || !isConnected}
                            className="hidden"
                            id="rag-upload"
                            accept=".txt,.md,.pdf"
                        />
                        <label
                            htmlFor="rag-upload"
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all cursor-pointer text-xs"
                        >
                            {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                            <span>{isUploading ? 'Uploading...' : 'Add Campaign Document'}</span>
                        </label>
                    </div>
                )}


                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/10 text-center">
                        <div className="text-xl font-bold text-white font-mono">{documents.length}</div>
                        <div className="text-[10px] uppercase tracking-wider text-cyan-500/50 font-semibold">Indexed Sources</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/10 text-center">
                        <div className="text-xl font-bold text-white font-mono">
                            {documents.reduce((acc, doc) => acc + doc.chunks, 0)}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-cyan-500/50 font-semibold">Total Chunks</div>
                    </div>
                </div>

                {/* document List */}
                <div className="max-h-48 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    {documents.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 italic text-xs">
                            No documents indexed yet. Start by uploading custom lore or rulebooks.
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileText size={14} className="text-cyan-400/60" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs text-slate-200 truncate font-medium">{doc.filename}</span>
                                        <span className="text-[9px] text-slate-500">{doc.chunks} chunks • {new Date(doc.upload_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc.filename)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
