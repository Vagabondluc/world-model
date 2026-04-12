
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WILL_O_WISP: SavedMonster = {
  "id": "srd-will-o-wisp",
  "name": "Will-o'-Wisp",
  "description": "Will-o'-wisps are malevolent, wispy balls of light that haunt lonely places and battlefields, feeding on fear and despair. They lure travelers to their doom with their faint, flickering light.",
  "profile": {
    "table": {
      "creatureType": "Tiny undead",
      "size": "Tiny",
      "alignment": "chaotic evil",
      "armorClass": "19",
      "hitPoints": "22 (9d4)",
      "speed": "0 ft., fly 50 ft. (hover)",
      "senses": "darkvision 120 ft., passive Perception 12",
      "languages": "the languages it knew in life",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR -5, DEX +9, CON +0, INT +1, WIS +2, CHA +0",
      "role": ""
    },
    "savingThrows": {
      "int": 4,
      "wis": 5,
      "cha": 3
    },
    "abilitiesAndTraits": "**Consume Life.** As a bonus action, the will-o'-wisp can target one creature it can see within 5 feet of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points.\n\n**Ephemeral.** The will-o'-wisp can't wear or carry anything.\n\n**Incorporeal Movement.** The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n**Variable Illumination.** The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of feet equal to the chosen radius. The will-o'-wisp can alter the radius as a bonus action.",
    "actions": "**Shock.** *Melee Spell Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 9 (2d8) lightning damage.",
    "roleplayingAndTactics": "Will-o'-wisps are not direct combatants. They use their invisibility and incorporeal nature to drain the life from downed or dying creatures. They will lure adventurers into traps or other dangers, feeding on the negative emotions."
  },
  "statblock": "### Will-o'-Wisp\n\n*Tiny undead, chaotic evil*\n\n___\n\n- **Armor Class** 19\n\n- **Hit Points** 22 (9d4)\n\n- **Speed** 0 ft., fly 50 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 1 (-5) | 28 (+9) | 10 (+0) | 13 (+1) | 14 (+2) | 11 (+0) |\n\n___\n\n- **Saving Throws** Int +4, Wis +5, Cha +3\n- **Senses** darkvision 120 ft., passive Perception 12\n\n- **Languages** the languages it knew in life\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Consume Life.*** As a bonus action, the will-o'-wisp can target one creature it can see within 5 feet of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points.\n\n***Ephemeral.*** The will-o'-wisp can't wear or carry anything.\n\n***Incorporeal Movement.*** The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n***Variable Illumination.*** The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of feet equal to the chosen radius. The will-o'-wisp can alter the radius as a bonus action.\n\n### Actions\n***Shock.*** *Melee Spell Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 9 (2d8) lightning damage."
};

export default SRD_MONSTER_WILL_O_WISP;
