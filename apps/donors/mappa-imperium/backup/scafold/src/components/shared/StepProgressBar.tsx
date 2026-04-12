import React from 'react';

interface Step {
    id: string;
    title: string;
}

interface StepProgress {
    completed: number;
    total: number;
}

interface StepProgressBarProps {
    steps: Step[];
    currentStepId: string;
    stepProgress: Record<string, StepProgress>;
    onStepChange: (stepId: string) => void;
}

type StepStatus = 'completed' | 'current' | 'available' | 'locked';

const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps, currentStepId, stepProgress, onStepChange }) => {

    const getStatus = (stepId: string): StepStatus => {
        const progress = stepProgress[stepId] || { completed: 0, total: 1 };
        const isComplete = progress.total > 0 && progress.completed >= progress.total;

        if (currentStepId === stepId) return 'current';
        if (isComplete) return 'completed';

        const stepOrder = steps.map(s => s.id);
        const stepIndex = stepOrder.indexOf(stepId);

        for (let i = 0; i < stepIndex; i++) {
            const prevStepId = stepOrder[i];
            const prevProgress = stepProgress[prevStepId] || { completed: 0, total: 1 };
            if (prevProgress.completed < prevProgress.total) {
                return 'locked';
            }
        }
        
        return 'available';
    };

    const { totalCompleted, totalTasks } = React.useMemo(() => {
        return steps.reduce((acc, step) => {
            const progress = stepProgress[step.id] || { completed: 0, total: 0 };
            acc.totalCompleted += progress.completed;
            acc.totalTasks += progress.total;
            return acc;
        }, { totalCompleted: 0, totalTasks: 0 });
    }, [steps, stepProgress]);

    const progressPercentage = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
    
    return (
        <div className="w-full mb-8 p-4 bg-gray-50 rounded-lg border">
            <div className="relative">
                <div className="absolute top-5 left-0 w-full h-1 transform -translate-y-1/2">
                    <div className="absolute w-full h-full bg-gray-300 rounded-full"></div>
                    <div 
                        className="absolute w-full h-full bg-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const status = getStatus(step.id);
                        const progress = stepProgress[step.id] || { completed: 0, total: 0 };
                        const isComplete = progress.total > 0 && progress.completed >= progress.total;
                        const isClickable = status === 'completed' || status === 'available';

                        const numberClasses: Record<StepStatus, string> = {
                            completed: 'bg-green-600 text-white border-green-700',
                            current: 'bg-amber-600 text-white border-amber-700 ring-4 ring-amber-200',
                            available: 'bg-blue-500 text-white border-blue-600',
                            locked: 'bg-gray-400 text-gray-200 border-gray-400',
                        };
                        
                        const titleClasses: Record<StepStatus, string> = {
                            completed: 'text-green-800',
                            current: 'text-amber-800 font-bold',
                            available: 'text-blue-800',
                            locked: 'text-gray-500',
                        };

                        return (
                            <div key={step.id} className="flex flex-col items-center text-center z-10 bg-gray-50 px-2 max-w-[120px]">
                                <button
                                    onClick={() => isClickable && onStepChange(step.id)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${numberClasses[status]} ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                                    aria-label={`Step ${index + 1}: ${step.title}. Status: ${status}.`}
                                    disabled={!isClickable}
                                >
                                    {isComplete ? '✔' : index + 1}
                                </button>
                                <p className={`mt-2 text-sm font-semibold ${titleClasses[status]}`}>{step.title}</p>
                                {progress.total > 1 && (
                                     <p className={`text-xs ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        ({progress.completed}/{progress.total})
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StepProgressBar;