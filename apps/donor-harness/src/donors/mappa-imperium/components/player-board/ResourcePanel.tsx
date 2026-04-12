import React, { useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Resource } from '@mi/types';
import type { ResourceTotals } from '../../types/progress.types';
import { calculateResourceTotals } from '../../utils/progressUtils';
import { RefreshCw } from 'lucide-react';

const ResourcePanel = () => {
    const { elements, currentPlayer } = useGameStore();

    const resources: ResourceTotals = useMemo(() => {
        if (!currentPlayer) return {};

        const playerResources = elements.filter(
            el => el.type === 'Resource' && el.owner === currentPlayer.playerNumber
        );

        // Initialize with core resources guaranteed to exist in UI
        const totals: ResourceTotals = {
            'Gold': 100, // Base income
            'Food': 50,  // Base supply
            'Mana': 0,
            'Iron': 0,   // Base iron
        };

        playerResources.forEach(res => {
            const data = res.data as Resource;
            const type = data.type;

            // Logic: 
            // 1. If it's a known type, it contributes to base resources
            // 2. If it's 'other' or has a custom name, it creates a new resource entry

            switch (type) {
                case 'mineral':
                    totals['Gold'] = (totals['Gold'] || 0) + 10;
                    totals['Iron'] = (totals['Iron'] || 0) + 5;
                    break;
                case 'flora':
                case 'fauna':
                    totals['Food'] = (totals['Food'] || 0) + 10;
                    break;
                case 'magical':
                    totals['Mana'] = (totals['Mana'] || 0) + 5;
                    break;
                case 'other':
                default:
                    // For custom resources, use the resource Name as the key
                    // e.g. "Darksteel" -> totals["Darksteel"] += 1
                    const resourceName = data.name;
                    // Simple logic: Each card is 1 unit, or we could parse properties
                    // For now, let's assume 1 unit per card + 10 value if abstract
                    // Let's just create the entry if it doesn't exist
                    totals[resourceName] = (totals[resourceName] || 0) + 1;
                    break;
            }
        });

        return totals;

    }, [elements, currentPlayer]);

    const resourceCards = useMemo(() => {
        if (!currentPlayer) return [];
        return elements.filter(el => el.type === 'Resource' && el.owner === currentPlayer.playerNumber);
    }, [elements, currentPlayer]);

    if (!currentPlayer) return <div className="p-4 text-gray-500">Please select a player.</div>;

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 h-full border border-gray-700 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
                Items & Resources
                <span className="text-xs font-normal text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full ml-auto">
                    {resourceCards.length} Cards
                </span>
            </h3>

            {/* Resource Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {Object.entries(resources).map(([name, value]) => {
                    // Determine color based on name/type logic for visual flair
                    let colorClass = "text-gray-300";
                    let borderClass = "border-gray-700/30";

                    const lowerName = name.toLowerCase();
                    if (lowerName === 'gold') { colorClass = "text-yellow-500"; borderClass = "border-yellow-900/30"; }
                    else if (lowerName === 'food') { colorClass = "text-green-500"; borderClass = "border-green-900/30"; }
                    else if (lowerName === 'mana') { colorClass = "text-purple-500"; borderClass = "border-purple-900/30"; }
                    else if (lowerName === 'iron') { colorClass = "text-slate-400"; borderClass = "border-slate-600/30"; }
                    else { colorClass = "text-blue-400"; borderClass = "border-blue-900/30"; } // Default for custom

                    return (
                        <div key={name} className={`bg-gray-900/80 p-3 rounded-lg border ${borderClass} flex flex-col items-center`}>
                            <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 truncate max-w-full px-2">{name}</span>
                        </div>
                    );
                })}
            </div>

            {/* Income breakdown (Mock) */}
            <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> Income Sources
                </h4>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Base Income</span>
                        <span className="text-yellow-500 font-mono">+100</span>
                    </div>
                    {resourceCards.length > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Resource Cards ({resourceCards.length})</span>
                            <span className="text-yellow-500 font-mono">+{resourceCards.length * 10}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Resource Cards List */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Developed Resources</h4>
                {resourceCards.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No resources developed yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {resourceCards.map(card => {
                            const data = card.data as Resource;
                            return (
                                <div key={card.id} className="flex items-center gap-3 bg-gray-700/40 p-2 rounded border border-gray-600/50 hover:bg-gray-700/60 transition-colors">
                                    <div className="text-xl w-8 h-8 flex items-center justify-center bg-gray-800 rounded shadow-sm">
                                        {data.symbol}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="font-bold text-sm text-gray-200 truncate">{card.name}</div>
                                        <div className="text-xs text-gray-400 capitalize">{data.type}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcePanel;
