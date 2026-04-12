
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DEER: SavedMonster = {
  "id": "srd-deer",
  "name": "Deer",
  "description": "A graceful, fleet-footed herbivore common in forests and plains. Deer are timid and will flee from most dangers.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "4 (1d8)",
      "speed": "50 ft.",
      "senses": "passive Perception 12",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR +0, DEX +3, CON +0, INT -4, WIS +2, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) piercing damage.",
    "roleplayingAndTactics": "Deer are not combatants and will always choose to flee. Their high speed makes them difficult to catch. Only a cornered or magically compelled deer will attack, and even then, it will seek any opportunity to escape."
  },
  "statblock": "### Deer\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 4 (1d8)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 16 (+3) | 11 (+0) | 2 (-4) | 14 (+2) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) piercing damage."
};

export default SRD_MONSTER_DEER;