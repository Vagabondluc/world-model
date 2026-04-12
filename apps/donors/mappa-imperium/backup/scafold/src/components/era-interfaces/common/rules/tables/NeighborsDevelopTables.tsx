import React from 'react';
import RuleTable from '../../RuleTable';
import RuleSection from '../../RuleSection';

const commonHeaders = ['1d6', 'Event', 'Description'];

const minorFactionRows = [
    [1, 'Expand', 'Add a settlement'],
    [2, 'Colonize', 'Build a new coastal settlement'],
    [3, 'Militarize', 'Draw in a new fort or military settlement'],
    [4, 'Union', 'Select a nearby tribe and merge them into the minor faction, becoming one nation.'],
    [5, 'Epic Construction', 'A new academy, altar, tower? Draw in a new construction'],
    [6, 'Expand', 'Connect a road to a neighbor and build a trade settlement on that road. Or, create a new coastal trading port.']
];

const tribeRows = [
    [1, 'Monster!', 'A new Legendary Monster has been discovered. Create one now and draw it in'],
    [2, 'Warpath', 'War! Select a neighbor and roll on the War! Table'],
    [3, 'Advancement', 'Strong leadership has taken control of the tribe. Upgrade to a Minor Faction by giving a banner and name.'],
    [4, 'Expand', 'Add a settlement'],
    [5, 'Floating Village', 'Strap some ships together and create a floating village in a nearby sea or lake'],
    [6, 'Invasion', 'A mighty leader has mustered enough force to attack and take a town. Take one nearby settlement and switch control to the tribe.']
];

const hiveRows = [
    [1, 'Swarm', 'A new queen has taken a large group to settle a new hive, place a new Hive somewhere else on the map.'],
    [2, 'Expand', 'Add a new hive settlement/den/nest nearby'],
    [3, 'Raid', 'Attack a nearby settlement, roll 1d6 for result Odd = settlement destroyed, Even = town defended'],
    [4, 'Infest', 'Attack and replace a nearby settlement with a new nest/settlement of the hive.'],
    [5, 'Spawn', 'The hive has bred an incredible new foe. Create a new Legendary Monster'],
    [6, 'Expand', 'Add a new hive settlement/den/nest nearby']
];

const magicUserRows = [
    [1, 'Minions', 'A group of followers has joined. Build a settlement camp nearby.'],
    [2, 'Raid', 'Attack a nearby settlement, roll 1d6 Odd = settlement destroyed, Even = town defended'],
    [3, 'Expand', 'Followers are flocking to the power (choice or force?), build a new resource camp settlement nearby.'],
    [4, 'Construction', 'A monolith, shrine, or portal? Draw in a new construction.'],
    [5, 'Alter Land', 'Eternal winter, forest grow, burned lands? Alter the lands nearby by adding a geography or destroying part of one.'],
    [6, 'Corruption', 'Foul or corrupted magic is tainting the land. Darken the land, kill the forests, or spoil the water supplies nearby.']
];

const cultRows = [
    [1, 'Expand', 'Add a settlement'],
    [2, 'Worship', 'Draw a new Temple nearby and select a deity or create a new one'],
    [3, 'Epic Construction', 'A new dungeon, tower, altar to a god? Draw in a new construction nearby'],
    [4, 'Infiltrate', 'The Cult has taken control of a nearby settlement, switch faction control to the cult'],
    [5, 'Ransack', 'A nearby settlement has something valuable (gems, weapons, people) draw in a camp nearby and describe the theft.'],
    [6, 'Expand', 'Add a settlement']
];

const monsterRows = [
    [1, 'Raid', 'Attack a nearby settlement, roll 1d6 Odd = settlement destroyed, Even = town defended'],
    [2, 'Treasure', 'Whether by offering, sacrifice, or assault, the monster has accumulated vast amounts of wealth. Draw in a treasure hold or gold laden lair.'],
    [3, 'Raid', 'Attack a nearby settlement, roll 1d6 Odd = settlement destroyed, Even = town defended'],
    [4, 'Ascension', 'Fantastic stories are being spread about the monster. Add it to the list of gods and select a domain and symbol for it (give it a name if you haven\'t yet)'],
    [5, 'Lair Building', 'The monster is settling in, they or their followers are creating a proper lair or den. Draw in a home, cave, tower, or sanctum.'],
    [6, 'Fury', 'The monster has unleashed its rage onto a nearby settlement, destroy and replace it with a ruin']
];

const NeighborsDevelopTables = () => {
    return (
        <div className="space-y-6">
            <RuleSection title="Minor Faction">
                <RuleTable headers={commonHeaders} rows={minorFactionRows} />
            </RuleSection>
            <RuleSection title="Tribe / Bandits / Pirates">
                <RuleTable headers={commonHeaders} rows={tribeRows} />
            </RuleSection>
            <RuleSection title="Hive">
                <RuleTable headers={commonHeaders} rows={hiveRows} />
            </RuleSection>
            <RuleSection title="Magic User">
                <RuleTable headers={commonHeaders} rows={magicUserRows} />
            </RuleSection>
            <RuleSection title="Cult / Lair / Order">
                <RuleTable headers={commonHeaders} rows={cultRows} />
            </RuleSection>
            <RuleSection title="Monster">
                <RuleTable headers={commonHeaders} rows={monsterRows} />
            </RuleSection>
        </div>
    );
};

export default NeighborsDevelopTables;