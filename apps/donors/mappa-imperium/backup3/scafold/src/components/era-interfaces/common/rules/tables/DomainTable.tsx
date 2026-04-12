import React from 'react';
import RuleTable from '../../RuleTable';

const domainHeaders = ['1d6', 'Domain'];
const domainRows = [
    [1, 'Geography (e.g., Mountain, Ocean, Forest)'],
    [2, 'Nature (e.g., Animals, Weather, Sun/Moon)'],
    [3, 'Craft (e.g., Smithing, Art, Brewing)'],
    [4, 'Endeavor (e.g., War, Knowledge, Love)'],
    [5, 'Home (e.g., Family, Harvest, Community)'],
    [6, 'Grim (e.g., Death, Disease, Secrets)']
];

const DomainTable = () => {
    return <RuleTable headers={domainHeaders} rows={domainRows} />;
};

export default DomainTable;