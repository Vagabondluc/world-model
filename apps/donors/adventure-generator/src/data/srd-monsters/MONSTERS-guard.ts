
// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GUARD: SavedMonster = {
  "id": "srd-guard",
  "name": "Guard",
  "description": "Guards include members of a city watch, soldiers in an army, or the bodyguards of a merchant or noble. They are trained warriors, loyal to their employer.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "16 (chain shirt, shield)",
      "hitPoints": "11 (2d8 + 2)",
      "speed": "30 ft.",
      "senses": "passive Perception 12",
      "languages": "any one language (usually Common)",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +1, DEX +1, CON +1, INT +0, WIS +0, CHA +0",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "",
    "actions": "**Spear.** *Melee or Ranged Weapon Attack:* +3 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack.",
    "roleplayingAndTactics": "Guards are disciplined and fight as a unit. They will attempt to form a shield wall to protect archers or spellcasters and will try to surround and overwhelm single targets. They are trained to raise an alarm and call for reinforcements."
  },
  "statblock": "### Guard\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 16 (chain shirt, shield)\n\n- **Hit Points** 11 (2d8 + 2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 12 (+1) | 12 (+1) | 10 (+0) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** passive Perception 12\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Spear.*** *Melee or Ranged Weapon Attack:* +3 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."
};

export default SRD_MONSTER_GUARD;