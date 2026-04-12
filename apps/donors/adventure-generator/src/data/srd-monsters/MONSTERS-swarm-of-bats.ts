
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SWARM_OF_BATS: SavedMonster = {
  "id": "srd-swarm-of-bats",
  "name": "Swarm of Bats",
  "description": "A swarm of bats is a disorienting cloud of flapping wings and high-pitched screeches. They are a common hazard in caves and ruins.",
  "profile": {
    "table": {
      "creatureType": "Medium swarm of Tiny beasts",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "22 (5d8)",
      "speed": "0 ft., fly 30 ft.",
      "senses": "blindsight 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -3, DEX +2, CON +0, INT -4, WIS +1, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "**Echolocation.** The swarm can't use its blindsight while deafened.\n\n**Keen Hearing.** The swarm has advantage on Wisdom (Perception) checks that rely on hearing.\n\n**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can't regain hit points or gain temporary hit points.",
    "actions": "",
    "roleplayingAndTactics": "A swarm of bats is not particularly dangerous but can be a nuisance, obscuring vision and potentially extinguishing light sources. They will attack any creature that disturbs their roost, but will disperse if they take significant damage."
  },
  "statblock": "### Swarm of Bats\n\n*Medium swarm of Tiny beasts, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 22 (5d8)\n\n- **Speed** 0 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 5 (-3) | 15 (+2) | 10 (+0) | 2 (-4) | 12 (+1) | 4 (-3) |\n\n___\n\n- **Senses** blindsight 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Echolocation.*** The swarm can't use its blindsight while deafened.\n\n***Keen Hearing.*** The swarm has advantage on Wisdom (Perception) checks that rely on hearing.\n\n***Swarm.*** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can't regain hit points or gain temporary hit points."
};

export default SRD_MONSTER_SWARM_OF_BATS;