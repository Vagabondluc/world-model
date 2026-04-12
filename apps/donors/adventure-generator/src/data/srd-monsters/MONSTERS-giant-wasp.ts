import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_WASP: SavedMonster = {
  "id": "srd-giant-wasp",
  "name": "Giant Wasp",
  "description": "A monstrously large wasp, as big as a pony, with a glistening black-and-yellow carapace and a stinger the size of a shortsword.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "13 (3d8)",
      "speed": "10 ft., fly 50 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +0, INT -5, WIS +0, CHA -4",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "",
    "actions": "**Sting.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6+2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.",
    "roleplayingAndTactics": "Giant wasps are aggressive territorial hunters. They will attack any creature that comes near their nest, fighting with a suicidal fury. They attack from the air, delivering a potent, paralyzing sting."
  },
  "statblock": "### Giant Wasp\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 13 (3d8)\n\n- **Speed** 10 ft., fly 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 14 (+2) | 10 (+0) | 1 (-5) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n### Actions\n***Sting.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6+2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
};

export default SRD_MONSTER_GIANT_WASP;