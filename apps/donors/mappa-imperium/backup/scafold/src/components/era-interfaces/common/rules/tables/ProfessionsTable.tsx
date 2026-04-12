import React from 'react';
import RuleTable from '../../RuleTable';

const professionsHeaders = ['3d6', 'Profession', '3d6', 'Profession', '3d6', 'Profession'];
const professionsRows = [
    [3, 'Musician', 9, 'Military Leader', 14, 'Diplomat'],
    [4, 'Sculptor', 10, 'City Leader', 15, 'Trader'],
    [5, 'Artist', 11, 'Explorer', 16, 'Humanitarian'],
    [6, 'Poet', 12, 'Adventurer', 17, 'Mage'],
    [7, 'Author', 13, 'Inventor', 18, 'Beast Tamer'],
    [8, 'Historian', '', '', '', '']
];

const ProfessionsTable = () => {
    return <RuleTable headers={professionsHeaders} rows={professionsRows} />;
};

export default ProfessionsTable;