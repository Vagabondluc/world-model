
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SWARM_OF_RATS: SavedMonster = {
  "id": "srd-swarm-of-rats",
  "name": "Swarm of Rats",
  "description": "A squeaking, surging tide of filth and disease, a swarm of rats can be found in sewers, dungeons, and other blighted places. They are carriers of plague and a symbol of urban decay.",
  "profile": {
    "table": {
      "creatureType": "Medium swarm of Tiny beasts",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "24 (7d8-7)",
      "speed": "30 ft.",
      "senses": "darkvision 30 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -1, DEX +0, CON -1, INT -4, WIS +0, CHA -4",
      "role": ""
    },
    "abilitiesAndTraits": "**Keen Smell.** The swarm has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain hit points or gain temporary hit points.",
    "actions": "",
    "roleplayingAndTactics": "A swarm of rats will overwhelm a single target, swarming over them with thousands of tiny bites. They are cowardly and will flee from fire or significant resistance, but a cornered swarm is a dangerous thing."
  },
  "statblock": "### Swarm of Rats\n\n*Medium swarm of Tiny beasts, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 24 (7d8-7)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 9 (-1) | 11 (+0) | 9 (-1) | 2 (-4) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Keen Smell.*** The swarm has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Swarm.*** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain hit points or gain temporary hit points."
};

export default SRD_MONSTER_SWARM_OF_RATS;