import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';
import { Trash2, FileText, Plus } from 'lucide-react';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

const SharedNotes = () => {
    const { lobbyState, addNote, deleteNote } = useGameStore();
    const { notes } = lobbyState;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addNote({
            title,
            content
        });
        setTitle('');
        setContent('');
        setIsAdding(false);
    };

    return (
        <div className="flex-1 flex flex-col bg-stone-50 h-full">
            <div className="p-3 border-b border-stone-200">
                {!isAdding ? (
                    <Button onClick={() => setIsAdding(true)} variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1">
                        <Plus className="w-3 h-3" /> Add Note
                    </Button>
                ) : (
                    <form onSubmit={handleAdd} className="space-y-2 bg-white p-2 rounded border border-stone-200">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Title..."
                            className={cn(componentStyles.input.base, "w-full text-sm py-1")}
                            autoFocus
                        />
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Content..."
                            className={cn(componentStyles.input.base, "w-full text-xs py-1 h-16 resize-none")}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" size="sm" variant="primary" className="flex-1" disabled={!title.trim()}>Save</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="flex-1">Cancel</Button>
                        </div>
                    </form>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {notes.length === 0 && !isAdding && (
                    <div className="text-center text-stone-400 text-xs mt-4">No shared notes yet.</div>
                )}
                {notes.map(note => (
                    <div key={note.id} className="bg-yellow-50 p-2 rounded shadow-sm border border-yellow-200 group relative">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-3 h-3 text-yellow-600" />
                            <div className="text-sm font-bold text-yellow-900">{note.title}</div>
                        </div>
                        <div className="text-xs text-stone-700 whitespace-pre-wrap">{note.content}</div>

                        <button
                            onClick={() => deleteNote(note.id)}
                            className="absolute top-2 right-2 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SharedNotes;
