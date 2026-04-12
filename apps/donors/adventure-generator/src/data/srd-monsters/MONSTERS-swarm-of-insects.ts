
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SWARM_OF_INSECTS: SavedMonster = {
  "id": "srd-swarm-of-insects",
  "name": "Swarm of Insects",
  "description": "A cloud of biting and stinging insects, this swarm can be composed of anything from locusts to wasps. They move as one, a buzzing, crawling carpet of death.",
  "profile": {
    "table": {
      "creatureType": "Medium swarm of Tiny beasts",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "22 (5d8)",
      "speed": "20 ft., climb 20 ft.",
      "senses": "blindsight 10 ft., passive Perception 8",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -4, DEX +1, CON +0, INT -5, WIS -2, CHA -5",
      "role": ""
    },
    "abilitiesAndTraits": "**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
    "actions": "**Bites.** *Melee Weapon Attack:* +3 to hit, reach 0 ft., one target in the swarm's space. *Hit:* 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer.",
    "roleplayingAndTactics": "A swarm of insects is a mindless, consuming force. It will swarm over any living creature in its path, its thousands of bites causing a death by a thousand cuts. Fire is particularly effective at dispersing the swarm."
  },
  "statblock": "### Swarm of Insects\n\n*Medium swarm of Tiny beasts, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 22 (5d8)\n\n- **Speed** 20 ft., climb 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 13 (+1) | 10 (+0) | 1 (-5) | 7 (-2) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 10 ft., passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Swarm.*** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.\n\n### Actions\n***Bites.*** *Melee Weapon Attack:* +3 to hit, reach 0 ft., one target in the swarm's space. *Hit:* 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer."
};

export default SRD_MONSTER_SWARM_OF_INSECTS;