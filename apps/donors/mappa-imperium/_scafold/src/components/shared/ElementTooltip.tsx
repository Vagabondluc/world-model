import React, { useState, useRef, ReactElement, cloneElement, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ElementCard, Resource, Deity, Location, Faction, Settlement } from '../../types';

interface ElementTooltipProps {
    element: ElementCard;
    children: ReactElement; // Must be a single React element
}

const getTooltipData = (element: ElementCard): { label: string; value: string }[] => {
    const data: { label: string; value: string }[] = [];
    switch (element.type) {
        case 'Deity':
            const deity = element.data as Deity;
            data.push({ label: 'Domain', value: deity.domain });
            data.push({ label: 'Symbol', value: deity.symbol });
            break;
        case 'Location':
            const location = element.data as Location;
            data.push({ label: 'Site Type', value: location.siteType });
            break;
        case 'Faction':
            const faction = element.data as Faction;
            data.push({ label: 'Race', value: faction.race });
            if (faction.leaderName) data.push({ label: 'Leader', value: faction.leaderName });
            if (faction.theme) data.push({ label: 'Theme', value: faction.theme });
            break;
        case 'Settlement':
            const settlement = element.data as Settlement;
            data.push({ label: 'Purpose', value: settlement.purpose });
            break;
        case 'Resource':
            const resource = element.data as Resource;
            data.push({ label: 'Type', value: resource.type });
            break;
    }
    return data.filter(d => d.value);
};

const ElementTooltip = ({ element, children }: ElementTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
    const targetRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (targetRef.current) {
            setPosition(targetRef.current.getBoundingClientRect());
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };
    
    const tooltipData = getTooltipData(element);
    if (tooltipData.length === 0) {
        return children;
    }
    
    // The trigger element that will be rendered in place
    // FIX: Passing 'ref' to cloneElement is valid for DOM elements at runtime but creates a TypeScript error
    // due to restrictive types in @types/react. The child is cast to ReactElement<any> to resolve this,
    // which is safer than casting to a specific DOM element type.
    const triggerElement = cloneElement(children as React.ReactElement<any>, {
        ref: targetRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    });

    // The tooltip content to be portaled
    const TooltipPortal = () => {
        const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

        useEffect(() => {
            if (position && tooltipRef.current) {
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                
                let top = position.top - tooltipRect.height - 8; // Default above
                if (top < 8) { // If not enough space above, position below
                    top = position.top + position.height + 8;
                }

                let left = position.left + (position.width / 2) - (tooltipRect.width / 2);
                if (left < 8) { // Clamp to left edge
                    left = 8;
                } else if (left + tooltipRect.width > window.innerWidth - 8) { // Clamp to right edge
                    left = window.innerWidth - tooltipRect.width - 8;
                }

                setTooltipPosition({
                    top: top,
                    left: left,
                });
            }
        }, [position]);

        if (!isVisible || !position) return null;

        const isBelow = tooltipPosition.top > position.top;

        return createPortal(
            <div
                ref={tooltipRef}
                style={{ top: tooltipPosition.top, left: tooltipPosition.left, visibility: tooltipPosition.top === 0 ? 'hidden' : 'visible' }}
                className="fixed p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg pointer-events-none z-[999] transition-opacity duration-200 w-64"
                role="tooltip"
            >
                <ul className="space-y-1">
                    {tooltipData.map(item => (
                        <li key={item.label} className="truncate">
                            <strong className="font-semibold text-amber-300 capitalize">{item.label}:</strong> {item.value}
                        </li>
                    ))}
                </ul>
                <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent ${isBelow ? 'bottom-full border-b-8 border-b-gray-800' : 'top-full border-t-8 border-t-gray-800'}`}></div>
            </div>,
            document.body
        );
    };

    return (
        <>
            {triggerElement}
            <TooltipPortal />
        </>
    );
};


export default ElementTooltip;