import React from 'react';
import { useGameStore } from '../../../stores/gameStore';
import type { EraCreationContextType } from '@mi/types';
import MarkdownRenderer from '../../shared/MarkdownRenderer';
import AIContextInput from '../../shared/AIContextInput';
import AIGenerationSection from '../../shared/AIGenerationSection';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ErrorAlert from '../../shared/ErrorAlert';
import { componentStyles } from '../../../design/tokens';
import { cn } from '../../../utils/cn';

interface GeographyAdvicePanelProps {
    state: EraCreationContextType;
}

const GeographyAdvicePanel = ({ state }: GeographyAdvicePanelProps) => {
    const { landmassType, features, advice, isLoading, error, getAIAdvice, userInputAdvice, setState } = state;
    const { elements } = useGameStore();

    const isAdvisorDisabled = !landmassType || features.some(f => f.type === '' || f.landmassIndex === '');

    const renderAIAdvice = () => {
        if (isLoading) {
            return <LoadingSpinner message="Consulting the ancient cartographers..." />;
        }
        if (error) {
            return <ErrorAlert title="AI Error" message={error} />;
        }
        if (advice) {
             return <MarkdownRenderer content={advice} />;
        }
        return <p className="text-gray-500 text-center p-8">Configure your landmass and select features above to get holistic AI advice.</p>;
    };

    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm space-y-6">
             <AIGenerationSection title="Holistic Placement Advisor">
                 <AIContextInput
                    id="userInputAdvice"
                    label="Additional Ideas (Optional)"
                    value={userInputAdvice || ''}
                    onChange={(value) => setState({ userInputAdvice: value })}
                    placeholder="Inject your own ideas, or paste an element's UUID to reference it..."
                    elements={elements}
                    tooltip="Reference existing elements by copying their ID from the Element Manager and pasting it here. The AI will use them as context."
                />
                <button
                    onClick={getAIAdvice}
                    disabled={isLoading || isAdvisorDisabled}
                    title={isAdvisorDisabled ? "Please select a landmass and assign all 8 geography features first." : "Get AI placement advice"}
                    className={cn(componentStyles.button.base, componentStyles.button.primary, "w-full bg-blue-600 hover:bg-blue-700")}
                >
                    Get Holistic AI Advice
                </button>
                 <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-inner min-h-[200px]">
                    <h3 className="text-2xl font-bold text-amber-900 mb-4 border-b pb-2">AI Advice</h3>
                    {renderAIAdvice()}
                </div>
            </AIGenerationSection>
        </div>
    );
};

export default GeographyAdvicePanel;
