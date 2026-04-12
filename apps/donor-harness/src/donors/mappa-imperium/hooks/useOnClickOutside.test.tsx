/// <reference types="@testing-library/jest-dom" />
import { render, fireEvent, screen } from '@testing-library/react';
import useOnClickOutside from './useOnClickOutside';
import React, { useRef } from 'react';

const TestComponent = ({ handler }: { handler: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref as any, handler); // simplified ref type for test

    return (
        <div>
            <div data-testid="outside">Outside</div>
            <div ref={ref} data-testid="inside">
                Inside
            </div>
        </div>
    );
};

describe('useOnClickOutside', () => {
    it('calls handler when clicking outside', () => {
        const handler = vi.fn();
        render(<TestComponent handler={handler} />);

        fireEvent.mouseDown(screen.getByTestId('outside'));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not call handler when clicking inside', () => {
        const handler = vi.fn();
        render(<TestComponent handler={handler} />);

        fireEvent.mouseDown(screen.getByTestId('inside'));
        expect(handler).not.toHaveBeenCalled();
    });

    it('works with touch events', () => {
        const handler = vi.fn();
        render(<TestComponent handler={handler} />);

        fireEvent.touchStart(screen.getByTestId('outside'));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not call handler on touch inside', () => {
        const handler = vi.fn();
        render(<TestComponent handler={handler} />);

        fireEvent.touchStart(screen.getByTestId('inside'));
        expect(handler).not.toHaveBeenCalled();
    });
});
