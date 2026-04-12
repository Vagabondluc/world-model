

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_LIZARD: SavedMonster = {
  "id": "srd-lizard",
  "name": "Lizard",
  "description": "A common, small reptile found in nearly every climate. They are quick and agile, often seen basking on rocks or skittering into crevices.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "2 (1d4)",
      "speed": "20 ft., climb 20 ft.",
      "senses": "darkvision 30 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +0, CON +0, INT -5, WIS -1, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "A lizard is harmless and will flee from any creature larger than an insect. It poses no threat in combat."
  },
  "statblock": "### Lizard\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 2 (1d4)\n\n- **Speed** 20 ft., climb 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 11 (+0) | 10 (+0) | 1 (-5) | 8 (-1) | 3 (-4) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_LIZARD;