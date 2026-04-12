import React from 'react';
import RuleTable from '../../RuleTable';

const nameHeaders = ['1d6', '1', '2', '3', '4', '5', '6'];
const nameRows = [
    [1, 'mith', 'tri', 'dar', 'gor', 'an', 'va'],
    [2, 'col', 'sige', 'dir', 'era', 'altas', 'rama'],
    [3, 'fir', 'alga', 'lorra', 'shiro', 'velen', 'amon'],
    [4, 'for', 'ened', 'ziri', 'red', 'saur', 'baal'],
    [5, 'li', 'serat', 'cho', 'maht', 'ali', 'esh'],
    [6, 'sae', 'rah', 'on', 'tin', 'ti', 'ah']
];

const NameTable = () => {
    return <RuleTable headers={nameHeaders} rows={nameRows} />;
};

export default NameTable;