import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GRIMLOCK: SavedMonster = {
  "id": "srd-grimlock",
  "name": "Grimlock",
  "description": "Grimlocks are degenerate, subterranean humanoids who were once human. Their eyes have completely atrophied, leaving them blind, but they have developed keen senses of hearing and smell.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (grimlock)",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "11",
      "hitPoints": "11 (2d8+2)",
      "speed": "30 ft.",
      "senses": "blindsight 30 ft. or 10 ft. while deafened (blind beyond this radius), passive Perception 13",
      "languages": "Undercommon",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +1, INT -1, WIS -1, CHA -2",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Blind Senses.** The grimlock can't use its blindsight while deafened and unable to smell.\n\n**Keen Hearing and Smell.** The grimlock has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Stone Camouflage.** The grimlock has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
    "actions": "**Spiked Bone Club.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage.",
    "roleplayingAndTactics": "Grimlocks are savage hunters who use their stone camouflage to ambush prey in the Underdark. They fight with crude clubs made from bone and stone. Their society is primitive, and they are often enslaved by more powerful subterranean races like mind flayers."
  },
  "statblock": "### Grimlock\n\n*Medium humanoid (grimlock), neutral evil*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 12 (+1) | 12 (+1) | 9 (-1) | 8 (-1) | 6 (-2) |\n\n___\n\n- **Skills** Athletics +5, Perception +3, Stealth +3\n\n- **Senses** blindsight 30 ft. or 10 ft. while deafened (blind beyond this radius), passive Perception 13\n\n- **Languages** Undercommon\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Blind Senses.*** The grimlock can't use its blindsight while deafened and unable to smell.\n\n***Keen Hearing and Smell.*** The grimlock has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Stone Camouflage.*** The grimlock has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n#### Actions\n\n***Spiked Bone Club.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage."
};