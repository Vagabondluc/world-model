
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SKELETON: SavedMonster = {
  "id": "srd-skeleton",
  "name": "Skeleton",
  "description": "A fleshless, animated corpse held together by dark magic, often found guarding ancient tombs or serving necromancers.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "13 (armor scraps)",
      "hitPoints": "13 (2d8+4)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "understands all languages it knew in life but can't speak",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +2, INT -2, WIS -1, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Vulnerability to Bludgeoning.** Skeletons are vulnerable to bludgeoning damage.",
    "actions": "**Shortsword.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Shortbow.** *Ranged Weapon Attack:* +4 to hit, range 80/320 ft., one target. *Hit:* 5 (1d6+2) piercing damage.",
    "roleplayingAndTactics": "Skeletons are mindless undead that obey the commands of their creator. They are more agile than zombies but more fragile. They fight without fear or strategy, overwhelming foes with numbers."
  },
  "statblock": "### Skeleton\n\n*Medium undead, lawful evil*\n\n___\n\n- **Armor Class** 13 (armor scraps)\n\n- **Hit Points** 13 (2d8+4)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 14 (+2) | 15 (+2) | 6 (-2) | 8 (-1) | 5 (-3) |\n\n___\n\n- **Vulnerabilities** bludgeoning\n- **Damage Immunities** poison\n- **Condition Immunities** exhaustion, poisoned\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** understands all languages it knew in life but can't speak\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Shortsword.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n***Shortbow.*** *Ranged Weapon Attack:* +4 to hit, range 80/320 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_SKELETON;