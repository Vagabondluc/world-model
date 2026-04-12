import React from 'react';

interface ReferenceTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const ReferenceTableModal = ({ isOpen, onClose, title, content }: ReferenceTableModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-2xl max-w-4xl w-[90%] m-4 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 pb-4 border-b flex-shrink-0">
                    <h3 className="text-2xl font-bold text-amber-800">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-800 text-3xl leading-none font-bold"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div 
                    className="max-h-[70vh] overflow-y-auto pr-2" 
                    dangerouslySetInnerHTML={{ __html: content }} 
                />
            </div>
        </div>
    );
};

export default ReferenceTableModal;