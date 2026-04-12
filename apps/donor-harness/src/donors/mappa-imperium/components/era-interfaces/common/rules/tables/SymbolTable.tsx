import React from 'react';
import RuleTable from '../../RuleTable';

const symbolHeaders = ['1d6', '1', '2', '3', '4', '5', '6'];
const symbolRows = [
    [1, 'Flame', 'Horse', 'Boar', 'Lion', 'Dragon', 'Hydra'],
    [2, 'Lightning Bolt', 'Bird', 'Mountain', 'Sun', 'Moon', 'Leaf'],
    [3, 'Tree', 'Claw', 'Spider', 'Grain', 'Bow', 'Horseshoe'],
    [4, 'Harp', 'Fish', 'Anvil', 'Wolf', 'Wings', 'Skull'],
    [5, 'Axe', 'Diamond', 'Flower', 'Apple', 'Cup', 'Spade'],
    [6, 'Sword', 'Beholder', 'Scorpion', 'Crab', 'Unicorn', 'Star']
];

const SymbolTable = () => {
    return <RuleTable headers={symbolHeaders} rows={symbolRows} />;
};

export default SymbolTable;
