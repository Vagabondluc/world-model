
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SHIELD_GUARDIAN: SavedMonster = {
  "id": "srd-shield-guardian",
  "name": "Shield Guardian",
  "description": "A shield guardian is a powerful construct created to protect its master. It is bound to a magical amulet, and will defend the wearer of the amulet with its life.",
  "profile": {
    "table": {
      "creatureType": "Large construct",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "17 (natural armor)",
      "hitPoints": "142 (15d10+60)",
      "speed": "30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 10",
      "languages": "understands commands given in any language but can't speak",
      "challengeRating": "7 (2,900 XP)",
      "keyAbilities": "STR +4, DEX -1, CON +4, INT -2, WIS +0, CHA -4",
      "role": "Soldier"
    },
    "savingThrows": {
      "con": 7
    },
    "abilitiesAndTraits": "**Bound.** The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet's wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian.\n\n**Regeneration.** The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit point.\n\n**Spell Storing.** A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost.",
    "actions": "**Multiattack.** The guardian makes two fist attacks.\n\n**Fist.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.",
    "roleplayingAndTactics": "The shield guardian is a selfless protector, intercepting attacks meant for its master. It is a powerful melee combatant and can store a spell for its master to use. It fights without fear or hesitation until its master is safe or it is destroyed."
  },
  "statblock": "### Shield Guardian\n\n*Large construct, unaligned*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 142 (15d10+60)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 8 (-1) | 18 (+4) | 7 (-2) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Saving Throws** Con +7\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 10\n\n- **Languages** understands commands given in any language but can't speak\n\n- **Challenge** 7 (2,900 XP)\n\n___\n\n***Bound.*** The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet's wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian.\n\n***Regeneration.*** The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit point.\n\n***Spell Storing.*** A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost.\n\n### Actions\n***Multiattack.*** The guardian makes two fist attacks.\n\n***Fist.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage."
};

export default SRD_MONSTER_SHIELD_GUARDIAN;