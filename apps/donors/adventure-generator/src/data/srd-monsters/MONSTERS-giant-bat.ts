import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_BAT: SavedMonster = {
  "id": "srd-giant-bat",
  "name": "Giant Bat",
  "description": "The bat can't use its blindsight while deafened.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "22 (4d10)",
      "speed": "10 ft., fly 60 ft.",
      "senses": "blindsight 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +2, DEX +3, CON +0, INT -4, WIS +1, CHA -2",
      "role": ""
    },
    "abilitiesAndTraits": "**Echolocation.** The bat can't use its blindsight while deafened.\n\n**Keen Hearing.** The bat has advantage on Wisdom (Perception) checks that rely on hearing.",
    "actions": "",
    "roleplayingAndTactics": ""
  },
  "statblock": "### Giant Bat\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 22 (4d10)\n\n- **Speed** 10 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 16 (+3) | 11 (+0) | 2 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Senses** blindsight 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Echolocation.*** The bat can't use its blindsight while deafened.\n\n***Keen Hearing.*** The bat has advantage on Wisdom (Perception) checks that rely on hearing."
};

export default SRD_MONSTER_GIANT_BAT;