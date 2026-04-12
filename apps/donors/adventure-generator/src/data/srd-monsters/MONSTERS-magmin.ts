

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MAGMIN: SavedMonster = {
  "id": "srd-magmin",
  "name": "Magmin",
  "description": "Magmins are mischievous, destructive creatures from the Elemental Plane of Fire. They look like small, humanoid figures made of magma and cooled obsidian, their bodies constantly shedding heat and light.",
  "profile": {
    "table": {
      "creatureType": "Small elemental",
      "size": "Small",
      "alignment": "chaotic neutral",
      "armorClass": "14 (natural armor)",
      "hitPoints": "9 (2d6+2)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Ignan",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -2, DEX +2, CON +1, INT -1, WIS +0, CHA +0",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Death Burst.** When the magmin dies, it explodes in a burst of fire and magma. Each creature within 10 feet of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. Flammable objects that aren't being worn or carried in that area are ignited.\n\n**Ignited Illumination.** As a bonus action, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
    "actions": "**Touch.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d6) fire damage. If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes 3 (1d6) fire damage at the start of each of its turns.",
    "roleplayingAndTactics": "Magmins are driven by a simple desire to burn things. They will rush towards the nearest flammable object or creature and set it alight. They are not strategic and will fight until destroyed, their death often causing more chaos than their attacks."
  },
  "statblock": "### Magmin\n\n*Small elemental, chaotic neutral*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 9 (2d6+2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 7 (-2) | 15 (+2) | 12 (+1) | 8 (-1) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Ignan\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Death Burst.*** When the magmin dies, it explodes in a burst of fire and magma. Each creature within 10 feet of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. Flammable objects that aren't being worn or carried in that area are ignited.\n\n***Ignited Illumination.*** As a bonus action, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 10 feet.\n\n### Actions\n***Touch.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d6) fire damage. If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes 3 (1d6) fire damage at the start of each of its turns."
};

export default SRD_MONSTER_MAGMIN;