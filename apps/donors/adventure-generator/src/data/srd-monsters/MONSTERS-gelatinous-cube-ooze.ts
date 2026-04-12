
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GELATINOUS_CUBE_OOZE: SavedMonster = {
  "id": "srd-gelatinous-cube-ooze",
  "name": "Gelatinous Cube (Ooze)",
  "description": "This transparent cube of quivering slime scours dungeon corridors, engulfing everything in its path. It digests organic matter and leaves behind only clean bones and metal gear.",
  "profile": {
    "table": {
      "creatureType": "Large ooze",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "6",
      "hitPoints": "84 (8d10+40)",
      "speed": "15 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 8",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX -4, CON +5, INT -5, WIS -2, CHA -5",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Ooze Cube.** The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw.\n\n**Transparent.** Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of the cube is surprised by the cube.",
    "actions": "**Pseudopod.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 10 (3d6) acid damage.\n\n**Engulf.** The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw.\n\nOn a successful save, the creature can choose to be pushed 5 feet back or to the side of the cube. A creature that chooses not to be pushed suffers the consequences of a failed saving throw.\n\nOn a failed save, the cube enters the creature's space, and the creature takes 10 (3d6) acid damage and is engulfed. The engulfed creature is restrained, it has total cover against attacks and other effects outside the cube, and it takes 21 (6d6) acid damage at the start of each of the cube's turns. When the cube moves, the engulfed creature moves with it.\n\nAn engulfed creature can try to escape by taking an action to make a DC 12 Strength check. On a success, the creature escapes and enters a space of its choice within 5 feet of the cube.",
    "roleplayingAndTactics": "The gelatinous cube is a mindless scavenger. It moves slowly through corridors, relying on its transparency to trap unwary adventurers. It attacks by moving directly into the space of its prey to Engulf them. It has no strategy other than to consume."
  },
  "statblock": "### Gelatinous Cube (Ooze)\n\n*Large ooze, unaligned*\n\n___\n\n- **Armor Class** 6\n\n- **Hit Points** 84 (8d10+40)\n\n- **Speed** 15 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 3 (-4) | 20 (+5) | 1 (-5) | 6 (-2) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Ooze Cube.*** The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw.\n\n***Transparent.*** Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of the cube is surprised by the cube.\n\n### Actions\n***Pseudopod.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 10 (3d6) acid damage.\n\n***Engulf.*** The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw."
};

export default SRD_MONSTER_GELATINOUS_CUBE_OOZE;
