import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FLYING_SNAKE: SavedMonster = {
  "id": "srd-flying-snake",
  "name": "Flying Snake",
  "description": "The snake doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "14",
      "hitPoints": "5 (2d4)",
      "speed": "30 ft., fly 60 ft., swim 30 ft",
      "senses": "blindsight 10 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR -3, DEX +4, CON +0, INT -4, WIS +1, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "**Flyby.** The snake doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage plus 7 (3d4) poison damage.",
    "roleplayingAndTactics": ""
  },
  "statblock": "### Flying Snake\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 14\n\n- **Hit Points** 5 (2d4)\n\n- **Speed** 30 ft., fly 60 ft., swim 30 ft\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 4 (-3) | 18 (+4) | 11 (+0) | 2 (-4) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Senses** blindsight 10 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Flyby.*** The snake doesn't provoke opportunity attacks when it flies out of an enemy's reach.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage plus 7 (3d4) poison damage."
};

export default SRD_MONSTER_FLYING_SNAKE;