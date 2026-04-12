
import React, { useState } from 'react';
import type { ElementCard, Player, GameRole, AppSettings } from '@mi/types';
import ElementCardDisplay from './ElementCardDisplay';
import ElementListRow from './ElementListRow';
import EditElementModal from '../shared/EditElementModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import ElementTimelineRow from './ElementTimelineRow';
import { useElementFilters } from './hooks/useElementFilters';
import ElementFilterBar from './ElementFilterBar';

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
    onExportElementHtml,
    onExportMarkdown
}: ElementManagerProps) => {
    const [modalElement, setModalElement] = useState<ElementCard | null>(null);
    const [isModalReadOnly, setIsModalReadOnly] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);

    const {
        viewMode, setViewMode,
        searchTerm, setSearchTerm,
        filterOwner, setFilterOwner,
        filterEra, setFilterEra,
        filterType, setFilterType,
        filteredElements,
        elementTypes,
        elementEras
    } = useElementFilters(elements);

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

    const CommonRowProps = {
        ownerName: (card: ElementCard) => players.find(p => p.playerNumber === card.owner)?.name || `Player ${card.owner}`,
        currentPlayer,
        gameRole,
        onEdit: (el: ElementCard) => handleOpenModal(el, false),
        onView: (el: ElementCard) => handleOpenModal(el, true),
        onDelete: handleDelete,
        onExportHtml: onExportElementHtml,
        onExportMarkdown: onExportMarkdown
    };

    return (
        <div className="flex flex-col h-full">
            <header className="mb-6">
                <h1 className="text-4xl font-extrabold text-amber-900">Element Manager</h1>
                <p className="mt-2 text-lg text-gray-600">Browse, search, and manage all the elements of your world.</p>
            </header>
            
            <ElementFilterBar
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                filterOwner={filterOwner} setFilterOwner={setFilterOwner}
                filterEra={filterEra} setFilterEra={setFilterEra}
                filterType={filterType} setFilterType={setFilterType}
                viewMode={viewMode} setViewMode={setViewMode}
                players={players}
                elementEras={elementEras}
                elementTypes={elementTypes}
            />

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
                                        {...CommonRowProps}
                                        card={card}
                                        ownerName={CommonRowProps.ownerName(card)}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === 'list' && (
                            <div className="space-y-3">
                                {filteredElements.map(card => (
                                    <ElementListRow
                                        key={card.id}
                                        {...CommonRowProps}
                                        card={card}
                                        ownerName={CommonRowProps.ownerName(card)}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === 'timeline' && (
                            <div className="space-y-3">
                                {filteredElements.map(card => (
                                    <ElementTimelineRow
                                        key={card.id}
                                        {...CommonRowProps}
                                        card={card}
                                        ownerName={CommonRowProps.ownerName(card)}
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

export default ElementManager;
