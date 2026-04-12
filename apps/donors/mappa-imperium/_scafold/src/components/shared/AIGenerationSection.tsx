import React from 'react';

interface AIGenerationSectionProps {
    title: string;
    children: React.ReactNode;
}

const AIGenerationSection = ({ title, children }: AIGenerationSectionProps) => {
    return (
        <details className="group pt-4 border-t">
            <summary className="text-lg font-bold text-amber-900 cursor-pointer list-none flex justify-between items-center">
                <div>
                    <span>✨ {title}</span>
                    <span className="text-sm font-normal text-gray-500 ml-2 group-hover:text-gray-700 italic">(click to expand)</span>
                </div>
                <span className="text-sm text-gray-500 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="ai-content-wrapper">
                <div className="ai-content-inner">
                    <div className="mt-4 space-y-4 pt-4 border-t">
                        {children}
                    </div>
                </div>
            </div>
        </details>
    );
};

export default AIGenerationSection;