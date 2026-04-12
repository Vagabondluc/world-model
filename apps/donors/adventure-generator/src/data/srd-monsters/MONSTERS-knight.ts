

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_KNIGHT: SavedMonster = {
  "id": "srd-knight",
  "name": "Knight",
  "description": "Knights are elite warriors, often of noble birth, who have been trained in the arts of war since childhood. They are masters of heavy armor and martial weapons.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "18 (plate)",
      "hitPoints": "52 (8d8 + 16)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language (usually Common)",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +2, INT +0, WIS +0, CHA +2",
      "role": "Leader"
    },
    "savingThrows": {
      "con": 4,
      "wis": 2
    },
    "abilitiesAndTraits": "**Brave.** The knight has advantage on saving throws against being frightened.",
    "actions": "**Multiattack.** The knight makes two melee attacks.\n\n**Greatsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) slashing damage.\n\n**Heavy Crossbow.** *Ranged Weapon Attack:* +2 to hit, range 100/400 ft., one target. *Hit:* 5 (1d10) piercing damage.\n\n**Leadership (Recharges after a Short or Long Rest).** For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 feet of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated.\n\n**Parry.** The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon.",
    "roleplayingAndTactics": "A knight is a disciplined and skilled combatant. They will use their Leadership ability to bolster their allies and will use their Parry reaction to deflect powerful blows. They are brave and will hold their ground, fighting honorably but fiercely to protect their charge or uphold their oath."
  },
  "statblock": "### Knight\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 18 (plate)\n\n- **Hit Points** 52 (8d8 + 16)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 11 (+0) | 14 (+2) | 11 (+0) | 11 (+0) | 15 (+2) |\n\n___\n\n- **Saving Throws** Con +4, Wis +2\n- **Senses** passive Perception 10\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Brave.*** The knight has advantage on saving throws against being frightened.\n\n### Actions\n***Multiattack.*** The knight makes two melee attacks.\n\n***Greatsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) slashing damage.\n\n***Heavy Crossbow.*** *Ranged Weapon Attack:* +2 to hit, range 100/400 ft., one target. *Hit:* 5 (1d10) piercing damage.\n\n***Leadership (Recharges after a Short or Long Rest).*** For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 feet of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated.\n\n***Parry.*** The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon."
};

export default SRD_MONSTER_KNIGHT;