import React from 'react';

const GeographyPlacer = ({ onComplete }: any) => {
    return (
        <div className="p-4 bg-white rounded border">
            <h3 className="font-bold">Geography Placer</h3>
            <button onClick={onComplete} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Finish Placement (Placeholder)</button>
        </div>
    );
};

export default GeographyPlacer;
