
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_VETERAN: SavedMonster = {
  "id": "srd-veteran",
  "name": "Veteran",
  "description": "Veterans are professional soldiers, hardened by years of battle. They can be found as sergeants in an army, leaders of a mercenary company, or grizzled guards of a fortress.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "17 (splint)",
      "hitPoints": "58 (9d8 + 18)",
      "speed": "30 ft.",
      "senses": "passive Perception 12",
      "languages": "any one language (usually Common)",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +2, INT +0, WIS +0, CHA +0",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.\n\n**Longsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands.\n\n**Shortsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6 + 3) piercing damage.\n\n**Heavy Crossbow.** *Ranged Weapon Attack:* +3 to hit, range 100/400 ft., one target. *Hit:* 6 (1d10 + 1) piercing damage.",
    "roleplayingAndTactics": "A veteran is a skilled and disciplined warrior who knows how to fight as part of a team. They are not easily intimidated and will stand their ground, using their multiattack to press the advantage in melee."
  },
  "statblock": "### Veteran\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 17 (splint)\n\n- **Hit Points** 58 (9d8 + 18)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 13 (+1) | 14 (+2) | 10 (+0) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Skills** Athletics +5, Perception +2\n\n- **Senses** passive Perception 12\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 3 (700 XP)\n\n___\n\n### Actions\n***Multiattack.*** The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.\n\n***Longsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands.\n\n***Shortsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6 + 3) piercing damage.\n\n***Heavy Crossbow.*** *Ranged Weapon Attack:* +3 to hit, range 100/400 ft., one target. *Hit:* 6 (1d10 + 1) piercing damage."
};

export default SRD_MONSTER_VETERAN;
