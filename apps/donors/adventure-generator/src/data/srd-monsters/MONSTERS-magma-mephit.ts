

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MAGMA_MEPHIT: SavedMonster = {
  "id": "srd-magma-mephit",
  "name": "Magma Mephit",
  "description": "A magma mephit is a creature of elemental earth and fire, appearing as a small, winged humanoid made of molten rock and bubbling lava. They are known for their foul tempers and destructive tendencies.",
  "profile": {
    "table": {
      "creatureType": "Small elemental",
      "size": "Small",
      "alignment": "neutral evil",
      "armorClass": "11",
      "hitPoints": "22 (5d6+5)",
      "speed": "30 ft., fly 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Ignan, Terran",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -1, DEX +1, CON +1, INT -2, WIS +0, CHA +0",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Death Burst.** When the mephit dies, it explodes in a burst of lava. Each creature within 5 feet of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one.\n\n**False Appearance.** While the mephit remains motionless, it is indistinguishable from an ordinary mound of magma.\n\n**Innate Spellcasting (1/Day).** The mephit can innately cast *heat metal* (spell save DC 10), requiring no material components. Its innate spellcasting ability is Charisma.",
    "actions": "**Claws.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 3 (1d4 + 1) slashing damage plus 2 (1d4) fire damage.",
    "roleplayingAndTactics": "Magma mephits are bullies that enjoy the suffering of others. They will use *heat metal* on an armored opponent from a safe distance, laughing as their target cooks. They are not brave and will flee if a fight turns against them, using their death burst as a final act of spite."
  },
  "statblock": "### Magma Mephit\n\n*Small elemental, neutral evil*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 22 (5d6+5)\n\n- **Speed** 30 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 12 (+1) | 12 (+1) | 7 (-2) | 10 (+0) | 10 (+0) |\n\n___\n\n- **Skills** Stealth +3\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Ignan, Terran\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Death Burst.*** When the mephit dies, it explodes in a burst of lava. Each creature within 5 feet of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one.\n\n***False Appearance.*** While the mephit remains motionless, it is indistinguishable from an ordinary mound of magma.\n\n***Innate Spellcasting (1/Day).*** The mephit can innately cast *heat metal* (spell save DC 10), requiring no material components. Its innate spellcasting ability is Charisma.\n\n### Actions\n***Claws.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 3 (1d4 + 1) slashing damage plus 2 (1d4) fire damage."
};

export default SRD_MONSTER_MAGMA_MEPHIT;