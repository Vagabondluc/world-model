import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GLADIATOR: SavedMonster = {
  "id": "srd-gladiator",
  "name": "Gladiator",
  "description": "A gladiator is a master of combat, a veteran of countless arena battles who fights for coin and glory. They are skilled with a variety of weapons and are always ready for a fight.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "16 (studded leather, shield)",
      "hitPoints": "112 (15d8 + 45)",
      "speed": "30 ft.",
      "senses": "passive Perception 11",
      "languages": "any one language (usually Common)",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT +0, WIS +1, CHA +2",
      "role": "Brute"
    },
    "savingThrows": {
      "str": 7,
      "dex": 5,
      "con": 6
    },
    "abilitiesAndTraits": "**Brave.** The gladiator has advantage on saving throws against being frightened.\n\n**Brute.** A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).",
    "actions": "**Multiattack.** The gladiator makes three melee attacks or two ranged attacks.\n\n**Spear.** *Melee or Ranged Weapon Attack:* +7 to hit, reach 5 ft. and range 20/60 ft., one target. *Hit:* 11 (2d6 + 4) piercing damage, or 13 (2d8 + 4) piercing damage if used with two hands to make a melee attack.\n\n**Shield Bash.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one creature. *Hit:* 9 (2d4 + 4) bludgeoning damage. If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.\n\n**Parry.** The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon.",
    "roleplayingAndTactics": "Gladiators are flashy, confident combatants. They use their shield bash to knock opponents prone and their multiattack to press the advantage. Their Brave trait makes them difficult to intimidate, and they will use their Parry reaction to deflect a deadly blow."
  },
  "statblock": "### Gladiator\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 16 (studded leather, shield)\n\n- **Hit Points** 112 (15d8 + 45)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 10 (+0) | 12 (+1) | 15 (+2) |\n\n___\n\n- **Saving Throws** Str +7, Dex +5, Con +6\n- **Skills** Athletics +10, Intimidation +5\n\n- **Senses** passive Perception 11\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Brave.*** The gladiator has advantage on saving throws against being frightened.\n\n***Brute.*** A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).\n\n### Actions\n***Multiattack.*** The gladiator makes three melee attacks or two ranged attacks.\n\n***Spear.*** *Melee or Ranged Weapon Attack:* +7 to hit, reach 5 ft. and range 20/60 ft., one target. *Hit:* 11 (2d6 + 4) piercing damage, or 13 (2d8 + 4) piercing damage if used with two hands to make a melee attack.\n\n***Shield Bash.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one creature. *Hit:* 9 (2d4 + 4) bludgeoning damage. If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.\n\n***Parry.*** The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon."
};

export default SRD_MONSTER_GLADIATOR;