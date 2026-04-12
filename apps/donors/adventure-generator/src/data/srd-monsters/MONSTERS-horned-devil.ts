

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HORNED_DEVIL: SavedMonster = {
  "id": "srd-horned-devil",
  "name": "Horned Devil",
  "description": "Also known as malebranche, horned devils are the brutish flying infantry of the Nine Hells. They are lazy and belligerent, but formidable foes when roused to battle.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (devil)",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "148 (17d10+55)",
      "speed": "20 ft., fly 60 ft.",
      "senses": "darkvision 120 ft., passive Perception 13",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +6, DEX +3, CON +5, INT +1, WIS +3, CHA +3",
      "role": "Soldier"
    },
    "savingThrows": {
      "str": 10,
      "dex": 7,
      "wis": 7,
      "cha": 7
    },
    "abilitiesAndTraits": "**Devil's Sight.** Magical darkness doesn't impede the devil's darkvision.\n\n**Magic Resistance.** The devil has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The devil makes three melee attacks: two with its fork and one with its tail. It can use Hurl Flame in place of any melee attack.\n\n**Fork.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 15 (2d8+6) piercing damage.\n\n**Tail.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 10 (1d8+6) piercing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 17 Constitution saving throw or lose 10 (3d6) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 10 (3d6). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing.\n\n**Hurl Flame.** *Ranged Spell Attack:* +7 to hit, range 150 ft., one target. *Hit:* 14 (4d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire.",
    "roleplayingAndTactics": "Horned devils are aerial combatants, preferring to fly above their enemies and hurl fire before descending to attack with their forks and tails. Their infernal wound ability can be particularly deadly, preventing healing and slowly bleeding a creature dry. They fight with a cruel efficiency, obeying the commands of their superiors without question."
  },
  "statblock": "### Horned Devil\n\n*Large fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 148 (17d10+55)\n\n- **Speed** 20 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 22 (+6) | 17 (+3) | 21 (+5) | 12 (+1) | 16 (+3) | 17 (+3) |\n\n___\n\n- **Saving Throws** Str +10, Dex +7, Wis +7, Cha +7\n- **Senses** darkvision 120 ft., passive Perception 13\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n***Devil's Sight.*** Magical darkness doesn't impede the devil's darkvision.\n\n***Magic Resistance.*** The devil has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The devil makes three melee attacks: two with its fork and one with its tail. It can use Hurl Flame in place of any melee attack.\n\n***Fork.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 15 (2d8+6) piercing damage.\n\n***Tail.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 10 (1d8+6) piercing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 17 Constitution saving throw or lose 10 (3d6) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 10 (3d6). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing.\n\n***Hurl Flame.*** *Ranged Spell Attack:* +7 to hit, range 150 ft., one target. *Hit:* 14 (4d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire."
};

export default SRD_MONSTER_HORNED_DEVIL;