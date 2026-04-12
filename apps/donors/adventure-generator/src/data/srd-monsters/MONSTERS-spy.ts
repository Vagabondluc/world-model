
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SPY: SavedMonster = {
  "id": "srd-spy",
  "name": "Spy",
  "description": "Spies are masters of infiltration and information gathering. They are adept at moving unseen and striking from the shadows when necessary.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "12",
      "hitPoints": "27 (6d8)",
      "speed": "30 ft.",
      "senses": "passive Perception 16",
      "languages": "any two languages",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +0, INT +1, WIS +2, CHA +3",
      "role": "Skirmisher"
    },
    "savingThrows": {
      "dex": 4,
      "int": 3
    },
    "abilitiesAndTraits": "**Cunning Action.** On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action.\n\n**Sneak Attack (1/Turn).** The spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the spy that isn't incapacitated and the spy doesn't have disadvantage on the attack roll.",
    "actions": "**Multiattack.** The spy makes two melee attacks.\n\n**Shortsword.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6 + 2) piercing damage.\n\n**Hand Crossbow.** *Ranged Weapon Attack:* +4 to hit, range 30/120 ft., one target. *Hit:* 5 (1d6 + 2) piercing damage.",
    "roleplayingAndTactics": "A spy will always try to accomplish their mission without resorting to combat. If a fight is unavoidable, they will use their Cunning Action and Sneak Attack to gain an advantage, but they will prioritize escape over a prolonged battle."
  },
  "statblock": "### Spy\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 27 (6d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 15 (+2) | 10 (+0) | 12 (+1) | 14 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Dex +4, Int +3\n- **Skills** Deception +5, Insight +4, Investigation +5, Perception +6, Persuasion +5, Sleight of Hand +4, Stealth +4\n\n- **Senses** passive Perception 16\n\n- **Languages** any two languages\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Cunning Action.*** On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action.\n\n***Sneak Attack (1/Turn).*** The spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the spy that isn't incapacitated and the spy doesn't have disadvantage on the attack roll.\n\n### Actions\n***Multiattack.*** The spy makes two melee attacks.\n\n***Shortsword.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6 + 2) piercing damage.\n\n***Hand Crossbow.*** *Ranged Weapon Attack:* +4 to hit, range 30/120 ft., one target. *Hit:* 5 (1d6 + 2) piercing damage."
};

export default SRD_MONSTER_SPY;