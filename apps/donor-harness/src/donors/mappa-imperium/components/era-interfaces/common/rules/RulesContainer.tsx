import React from 'react';

interface RulesContainerProps {
    children: React.ReactNode;
}

const RulesContainer = ({ children }: RulesContainerProps) => {
    return (
        <>
            {children}
        </>
    );
};

export default RulesContainer;
