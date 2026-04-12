
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PRIEST: SavedMonster = {
  "id": "srd-priest",
  "name": "Priest",
  "description": "Priests are intermediaries between the mortal world and the divine, acting as healers, spiritual guides, and sometimes, holy warriors.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "13 (chain shirt)",
      "hitPoints": "27 (5d8 + 5)",
      "speed": "30 ft.",
      "senses": "passive Perception 13",
      "languages": "any two languages",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +0, DEX +0, CON +1, INT +1, WIS +3, CHA +1",
      "role": "Leader"
    },
    "savingThrows": {
        "wis": 5,
        "cha": 3
    },
    "abilitiesAndTraits": "**Divine Eminence.** As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.\n\n**Spellcasting.** The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared:\n- Cantrips (at will): *light, sacred flame, thaumaturgy*\n- 1st level (4 slots): *cure wounds, guiding bolt, sanctuary*\n- 2nd level (3 slots): *lesser restoration, spiritual weapon*\n- 3rd level (2 slots): *dispel magic, spirit guardians*",
    "actions": "**Mace.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 3 (1d6) bludgeoning damage.",
    "roleplayingAndTactics": "A priest will try to avoid direct combat, using their spells to support their allies and hinder their foes. They will use *sanctuary* to protect themselves or an ally, *spiritual weapon* to attack from a distance, and *spirit guardians* to control an area. They are dedicated to their faith and will defend their temple and flock."
  },
  "statblock": "### Priest\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 13 (chain shirt)\n\n- **Hit Points** 27 (5d8 + 5)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 10 (+0) | 12 (+1) | 13 (+1) | 16 (+3) | 13 (+1) |\n\n___\n\n- **Saving Throws** Wis +5, Cha +3\n- **Skills** Medicine +7, Persuasion +3, Religion +5\n\n- **Senses** passive Perception 13\n\n- **Languages** any two languages\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Divine Eminence.*** As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.\n\n***Spellcasting.*** The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared:\n- Cantrips (at will): *light, sacred flame, thaumaturgy*\n- 1st level (4 slots): *cure wounds, guiding bolt, sanctuary*\n- 2nd level (3 slots): *lesser restoration, spiritual weapon*\n- 3rd level (2 slots): *dispel magic, spirit guardians*\n\n### Actions\n***Mace.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 3 (1d6) bludgeoning damage."
};

export default SRD_MONSTER_PRIEST;
