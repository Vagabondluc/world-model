

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_IMP_DEVIL: SavedMonster = {
  "id": "srd-imp-devil",
  "name": "Imp (Devil)",
  "description": "Imps are the lowest form of devil, malevolent little fiends that serve as spies and messengers for greater devils.",
  "profile": {
    "table": {
      "creatureType": "Tiny fiend (devil, shapechanger)",
      "size": "Tiny",
      "alignment": "lawful evil",
      "armorClass": "13",
      "hitPoints": "10 (3d4+3)",
      "speed": "20 ft., fly 40 ft.",
      "senses": "darkvision 120 ft., passive Perception 11",
      "languages": "Infernal, Common",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR -2, DEX +3, CON +1, INT +0, WIS +1, CHA +2",
      "role": "Scout"
    },
    "savingThrows": {
      "dex": 5,
      "wis": 3
    },
    "abilitiesAndTraits": "**Shapechanger.** The imp can use its action to polymorph into a beast form that resembles a rat (speed 20 ft.), a raven (20 ft., fly 60 ft.), or a spider (20 ft., climb 20 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Devil's Sight.** Magical darkness doesn't impede the imp's darkvision.\n\n**Magic Resistance.** The imp has advantage on saving throws against spells and other magical effects.",
    "actions": "**Sting (Bite in Beast Form).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage, and the target must make on a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one.\n\n**Invisibility.** The imp magically turns invisible until it attacks or its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisible with it.",
    "roleplayingAndTactics": "Imps are not brave. They use their invisibility and shapechanging to spy and ambush. They will deliver their poisonous sting and then fly away, turning invisible to escape retaliation. They are servile to powerful masters but cruel to any creature they see as weaker."
  },
  "statblock": "### Imp (Devil)\n\n*Tiny fiend (devil, shapechanger), lawful evil*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 10 (3d4+3)\n\n- **Speed** 20 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 17 (+3) | 13 (+1) | 11 (+0) | 12 (+1) | 14 (+2) |\n\n___\n\n- **Saving Throws** Dex +5, Wis +3\n- **Skills** Deception +4, Insight +3, Persuasion +4, Stealth +5\n\n- **Senses** darkvision 120 ft., passive Perception 11\n\n- **Languages** Infernal, Common\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Shapechanger.*** The imp can use its action to polymorph into a beast form that resembles a rat (speed 20 ft.), a raven (20 ft., fly 60 ft.), or a spider (20 ft., climb 20 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Devil's Sight.*** Magical darkness doesn't impede the imp's darkvision.\n\n***Magic Resistance.*** The imp has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Sting (Bite in Beast Form).*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage, and the target must make on a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one.\n\n***Invisibility.*** The imp magically turns invisible until it attacks or its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisible with it."
};

export default SRD_MONSTER_IMP_DEVIL;