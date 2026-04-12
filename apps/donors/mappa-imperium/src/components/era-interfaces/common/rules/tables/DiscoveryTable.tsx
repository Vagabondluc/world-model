import React from 'react';
import RuleTable from '../../RuleTable';

const discoveryHeaders = ['3d6', 'Event', 'Description'];
const discoveryRows = [
    [3, 'Magical Event', 'Something magical, powerful, or otherworldly has been discovered. Describe and draw this relic, be sure to give it and the location where it was discovered a name.'],
    [4, 'Evil Lair or Hive', 'Sinister forces are lurking. Is it demons, twisted abominations, giant spiders? Draw in this new hostile neighbor with an appropriate settlement.'],
    [5, 'New Island', 'Your sea explorers have discovered a new island! Draw in 1 small island, roll on the geography table twice and place on or near new island, then name the island after the explorer that discovered it.'],
    [6, 'Ancient Ruins', 'Your scouts discovered the ruins of a lost civilization. Draw in a ruin and place a new cult, hive, mage, or tribe nearby.'],
    [7, 'Neighbors Develop', 'Select a neighbor at random and roll on the appropriate Neighbors Develop Table.'],
    [8, 'Bandits/Pirates', 'Brigands have been raiding merchants and caravans. Place a new hostile camp on a trade route or bay, then give them a name and banner.'],
    [9, 'Minor Kingdom', 'Scouts have discovered another kingdom! Roll on the Race table, then place 2 settlements. Remember to give them a banner and a name!'],
    [10, 'Colonization', 'Your empire is growing to distant shores. Build a new coastal settlement on the same or nearby island.'],
    [11, 'Expansion', 'Your empire is growing. Place a new settlement - Roll on the settlement table.'],
    [12, 'Hostiles', 'Your explorers have made contact with hostiles. Roll on the Neighbors Table and place them anywhere in your home region. Use the Race Table & Settlement Table if necessary.'],
    [13, 'Military Expansion', 'Your empire is flexing it\'s might, draw in a new military settlement nearby.'],
    [14, 'Neighbor Expands', 'Choose one neighboring faction and add a new settlement for them.'],
    [15, 'New Resource', 'Your Explorers have discovered a valuable new resource! Place a new resource symbol in your home region.'],
    [16, 'Fantastic Landmark', 'Scouts have stumbled upon an impressive landmark, is it a strange rock formation, a lone monolith, magical grove? Draw it in then place a tribe nearby - roll on the Race Table and place a settlement.'],
    [17, 'Roaming Herds', 'Strange and magnificent beasts have been spotted. Are they terrifyingly large, aggressive, tasty? Draw in a symbol and name for these new creatures.'],
    [18, 'Monster Awakens', 'Your scouts have disturbed and awakened a legendary monster, draw in a new monster and give it a name.']
];

const DiscoveryTable = () => {
    return <RuleTable headers={discoveryHeaders} rows={discoveryRows} />;
};

export default DiscoveryTable;
