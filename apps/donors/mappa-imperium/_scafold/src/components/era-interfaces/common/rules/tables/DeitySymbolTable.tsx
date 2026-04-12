import React from 'react';
import RuleTable from '../../RuleTable';

const symbolHeaders = ['1d6', 'Symbol Type'];
const symbolRows = [
    [1, 'Weapon (e.g., Sword, Hammer, Bow)'],
    [2, 'Tool (e.g., Anvil, Scythe, Book)'],
    [3, 'Animal (e.g., Wolf, Eagle, Serpent)'],
    [4, 'Plant (e.g., Oak Tree, Rose, Mushroom)'],
    [5, 'Natural (e.g., Mountain, Wave, Star)'],
    [6, 'Body Part (e.g., Eye, Hand, Skull)']
];

const DeitySymbolTable = () => {
    return <RuleTable headers={symbolHeaders} rows={symbolRows} />;
};

export default DeitySymbolTable;