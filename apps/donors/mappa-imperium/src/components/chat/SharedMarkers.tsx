import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';
import { Trash2, MapPin, Plus } from 'lucide-react';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

const SharedMarkers = () => {
    const { lobbyState, addMarker, deleteMarker } = useGameStore();
    const { markers } = lobbyState;
    const [newLabel, setNewLabel] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel.trim()) return;

        // Mock current view position - in real app would get from map viewport
        addMarker({
            position: { q: 0, r: 0 },
            label: newLabel,
            color: '#ef4444'
        });
        setNewLabel('');
    };

    return (
        <div className="flex-1 flex flex-col bg-stone-50 h-full">
            <div className="p-3 border-b border-stone-200">
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        placeholder="New Marker Label..."
                        className={cn(componentStyles.input.base, "flex-1 text-sm py-1")}
                    />
                    <Button type="submit" size="sm" variant="primary" disabled={!newLabel.trim()}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {markers.length === 0 && (
                    <div className="text-center text-stone-400 text-xs mt-4">No shared markers yet.</div>
                )}
                {markers.map(marker => (
                    <div key={marker.id} className="bg-white p-2 rounded shadow-sm border border-stone-100 flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <div>
                                <div className="text-sm font-medium text-stone-800">{marker.label}</div>
                                <div className="text-[10px] text-stone-500">
                                    Creator ID: {marker.creatorId.substring(0, 6)} • ({marker.position.q}, {marker.position.r})
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => deleteMarker(marker.id)}
                            className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SharedMarkers;
