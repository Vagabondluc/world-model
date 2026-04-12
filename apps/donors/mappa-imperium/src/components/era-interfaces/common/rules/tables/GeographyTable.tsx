import React from 'react';
import RuleTable from '../../RuleTable';

const geographyHeaders = ['2d6', 'Geography'];
const geographyRows = [
    [2, 'Savanna'], [3, 'Wetlands'], [4, 'Hills'], [5, 'Lake'], [6, 'River'], [7, 'Forest'],
    [8, 'Mountains'], [9, 'Desert'], [10, 'Jungle'], [11, 'Canyon'], [12, 'Volcano']
];

const GeographyTable = () => {
    return <RuleTable headers={geographyHeaders} rows={geographyRows} />;
};

export default GeographyTable;
