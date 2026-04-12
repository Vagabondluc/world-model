
import React, { useState, useEffect } from 'react';
import type { ElementCard } from '../../types';
import ConfirmationModal from './ConfirmationModal';
import { ResourceForm } from './edit-forms/ResourceForm';
import { DeityForm } from './edit-forms/DeityForm';
import { LocationForm } from './edit-forms/LocationForm';
import { FactionForm } from './edit-forms/FactionForm';
import { SettlementForm } from './edit-forms/SettlementForm';
import { GenericDescriptionForm } from './edit-forms/GenericDescriptionForm';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface EditElementModalProps {
    element: ElementCard;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedElement: ElementCard) => void;
    isReadOnly?: boolean;
}

const EditElementModal = ({ element, isOpen, onClose, onSave, isReadOnly = false }: EditElementModalProps) => {
    const [name, setName] = useState(element.name);
    const [data, setData] = useState(element.data);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    
    useEffect(() => {
        setName(element.name);
        setData(element.data);
    }, [element]);

    if (!isOpen) return null;

    const handleDataChange = (newData: Partial<ElementCard['data']>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const handleConfirmSave = () => {
        const updatedElement: ElementCard = { ...element, name, data };
        onSave(updatedElement);
        setIsConfirmOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;
        setIsConfirmOpen(true);
    };

    const renderForm = () => {
        const props = { data: data as any, onDataChange: handleDataChange, isReadOnly };
        switch (element.type) {
            case 'Resource': return <ResourceForm {...props} />;
            case 'Deity': return <DeityForm {...props} />;
            case 'Location': return <LocationForm {...props} />;
            case 'Faction': return <FactionForm {...props} />;
            case 'Settlement': return <SettlementForm {...props} />;
            case 'Event':
            case 'War':
            case 'Monument':
            case 'Character':
                return <GenericDescriptionForm {...props} />;
            default: return <div>Form not implemented for this type.</div>;
        }
    };

    return (
        <>
            <div className={componentStyles.modal.overlay} aria-modal="true" role="dialog">
                <div className={componentStyles.modal.content}>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-amber-800 mb-2">{isReadOnly ? 'View' : 'Edit'} {element.type}</h2>
                        {element.creationStep && <p className="text-sm text-gray-500 mb-4">Created during: <strong>{element.creationStep}</strong></p>}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="editElementName" className={componentStyles.form.label}>Name</label>
                                <input type="text" id="editElementName" value={name} onChange={(e) => setName(e.target.value)} className={componentStyles.input.base} required disabled={isReadOnly} />
                            </div>
                            {renderForm()}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={onClose} className={cn(componentStyles.button.base, componentStyles.button.secondary)}>
                                {isReadOnly ? 'Close' : 'Cancel'}
                            </button>
                            {!isReadOnly && <button type="submit" className={cn(componentStyles.button.base, componentStyles.button.primary)}>Save Changes</button>}
                        </div>
                    </form>
                </div>
            </div>
            {!isReadOnly && <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmSave} title="Confirm Changes" message="Are you sure you want to save these changes?" confirmText="Save" />}
        </>
    );
};

export default EditElementModal;
