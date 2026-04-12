import React from 'react';
import { useGameStore } from '../../stores/gameStore';

// This is a placeholder. Cursors are mainly visualized on the map itself.
// But we might want a list of who is active in this panel.
const SharedCursors = () => {
    const { lobbyState } = useGameStore();
    const { cursors } = lobbyState;

    const activeUserCount = Object.keys(cursors).length;

    if (activeUserCount === 0) return null;

    return (
        <div className="p-2 border-t border-stone-200 bg-stone-100 text-[10px] text-stone-500 flex gap-2 overflow-x-auto">
            <span className="font-semibold">Cursors:</span>
            {Object.entries(cursors).map(([id, cursor]) => (
                <span key={id} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cursor.color }}></span>
                    {id}
                </span>
            ))}
        </div>
    );
};

export default SharedCursors;
