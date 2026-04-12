
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_THUG: SavedMonster = {
  "id": "srd-thug",
  "name": "Thug",
  "description": "Thugs are common brutes for hire, found in the employ of thieves' guilds, evil nobles, and anyone else who needs some muscle. They are bullies who prey on the weak.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any non-good alignment",
      "armorClass": "11 (leather armor)",
      "hitPoints": "32 (5d8 + 10)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language (usually Common)",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +2, INT +0, WIS +0, CHA +0",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Pack Tactics.** The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Multiattack.** The thug makes two melee attacks.\n\n**Mace.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6 + 2) bludgeoning damage.\n\n**Heavy Crossbow.** *Ranged Weapon Attack:* +2 to hit, range 100/400 ft., one target. *Hit:* 5 (1d10) piercing damage.",
    "roleplayingAndTactics": "Thugs rely on numbers and intimidation. They use Pack Tactics to gang up on opponents. They are not brave and will likely flee if their employer is killed or if they face a superior force."
  },
  "statblock": "### Thug\n\n*Medium humanoid (any race), any non-good alignment*\n\n___\n\n- **Armor Class** 11 (leather armor)\n\n- **Hit Points** 32 (5d8 + 10)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 11 (+0) | 14 (+2) | 10 (+0) | 10 (+0) | 11 (+0) |\n\n___\n\n- **Skills** Intimidation +2\n\n- **Senses** passive Perception 10\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Pack Tactics.*** The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Multiattack.*** The thug makes two melee attacks.\n\n***Mace.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6 + 2) bludgeoning damage.\n\n***Heavy Crossbow.*** *Ranged Weapon Attack:* +2 to hit, range 100/400 ft., one target. *Hit:* 5 (1d10) piercing damage."
};

export default SRD_MONSTER_THUG;