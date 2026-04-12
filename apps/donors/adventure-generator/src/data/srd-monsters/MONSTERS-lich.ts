

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_LICH: SavedMonster = {
  "id": "srd-lich",
  "name": "Lich",
  "description": "A lich is a powerful spellcaster who has embraced undeath to achieve immortality. They are master strategists and archmages, their minds filled with arcane secrets and their souls bound to a magical phylactery.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "any evil alignment",
      "armorClass": "17 (natural armor)",
      "hitPoints": "135 (18d8+54)",
      "speed": "30 ft.",
      "senses": "truesight 120 ft., passive Perception 19",
      "languages": "Common plus up to five other languages",
      "challengeRating": "21 (33,000 XP)",
      "keyAbilities": "STR +0, DEX +3, CON +3, INT +5, WIS +2, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "con": 10,
      "int": 12,
      "wis": 9
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the lich fails a saving throw, it can choose to succeed instead.\n\n**Rejuvenation.** If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery.\n\n**Spellcasting.** The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared:\n\n**Turn Resistance.** The lich has advantage on saving throws against any effect that turns undead.",
    "actions": "**Paralyzing Touch.** *Melee Spell Attack:* +12 to hit, reach 5 ft., one creature. *Hit:* 10 (3d6) cold damage. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "A lich is a genius tactician who will never engage in a fair fight. It will use its vast array of spells to control the battlefield, summon undead minions, and wear down its enemies from a distance. Its Paralyzing Touch is a weapon of last resort, used only when an enemy has breached its magical defenses."
  },
  "statblock": "### Lich\n\n*Medium undead, any evil alignment*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 135 (18d8+54)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 16 (+3) | 16 (+3) | 20 (+5) | 14 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Con +10, Int +12, Wis +9\n- **Skills** Arcana +19, History +12, Insight +9, Perception +9\n\n- **Senses** truesight 120 ft., passive Perception 19\n\n- **Languages** Common plus up to five other languages\n\n- **Challenge** 21 (33,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the lich fails a saving throw, it can choose to succeed instead.\n\n***Rejuvenation.*** If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery.\n\n***Spellcasting.*** The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared:\n\n***Turn Resistance.*** The lich has advantage on saving throws against any effect that turns undead.\n\n### Actions\n***Paralyzing Touch.*** *Melee Spell Attack:* +12 to hit, reach 5 ft., one creature. *Hit:* 10 (3d6) cold damage. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
};

export default SRD_MONSTER_LICH;