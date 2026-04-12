
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PURPLE_WORM: SavedMonster = {
  "id": "srd-purple-worm",
  "name": "Purple Worm",
  "description": "A gargantuan, purple-hued worm that burrows through the earth of the Underdark, consuming everything in its path. Its massive maw can swallow a creature whole, and its tail ends in a deadly poison stinger.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan monstrosity",
      "size": "Gargantuan",
      "alignment": "unaligned",
      "armorClass": "18 (natural armor)",
      "hitPoints": "247 (15d20+90)",
      "speed": "50 ft., burrow 30 ft.",
      "senses": "blindsight 30 ft., tremorsense 60 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "15 (13,000 XP)",
      "keyAbilities": "STR +9, DEX -2, CON +6, INT -5, WIS -1, CHA -3",
      "role": "Brute"
    },
    "savingThrows": {
        "con": 11,
        "wis": 4
    },
    "abilitiesAndTraits": "**Tunneler.** The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot diameter tunnel in its wake.",
    "actions": "**Multiattack.** The worm makes two attacks: one with its bite and one with its stinger.\n\n**Bite.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 22 (3d8+9) piercing damage. If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm. A swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the worm, and it takes 21 (6d6) acid damage at the start of each of the worm's turns.\n\n**Tail Stinger.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one creature. *Hit:* 19 (3d6+9) piercing damage, and the target must make a DC 19 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "The purple worm is a mindless engine of destruction, driven by a constant, ravenous hunger. It uses its tremorsense to locate prey from below, erupting from the ground to swallow a target. It will use its stinger to fend off other attackers while it digests its meal."
  },
  "statblock": "### Purple Worm\n\n*Gargantuan monstrosity, unaligned*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 247 (15d20+90)\n\n- **Speed** 50 ft., burrow 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 28 (+9) | 7 (-2) | 22 (+6) | 1 (-5) | 8 (-1) | 4 (-3) |\n\n___\n\n- **Saving Throws** Con +11, Wis +4\n- **Senses** blindsight 30 ft., tremorsense 60 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 15 (13,000 XP)\n\n___\n\n***Tunneler.*** The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot diameter tunnel in its wake.\n\n### Actions\n***Multiattack.*** The worm makes two attacks: one with its bite and one with its stinger.\n\n***Bite.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 22 (3d8+9) piercing damage. If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm. A swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the worm, and it takes 21 (6d6) acid damage at the start of each of the worm's turns.\n\n***Tail Stinger.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one creature. *Hit:* 19 (3d6+9) piercing damage, and the target must make a DC 19 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_PURPLE_WORM;
