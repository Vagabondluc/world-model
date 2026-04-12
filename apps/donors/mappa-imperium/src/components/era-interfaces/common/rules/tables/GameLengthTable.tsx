import React from 'react';
import RuleTable from '../../RuleTable';

const gameLengthHeaders = ['Era', 'Short', 'Standard', 'Long', 'Epic'];
const gameLengthRows = [
    ['Era 4', 3, 6, 8, 11],
    ['Era 5', 4, 6, 8, 12],
    ['Era 6', 3, 5, 6, 10]
];

const GameLengthTable = () => {
    return <RuleTable headers={gameLengthHeaders} rows={gameLengthRows} />;
};

export default GameLengthTable;
