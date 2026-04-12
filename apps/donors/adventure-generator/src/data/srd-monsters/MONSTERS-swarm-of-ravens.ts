
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SWARM_OF_RAVENS: SavedMonster = {
  "id": "srd-swarm-of-ravens",
  "name": "Swarm of Ravens",
  "description": "A flock of ravens, often called an 'unkindness,' can be an unsettling sight. When they swarm, they can be a disorienting flurry of black wings and sharp beaks.",
  "profile": {
    "table": {
      "creatureType": "Medium swarm of Tiny beasts",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "24 (7d8-7)",
      "speed": "10 ft., fly 50 ft.",
      "senses": "passive Perception 15",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -2, DEX +2, CON -1, INT -4, WIS +1, CHA -2",
      "role": ""
    },
    "abilitiesAndTraits": "**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. The swarm can't regain hit points or gain temporary hit points.",
    "actions": "",
    "roleplayingAndTactics": "A swarm of ravens is not typically aggressive but can be a dangerous distraction. They will swarm a target, pecking and clawing, making it difficult for the creature to concentrate or see."
  },
  "statblock": "### Swarm of Ravens\n\n*Medium swarm of Tiny beasts, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 24 (7d8-7)\n\n- **Speed** 10 ft., fly 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 14 (+2) | 8 (-1) | 3 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Skills** Perception +5\n\n- **Senses** passive Perception 15\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Swarm.*** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. The swarm can't regain hit points or gain temporary hit points."
};

export default SRD_MONSTER_SWARM_OF_RAVENS;