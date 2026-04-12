import { useGameStore } from '../../stores/gameStore';
import { Settlement } from '@mi/types';
import { Building, Users, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

const SettlementPanel = () => {
    const { elements, selectedElementId } = useGameStore();

    const selectedSettlement = elements.find(el => el.id === selectedElementId && el.type === 'Settlement');

    if (!selectedSettlement) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-4 h-full border border-gray-700 flex items-center justify-center text-gray-500 italic text-center">
                Select a settlement on the map to view details.
            </div>
        );
    }

    const data = selectedSettlement.data as Settlement;

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 h-full border border-gray-700 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-700">
                <div>
                    <h3 className="text-xl font-bold text-amber-500 truncate">{selectedSettlement.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                        <span className={cn("px-1.5 py-0.5 rounded bg-gray-700",
                            data.purpose === 'Capital' ? 'text-yellow-400 border border-yellow-900' : 'text-gray-300'
                        )}>
                            {data.purpose}
                        </span>
                        {/* Mock Tier if not in data, or extend Settlement type later */}
                        {/* <span className="text-gray-500">•</span> */}
                        {/* <span>Tier 1</span> */}
                    </div>
                </div>
                <div className="bg-gray-700 p-2 rounded-lg">
                    <Building className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-900/60 p-2 rounded flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Populace</div>
                        <div className="font-mono font-bold text-gray-200">1,250</div>
                    </div>
                </div>
                <div className="bg-gray-900/60 p-2 rounded flex items-center gap-3">
                    <Activity className="w-4 h-4 text-green-400" />
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Growth</div>
                        <div className="font-mono font-bold text-gray-200">+12%</div>
                    </div>
                </div>
            </div>

            {/* Buildings List or Description */}
            <div className="space-y-4">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/30 p-2 rounded border border-gray-700/50">
                        {data.description || "No description available."}
                    </p>
                </div>

                {data.notes && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
                        <p className="text-sm text-gray-400 italic">
                            {data.notes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettlementPanel;
