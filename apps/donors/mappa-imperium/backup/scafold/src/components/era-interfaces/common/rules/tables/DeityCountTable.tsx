import React from 'react';
import RuleTable from '../../RuleTable';

const deityCountHeaders = ['1d6', 'Number of Deities'];
const deityCountRows = [
    ['1', '1 Deity'],
    ['2, 3', '2 Deities'],
    ['4, 5', '3 Deities'],
    ['6', '4 Deities']
];

const DeityCountTable = () => {
    return <RuleTable headers={deityCountHeaders} rows={deityCountRows} />;
};

export default DeityCountTable;