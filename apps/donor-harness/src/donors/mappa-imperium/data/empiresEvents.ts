import type { ElementCard } from '@mi/types';

export interface EmpireEvent {
    name: string;
    description: string;
    prompt: string;
    elementType: ElementCard['type'];
}

export const empiresEvents: Record<number, EmpireEvent> = {
    3: {
        name: 'The King is Dead',
        description: 'Your king/leader has died without a proper heir and now your empire is in anarchy. Split your empire into at least 3 factions, creating new names/banners for each.',
        prompt: 'Chronicle a succession crisis. Detail the deceased ruler, the emerging factions, their leaders, and the immediate changes to the empire.',
        elementType: 'Event',
    },
    4: {
        name: 'Overthrown',
        description: 'One of your settlements has grown tired of your rule and thrown out the ruling class. Rename this new "free" city and give the new faction a name and banner.',
        prompt: 'Detail a settlement\'s rebellion. Name the overthrown class, the revolutionary leaders, and the city\'s transformation.',
        elementType: 'Event',
    },
    5: {
        name: 'Shrine',
        description: 'A nearby location has come to be seen as sacred grounds. Place a shrine or temple and select the deity worshiped here.',
        prompt: 'Chronicle the emergence of a sacred site. Describe its location, discovery, signs of divine favor, and impact on local culture.',
        elementType: 'Event',
    },
    6: {
        name: 'Hero Arrives',
        description: 'A powerful hero has shown up in the Empire. What did they do? Draw in a statue, monument, or name a geography near your capital.',
        prompt: 'Record the impact of a new hero. Detail their name, origin, great deed, and the cultural changes they inspired.',
        elementType: 'Event',
    },
    7: {
        name: 'Hostile Attack',
        description: 'A nearby hostile force has attacked! Destroy a fort or settlement and replace it with a ruin, or claim it for the invading faction.',
        prompt: 'Document a hostile attack. Detail the enemy, the battle, the settlement\'s fall, and the strategic aftermath.',
        elementType: 'Event',
    },
    8: {
        name: 'War!',
        description: 'Your army is marching! Select any settlement not already owned by you and roll on the War! Table.',
        prompt: 'Chronicle a military campaign. Document the cause for war, the leaders, army composition, and the battle\'s outcome.',
        elementType: 'Event',
    },
    9: {
        name: 'Neighbors Develop',
        description: 'Select a neighbor at random and roll on the appropriate Neighbors Develop Table.',
        prompt: 'Record the evolution of a neighboring faction. Detail their new developments and how they change your relationship.',
        elementType: 'Event',
    },
    10: {
        name: 'Expedition',
        description: 'A fleet or caravan has set out to gain a foothold in distant lands. Place a new coastal fort or frontier outpost.',
        prompt: 'Chronicle an expedition. Detail the fleet, commander, objectives, challenges, and any new discoveries or settlements.',
        elementType: 'Event',
    },
    11: {
        name: 'Expand',
        description: 'Your empire is growing. Place a new settlement by rolling on the settlement table.',
        prompt: 'Record the growth of your empire. Detail the new settlement\'s location, purpose, population, and its integration into the empire.',
        elementType: 'Event',
    },
    12: {
        name: 'Prosperity',
        description: 'People are flocking to your empire. Grow your cities, add farmland, and draw in a monument to show off your wealth.',
        prompt: 'Chronicle an economic boom. Detail the catalysts, growth patterns, new construction, and social changes that result.',
        elementType: 'Event',
    },
    13: {
        name: 'Trade',
        description: 'Economic Prosperity! Build a road connecting your empire to another faction and add a trade post.',
        prompt: 'Record the establishment of a new trade connection. Detail the route, infrastructure, merchants, and the economic impact.',
        elementType: 'Event',
    },
    14: {
        name: 'Military Power',
        description: 'Your empire needs stability & security. Create a fort, city/border walls, or a barracks.',
        prompt: 'Chronicle the fortification of your empire. Detail the construction, strategic purpose, and regional impact of the new military power.',
        elementType: 'Event',
    },
    15: {
        name: 'Gifted Academy',
        description: 'Your empire has cultivated a new craft, art, or ability. Build a new academy, sanctuary, or library for this group.',
        prompt: 'Record the founding of a great institution. Detail its specialty, founding scholars, teaching methods, and cultural influence.',
        elementType: 'Event',
    },
    16: {
        name: 'Disaster/Famine',
        description: 'Something terrible has struck the empire. Natural Disaster or Magical, famine or disease? Remove a settlement and replace it with a ruin.',
        prompt: 'Chronicle a catastrophe. Detail the disaster\'s cause, its initial impact, the leadership\'s response, and the long-term social changes.',
        elementType: 'Event',
    },
    17: {
        name: 'Feed the People',
        description: 'Your growing empire needs food! Place either a new farming town or fishing village.',
        prompt: 'Record a major agricultural or aquacultural development. Detail the location, production methods, and its impact on the population.',
        elementType: 'Event',
    },
    18: {
        name: 'Revolution',
        description: 'Rebellion! Half your empire has split into a new faction. Give them a name and banner, and treat them as a hostile neighbor.',
        prompt: 'Chronicle an uprising. Detail the causes of the rebellion, the emergence of a new leader, and the division of territory and resources.',
        elementType: 'Event',
    },
};
