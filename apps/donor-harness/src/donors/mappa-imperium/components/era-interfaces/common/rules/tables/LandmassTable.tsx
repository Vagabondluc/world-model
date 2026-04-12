import React from 'react';
import RuleTable from '../../RuleTable';

const landmassHeaders = ['1d6', 'Landmass'];
const landmassRows = [
    [1, '1 Large Continent'],
    [2, '1 Large + 1 Small isle'],
    [3, '1 Large + 2 Small isles'],
    [4, '2 Medium islands'],
    [5, '3 Medium islands'],
    [6, 'Archipelago with at least 4 islands']
];

const LandmassTable = () => {
    return <RuleTable headers={landmassHeaders} rows={landmassRows} />;
};

export default LandmassTable;
