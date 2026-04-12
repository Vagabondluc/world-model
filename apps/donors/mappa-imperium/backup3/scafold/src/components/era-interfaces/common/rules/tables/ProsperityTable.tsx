import React from 'react';
import RuleTable from '../../RuleTable';

const prosperityHeaders = ['3d6', 'Profession', '3d6', 'Profession', '3d6', 'Profession'];
const prosperityRows = [
    [3, 'Music', 9, 'Fine Carpentry', 14, 'Magic Training'],
    [4, 'Alchemy or brew', 10, 'Type of weaponry', 15, 'Trade'],
    [5, 'Artistic Trinkets', 11, 'Metal Industry', 16, 'Horsemanship'],
    [6, 'Mining', 12, 'Type of Food', 17, 'Metal Work'],
    [7, 'Explorers', 13, 'Fighting style', 18, 'Beast Raising'],
    [8, 'Seafarers', '', '', '', '']
];

const ProsperityTable = () => {
    return <RuleTable headers={prosperityHeaders} rows={prosperityRows} />;
};

export default ProsperityTable;