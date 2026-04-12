import React from 'react';
import RuleTable from '../../RuleTable';

const sitesHeaders = ['2d6', 'Site Type'];
const sitesRows = [
    [2, 'Bottomless Pit'],
    [3, 'Lone Mountain'],
    [4, 'Hot Spring or Geyser'],
    [5, 'Small Lake or Rock Tower'],
    [6, 'Ancient Tree'],
    [7, 'Cave'],
    [8, 'Volcano'],
    [9, 'Grove'],
    [10, 'Henge'],
    ['11-12', "Player's Choice"]
];

const SacredSitesTable = () => {
    return <RuleTable headers={sitesHeaders} rows={sitesRows} />;
};

export default SacredSitesTable;
