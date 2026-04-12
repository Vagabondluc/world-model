
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WOLF: SavedMonster = {
  "id": "srd-wolf",
  "name": "Wolf",
  "description": "A common predator of the forests and plains, the wolf is a symbol of the wild. They are intelligent pack hunters, known for their cunning and coordination.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "11 (2d8+2)",
      "speed": "40 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +1, INT -4, WIS +1, CHA -2",
      "role": ""
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Pack Tactics.** The wolf has advantage on attack rolls against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "",
    "roleplayingAndTactics": "Wolves hunt in packs, using their superior numbers and Pack Tactics to surround and overwhelm their prey. They will work together to harry and knock down a target before moving in for the kill."
  },
  "statblock": "### Wolf\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 15 (+2) | 12 (+1) | 3 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Skills** Perception +3, Stealth +4\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Keen Hearing and Smell.*** The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Pack Tactics.*** The wolf has advantage on attack rolls against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated."
};

export default SRD_MONSTER_WOLF;
