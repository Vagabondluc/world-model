import React, { useState } from 'react';
import type { ElementCard } from '../../../types';
import ElementCardRenderer from '../../shared/ElementCardRenderer';

interface EraLayoutContainerProps {
    eraName: string;
    eraIcon: string;
    eraDescription: string;
    rulesComponent: React.ReactNode;
    gameplayComponent: React.ReactNode; // This now includes the steps and form
    fullWidthContent?: React.ReactNode; // New prop for content below the grid
    sidebarTitle: string;
    sidebarElements: ElementCard[];
    elementsForContext: ElementCard[];
    onEditElement: (element: ElementCard) => void;
    onDeleteElement: (id: string, name: string) => void;
    onExportHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const EraLayoutContainer = ({
    eraName,
    eraIcon,
    eraDescription,
    rulesComponent,
    gameplayComponent,
    fullWidthContent,
    sidebarTitle,
    sidebarElements,
    elementsForContext,
    onEditElement,
    onDeleteElement,
    onExportHtml,
    onExportMarkdown,
}: EraLayoutContainerProps) => {
    const [activeTab, setActiveTab] = useState('gameplay');

    const tabButtonClasses = "px-6 py-3 font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none";
    const activeTabClasses = "bg-white text-amber-800 shadow-md";
    const inactiveTabClasses = "bg-amber-100 hover:bg-amber-200/80 text-amber-700";

    const GameplayView = () => (
        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
                {gameplayComponent}
            </div>
            <aside className="md:col-span-1 space-y-4 md:sticky top-28 h-fit">
                <h3 className="text-2xl font-bold text-amber-900 border-b pb-2">{sidebarTitle}</h3>
                {sidebarElements.length > 0 ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {sidebarElements.map(el => (
                            <ElementCardRenderer
                                key={el.id}
                                element={el}
                                elements={elementsForContext}
                                onEdit={onEditElement}
                                onDelete={onDeleteElement}
                                onExportHtml={onExportHtml}
                                onExportMarkdown={onExportMarkdown}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Elements you create will appear here.</p>
                    </div>
                )}
            </aside>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="border-b border-amber-200 bg-amber-50 rounded-t-lg p-4 pt-6 relative bottom-[-32px]">
                <nav className="flex gap-2 px-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('rules')} className={`${tabButtonClasses} ${activeTab === 'rules' ? activeTabClasses : inactiveTabClasses}`}>Rules</button>
                    <button onClick={() => setActiveTab('gameplay')} className={`${tabButtonClasses} ${activeTab === 'gameplay' ? activeTabClasses : inactiveTabClasses}`}>Gameplay</button>
                </nav>
            </div>

            <div className="pt-8">
                {activeTab === 'rules' && <div className="space-y-8">{rulesComponent}</div>}
                {activeTab === 'gameplay' && gameplayComponent && (
                    <>
                        <GameplayView />
                        {fullWidthContent && (
                            <div className="mt-8">
                                {fullWidthContent}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EraLayoutContainer;