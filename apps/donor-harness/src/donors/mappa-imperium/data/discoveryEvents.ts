import type { ElementCard } from '@mi/types';

export interface DiscoveryEvent {
    name: string;
    description: string;
    prompt: string;
    elementType: ElementCard['type'];
    handler?: 'NEIGHBOR_DEVELOP' | 'MINOR_KINGDOM' | 'EXPANSION' | 'HOSTILES' | 'LANDMARK_TRIBE';
}

export const discoveryEvents: Record<number, DiscoveryEvent> = {
    3: {
        name: 'Magical Event',
        description: 'Something magical, powerful, or otherworldly has been discovered. Describe and draw this relic, be sure to give it and the location where it was discovered a name.',
        prompt: `Your faction has discovered a powerful magical relic. Detail its physical appearance, unique properties, the specific circumstances of discovery, its immediate effects, and potential uses. The tone should be mysterious and wondrous.`,
        elementType: 'Resource',
    },
    4: {
        name: 'Evil Lair or Hive',
        description: 'Sinister forces are lurking. Is it demons, twisted abominations, giant spiders? Draw in this new hostile neighbor with an appropriate settlement.',
        prompt: `A sinister presence has been detected. Describe the first signs noticed by scouts, specific environmental changes it causes, the immediate threat it poses, and one unexpected opportunity this creates. The tone should be ominous.`,
        elementType: 'Faction',
    },
    5: {
        name: 'New Island',
        description: 'Your sea explorers have discovered a new island! Draw in 1 small island, roll on the geography table pg 5 twice and place on or near new island, then name the island after the explorer that discovered it.',
        prompt: `Your explorers have found an island. Detail three distinctive geographical features, one unique resource or phenomenon, two immediate challenges for settlement, and its strategic value. The tone should be adventurous.`,
        elementType: 'Location',
    },
    6: {
        name: 'Ancient Ruins',
        description: 'Your scouts discovered the ruins of a lost civilization. Draw in a ruin and place a new cult, hive, mage, or tribe nearby.',
        prompt: `Ruins of a lost civilization have emerged. Specify three architectural peculiarities, two preserved artifacts with clear purposes, one mysterious element that defies understanding, and its immediate value to your faction.`,
        elementType: 'Location',
    },
    7: {
        name: 'Neighbors Develop',
        description: 'Select a neighbor at random and roll on the appropriate Neighbors Develop Table on page 13.',
        prompt: `A neighboring faction is developing in an interesting way. Describe this change and its implications for your faction. What opportunities or threats does this present?`,
        elementType: 'Event', // Placeholder, handler will determine outcome
        handler: 'NEIGHBOR_DEVELOP',
    },
    8: {
        name: 'Bandits/Pirates',
        description: 'Brigands have been raiding merchants and caravans. Place a new hostile camp on a trade route or bay, then give them a name and banner.',
        prompt: `Raiders threaten your interests. Detail their distinct tactics and pattern, two specific targets they've hit, their base's defensive advantages, and one opportunity their presence creates.`,
        elementType: 'Faction',
    },
    9: {
        name: 'Minor Kingdom',
        description: 'Scouts have discovered another kingdom! Roll on the Race Table pg 7, then place 2 settlements. Remember to give them a banner and a name!',
        prompt: `Scouts have discovered a previously unknown minor kingdom. Describe their people, their main settlements, their relationship with the land, and their initial disposition towards your faction.`,
        elementType: 'Faction',
        handler: 'MINOR_KINGDOM',
    },
    10: {
        name: 'Colonization',
        description: 'Your empire is growing to distant shores. Build a new coastal settlement on the same or nearby island.',
        prompt: `Your faction is establishing a new coastal settlement. Describe its geographical advantages, immediate resource opportunities, an unexpected local challenge, and its strategic importance.`,
        elementType: 'Settlement',
    },
    11: {
        name: 'Expansion',
        description: 'Your empire is growing. Place a new settlement - Roll on the settlement table on the previous page 3.4.',
        prompt: `Your empire grows inland. Detail the new settlement's unique purpose, two local resources it secures, one challenge to maintaining control, and its relationship with existing settlements.`,
        elementType: 'Settlement',
        handler: 'EXPANSION',
    },
    12: {
        name: 'Hostiles',
        description: 'Your explorers have made contact with hostiles. Roll on the Neighbors Table pg 9 and place them anywhere in your home region.',
        prompt: `Your explorers have made contact with a new hostile group. Describe their nature, their territory, their reasons for hostility, and the immediate threat they pose.`,
        elementType: 'Faction',
        handler: 'HOSTILES',
    },
    13: {
        name: 'Military Expansion',
        description: 'Your empire is flexing its might, draw in a new military settlement nearby.',
        prompt: `Your faction is projecting power into new territory. Specify the fortress's unique design features, two strategic advantages it provides, an unexpected local reaction, and its role in your military structure.`,
        elementType: 'Settlement',
    },
    14: {
        name: 'Neighbor Expands',
        description: 'Choose one neighboring faction and add a new settlement for them.',
        prompt: `A neighboring faction is expanding. Detail the new settlement's distinctive features, two ways it affects your interests, one opportunity for cooperation, and potential future conflicts.`,
        elementType: 'Event',
    },
    15: {
        name: 'New Resource',
        description: 'Your Explorers have discovered a valuable new resource! Place a new resource symbol in your home region.',
        prompt: `A valuable new resource discovery changes everything. Describe the resource's unique properties, three immediate applications, one extraction challenge, and its impact on local politics and your faction's economy.`,
        elementType: 'Resource',
    },
    16: {
        name: 'Fantastic Landmark',
        description: 'Scouts have stumbled upon an impressive landmark. Draw it in then place a tribe nearby.',
        prompt: `A magnificent natural or magical landmark dominates the landscape. Detail its physical characteristics, local beliefs about its origin, two practical uses discovered, and its influence on local culture and settlement patterns.`,
        elementType: 'Location',
        handler: 'LANDMARK_TRIBE',
    },
    17: {
        name: 'Roaming Herds',
        description: 'Strange and magnificent beasts have been spotted. Draw in a symbol and name for these new creatures.',
        prompt: `Unique creatures roam your territories. Specify their distinctive features and behaviors, three potential resources they provide (hides, meat, magical components, etc.), one challenge to maintaining control, and their impact on local development.`, // Fixed prompt text which seemed truncated/merged in thought? No, just copied from backup
        elementType: 'Resource',
    },
    18: {
        name: 'Monster Awakens',
        description: 'Your scouts have disturbed and awakened a legendary monster, draw in a new monster and give it a name.',
        prompt: `A legendary creature emerges. Detail its unique characteristics and abilities, three ways it affects the territory (destruction, creation of new resources, magical effects), one unexpected benefit of its presence, and its influence on local development.`,
        elementType: 'Faction',
    },
};
