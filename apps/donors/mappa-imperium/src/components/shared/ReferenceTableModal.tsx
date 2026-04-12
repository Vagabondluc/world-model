import React from 'react';

const ReferenceTableModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">
                <h3>Reference Table</h3>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ReferenceTableModal;
