
import React, { useLayoutEffect, useEffect } from 'react';
import EraHomeContent from './EraHomeContent';
import EraCreationContent from './EraCreationContent';
import EraMythContent from './EraMythContent';
import EraFoundationContent from './EraFoundationContent';
import EraDiscoveryContent from './EraDiscoveryContent';
import EraEmpiresContent from './EraEmpiresContent';
import EraCollapseContent from './EraCollapseContent';

interface EraContentProps {
    eraId: number;
    onReady?: (isReady: boolean) => void;
}

const EraContent = ({ 
    eraId, 
    onReady = () => {},
}: EraContentProps) => {
    
    // Immediately signal that we are not ready when the component is about to render with a new eraId.
    // useLayoutEffect runs synchronously before the browser paints, preventing race conditions.
    useLayoutEffect(() => {
        onReady(false);
    }, [eraId, onReady]);

    // Signal that we are ready after the component has mounted/updated.
    useEffect(() => {
        const timer = setTimeout(() => {
            onReady(true);
        }, 0); // next tick
        return () => clearTimeout(timer);
    }, [eraId, onReady]);

    const renderEra = () => {
        switch (eraId) {
            case 0:
                return <EraHomeContent />;
            case 1:
                return <EraCreationContent />;
            case 2:
                return <EraMythContent />;
            case 3:
                return <EraFoundationContent />;
            case 4:
                return <EraDiscoveryContent />;
            case 5:
                return <EraEmpiresContent />;
            case 6:
                return <EraCollapseContent />;
            default:
                return <EraHomeContent />;
        }
    };

    return (
        <div>
            {renderEra()}
        </div>
    );
};

export default EraContent;
