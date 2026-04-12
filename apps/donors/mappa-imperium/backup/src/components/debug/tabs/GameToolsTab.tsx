import React, { useState } from 'react';
import { Play, SkipForward, Download, Upload, RefreshCw } from 'lucide-react';
import type { UnifiedDebugSystemProps } from '../types/debugTypes';

const GameToolsTab: React.FC<Omit<UnifiedDebugSystemProps, 'isOpen' | 'onClose' | 'isDebugMode' | 'currentEraId' | 'completedEras' >> = ({
    onPrepopulateEra,
    onUnlockAllEras,
    onExportGameData,
    onImportGameData,
    onClearAllData,
    players,
}) => {
    const [selectedPlayerNumber, setSelectedPlayerNumber] = useState(0);

    return (
        <div className="space-y-6">
            <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-900">Era Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <button onClick={onUnlockAllEras} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                            <SkipForward className="w-4 h-4" />Unlock All Eras
                        </button>
                    </div>
                    <div>
                        <h5 className="font-medium mb-2 text-gray-900">Data Population</h5>
                        <div className="mb-2">
                            <select value={selectedPlayerNumber} onChange={(e) => setSelectedPlayerNumber(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900">
                                <option value="0">All Players</option>
                                {players.map(p => (<option key={p.playerNumber} value={p.playerNumber}>{p.name}</option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(era => (
                                <button 
                                    key={era} 
                                    onClick={() => onPrepopulateEra(era, selectedPlayerNumber)} 
                                    className="w-full bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm flex items-center justify-center gap-1"
                                    title={`Prepopulate Era ${era} (Backfills previous eras)`}
                                >
                                    <Play className="w-3 h-3" />E{era}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-900">Data Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={onExportGameData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />Export Game
                    </button>
                    <button onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) onImportGameData(file);
                        };
                        input.click();
                    }} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />Import Game
                    </button>
                    <button onClick={onClearAllData} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" />Clear Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameToolsTab;