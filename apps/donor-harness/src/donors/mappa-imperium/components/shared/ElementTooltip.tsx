import React from 'react';

const ElementTooltip: React.FC<any> = ({ children }) => {
    return (
        <div className="group relative inline-block">
            {children}
        </div>
    );
};

export default ElementTooltip;
