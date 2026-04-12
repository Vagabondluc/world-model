import React from 'react';
import RuleTable from '../../RuleTable';

const empiresHeaders = ['3d6', 'Event', 'Description'];
const empiresRows = [
    [3, 'The King is Dead', 'Your king/leader has died without a proper heir and now your empire is in anarchy. Split your empire into at least 3 factions, creating new names/banners for each.'],
    [4, 'Overthrown', 'One of your settlements has grown tired of your rule and thrown out the ruling class. Rename this new "free" city and give the new faction a name and banner.'],
    [5, 'Shrine', 'A nearby location has come to be seen as sacred grounds to your people. Place a shrine or temple and select the deity worshiped here.'],
    [6, 'Hero Arrives', 'A powerful hero has shown up in the Empire, what did they do? Draw in a statue, monument, or name a geography near your capital or the location of the event.'],
    [7, 'Hostile Attack', 'A nearby hostile force has attacked! destroy a fort or settlement and replace it with a ruin, or claim it for the nearby invading faction.'],
    [8, 'War!', 'Your army is marching! Select any settlement not already owned by you and roll on the War! Table.'],
    [9, 'Neighbors Develop', 'Select a neighbor at random and roll on the appropriate Neighbors Develop Table.'],
    [10, 'Expedition', 'A fleet of ships or military caravan has set out to gain a foothold in distant lands. Place a new coastal fort or frontier outpost, preferably in another\'s home region.'],
    [11, 'Expand', 'Your empire is growing, Roll on the settlement table and place a new settlement anywhere on the map.'],
    [12, 'Prosperity', 'People are flocking to your empire. Grow your cities if possible, add more farmland, draw ships in the ports, etc. Then draw in a monument or construction to show off your wealth.'],
    [13, 'Trade', 'Economic Prosperity! Build a road connecting your empire to another faction, then add a trade post somewhere along the road.'],
    [14, 'Military Power', 'Your empire needs stability & security. Create a fort, city/border walls, or a barracks.'],
    [15, 'Gifted Academy', 'Your empire has cultivated a new craft, art, or ability. Build a new academy, sanctuary, or library for this group and place this new settlement.'],
    [16, 'Disaster/Famine', 'Something terrible has struck the empire. Natural Disaster or Magical, famine or disease? Remove a settlement and replace it with a ruin.'],
    [17, 'Feed the People', 'Your growing empire needs food! Place either a new farming town or fishing village.'],
    [18, 'Revolution', 'Rebellion! Half your empire has split into a new faction. Give them a name +banner, treat them as a hostile neighbor from now on.']
];

const EmpiresTable = () => {
    return <RuleTable headers={empiresHeaders} rows={empiresRows} />;
};

export default EmpiresTable;