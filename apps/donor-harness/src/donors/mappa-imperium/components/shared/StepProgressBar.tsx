import React from 'react';

interface Step {
    id: string;
    title: string;
}

interface StepProgress {
    [key: string]: {
        completed: number;
        total: number;
    };
}

interface StepProgressBarProps {
    steps: Step[];
    currentStepId: string;
    stepProgress: StepProgress;
    onStepChange: (stepId: string) => void;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps, currentStepId, stepProgress, onStepChange }) => {
    return (
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {steps.map((step, index) => {
                const isActive = step.id === currentStepId;
                const progress = stepProgress[step.id];
                const isCompleted = progress && progress.completed >= progress.total;

                return (
                    <div
                        key={step.id}
                        className={`flex flex-col items-center min-w-[120px] cursor-pointer ${isActive ? 'text-amber-700 font-bold' : 'text-gray-500'}`}
                        onClick={() => onStepChange(step.id)}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${isActive ? 'border-amber-700 bg-amber-100' : isCompleted ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}>
                            {isCompleted ? '✓' : index + 1}
                        </div>
                        <span className="text-sm whitespace-nowrap">{step.title}</span>
                        {progress && (
                            <span className="text-xs text-gray-400 mt-1">{progress.completed}/{progress.total}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StepProgressBar;
