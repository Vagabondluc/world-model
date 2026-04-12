

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HOBGOBLIN: SavedMonster = {
  "id": "srd-hobgoblin",
  "name": "Hobgoblin",
  "description": "Hobgoblins are militaristic, goblinoid mercenaries who live for war. They are larger, stronger, and more disciplined than their goblin and bugbear kin, forming formidable legions.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (goblinoid)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "18 (chain mail, shield)",
      "hitPoints": "11 (2d8+2)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Common, Goblin",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +1, DEX +1, CON +1, INT +0, WIS +0, CHA -1",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Martial Advantage.** Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn't incapacitated.",
    "actions": "**Longsword.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8+1) slashing damage, or 6 (1d10+1) slashing damage if used with two hands.\n\n**Longbow.** *Ranged Weapon Attack:* +3 to hit, range 150/600 ft., one target. *Hit:* 5 (1d8 + 1) piercing damage.",
    "roleplayingAndTactics": "Hobgoblins are disciplined soldiers who fight with tactical precision. They use their Martial Advantage trait to focus fire on single targets, working in concert to quickly overwhelm their foes. They are not prone to fear and will hold a line until ordered to retreat by a superior."
  },
  "statblock": "### Hobgoblin\n\n*Medium humanoid (goblinoid), lawful evil*\n\n___\n\n- **Armor Class** 18 (chain mail, shield)\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 12 (+1) | 12 (+1) | 10 (+0) | 10 (+0) | 9 (-1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Common, Goblin\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Martial Advantage.*** Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn't incapacitated.\n\n### Actions\n***Longsword.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8+1) slashing damage, or 6 (1d10+1) slashing damage if used with two hands.\n\n***Longbow.*** *Ranged Weapon Attack:* +3 to hit, range 150/600 ft., one target. *Hit:* 5 (1d8 + 1) piercing damage."
};

export default SRD_MONSTER_HOBGOBLIN;