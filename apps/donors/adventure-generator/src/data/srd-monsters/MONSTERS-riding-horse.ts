
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RIDING_HORSE: SavedMonster = {
  "id": "srd-riding-horse",
  "name": "Riding Horse",
  "description": "A light horse bred for speed and agility, commonly used as a mount by scouts, messengers, and travelers.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "13 (2d10+2)",
      "speed": "60 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +1, INT -4, WIS +0, CHA -2",
      "role": ""
    },
    "abilitiesAndTraits": "",
    "actions": "**Hooves.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (2d4+3) bludgeoning damage.",
    "roleplayingAndTactics": "Riding horses are not trained for combat and will flee from danger if their rider is dismounted. They are prized for their speed and endurance."
  },
  "statblock": "### Riding Horse\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 13 (2d10+2)\n\n- **Speed** 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 10 (+0) | 12 (+1) | 2 (-4) | 11 (+0) | 7 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (2d4+3) bludgeoning damage."
};

export default SRD_MONSTER_RIDING_HORSE;
