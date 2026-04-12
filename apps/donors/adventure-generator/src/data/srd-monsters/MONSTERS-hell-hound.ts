

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HELL_HOUND: SavedMonster = {
  "id": "srd-hell-hound",
  "name": "Hell Hound",
  "description": "These fiery hounds of the lower planes hunt in packs, their bodies wreathed in smoke and flame. They are the loyal pets of devils and fire giants.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "45 (7d8+14)",
      "speed": "50 ft.",
      "senses": "darkvision 60 ft., passive Perception 15",
      "languages": "understands Infernal but can't speak it",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +2, INT -2, WIS +1, CHA -2",
      "role": "Skirmisher"
    },
    "savingThrows": {
      "dex": 3
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Pack Tactics.** The hound has advantage on an attack roll against a creature if at least one of the hound's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage plus 7 (2d6) fire damage.\n\n**Fire Breath (Recharge 5-6).** The hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 21 (6d6) fire damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Hell hounds are relentless pack hunters. They coordinate their attacks, using Pack Tactics to surround and overwhelm a single target. They will use their Fire Breath at the start of combat to soften up a group of enemies before closing in for the kill."
  },
  "statblock": "### Hell Hound\n\n*Medium fiend, lawful evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 45 (7d8+14)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 12 (+1) | 14 (+2) | 6 (-2) | 13 (+1) | 6 (-2) |\n\n___\n\n- **Saving Throws** Dex +3\n- **Skills** Perception +5\n\n- **Senses** darkvision 60 ft., passive Perception 15\n\n- **Languages** understands Infernal but can't speak it\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Keen Hearing and Smell.*** The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Pack Tactics.*** The hound has advantage on an attack roll against a creature if at least one of the hound's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage plus 7 (2d6) fire damage."
};

export default SRD_MONSTER_HELL_HOUND;