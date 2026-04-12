import React from 'react';
import RuleTable from '../../RuleTable';

const namingHeaders = ['1d6', '1', '2', '3', '4', '5', '6'];
const namingRows = [
    [1, 'Kingdom', 'Empire', 'Unity', 'Order', 'Federation', 'Talon'],
    [2, 'Union', 'Strike', 'Consortium', 'Tempest', 'Collective', 'Fate'],
    [3, 'Sentinel', 'Alliance', 'Dominion', 'Confederacy', 'Nation', 'Domain'],
    [4, 'Alliance', 'Tome', 'Dynasty', 'Horde', 'People', 'Flame'],
    [5, 'Crusade', 'Republic', 'Council', 'Hierarchy', 'Covenant', 'Legion'],
    [6, 'Hegemony', 'Imperium', 'Khanate', 'State', 'League', 'Sword']
];

const NamingIdeasTable = () => {
    return <RuleTable headers={namingHeaders} rows={namingRows} />;
};

export default NamingIdeasTable;