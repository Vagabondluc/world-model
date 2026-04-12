import React from 'react';
import RuleTable from '../../RuleTable';

const settlementHeaders = ['1d6', 'Settlement Purpose', 'Examples'];
const settlementRows = [
    [1, 'Food', '(farm, fish, forage)'],
    [2, 'Mining', '(stone quarry, clay pit, metal mine)'],
    [3, 'Industry', '(goods production, textile, factory)'],
    [4, 'Trade', '(market, port, caravan stop)'],
    [5, 'Military', '(frontier fort, barracks, academy)'],
    [6, 'Religion', '(monastery, temple, shrine)']
];

const SettlementTable = () => {
    return <RuleTable headers={settlementHeaders} rows={settlementRows} />;
};

export default SettlementTable;