

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GYNOSPHINX_SPHINX: SavedMonster = {
  "id": "srd-gynosphinx-sphinx",
  "name": "Gynosphinx (Sphinx)",
  "description": "A gynosphinx has the head of a human female, the body of a lion, and the wings of a hawk. They are powerful, enigmatic beings who guard ancient secrets and test the worth of those who seek knowledge with complex riddles.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "lawful neutral",
      "armorClass": "17 (natural armor)",
      "hitPoints": "136 (16d10+48)",
      "speed": "40 ft., fly 60 ft.",
      "senses": "truesight 120 ft., passive Perception 18",
      "languages": "Common, Sphinx",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT +4, WIS +4, CHA +4",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 6,
      "con": 7,
      "int": 8,
      "wis": 8
    },
    "abilitiesAndTraits": "**Inscrutable.** The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.\n\n**Magic Weapons.** The sphinx's weapon attacks are magical.\n\n**Spellcasting.** The sphinx is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following wizard spells prepared:\n- Cantrips (at will): *mage hand, minor illusion, prestidigitation*\n- 1st level (4 slots): *detect magic, identify, shield*\n- 2nd level (3 slots): *darkness, detect thoughts, invisibility*\n- 3rd level (3 slots): *dispel magic, major image*\n- 4th level (3 slots): *greater invisibility, locate creature*\n- 5th level (1 slot): *legend lore*",
    "actions": "**Multiattack.** The sphinx makes two claw attacks.\n\n**Claw.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.",
    "roleplayingAndTactics": "A gynosphinx prefers intellectual challenges over physical ones. It will test intruders with riddles, and only attacks those who prove unworthy or hostile. In combat, it is a formidable opponent, using its spells to confuse and disable enemies before striking with its powerful claws."
  },
  "statblock": "### Gynosphinx (Sphinx)\n\n*Large monstrosity, lawful neutral*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 136 (16d10+48)\n\n- **Speed** 40 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 18 (+4) | 18 (+4) | 18 (+4) |\n\n___\n\n- **Saving Throws** Dex +6, Con +7, Int +8, Wis +8\n- **Skills** Arcana +12, History +12, Perception +8, Religion +8\n\n- **Senses** truesight 120 ft., passive Perception 18\n\n- **Languages** Common, Sphinx\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n***Inscrutable.*** The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.\n\n***Magic Weapons.*** The sphinx's weapon attacks are magical.\n\n***Spellcasting.*** The sphinx is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following wizard spells prepared:\n\n### Actions\n***Multiattack.*** The sphinx makes two claw attacks.\n\n***Claw.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage."
};

export default SRD_MONSTER_GYNOSPHINX_SPHINX;