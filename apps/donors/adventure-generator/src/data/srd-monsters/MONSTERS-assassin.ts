import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ASSASSIN: SavedMonster = {
  "id": "srd-assassin",
  "name": "Assassin",
  "description": "Assassins are deadly killers for hire, masters of stealth, poison, and disguise. They are ruthless and efficient in their deadly trade.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any non-good alignment",
      "armorClass": "15 (studded leather)",
      "hitPoints": "78 (12d8 + 24)",
      "speed": "30 ft.",
      "senses": "passive Perception 13",
      "languages": "Thieves' cant plus any two languages",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +0, DEX +3, CON +2, INT +1, WIS +0, CHA +0",
      "role": "Ambusher"
    },
    "savingThrows": {
      "dex": 6,
      "int": 4
    },
    "abilitiesAndTraits": "**Assassinate.** During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.\n\n**Evasion.** If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.\n\n**Sneak Attack.** Once per turn, the assassin deals an extra 14 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll.",
    "actions": "**Multiattack.** The assassin makes two shortsword attacks.\n\n**Shortsword.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.\n\n**Light Crossbow.** *Ranged Weapon Attack:* +6 to hit, range 80/320 ft., one target. *Hit:* 7 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "An assassin strikes from the shadows, aiming to eliminate their target in the first round of combat with their Assassinate and Sneak Attack abilities. They will use poison to weaken their foes and will not hesitate to flee if a fight turns against them."
  },
  "statblock": "### Assassin\n\n*Medium humanoid (any race), any non-good alignment*\n\n___\n\n- **Armor Class** 15 (studded leather)\n\n- **Hit Points** 78 (12d8 + 24)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 16 (+3) | 14 (+2) | 13 (+1) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Saving Throws** Dex +6, Int +4\n- **Skills** Acrobatics +6, Deception +3, Perception +3, Stealth +9\n\n- **Senses** passive Perception 13\n\n- **Languages** Thieves' cant plus any two languages\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n***Assassinate.*** During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.\n\n***Evasion.*** If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.\n\n***Sneak Attack.*** Once per turn, the assassin deals an extra 14 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll.\n\n### Actions\n***Multiattack.*** The assassin makes two shortsword attacks.\n\n***Shortsword.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.\n\n***Light Crossbow.*** *Ranged Weapon Attack:* +6 to hit, range 80/320 ft., one target. *Hit:* 7 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ASSASSIN;