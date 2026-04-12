import React from 'react';
import RuleTable from '../../RuleTable';

const neighborsHeaders = ['1d6', 'Faction Type', 'Examples'];
const neighborsRows = [
    [1, 'Hive or Swarm', '(Insect, Fungus, Crustacean)'],
    [2, 'Tribe or Clan', '(Roll on the Race Table)'],
    [3, 'Minor Kingdom', '(Roll on Race Table, add 1 additional settlement)'],
    [4, 'Magic User', '(Mad mage, Necromancer, druid, etc)'],
    [5, 'Cult/Order/Lair', '(demons, bandits, worshippers)'],
    [6, 'Legendary Monster', '(Dragon, Hydra, Kraken)']
];

const NeighborsTable = () => {
    return <RuleTable headers={neighborsHeaders} rows={neighborsRows} />;
};

export default NeighborsTable;
