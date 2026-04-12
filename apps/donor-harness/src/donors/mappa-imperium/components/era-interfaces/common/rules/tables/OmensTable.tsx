import React from 'react';
import RuleTable from '../../RuleTable';

const omensHeaders = ['2d6', 'Event', 'Description'];
const omensRows = [
    [2, 'Black Smoke', 'Black smoke is seen rising from the tallest peak, name that peak now'],
    [3, 'Abyss', 'Rumors begin to spread about strange sounds coming from a point in the largest ocean, name that ocean or bay now'],
    [4, 'Blinding Light', 'A bright light appears, coming from the least inhabited island - name that island'],
    [5, 'Silence', 'Rumors begin to spread amongst the world\'s temples that something is wrong with the gods...'],
    [6, 'River of Blood', 'One of the world\'s rivers or lakes begins to change color. Name that river or lake.'],
    [7, 'Comet', 'A comet fills the night sky. Is this a dark omen or sign of prosperity?'],
    [8, 'They Know Something', 'For several days, birds are all seen flying away from one island. Name that island'],
    [9, 'Stench', 'A foul stench begins emanating from one of the Sacred Sites'],
    [10, 'Howl', 'At sundown, a deafening howl is heard across the world'],
    [11, 'Terror', 'Rumors spread that something is back...'],
    [12, 'Meteor Storm', 'Thousands of meteors pepper the land. What\'s left when the dust clears?']
];

const OmensTable = () => {
    return <RuleTable headers={omensHeaders} rows={omensRows} />;
};

export default OmensTable;
