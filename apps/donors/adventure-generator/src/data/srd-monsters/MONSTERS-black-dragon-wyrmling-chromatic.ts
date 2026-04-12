

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BLACK_DRAGON_WYRMLING_CHROMATIC: SavedMonster = {
  "id": "srd-black-dragon-wyrmling-chromatic",
  "name": "Black Dragon Wyrmling (Chromatic)",
  "description": "Even as a hatchling, a black dragon possesses a cruel and sadistic nature. It enjoys tormenting smaller creatures from the safety of its swampy home.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "33 (6d8+6)",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +1, INT +0, WIS +0, CHA +1",
      "role": "Artillery"
    },
    "savingThrows": {
      "dex": 4,
      "con": 3,
      "wis": 2,
      "cha": 3
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 2 (1d4) acid damage.\n\n**Acid Breath (Recharge 5-6).** The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A black dragon wyrmling is a cowardly fighter, preferring to use its Acid Breath from a distance or while hidden in murky water. It will flee from a fair fight, but will viciously attack any creature it thinks it can kill without risk."
  },
  "statblock": "### Black Dragon Wyrmling (Chromatic)\n\n*Medium dragon, chaotic evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 33 (6d8+6)\n\n- **Speed** 30 ft., fly 60 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 14 (+2) | 13 (+1) | 10 (+0) | 11 (+0) | 13 (+1) |\n\n___\n\n- **Saving Throws** Dex +4, Con +3, Wis +2, Cha +3\n- **Skills** Perception +4, Stealth +4\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 2 (1d4) acid damage.\n\n***Acid Breath (Recharge 5-6).*** The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_BLACK_DRAGON_WYRMLING_CHROMATIC;