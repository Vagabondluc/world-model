import React, { useState, useMemo } from 'react';
import type { ElementCard, Player, GameRole, AppSettings, Resource, Deity, Location, Faction, Settlement, Event, Character, War, Monument } from '../../types';
import ElementCardDisplay from './ElementCardDisplay';
import ElementListRow from './ElementListRow';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import ElementTimelineRow from './ElementTimelineRow';

interface ElementManagerProps {
    elements: ElementCard[];
    players: Player[];
    currentPlayer: Player | null;
    gameRole: GameRole;
    onUpdateElement: (element: ElementCard) => void;
    onDeleteElement: (elementId: string) => void;
    appSettings: AppSettings;
    onExportElementHtml: (element: ElementCard) => void;
    onExportMarkdown: (element: ElementCard) => void;
}

const ElementManager = ({ 
    elements, 
    players, 
    currentPlayer, 
    gameRole, 
    onUpdateElement, 
    onDeleteElement,
    appSettings,
    onExportElementHtml,
    onExportMarkdown
}: ElementManagerProps) => {
    const [modalElement, setModalElement] = useState<ElementCard | null>(null);
    const [isModalReadOnly, setIsModalReadOnly] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);

    // State for new features
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOwner, setFilterOwner] = useState('');
    const [filterEra, setFilterEra] = useState('');
    const [filterType, setFilterType] = useState('');
    
    const elementTypes = useMemo(() => Array.from(new Set(elements.map(el => el.type))), [elements]);
    const elementEras = useMemo(() => Array.from(new Set(elements.map(el => el.era))).sort((a,b) => a - b), [elements]);

    const filteredElements = useMemo(() => {
        const filtered = elements.filter(el => {
            const lowerSearch = searchTerm.toLowerCase();

            let searchableText = '';
            switch (el.type) {
                case 'Resource': searchableText = (el.data as Resource).properties; break;
                case 'Deity': searchableText = `${(el.data as Deity).description} ${(el.data as Deity).domain}`; break;
                case 'Location': searchableText = (el.data as Location).description; break;
                case 'Faction': 
                    const faction = el.data as Faction;
                    searchableText = `${faction.race} ${faction.theme} ${faction.leaderName} ${faction.symbolName} ${faction.description} ${faction.industry} ${faction.industryDescription}`;
                    break;
                case 'Settlement': 
                    const settlement = el.data as Settlement;
                    searchableText = `${settlement.purpose} ${settlement.description}`; 
                    break;
                case 'Event': searchableText = (el.data as Event).description; break;
                case 'Character': searchableText = (el.data as Character).description; break;
                case 'War': searchableText = (el.data as War).description; break;
                case 'Monument': searchableText = (el.data as Monument).description; break;
            }

            const searchMatch = lowerSearch === '' ||
                el.name.toLowerCase().includes(lowerSearch) ||
                el.type.toLowerCase().includes(lowerSearch) ||
                (searchableText && searchableText.toLowerCase().includes(lowerSearch));

            const ownerMatch = filterOwner === '' || el.owner === parseInt(filterOwner, 10);
            const eraMatch = filterEra === '' || el.era === parseInt(filterEra, 10);
            const typeMatch = filterType === '' || el.type === filterType;

            return searchMatch && ownerMatch && eraMatch && typeMatch;
        });

        if (viewMode === 'timeline') {
            return filtered.sort((a, b) => (a.createdYear || Infinity) - (b.createdYear || Infinity));
        }
        return filtered;
    }, [elements, searchTerm, filterOwner, filterEra, filterType, viewMode]);

    const handleOpenModal = (element: ElementCard, readOnly: boolean) => {
        setModalElement(element);
        setIsModalReadOnly(readOnly);
    };

    const handleCloseModal = () => {
        setModalElement(null);
    };

    const handleSaveEdit = (updatedElement: ElementCard) => {
        onUpdateElement(updatedElement);
        handleCloseModal();
    };

    const handleDelete = (elementId: string, elementName: string) => {
        setConfirmDelete({ id: elementId, name: elementName });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            onDeleteElement(confirmDelete.id);
            setConfirmDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="mb-6">
                <h1 className="text-4xl font-extrabold text-amber-900">Element Manager</h1>
                <p className="mt-2 text-lg text-gray-600">Browse, search, and manage all the elements of your world.</p>
            </header>
            
            {/* Filter and View Controls */}
            <div className="filter-bar">
                <div className="flex-grow w-full">
                    <input
                        type="search"
                        placeholder="Search by name, type, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-base"
                    />
                </div>
                <div className="flex-shrink-0 flex items-center gap-4 flex-wrap">
                    <select
                        value={filterOwner}
                        onChange={(e) => setFilterOwner(e.target.value)}
                        className="input-base"
                        aria-label="Filter by owner"
                    >
                        <option value="">All Owners</option>
                        {players.map(p => <option key={p.playerNumber} value={p.playerNumber}>{p.name}</option>)}
                    </select>
                    <select
                        value={filterEra}
                        onChange={(e) => setFilterEra(e.target.value)}
                        className="input-base"
                         aria-label="Filter by era"
                    >
                        <option value="">All Eras</option>
                        {elementEras.map(era => <option key={era} value={era}>Era {era}</option>)}
                    </select>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="input-base"
                         aria-label="Filter by type"
                    >
                        <option value="">All Types</option>
                        {elementTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <div className="toggle-group">
                        <button onClick={() => setViewMode('grid')} className={`toggle-btn ${viewMode === 'grid' ? 'toggle-btn-active' : ''}`} aria-label="Grid View">Grid</button>
                        <button onClick={() => setViewMode('list')} className={`toggle-btn ${viewMode === 'list' ? 'toggle-btn-active' : ''}`} aria-label="List View">List</button>
                        <button onClick={() => setViewMode('timeline')} className={`toggle-btn ${viewMode === 'timeline' ? 'toggle-btn-active' : ''}`} aria-label="Timeline View">Timeline</button>
                    </div>
                </div>
            </div>

            {/* Element Display */}
            <div className="flex-grow">
                {filteredElements.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                        <h2 className="text-xl font-semibold">No elements match your filters.</h2>
                        <p>Try adjusting your search or filter settings.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredElements.map(card => (
                                    <ElementCardDisplay
                                        key={card.id}
                                        card={card}
                                        ownerName={players.find(p => p.playerNumber === card.owner)?.name || `Player ${card.owner}`}
                                        currentPlayer={currentPlayer}
                                        gameRole={gameRole}
                                        onEdit={(el) => handleOpenModal(el, false)}
                                        onView={(el) => handleOpenModal(el, true)}
                                        onDelete={handleDelete}
                                        onExportHtml={onExportElementHtml}
                                        onExportMarkdown={onExportMarkdown}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === 'list' && (
                            <div className="space-y-3">
                                {filteredElements.map(card => (
                                    <ElementListRow
                                        key={card.id}
                                        card={card}
                                        ownerName={players.find(p => p.playerNumber === card.owner)?.name || `Player ${card.owner}`}
                                        currentPlayer={currentPlayer}
                                        gameRole={gameRole}
                                        onEdit={(el) => handleOpenModal(el, false)}
                                        onView={(el) => handleOpenModal(el, true)}
                                        onDelete={handleDelete}
                                        onExportHtml={onExportElementHtml}
                                        onExportMarkdown={onExportMarkdown}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === 'timeline' && (
                            <div className="space-y-3">
                                {filteredElements.map(card => (
                                    <ElementTimelineRow
                                        key={card.id}
                                        card={card}
                                        ownerName={players.find(p => p.playerNumber === card.owner)?.name || `Player ${card.owner}`}
                                        currentPlayer={currentPlayer}
                                        gameRole={gameRole}
                                        onEdit={(el) => handleOpenModal(el, false)}
                                        onView={(el) => handleOpenModal(el, true)}
                                        onDelete={handleDelete}
                                        onExportHtml={onExportElementHtml}
                                        onExportMarkdown={onExportMarkdown}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalElement && (
                <EditElementModal
                    element={modalElement}
                    isOpen={!!modalElement}
                    onClose={handleCloseModal}
                    onSave={handleSaveEdit}
                    isReadOnly={isModalReadOnly}
                />
            )}
            {confirmDelete && (
                <ConfirmationModal
                    isOpen={!!confirmDelete}
                    onClose={() => setConfirmDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                    message={<>Are you sure you want to permanently delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</>}
                    confirmText="Delete"
                    confirmButtonClass="btn-destructive"
                />
            )}
        </div>
    );
};

// FIX: Add default export to fix import error.
export default ElementManager;