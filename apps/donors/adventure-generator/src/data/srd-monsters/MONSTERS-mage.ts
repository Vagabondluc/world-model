

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MAGE: SavedMonster = {
  "id": "srd-mage",
  "name": "Mage",
  "description": "A mage is a master of arcane arts, having dedicated their life to the study of magic. They can be found as advisors in royal courts, heads of magical academies, or secluded in towers pursuing forbidden knowledge.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "12 (15 with *mage armor*)",
      "hitPoints": "40 (9d8)",
      "speed": "30 ft.",
      "senses": "passive Perception 11",
      "languages": "any four languages",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR -1, DEX +2, CON +0, INT +3, WIS +1, CHA +0",
      "role": "Artillery"
    },
    "savingThrows": {
      "int": 6,
      "wis": 4
    },
    "abilitiesAndTraits": "**Spellcasting.** The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared:",
    "actions": "**Dagger.** *Melee or Ranged Weapon Attack:* +5 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d4 + 1) piercing damage.",
    "roleplayingAndTactics": "A mage is a strategic and powerful opponent who avoids direct physical confrontation. They will use defensive spells like *mage armor* and *greater invisibility* before unleashing devastating area-of-effect spells like *fireball* and *cone of cold*. They are intelligent and will exploit any weakness they can find."
  },
  "statblock": "### Mage\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 12 (15 with *mage armor*)\n\n- **Hit Points** 40 (9d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 9 (-1) | 14 (+2) | 11 (+0) | 17 (+3) | 12 (+1) | 11 (+0) |\n\n___\n\n- **Saving Throws** Int +6, Wis +4\n- **Skills** Arcana +6, History +6\n\n- **Senses** passive Perception 11\n\n- **Languages** any four languages\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n***Spellcasting.*** The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared:\n\n### Actions\n***Dagger.*** *Melee or Ranged Weapon Attack:* +5 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d4 + 1) piercing damage."
};

export default SRD_MONSTER_MAGE;