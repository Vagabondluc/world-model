import React, { useState } from 'react';
import { useStaticContent } from '../../hooks/useStaticContent';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

interface CollapsibleReferenceProps {
    filePath: string;
    linkText: string;
}

const CollapsibleReference = ({ filePath, linkText }: CollapsibleReferenceProps) => {
    const [isOpen, setIsOpen] = useState(false);
    // Only fetch content when the section is open for performance
    const { content, isLoading, error } = useStaticContent(isOpen ? filePath : '');

    return (
        <div className="my-2 inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="reference-link flex items-center gap-1"
                aria-expanded={isOpen}
            >
                <span>{linkText}</span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div
                className={`transition-[max-height,padding,margin] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] mt-2' : 'max-h-0'}`}
            >
                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
                    {isLoading && <LoadingSpinner message="Loading reference..." />}
                    {error && <ErrorAlert title="Error" message={error} />}
                    {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
                </div>
            </div>
        </div>
    );
};

export default CollapsibleReference;