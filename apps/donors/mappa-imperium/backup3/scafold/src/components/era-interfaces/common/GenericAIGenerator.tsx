import React, { useState, useEffect } from 'react';
import { useAI } from '../../../contexts/AIContext';
import AIContextInput from '../../shared/AIContextInput';
import MarkdownRenderer from '../../shared/MarkdownRenderer';

interface GenericAIGeneratorProps {
    title: string;
    description: string;
    basePrompt: string;
}

const GenericAIGenerator = ({ title, description, basePrompt }: GenericAIGeneratorProps) => {
    const { result, isLoading, error, generate, clear, elements } = useAI();
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        // Clear previous results when the component/prompt changes
        return () => {
            clear();
        };
    }, [basePrompt, clear]);

    const handleGenerate = () => {
        generate(basePrompt, userInput);
    };

    const renderResult = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <span className="ml-3 text-gray-600">Generating narrative...</span>
                </div>
            );
        }
        if (error) {
            return <p className="text-red-600 p-4 bg-red-50 rounded-md">{error}</p>;
        }
        if (result) {
            return <MarkdownRenderer content={result} />;
        }
        return <p className="text-gray-500 text-center p-8">The AI's response will appear here.</p>;
    };

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">{title}</h2>
                <p className="mt-2 text-lg text-gray-600">{description}</p>
            </header>

            <div className="p-6 border rounded-lg bg-white shadow-sm space-y-6">
                <AIContextInput
                    id="ai-user-input"
                    label="Additional Context or Ideas (Optional)"
                    value={userInput}
                    onChange={setUserInput}
                    placeholder="Provide your own ideas, or paste an element's UUID to reference it..."
                    elements={elements}
                    rows={4}
                    tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    {isLoading ? 'Generating...' : '✨ Generate with AI'}
                </button>
            </div>

            <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-inner min-h-[200px]">
                <h3 className="text-2xl font-bold text-amber-900 mb-4 border-b pb-2">AI Generated Content</h3>
                {renderResult()}
            </div>
        </div>
    );
};

export default GenericAIGenerator;