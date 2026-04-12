
import React, { useMemo, useState, useRef } from 'react';
import EraSelector from './EraSelector';
import PlayerStatus from './PlayerStatus';
import { useGameStore } from '../../stores/gameStore';
import { calculateCurrentYearForPlayer } from '../../utils/timelineCalculator';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { componentStyles } from '../../design/tokens';
import type { CurrentYearDisplay } from '../../types/progress.types';
import { cn } from '../../utils/cn';

const NavigationHeader = () => {
    const {
        viewedEraId,
        view,
        changeView,
        isDebugMode,
        exportGameData,
        exportChronicleFeed,
        gameSettings,
        elements,
        toggleSettingsModal,
        toggleDebugger,
        isTransitioning,
        currentPlayer
    } = useGameStore();

    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(exportMenuRef as React.RefObject<HTMLElement | null>, () => setIsExportMenuOpen(false));

    const currentYearDisplay: CurrentYearDisplay = useMemo(() => {
        return calculateCurrentYearForPlayer(viewedEraId, gameSettings, elements, currentPlayer);
    }, [viewedEraId, gameSettings, elements, currentPlayer]);


    return (
        <>
            <header className={componentStyles.header.main}>
                <div className="container mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold tracking-wider">Mappa Imperium</div>
                            <div className="flex flex-col">
                                <span className="text-xs text-amber-900/60 font-medium uppercase tracking-widest">Era {viewedEraId + 1}</span>
                                {currentYearDisplay && (
                                    <div className="text-sm font-bold text-amber-900">
                                        {currentYearDisplay}
                                    </div>
                                )}
                            </div>
                        </div>



                        <nav className={componentStyles.navigation.container}>
                            <button
                                onClick={() => changeView('eras')}
                                className={cn(componentStyles.navigation.button, view === 'eras' ? componentStyles.navigation.buttonActive : componentStyles.navigation.buttonInactive)}
                                aria-current={view === 'eras'}
                            >
                                Rulebook
                            </button>
                            <button
                                onClick={() => changeView('elements')}
                                className={cn(componentStyles.navigation.button, view === 'elements' ? componentStyles.navigation.buttonActive : componentStyles.navigation.buttonInactive)}
                                aria-current={view === 'elements'}
                            >
                                Element Manager
                            </button>
                            <button
                                onClick={() => changeView('map')}
                                className={cn(componentStyles.navigation.button, view === 'map' ? componentStyles.navigation.buttonActive : componentStyles.navigation.buttonInactive)}
                                aria-current={view === 'map'}
                            >
                                World Map
                            </button>
                        </nav>

                        <div className="flex items-center gap-4">
                            <PlayerStatus />

                            <div className="relative" ref={exportMenuRef}>
                                <button
                                    onClick={() => setIsExportMenuOpen(prev => !prev)}
                                    className={cn("hidden md:inline-flex items-center gap-2", componentStyles.button.primary, "!py-2 !px-3")}
                                    aria-haspopup="true"
                                    aria-expanded={isExportMenuOpen}
                                >
                                    Export
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isExportMenuOpen && (
                                    <div className={componentStyles.dropdown.menu} role="menu">
                                        <button
                                            role="menuitem"
                                            onClick={() => { exportGameData(); setIsExportMenuOpen(false); }}
                                            className={componentStyles.dropdown.item}
                                            title="Export a complete save file to continue your session later or pass the turn in a Play-by-Email game."
                                        >
                                            Save Game (.json)
                                        </button>
                                        <button
                                            role="menuitem"
                                            onClick={() => { exportChronicleFeed(); setIsExportMenuOpen(false); }}
                                            className={componentStyles.dropdown.item}
                                            title="Export a read-only snapshot of the world to be hosted online for others to observe."
                                        >
                                            Publish Feed (.json)
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={toggleSettingsModal}
                                className={cn(componentStyles.button.icon, "bg-amber-700 hover:bg-amber-600 focus:ring-amber-300 text-white")}
                                aria-label="Open Settings"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            {isDebugMode && (
                                <button
                                    onClick={toggleDebugger}
                                    className={cn(componentStyles.button.icon, "bg-red-600 hover:bg-red-500 focus:ring-red-300 text-white")}
                                    aria-label="Open Debug Menu"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    {view === 'eras' && (
                        <div className="w-full border-t border-amber-800/50 pt-3">
                            <EraSelector />
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-300/20 overflow-hidden">
                    {isTransitioning && <div className="h-full bg-amber-400 w-full animate-indeterminate-progress"></div>}
                </div>
            </header>
        </>
    );
};

export default NavigationHeader;