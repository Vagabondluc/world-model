import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BRONZE_DRAGON_WYRMLING_METALLIC: SavedMonster = {
  "id": "srd-bronze-dragon-wyrmling-metallic",
  "name": "Bronze Dragon Wyrmling (Metallic)",
  "description": "Young bronze dragons are playful and curious, with a strong sense of justice. They enjoy watching ships and often rescue sailors from drowning.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "lawful good",
      "armorClass": "17 (natural armor)",
      "hitPoints": "32 (5d8+10)",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +2, INT +1, WIS +0, CHA +2",
      "role": "Soldier"
    },
    "savingThrows": {
      "dex": 2,
      "con": 4,
      "wis": 2,
      "cha": 4
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons:\n- **Lightning Breath.** The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much damage on a successful one.\n- **Repulsion Breath.** The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon.",
    "roleplayingAndTactics": "Bronze wyrmlings are inquisitive and fascinated by mortals. They avoid fights but will use their breath weapons to defend themselves or others if necessary, preferring Repulsion Breath to drive off threats non-lethally."
  },
  "statblock": "### Bronze Dragon Wyrmling (Metallic)\n\n*Medium dragon, lawful good*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 32 (5d8+10)\n\n- **Speed** 30 ft., fly 60 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 10 (+0) | 15 (+2) | 12 (+1) | 11 (+0) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +2, Con +4, Wis +2, Cha +4\n- **Skills** Perception +4, Stealth +2\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons:\n- **Lightning Breath.** The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much damage on a successful one.\n- **Repulsion Breath.** The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon."
};

export default SRD_MONSTER_BRONZE_DRAGON_WYRMLING_METALLIC;