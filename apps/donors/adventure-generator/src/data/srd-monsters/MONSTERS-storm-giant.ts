
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_STORM_GIANT: SavedMonster = {
  "id": "srd-storm-giant",
  "name": "Storm Giant",
  "description": "Storm giants are the most powerful and majestic of the giants, dwelling in castles on cloud islands or in the depths of the ocean. They are wise, reclusive, and command the power of the storm.",
  "profile": {
    "table": {
      "creatureType": "Huge giant",
      "size": "Huge",
      "alignment": "chaotic good",
      "armorClass": "16 (scale mail)",
      "hitPoints": "230 (20d12+100)",
      "speed": "50 ft., swim 50 ft.",
      "senses": "passive Perception 19",
      "languages": "Common, Giant",
      "challengeRating": "13 (10,000 XP)",
      "keyAbilities": "STR +9, DEX +2, CON +5, INT +3, WIS +4, CHA +4",
      "role": "Artillery"
    },
    "savingThrows": {
      "str": 14,
      "con": 10,
      "wis": 9,
      "cha": 9
    },
    "abilitiesAndTraits": "**Amphibious.** The giant can breathe air and water.\n\n**Innate Spellcasting.** The giant's innate spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components:\nAt will: *detect magic, feather fall, levitate, light*\n3/day each: *control weather, water breathing*",
    "actions": "**Multiattack.** The giant makes two greatsword attacks.\n\n**Greatsword.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 30 (6d6+9) slashing damage.\n\n**Rock.** *Ranged Weapon Attack:* +14 to hit, range 60/240 ft., one target. *Hit:* 35 (4d12+9) bludgeoning damage.\n\n**Lightning Strike (Recharge 5-6).** The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Storm giants are benevolent but aloof. They will only intervene in mortal affairs when a great threat emerges. In combat, they are devastating, hurling lightning bolts and massive rocks, and their greatswords strike with the force of a thunderclap."
  },
  "statblock": "### Storm Giant\n\n*Huge giant, chaotic good*\n\n___\n\n- **Armor Class** 16 (scale mail)\n\n- **Hit Points** 230 (20d12+100)\n\n- **Speed** 50 ft., swim 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 29 (+9) | 14 (+2) | 20 (+5) | 16 (+3) | 18 (+4) | 18 (+4) |\n\n___\n\n- **Saving Throws** Str +14, Con +10, Wis +9, Cha +9\n- **Skills** Arcana +8, Athletics +14, History +8, Perception +9\n\n- **Senses** passive Perception 19\n\n- **Languages** Common, Giant\n\n- **Challenge** 13 (10,000 XP)\n\n___\n\n***Amphibious.*** The giant can breathe air and water.\n\n***Innate Spellcasting.*** The giant's innate spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components\n\n### Actions\n***Multiattack.*** The giant makes two greatsword attacks.\n\n***Greatsword.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 30 (6d6+9) slashing damage.\n\n***Rock.*** *Ranged Weapon Attack:* +14 to hit, range 60/240 ft., one target. *Hit:* 35 (4d12+9) bludgeoning damage.\n\n***Lightning Strike (Recharge 5-6).*** The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_STORM_GIANT;