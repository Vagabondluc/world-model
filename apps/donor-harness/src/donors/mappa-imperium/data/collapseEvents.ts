import type { ElementCard } from '@mi/types';

export interface CollapseEvent {
    name: string;
    description: string;
    prompt: string;
    elementType: ElementCard['type'];
}

export const collapseEvents: Record<number, CollapseEvent> = {
    3: {
        name: 'Dug Too Deep',
        description: 'A Monster has risen from underground and destroyed or claimed one of your settlements.',
        prompt: 'A monster has been unearthed. Generate a name for this new monster and a chronicle of its emergence and the destruction it caused.',
        elementType: 'Faction',
    },
    4: {
        name: 'Arcane Disturbance',
        description: 'Describe & draw in a magical occurrence, anything from a new tower to a massive crater.',
        prompt: 'An arcane disturbance has occurred. Generate a name for this event and a chronicle describing the magical phenomenon and its immediate impact.',
        elementType: 'Event',
    },
    5: {
        name: 'Royalty',
        description: 'Your rulers need a place to live! Build a palace for them near the capital or somewhere of importance.',
        prompt: 'A new royal palace is being constructed. Generate a name for the palace and a description of its grandeur and significance to the ruling family.',
        elementType: 'Settlement',
    },
    6: {
        name: 'Piety',
        description: 'A religion has gained prominence. Place a cathedral or large temple nearby.',
        prompt: 'A religion has gained prominence. Generate a name for a new grand cathedral and describe its construction and the faith it represents.',
        elementType: 'Settlement',
    },
    7: {
        name: 'Refugees',
        description: 'People are flocking to your city. Place a small village next to or expand your capital for these new citizens.',
        prompt: 'A wave of refugees has arrived. Generate a name for their new village and describe the refugees and their impact on your empire.',
        elementType: 'Settlement',
    },
    8: {
        name: 'Rising Empire',
        description: 'Despite the times, your empire is thriving! Roll & draw in a new settlement or expand your existing one with farmland, walls, etc.',
        prompt: 'The empire is thriving against the odds. Generate a name for a new settlement and describe this beacon of hope in a declining age.',
        elementType: 'Settlement',
    },
    9: {
        name: 'Neighboring War',
        description: 'Select any two neighboring factions and roll on the War! Table.',
        prompt: 'Two neighboring factions are at war. Generate a name for this conflict and a brief chronicle of the initial clashes.',
        elementType: 'War',
    },
    10: {
        name: 'War!',
        description: 'Your army is marching! Select any settlement not already owned by you and roll on the War! Table.',
        prompt: 'Your empire goes to war. Generate a name for this campaign and a chronicle of your army\'s first major engagement.',
        elementType: 'War',
    },
    11: {
        name: 'Neighbors Develop',
        description: 'Select a neighbor at random and roll on the appropriate Neighbors Develop Table.',
        prompt: 'A neighboring faction is developing. Generate a name for this event and describe the changes occurring on your borders.',
        elementType: 'Event',
    },
    12: {
        name: 'Mobilize',
        description: 'Draw in a new fort or military settlement.',
        prompt: 'The empire is mobilizing its forces. Generate a name for a new military fortress and describe its strategic importance.',
        elementType: 'Settlement',
    },
    13: {
        name: 'Disaster',
        description: 'Something terrible has struck the empire. Remove at least 1 settlement and replace it with a ruin.',
        prompt: 'A disaster has struck the empire. Generate a name for this catastrophic event and chronicle its impact and the destruction of a settlement.',
        elementType: 'Event',
    },
    14: {
        name: 'Evil Lurks',
        description: 'Something sinister has claimed a nearby ruin. Place a new cult, tribe, mage, hive, or monster onto the map.',
        prompt: 'An evil presence has taken root in a nearby ruin. Generate a name for this new sinister faction and a description of its nature and goals.',
        elementType: 'Faction',
    },
    15: {
        name: 'Vassalage',
        description: 'A neighboring faction has joined your empire. Create an Alliance Banner and give your new united empire a name.',
        prompt: 'A neighboring faction has sworn fealty. Generate a name for this political union and a chronicle of the event.',
        elementType: 'Event',
    },
    16: {
        name: 'Revolution',
        description: 'Rebellion! Half your empire has split into a new faction. Give them a name + banner.',
        prompt: 'A revolution splits the empire. Generate a name for the new revolutionary faction and a chronicle of the uprising.',
        elementType: 'Faction',
    },
    17: {
        name: 'Nightmares',
        description: 'Something foul is lurking in the forest. Treat them as a hostile faction and give the location an ominous name.',
        prompt: 'A nightmarish threat has emerged in a region. Generate a name for this new horrific faction and a description of the terror it spreads.',
        elementType: 'Faction',
    },
    18: {
        name: 'Cataclysm',
        description: 'Total devastation! Destroy a large section of your home region then describe the mythical story.',
        prompt: 'A cataclysmic event has reshaped the world. Generate a name for this apocalypse and write an epic chronicle of the devastation.',
        elementType: 'Event',
    },
};
