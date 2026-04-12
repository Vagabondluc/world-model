import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ARCHMAGE: SavedMonster = {
  "id": "srd-archmage",
  "name": "Archmage",
  "description": "An archmage is a powerful and influential spellcaster, having mastered the arcane arts through decades of study. They often act as advisors to royalty or lead magical academies.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "12 (15 with *mage armor*)",
      "hitPoints": "99 (18d8 + 18)",
      "speed": "30 ft.",
      "senses": "passive Perception 12",
      "languages": "any six languages",
      "challengeRating": "12 (8,400 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +1, INT +5, WIS +2, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "int": 9,
      "wis": 6
    },
    "abilitiesAndTraits": "**Magic Resistance.** The archmage has advantage on saving throws against spells and other magical effects.\n\n**Spellcasting.** The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast *disguise self* and *invisibility* at will and has the following wizard spells prepared:\n\n- Cantrips (at will): *fire bolt, light, mage hand, prestidigitation, shocking grasp*\n- 1st level (4 slots): *detect magic, identify, mage armor, magic missile*\n- 2nd level (3 slots): *detect thoughts, mirror image, misty step*\n- 3rd level (3 slots): *counterspell, fly, lightning bolt*\n- 4th level (3 slots): *banishment, fire shield, stoneskin*\n- 5th level (3 slots): *cone of cold, scrying, wall of force*\n- 6th level (1 slot): *globe of invulnerability*\n- 7th level (1 slot): *teleport*\n- 8th level (1 slot): *mind blank*\n- 9th level (1 slot): *time stop*",
    "actions": "**Dagger.** *Melee or Ranged Weapon Attack:* +6 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d4 + 2) piercing damage.",
    "roleplayingAndTactics": "An archmage is a highly intelligent and strategic combatant. They will use their spells to control the battlefield from a distance, using *fly*, *time stop*, or *globe of invulnerability* to gain an advantage. They view melee as a last resort."
  },
  "statblock": "### Archmage\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 12 (15 with *mage armor*)\n\n- **Hit Points** 99 (18d8 + 18)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 14 (+2) | 12 (+1) | 20 (+5) | 15 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Int +9, Wis +6\n- **Skills** Arcana +9, History +9\n\n- **Senses** passive Perception 12\n\n- **Languages** any six languages\n\n- **Challenge** 12 (8,400 XP)\n\n___\n\n***Magic Resistance.*** The archmage has advantage on saving throws against spells and other magical effects.\n\n***Spellcasting.*** The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast *disguise self* and *invisibility* at will and has the following wizard spells prepared:\n\n- Cantrips (at will): *fire bolt, light, mage hand, prestidigitation, shocking grasp*\n- 1st level (4 slots): *detect magic, identify, mage armor, magic missile*\n- 2nd level (3 slots): *detect thoughts, mirror image, misty step*\n- 3rd level (3 slots): *counterspell, fly, lightning bolt*\n- 4th level (3 slots): *banishment, fire shield, stoneskin*\n- 5th level (3 slots): *cone of cold, scrying, wall of force*\n- 6th level (1 slot): *globe of invulnerability*\n- 7th level (1 slot): *teleport*\n- 8th level (1 slot): *mind blank*\n- 9th level (1 slot): *time stop*\n\n### Actions\n***Dagger.*** *Melee or Ranged Weapon Attack:* +6 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d4 + 2) piercing damage."
};

export default SRD_MONSTER_ARCHMAGE;