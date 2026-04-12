
import { JobArchetype, ComplicationPack, RewardPack } from '../types/jobGenerator';

export const JOB_ARCHETYPES: JobArchetype[] = [
  {
    id: "escort",
    weight: 1.2,
    tags: ["travel", "protection"],
    biomeAffinity: ["plains", "forest", "road"],
    urgencyRange: [1, 3],
    minDanger: 1,
    maxDanger: 4,
    titleTemplates: [
      "Guard {target} on the Road to {destination}",
      "Seeking Trustworthy Escorts to {destination}",
      "Caravan Security Needed Through {biomeSummary}",
      "Bodyguards Needed: Protect {clientName}",
      "Wagon Transport Through Dangerous {biomeSummary}"
    ],
    summaryTemplates: [
      "A {clientType} named {clientName} needs protection along the route from {origin} to {destination}. Recent reports mention {threatSummary}.",
      "Merchants require aid moving goods through {biomeSummary}. {enemyTypePlural} have been sighted near the road."
    ],
    detailsTemplates: [
      "Protect {clientName} and their cargo along the path between {origin} and {destination}. The route crosses {biomeSummary}, where {threatDetail}. Departure is scheduled {departureTime}. Payment upon safe arrival.",
      "The caravan is lightly armed and vulnerable. The journey will take several days through {biomeSummary}. Expect trouble from {enemyTypePlural}."
    ],
    complicationPools: [ "ambushes", "secretCargo", "weather", "rivalGroup" ],
    rewardPools: [ "standardCoin", "favorOrContact", "magicItemChance" ]
  },
  {
    id: "hunt",
    weight: 1.8,
    tags: ["combat", "wilderness"],
    biomeAffinity: ["forest", "mountain", "swamp"],
    urgencyRange: [2, 4],
    minDanger: 2,
    maxDanger: 5,
    titleTemplates: [
      "Bounty: The {enemyType} of {locationName}",
      "Wanted Dead: Monster Threatening {origin}",
      "Hunt Down the {enemyType} Stalking the {biomeSummary}",
      "A Beast Terrorizes {origin}: {enemyType}!"
    ],
    summaryTemplates: [
      "{enemyTypePlural} have been attacking travelers near {origin}. Local guards offer payment for their elimination.",
      "The {enemyType} lairs near {locationName} and has become increasingly bold."
    ],
    detailsTemplates: [
      "Tracks lead toward {locationName}. Witnesses report {weirdEvent}. The creature grew more aggressive recently.",
      "{clientName} claims the creature may be mutated or cursed. Removing it will restore safety to {origin}."
    ],
    complicationPools: [ "ambushes", "rivalGroup", "environmentalHazard", "weather" ],
    rewardPools: [ "standardCoin", "magicItemChance" ]
  },
  {
    id: "retrieve",
    weight: 1.0,
    tags: ["exploration", "dungeon"],
    biomeAffinity: ["urban", "underdark"],
    urgencyRange: [1, 2],
    titleTemplates: [
      "Recover the Lost {item} of {clientName}",
      "Retrieval Mission: {locationName}",
      "Missing: {item}. Reward Offered.",
    ],
    summaryTemplates: [
      "{clientName} seeks brave souls to enter {locationName} and retrieve a stolen {item}.",
    ],
    detailsTemplates: [
      "The {item} was lost during a previous expedition to {locationName}. It is believed to be held by {enemyTypePlural} or hidden within the ruins. {clientName} emphasizes that discretion is paramount.",
    ],
    complicationPools: ["traps", "cursedItem", "rivalGroup"],
    rewardPools: ["standardCoin", "magicItemChance"],
  },
  {
    id: "investigate",
    weight: 0.8,
    tags: ["mystery", "social"],
    urgencyRange: [2, 3],
    biomeAffinity: ["urban"],
    titleTemplates: [
      "Mystery at {locationName}",
      "Disappearances in {origin}",
      "Truth Seekers Needed: The Case of {target}",
    ],
    summaryTemplates: [
      "Strange occurrences in {origin} have the locals on edge. {clientName} wants answers regarding the recent {weirdEvent}.",
    ],
    detailsTemplates: [
      "It started with {weirdEvent}, but now people are going missing. {clientName} suspects {enemyType} involvement or perhaps something darker. Investigate the clues at {locationName} and report back.",
    ],
    complicationPools: ["doubleCross", "hiddenCult", "misinformation"],
    rewardPools: ["standardCoin", "favorOrContact"],
  }
];

export const COMPLICATION_PACKS: ComplicationPack[] = [
  {
    id: "ambushes",
    weight: 2,
    templates: [
      "The route has seen {enemyType} ambushes in the last tenday.",
      "Scouts report fresh tracks belonging to {enemyTypePlural} near the planned path.",
    ],
    tags: ["combat", "travel"]
  },
  {
    id: "secretCargo",
    weight: 1,
    templates: [
      "The cargo includes something the client refuses to discuss, attracting the attention of {enemyTypePlural}.",
      "{clientName} is not being honest about what’s in the crates—there is a faint arcane hum that suggests hidden dangers.",
    ],
    tags: ["mystery", "twist"]
  },
  {
    id: "doubleCross",
    weight: 0.5,
    templates: [
      "A rival of {clientFactionName} has posted a counter-offer on a different board, promising extra gold if the party sabotages the job.",
      "{clientName} intends to frame the party for a crime once the job is done.",
    ],
    tags: ["social", "faction"]
  },
  {
    id: "weather",
    weight: 1.5,
    templates: [
        "A severe storm is approaching, making travel through {biomeSummary} treacherous.",
        "Unnatural fog has descended upon {locationName}, limiting visibility to a few feet."
    ],
    tags: ["environmental"]
  },
  {
      id: "rivalGroup",
      weight: 1,
      templates: [
          "Another adventuring party, 'The Iron Bastards', has also accepted this contract.",
          "Mercenaries hired by a third party are racing to get there first."
      ],
      tags: ["social", "combat"]
  }
];

export const REWARD_PACKS: RewardPack[] = [
  {
    id: "standardCoin",
    weight: 3,
    baseGold: 50,
    templates: [
      "{goldAmount} gp, paid upon successful completion.",
      "{goldAmount} gp and meals covered for the duration of the job.",
      "A bounty of {goldAmount} gp per head.",
    ],
  },
  {
    id: "favorOrContact",
    weight: 1.5,
    templates: [
      "An introduction to {importantNPC} and a standing favor from {clientFactionName}.",
      "Ongoing discounts at {clientBusinessName} and the gratitude of {clientFactionName}.",
      "Safe passage through {regionName} guaranteed by {clientName}.",
    ],
  },
  {
      id: "magicItemChance",
      weight: 0.5,
      templates: [
          "The pick of one minor magical item from {clientName}'s personal vault.",
          "{goldAmount} gp and a mysterious potion of unknown origin.",
      ]
  }
];

export const ENEMY_TABLE: Record<string, string[]> = {
    forest: ["bandits", "wolves", "goblins", "giant spiders", "owlbears"],
    swamp: ["lizardfolk", "hags", "giant crocodiles", "will-o'-wisps", "undead"],
    mountain: ["orcs", "harpies", "giants", "wyverns", "trolls"],
    desert: ["gnolls", "giant scorpions", "dust mephits", "blue dragon cultists"],
    coast: ["sahuagin", "pirates", "merrow", "sirens", "reef sharks"],
    urban: ["thieves", "doppelgangers", "corrupt guards", "cultists", "gang leaders"],
    underdark: ["drow", "quaggoths", "hook horrors", "mind flayers"],
    plains: ["bandits", "hyenas", "gnolls", "brigands"],
    default: ["monsters", "bandits", "wild beasts"]
};

export const JOB_THEMES = [
    "General / Mixed",
    "Mercenary Work",
    "Monster Hunting",
    "Political Intrigue",
    "Undead / Necromancy",
    "Exploration / Ruins",
    "Crime / Heist",
    "Magical Anomalies"
];
