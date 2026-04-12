import React from 'react';
import RuleTable from '../../RuleTable';

const collapseHeaders = ['3d6', 'Event', 'Description'];
const collapseRows = [
    [3, 'Dug Too Deep', 'A Monster has risen from underground and destroyed or claimed one of your settlements. Place a new monster on the map now (don\'t forget a name)'],
    [4, 'Arcane Disturbance', 'Has a portal to a new realm opened, or perhaps a mad wizard has crafted a new tower? Describe & draw in a magical occurrence, anything from a new tower to a massive crater.'],
    [5, 'Royalty', 'Your rulers need a place to live! Build a palace for them near the capital or somewhere of importance. Name this region on the map after the ruling family'],
    [6, 'Piety', 'A religion has gained prominence in the empire. Select a deity (or create a new one) and place a cathedral or large temple nearby'],
    [7, 'Refugees', 'People are flocking to your city, are they fleeing war, monster attacks, disasters? Place a small village next to or expand your capital for these new citizens.'],
    [8, 'Rising Empire', 'Despite the times, your empire is thriving! Roll & draw in a new settlement or expand your existing one with farmland, walls, etc.'],
    [9, 'Neighboring War', 'Select any two neighboring factions, choose which is the attacker and defender, then roll on the War! Table'],
    [10, 'War!', 'Your army is marching! Select any settlement not already owned by you and roll on the War! Table with your empire acting as the Attacker.'],
    [11, 'Neighbors Develop', 'Select a neighbor at random and roll on the appropriate Neighbors Develop Table.'],
    [12, 'Mobilize', 'Draw in a new fort or military settlement'],
    [13, 'Disaster', 'Something terrible has struck the empire. Natural Disaster or Magical, famine or disease? Roll 1 dice to determine the severity (6 is most severe, 1 is weak) - Remove at least 1 settlement and replace it with a ruin.'],
    [14, 'Evil Lurks', 'Something sinister has claimed a nearby ruin. Place a new cult, tribe, mage, hive, or monster onto the map on an existing ruin.'],
    [15, 'Vassalage', 'A neighboring faction has joined your empire. Create an Alliance Banner and give your new united empire a name.'],
    [16, 'Revolution', 'Rebellion! Half your empire has split into a new faction. Give them a name + banner, treat them as a hostile neighbor from now on'],
    [17, 'Nightmares', 'Something fowl is lurking in the forest (or any geography) is it lycanthropy, demonic spiders, a mad druid, rodents of unusual size? Treat them as a hostile faction and give the location an ominous name.'],
    [18, 'Cataclysm', 'Total devastation! Something apocalyptic has struck your home region, island destroyed, comet impact, fury of the gods? Destroy a large section of your home region then describe the mythical story.']
];

const CollapseTable = () => {
    return <RuleTable headers={collapseHeaders} rows={collapseRows} />;
};

export default CollapseTable;
