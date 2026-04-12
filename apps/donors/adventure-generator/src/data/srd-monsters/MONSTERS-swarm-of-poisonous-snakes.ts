
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SWARM_OF_POISONOUS_SNAKES: SavedMonster = {
  "id": "srd-swarm-of-poisonous-snakes",
  "name": "Swarm of Poisonous Snakes",
  "description": "A writhing mass of venomous snakes, this swarm is a deadly threat to any creature that stumbles into it. The ground seems to come alive with hissing, striking serpents.",
  "profile": {
    "table": {
      "creatureType": "Medium swarm of Tiny beasts",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "14",
      "hitPoints": "36 (8d8)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR -1, DEX +4, CON +0, INT -5, WIS +0, CHA -4",
      "role": ""
    },
    "abilitiesAndTraits": "**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. The swarm can't regain hit points or gain temporary hit points.",
    "actions": "",
    "roleplayingAndTactics": "The swarm strikes at any creature in its space, its many fangs delivering a potent poison. It is a territorial creature, defending its nest or hunting ground with mindless ferocity."
  },
  "statblock": "### Swarm of Poisonous Snakes\n\n*Medium swarm of Tiny beasts, unaligned*\n\n___\n\n- **Armor Class** 14\n\n- **Hit Points** 36 (8d8)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 18 (+4) | 11 (+0) | 1 (-5) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Senses** blindsight 10 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Swarm.*** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. The swarm can't regain hit points or gain temporary hit points."
};

export default SRD_MONSTER_SWARM_OF_POISONOUS_SNAKES;