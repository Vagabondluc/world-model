import React from 'react';

interface PantheonSetupProps {
    onCountSelect: (count: number) => void;
}

const PantheonSetup = ({ onCountSelect }: PantheonSetupProps) => {
    return (
        <div className="text-center p-8 bg-gray-50 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-800">2.1 Number of Deities</h2>
            <p className="mt-2 text-gray-600 mb-6">Roll 1d6 in your preferred tool (like Foundry VTT) and select the corresponding number of deities below to begin.</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                 {[
                    { roll: '1', deities: 1 },
                    { roll: '2, 3', deities: 2 },
                    { roll: '4, 5', deities: 3 },
                    { roll: '6', deities: 4 }
                 ].map(({ roll, deities }) => (
                    <button 
                        key={deities}
                        onClick={() => onCountSelect(deities)}
                        className="w-32 h-32 flex flex-col items-center justify-center text-amber-800 bg-white border-2 border-amber-300 rounded-lg shadow-sm hover:bg-amber-100 hover:border-amber-500 hover:shadow-md transition-all transform hover:scale-105"
                    >
                        <span className="text-4xl font-bold">{deities}</span>
                        <span className="text-sm text-gray-500">Deit{deities > 1 ? 'ies' : 'y'}</span>
                        <span className="text-xs text-gray-400">(Roll {roll})</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PantheonSetup;
