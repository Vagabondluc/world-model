
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RED_DRAGON_WYRMLING_CHROMATIC: SavedMonster = {
  "id": "srd-red-dragon-wyrmling-chromatic",
  "name": "Red Dragon Wyrmling (Chromatic)",
  "description": "Even as a hatchling, a red dragon is a creature of immense vanity, greed, and destructive power. Its scales are the color of fire and its heart burns with a rage that will one day level mountains.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "75 (10d8+30)",
      "speed": "30 ft., climb 30 ft., fly 60 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT +1, WIS +0, CHA +2",
      "role": "Brute"
    },
    "savingThrows": {
        "dex": 2,
        "con": 5,
        "wis": 2,
        "cha": 4
    },
    "abilitiesAndTraits": "**Immunity to Fire.** Red dragons are immune to fire damage.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (1d10+4) piercing damage plus 3 (1d6) fire damage.\n\n**Fire Breath (Recharge 5-6).** The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A red dragon wyrmling is arrogant and aggressive. It will use its fire breath at the first opportunity and will fight with a ferocity that belies its small size. It believes itself to be the rightful owner of anything it can see."
  },
  "statblock": "### Red Dragon Wyrmling (Chromatic)\n\n*Medium dragon, chaotic evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 75 (10d8+30)\n\n- **Speed** 30 ft., climb 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 17 (+3) | 12 (+1) | 11 (+0) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +2, Con +5, Wis +2, Cha +4\n- **Skills** Perception +4, Stealth +2\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (1d10+4) piercing damage plus 3 (1d6) fire damage.\n\n***Fire Breath (Recharge 5-6).*** The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_RED_DRAGON_WYRMLING_CHROMATIC;
