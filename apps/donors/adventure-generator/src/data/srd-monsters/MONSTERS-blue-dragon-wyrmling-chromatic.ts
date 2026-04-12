

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BLUE_DRAGON_WYRMLING_CHROMATIC: SavedMonster = {
  "id": "srd-blue-dragon-wyrmling-chromatic",
  "name": "Blue Dragon Wyrmling (Chromatic)",
  "description": "A young blue dragon is a vain and deadly hunter of the desert. Even at a young age, it enjoys lording its power over lesser creatures and carving out a territory for itself.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "52 (8d8+16)",
      "speed": "30 ft., burrow 15 ft., fly 60 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +2, INT +1, WIS +0, CHA +2",
      "role": "Artillery"
    },
    "savingThrows": {
      "dex": 2,
      "con": 4,
      "wis": 2,
      "cha": 4
    },
    "abilitiesAndTraits": "**Immunity to Lightning.** Blue dragons are immune to lightning damage.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage plus 3 (1d6) lightning damage.\n\n**Lightning Breath (Recharge 5-6).** The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A blue dragon wyrmling uses its burrow speed to create ambushes, emerging from the sand to unleash its lightning breath before flying out of reach. It is arrogant and will taunt its prey, but it will flee if seriously injured."
  },
  "statblock": "### Blue Dragon Wyrmling (Chromatic)\n\n*Medium dragon, lawful evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 52 (8d8+16)\n\n- **Speed** 30 ft., burrow 15 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 10 (+0) | 15 (+2) | 12 (+1) | 11 (+0) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +2, Con +4, Wis +2, Cha +4\n- **Skills** Perception +4, Stealth +2\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 3 (700 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage plus 3 (1d6) lightning damage.\n\n***Lightning Breath (Recharge 5-6).*** The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_BLUE_DRAGON_WYRMLING_CHROMATIC;