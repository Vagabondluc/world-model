
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DUERGAR: SavedMonster = {
  "id": "srd-duergar",
  "name": "Duergar",
  "description": "These evil, gray-skinned dwarves dwell in the deepest parts of the Underdark. They are grim, tyrannical slavers who value toil and suffering.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (dwarf)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "16 (scale mail, shield)",
      "hitPoints": "26 (4d8+8)",
      "speed": "25 ft.",
      "senses": "darkvision 120 ft., passive Perception 10",
      "languages": "Dwarvish, Undercommon",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +2, INT +0, WIS +0, CHA -1",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Duergar Resilience.** The duergar has advantage on saving throws against poison, spells, and illusions, as well as to resist being charmed or paralyzed.\n\n**Sunlight Sensitivity.** While in sunlight, the duergar has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Enlarge (Recharges after a Short or Long Rest).** For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks (included in the attacks), and makes Strength checks and Strength saving throws with advantage. If the duergar lacks the room to become Large, it attains the maximum size possible in the space available.\n\n**War Pick.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage, or 11 (2d8+2) piercing damage while enlarged.\n\n**Javelin.** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 30/120 ft., one target. *Hit:* 5 (1d6+2) piercing damage, or 9 (2d6+2) piercing damage while enlarged.",
    "roleplayingAndTactics": "Duergar fight with grim discipline. They often begin a fight by turning invisible to get into a superior position, then using Enlarge to become a greater threat. They fight in tactical units, focusing fire on a single target before moving to the next."
  },
  "statblock": "### Duergar\n\n*Medium humanoid (dwarf), lawful evil*\n\n___\n\n- **Armor Class** 16 (scale mail, shield)\n\n- **Hit Points** 26 (4d8+8)\n\n- **Speed** 25 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 11 (+0) | 14 (+2) | 11 (+0) | 10 (+0) | 9 (-1) |\n\n___\n\n- **Senses** darkvision 120 ft., passive Perception 10\n\n- **Languages** Dwarvish, Undercommon\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Duergar Resilience.*** The duergar has advantage on saving throws against poison, spells, and illusions, as well as to resist being charmed or paralyzed.\n\n***Sunlight Sensitivity.*** While in sunlight, the duergar has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Enlarge (Recharges after a Short or Long Rest).*** For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks (included in the attacks), and makes Strength checks and Strength saving throws with advantage. If the duergar lacks the room to become Large, it attains the maximum size possible in the space available.\n\n***War Pick.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage, or 11 (2d8+2) piercing damage while enlarged.\n\n***Javelin.*** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 30/120 ft., one target. *Hit:* 5 (1d6+2) piercing damage, or 9 (2d6+2) piercing damage while enlarged."
};

export default SRD_MONSTER_DUERGAR;