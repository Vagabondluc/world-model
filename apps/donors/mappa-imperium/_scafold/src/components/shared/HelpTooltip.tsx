import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface HelpTooltipProps {
    text: string;
}

const HelpTooltip = ({ text }: HelpTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<{ top: number, left: number } | null>(null);
    const targetRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            let top = rect.top - 10;
            const left = rect.left + rect.width / 2;
            
            // This will be calculated properly in the effect
            setPosition({ top, left });
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };
    
    useEffect(() => {
        if (isVisible && targetRef.current && tooltipRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top = targetRect.top - tooltipRect.height - 8; // Position above by default
            if (top < 8) { // If not enough space, position below
                top = targetRect.bottom + 8;
            }

            let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            if (left < 8) left = 8;
            if (left + tooltipRect.width > window.innerWidth - 8) {
                left = window.innerWidth - tooltipRect.width - 8;
            }
            
            setPosition({ top, left });
        }
    }, [isVisible]);

    const TooltipPortal = () => {
        if (!isVisible || !position) return null;
        
        const isBelow = position.top > (targetRef.current?.getBoundingClientRect().top || 0);

        return createPortal(
            <div
                ref={tooltipRef}
                style={{ top: `${position.top}px`, left: `${position.left}px`, visibility: position.top === 0 ? 'hidden' : 'visible' }}
                className="fixed p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg pointer-events-none z-[100] transition-opacity duration-200 w-64"
                role="tooltip"
            >
                {text}
                 <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${isBelow ? 'bottom-full border-b-4 border-b-gray-800' : 'top-full border-t-4 border-t-gray-800'}`}></div>
            </div>,
            document.body
        );
    };

    return (
        <span
            ref={targetRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="inline-flex items-center justify-center ml-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <TooltipPortal />
        </span>
    );
};

export default HelpTooltip;