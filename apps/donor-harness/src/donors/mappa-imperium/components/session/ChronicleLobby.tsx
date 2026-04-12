
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface GameManifest {
    gameId: string;
    gameName: string;
    lastUpdate: string;
    nextPlayerUp: string;
    playerList: string[];
    currentEraStep: string;
    feedUrl: string;
}

const ChronicleLobby = () => {
    const { importFromFeed, backToSetup } = useGameStore();
    
    const [games, setGames] = useState<GameManifest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                // In a real deployment, this would be an absolute URL.
                // For local dev, we assume it's in the public folder.
                const response = await fetch('/chronicles/manifest.json');
                if (!response.ok) {
                    throw new Error(`Could not load manifest.json. Server responded with ${response.status}`);
                }
                const data = await response.json();
                if (!data.games || !Array.isArray(data.games)) {
                    throw new Error("Invalid manifest format: 'games' array not found.");
                }
                setGames(data.games);
            } catch (err) {
                console.error("Error fetching chronicle manifest:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchManifest();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    }
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center text-gray-500">Loading available chronicles...</div>;
        }

        if (error) {
            return (
                <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                    <p className="font-bold">Failed to Load Chronicle Lobby</p>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs mt-2">Ensure a valid `manifest.json` file exists in the `/public/chronicles/` directory.</p>
                </div>
            );
        }

        if (games.length === 0) {
            return <div className="text-center text-gray-500">No public chronicles found.</div>;
        }

        return (
            <div className="space-y-4">
                {games.map(game => (
                    <div key={game.gameId} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-amber-800">{game.gameName}</h3>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Players:</span> {game.playerList.join(', ')}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Current State:</span> {game.currentEraStep}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Last Update: {formatDate(game.lastUpdate)}
                            </p>
                        </div>
                        <div className="w-full md:w-auto text-left md:text-right">
                            <p className="text-sm font-semibold text-gray-700">Next Turn:</p>
                            <p className="text-amber-700 font-bold">{game.nextPlayerUp}</p>
                            <button 
                                onClick={() => importFromFeed(game.feedUrl)}
                                className={cn(componentStyles.button.base, componentStyles.button.primary, "bg-sky-700 hover:bg-sky-600 w-full mt-2")}
                            >
                                Load as Observer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={componentStyles.layout.centeredCard}>
            <div className={cn(componentStyles.card.page, "max-w-2xl")}>
                 <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">Chronicle Lobby</h1>
                <p className="text-center text-gray-600 mb-8">Browse and load publicly available Mappa Imperium games.</p>
                {renderContent()}
                <div className="mt-8 pt-4 border-t">
                    <button onClick={backToSetup} className={cn(componentStyles.button.base, componentStyles.button.secondary, "w-full")}>
                        &larr; Back to Setup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChronicleLobby;
