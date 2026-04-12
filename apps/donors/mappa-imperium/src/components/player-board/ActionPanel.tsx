import { useGameStore } from '../../stores/gameStore';
import { Sword, Handshake, ScrollText, Flag } from 'lucide-react';

const ActionPanel = () => {
    const { currentPlayer, isTransitioning, sendChatMessage } = useGameStore();

    const handleAction = (actionId: string) => {
        // Find the action label for better logging
        const actionLabel = actionCategories.flatMap(c => c.actions).find(a => a.id === actionId)?.label || actionId;

        sendChatMessage(`triggered action: **${actionLabel}**`, 'action');

        // TODO: Dispatch specific game logic actions here
        // For now, the chat log serves as visual feedback
    };

    if (!currentPlayer) return <div className="p-4 text-gray-500">Please select a player.</div>;

    const actionCategories = [
        {
            title: "Phase Actions",
            icon: <Flag className="w-4 h-4 text-amber-500" />,
            actions: [
                { id: 'plan', label: 'Planning Phase', desc: 'Set your intentions for the turn' },
                { id: 'execute', label: 'Execute Orders', desc: 'Resolve pending moves' },
            ]
        },
        {
            title: "Diplomacy",
            icon: <Handshake className="w-4 h-4 text-blue-400" />,
            actions: [
                { id: 'trade', label: 'Offer Trade', desc: 'Exchange resources with others' },
                { id: 'treaty', label: 'Propose Treaty', desc: 'Form alliances or non-aggression pacts' },
            ]
        },
        {
            title: "Military",
            icon: <Sword className="w-4 h-4 text-red-500" />,
            actions: [
                { id: 'muster', label: 'Muster Forces', desc: 'Raise armies from settlements' },
            ]
        }
    ];

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 h-full border border-gray-700 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
                <ScrollText className="w-5 h-5" />
                Player Actions
            </h3>

            <div className="space-y-6">
                {actionCategories.map((category) => (
                    <div key={category.title}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-gray-700 pb-1">
                            {category.icon}
                            {category.title}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {category.actions.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => handleAction(action.id)}
                                    disabled={isTransitioning}
                                    className="group flex flex-col items-start w-full bg-gray-700/40 hover:bg-gray-700 p-2.5 rounded border border-gray-600/30 hover:border-gray-500 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="font-bold text-sm text-gray-200 group-hover:text-amber-400 transition-colors">
                                        {action.label}
                                    </span>
                                    <span className="text-[10px] text-gray-500 group-hover:text-gray-400">
                                        {action.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-3 bg-blue-900/20 border border-blue-900/50 rounded text-xs text-blue-200">
                <p><strong>Note:</strong> Some actions may be unavailable depending on the current Era or Game Phase.</p>
            </div>
        </div>
    );
};

export default ActionPanel;
