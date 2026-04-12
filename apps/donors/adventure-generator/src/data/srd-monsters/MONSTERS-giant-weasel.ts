import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_WEASEL: SavedMonster = {
  "id": "srd-giant-weasel",
  "name": "Giant Weasel",
  "description": "A surprisingly large and ferocious predator, the giant weasel is a relentless hunter known for its speed and agility.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "9 (2d8)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +0, DEX +3, CON +0, INT -3, WIS +1, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage.",
    "roleplayingAndTactics": "Giant weasels are quick and deadly hunters, often preying on creatures larger than themselves. They use their speed to outmaneuver prey before delivering a powerful bite to the neck."
  },
  "statblock": "### Giant Weasel\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 9 (2d8)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 16 (+3) | 10 (+0) | 4 (-3) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Skills** Perception +3, Stealth +5\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Keen Hearing and Smell.*** The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage."
};

export default SRD_MONSTER_GIANT_WEASEL;