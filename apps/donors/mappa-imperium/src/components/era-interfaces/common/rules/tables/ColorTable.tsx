import React from 'react';
import RuleTable from '../../RuleTable';

const colorHeaders = ['1d6', '1', '2', '3', '4', '5', '6'];
const colorRows = [
    [1, 'Crimson', 'Red', 'Pink', 'Dark Blue', 'Lt Blue', 'Blue'],
    [2, 'Dark Brown', 'Brown', 'Tan', 'Lime Green', 'Green', 'Dark Green'],
    [3, 'Peach', 'Burgundy', 'Turquoise', 'Burnt Orange', 'Cream', 'Dark Purple'],
    [4, 'Auburn', 'Lt Grey', 'Cyan', 'Magenta', 'Rose', 'Slate'],
    [5, 'Grey', 'Charcoal', 'Light Grey', 'Amber', 'Purple', 'Dark Red'],
    [6, 'Yellow', 'Orange', 'Gold', 'Silver', 'Black', 'White']
];

const ColorTable = () => {
    return <RuleTable headers={colorHeaders} rows={colorRows} />;
};

export default ColorTable;
