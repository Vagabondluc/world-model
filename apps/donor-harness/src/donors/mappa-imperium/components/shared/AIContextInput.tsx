import React from 'react';

interface AIContextInputProps {
    id?: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    elements?: unknown[];
    placeholder?: string;
    rows?: number;
    tooltip?: string;
    disabled?: boolean;
}

const AIContextInput: React.FC<AIContextInputProps> = ({ id, label, value, onChange, placeholder, rows }) => {
    return (
        <div className="mb-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows || 2}
                className="w-full p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};

export default AIContextInput;
