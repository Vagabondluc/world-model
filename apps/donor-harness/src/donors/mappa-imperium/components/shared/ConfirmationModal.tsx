import React, { ReactNode } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: ReactNode;
    confirmText?: string;
    confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmButtonClass = 'bg-red-600'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <div className="mb-6 text-gray-700">{message}</div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                    <button onClick={onConfirm} className={`px-4 py-2 text-white rounded hover:opacity-90 ${confirmButtonClass}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
