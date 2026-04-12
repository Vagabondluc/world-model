
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DRUID: SavedMonster = {
  "id": "srd-druid",
  "name": "Druid",
  "description": "Druids are priests of the Old Faith, venerating nature above all else. They are often found guarding sacred groves or acting as spiritual leaders for wilderness communities.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "11 (16 with *barkskin*)",
      "hitPoints": "27 (5d8 + 5)",
      "speed": "30 ft.",
      "senses": "passive Perception 14",
      "languages": "Druidic plus any two languages",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +0, DEX +1, CON +1, INT +1, WIS +2, CHA +0",
      "role": "Controller"
    },
    "savingThrows": {
      "int": 3,
      "wis": 4
    },
    "abilitiesAndTraits": "**Spellcasting.** The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). It has the following druid spells prepared:",
    "actions": "**Quarterstaff.** *Melee Weapon Attack:* +2 to hit (+4 to hit with *shillelagh*), reach 5 ft., one target. *Hit:* 3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with *shillelagh*.",
    "roleplayingAndTactics": "A druid avoids combat, preferring to reason with intruders. If forced to fight, they use spells to control the battlefield with plants and animals. They will use *thunderwave* to push enemies back and *entangle* to hold them. If seriously threatened, a druid might wild shape into a beast to fight or escape."
  },
  "statblock": "### Druid\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 11 (16 with *barkskin*)\n\n- **Hit Points** 27 (5d8 + 5)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 12 (+1) | 13 (+1) | 12 (+1) | 15 (+2) | 11 (+0) |\n\n___\n\n- **Saving Throws** Int +3, Wis +4\n- **Skills** Medicine +4, Nature +3, Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** Druidic plus any two languages\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Spellcasting.*** The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). It has the following druid spells prepared:\n\n### Actions\n***Quarterstaff.*** *Melee Weapon Attack:* +2 to hit (+4 to hit with *shillelagh*), reach 5 ft., one target. *Hit:* 3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with *shillelagh*."
};

export default SRD_MONSTER_DRUID;