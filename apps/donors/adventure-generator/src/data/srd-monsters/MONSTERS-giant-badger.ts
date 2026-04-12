
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_BADGER: SavedMonster = {
  "id": "srd-giant-badger",
  "name": "Giant Badger",
  "description": "An overgrown cousin of the common badger, this creature is fierce and territorial. It uses its powerful claws for burrowing and defense.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "13 (2d8+4)",
      "speed": "30 ft., burrow 10 ft.",
      "senses": "darkvision 30 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +0, CON +2, INT -4, WIS +1, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Smell.** The badger has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Multiattack.** The badger makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 6 (2d4+1) slashing damage.",
    "roleplayingAndTactics": "Giant badgers are aggressive if provoked or cornered. They use their multiattack to inflict damage quickly. If outnumbered, they may attempt to burrow to safety."
  },
  "statblock": "### Giant Badger\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 13 (2d8+4)\n\n- **Speed** 30 ft., burrow 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 10 (+0) | 15 (+2) | 2 (-4) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Keen Smell.*** The badger has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Multiattack.*** The badger makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 6 (2d4+1) slashing damage."
};

export default SRD_MONSTER_GIANT_BADGER;
