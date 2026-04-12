import React from 'react';
import type { ElementCard } from '@mi/types';

interface EraLayoutContainerProps {
    eraName: string;
    eraIcon: string;
    eraDescription: string;
    rulesComponent: React.ReactNode;
    gameplayComponent: React.ReactNode;
    sidebarTitle: string;
    sidebarElements: ElementCard[];
    elementsForContext?: ElementCard[];
    onEditElement?: (element: ElementCard) => void;
    onDeleteElement?: (id: string, name: string) => void;
    onExportHtml?: (element: ElementCard) => void;
    onExportMarkdown?: (element: ElementCard) => void;
    fullWidthContent?: React.ReactNode;
}

const EraLayoutContainer: React.FC<EraLayoutContainerProps> = ({
    eraName, eraIcon, eraDescription, rulesComponent, gameplayComponent, sidebarTitle, sidebarElements, fullWidthContent
}) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Main Content */}
            <div className="flex-grow overflow-y-auto p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <span>{eraIcon}</span>
                        {eraName}
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">{eraDescription}</p>
                </header>

                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Rules of the Era</h2>
                    {rulesComponent}
                </div>

                <div className="bg-gray-50 rounded-lg shadow-inner p-6">
                    {gameplayComponent}
                </div>

                {fullWidthContent && (
                    <div className="mt-8">
                        {fullWidthContent}
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l bg-white flex flex-col shadow-lg">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-gray-700">{sidebarTitle}</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {sidebarElements.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No elements created yet.</p>
                    ) : (
                        sidebarElements.map(el => (
                            <div key={el.id} className="p-3 border rounded shadow-sm hover:shadow transition-shadow">
                                <h4 className="font-bold text-sm">{el.name}</h4>
                                <p className="text-xs text-gray-500">{el.type}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EraLayoutContainer;
