
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_NOBLE: SavedMonster = {
    "id": "srd-noble",
    "name": "Noble",
    "description": "A noble is a person of high birth and station, trained in etiquette, politics, and the fine art of dueling. They are figures of authority, accustomed to giving orders and being obeyed.",
    "profile": {
      "table": {
        "creatureType": "Medium humanoid (any race)",
        "size": "Medium",
        "alignment": "any alignment",
        "armorClass": "15 (breastplate)",
        "hitPoints": "9 (2d8)",
        "speed": "30 ft.",
        "senses": "passive Perception 12",
        "languages": "any two languages",
        "challengeRating": "1/8 (25 XP)",
        "keyAbilities": "STR +0, DEX +1, CON +0, INT +1, WIS +2, CHA +3",
        "role": "Leader"
      },
      "abilitiesAndTraits": "",
      "actions": "**Rapier.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8 + 1) piercing damage.\n\n**Parry.** The noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon.",
      "roleplayingAndTactics": "Nobles are typically not front-line warriors but are skilled in fencing. They will use their Parry ability to defend themselves and will often have guards or retainers to fight for them. Their main strength is their social influence, not their martial prowess."
    },
    "statblock": "### Noble\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 15 (breastplate)\n\n- **Hit Points** 9 (2d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 12 (+1) | 11 (+0) | 12 (+1) | 14 (+2) | 16 (+3) |\n\n___\n\n- **Skills** Deception +5, Insight +4, Persuasion +5\n\n- **Senses** passive Perception 12\n\n- **Languages** any two languages\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Rapier.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8 + 1) piercing damage.\n\n***Parry.*** The noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon."
  };
export default SRD_MONSTER_NOBLE;
