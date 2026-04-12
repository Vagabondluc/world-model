/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import StepProgressBar from './StepProgressBar';

describe('StepProgressBar', () => {
    const mockSteps = [
        { id: '1', title: 'Step 1' },
        { id: '2', title: 'Step 2' },
        { id: '3', title: 'Step 3' }
    ];
    const mockProgress = {
        '1': { completed: 1, total: 1 },
        '2': { completed: 0, total: 1 },
        '3': { completed: 0, total: 1 }
    };

    it('renders all steps', () => {
        render(<StepProgressBar steps={mockSteps} currentStepId="1" stepProgress={mockProgress} onStepChange={() => { }} />);
        mockSteps.forEach(step => {
            expect(screen.getByText(step.title)).toBeInTheDocument();
        });
    });

    it('marks current step as active', () => {
        render(<StepProgressBar steps={mockSteps} currentStepId="2" stepProgress={mockProgress} onStepChange={() => { }} />);
        // Step 2 should have active classes (we check for text-amber-700 which happens on parent div if active)
        // This is a bit brittle, checking for 'Step 2' text element parent usually
        const step2Text = screen.getByText('Step 2');
        // The parent div of the text span has the class.
        expect(step2Text.parentElement).toHaveClass('text-amber-700');
    });

    it('calls onStepChange when clicked', () => {
        const handleChange = vi.fn();
        render(<StepProgressBar steps={mockSteps} currentStepId="1" stepProgress={mockProgress} onStepChange={handleChange} />);

        fireEvent.click(screen.getByText('Step 3'));
        expect(handleChange).toHaveBeenCalledWith('3');
    });
});
