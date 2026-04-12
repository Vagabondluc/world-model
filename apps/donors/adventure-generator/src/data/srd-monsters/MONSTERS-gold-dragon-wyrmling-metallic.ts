import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GOLD_DRAGON_WYRMLING_METALLIC: SavedMonster = {
  "id": "srd-gold-dragon-wyrmling-metallic",
  "name": "Gold Dragon Wyrmling (Metallic)",
  "description": "Even as a hatchling, a gold dragon is a force for good, wise beyond its years. Its scales gleam like the sun, and it possesses a natural curiosity about the world and its inhabitants.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "lawful good",
      "armorClass": "17 (natural armor)",
      "hitPoints": "60 (8d8+24)",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT +2, WIS +0, CHA +3",
      "role": "Leader"
    },
    "savingThrows": {
      "dex": 4,
      "con": 5,
      "wis": 2,
      "cha": 5
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (1d10+4) piercing damage.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons.\n- **Fire Breath.** The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much damage on a successful one.\n- **Weakening Breath.** The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute.",
    "roleplayingAndTactics": "A gold dragon wyrmling avoids combat, preferring to talk and learn. If forced to fight, it uses its Weakening Breath to disable strong foes before using its Fire Breath. It will always prioritize protecting the innocent."
  },
  "statblock": "### Gold Dragon Wyrmling (Metallic)\n\n*Medium dragon, lawful good*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 60 (8d8+24)\n\n- **Speed** 30 ft., fly 60 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 14 (+2) | 17 (+3) | 14 (+2) | 11 (+0) | 16 (+3) |\n\n___\n\n- **Saving Throws** Dex +4, Con +5, Wis +2, Cha +5\n- **Skills** Perception +4, Stealth +4\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (1d10+4) piercing damage.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons."
};

export default SRD_MONSTER_GOLD_DRAGON_WYRMLING_METALLIC;