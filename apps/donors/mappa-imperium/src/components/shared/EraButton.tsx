import React from 'react';

interface EraButtonProps {
    label: string;
    isActive?: boolean;
    onClick: () => void;
    [key: string]: any;
}

const EraButton: React.FC<EraButtonProps> = ({ label, isActive, onClick, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded font-bold transition-colors ${isActive ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            {...props}
        >
            {label}
        </button>
    );
};

export default EraButton;
