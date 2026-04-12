import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_LIZARD: SavedMonster = {
  "id": "srd-giant-lizard",
  "name": "Giant Lizard",
  "description": "These swift, predatory reptiles are found in a variety of warm climates. Some can be trained as mounts, especially by reptilian races like lizardfolk.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "19 (3d10+3)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "darkvision 30 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +1, INT -4, WIS +0, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "Some giant lizards have a swimming speed of 30 feet and can hold their breath for 15 minutes.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage.",
    "roleplayingAndTactics": "A giant lizard is a simple predator. It relies on its speed and climbing ability to get into an advantageous position before striking with its powerful bite. When used as a mount, it is a formidable part of a cavalry charge."
  },
  "statblock": "### Giant Lizard\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 12 (+1) | 13 (+1) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage."
};

export default SRD_MONSTER_GIANT_LIZARD;