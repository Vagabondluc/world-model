import React from 'react';

interface AIGenerationSectionProps {
    title: string;
    children: React.ReactNode;
}

const AIGenerationSection: React.FC<AIGenerationSectionProps> = ({ title, children }) => {
    return (
        <div className="border border-indigo-200 rounded p-4 bg-indigo-50/50">
            <h3 className="text-sm font-bold text-indigo-800 mb-2 uppercase tracking-wide">{title}</h3>
            {children}
        </div>
    );
};

export default AIGenerationSection;
