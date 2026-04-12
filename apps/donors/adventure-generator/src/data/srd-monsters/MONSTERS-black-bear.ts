
// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BLACK_BEAR: SavedMonster = {
  "id": "srd-black-bear",
  "name": "Black Bear",
  "description": "These omnivorous mammals are common in temperate forests. While typically shy, they can be fierce when defending their cubs or a food source.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "19 (3d8+6)",
      "speed": "40 ft., climb 30 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +2, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Smell.** The bear has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Multiattack.** The bear makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4+2) slashing damage.",
    "roleplayingAndTactics": "A black bear will usually try to intimidate intruders with roars before attacking. If it attacks, it uses its multiattack to bite and claw a single target. It will flee if seriously wounded, unless its cubs are nearby."
  },
  "statblock": "### Black Bear\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 19 (3d8+6)\n\n- **Speed** 40 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 10 (+0) | 14 (+2) | 2 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Keen Smell.*** The bear has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Multiattack.*** The bear makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4+2) slashing damage."
};

export default SRD_MONSTER_BLACK_BEAR;