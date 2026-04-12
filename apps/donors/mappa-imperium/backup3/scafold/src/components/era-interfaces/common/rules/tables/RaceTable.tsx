import React from 'react';
import RuleTable from '../../RuleTable';

const raceHeaders = ['2d6', 'Ancestry', 'Examples'];
const raceRows = [
    [2, 'Demonkind', 'Demonfolk, Imp, Tiefling'],
    [3, 'Seafolk', 'Merfolk, Triton, Crabfolk'],
    [4, 'Smallfolk', 'Halfling, Gnome, Deep Gnome, Fairy'],
    [5, 'Reptilian', 'Lizardfolk, Kobold, Snakefolk, Dragonborn'],
    [6, 'Dwarves', 'Mountain Dwarves, Hill Dwarves, Duergar'],
    [7, 'Humans', 'Half-elf/orc or distinguishing culture'],
    [8, 'Elves', 'High Elf, Wood Elf, Drow'],
    [9, 'Greenskins', 'Orc, Goblin, Hobgoblin'],
    [10, 'Animalfolk', 'Ratfolk, Gnoll, Kenku, Frogfolk, Catfolk'],
    [11, 'Giantkind', 'Frost/Fire, Goliath'],
    [12, "Player's Choice", 'Create your own or select one above']
];

const RaceTable = () => {
    return <RuleTable headers={raceHeaders} rows={raceRows} />;
};

export default RaceTable;