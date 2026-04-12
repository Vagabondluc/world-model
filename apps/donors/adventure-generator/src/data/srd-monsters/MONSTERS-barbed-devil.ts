import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BARBED_DEVIL: SavedMonster = {
  "id": "srd-barbed-devil",
  "name": "Barbed Devil",
  "description": "This fiend is covered in sharp spines and barbs. It serves as a guard and shock trooper in the infernal legions, reveling in the pain it inflicts.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend (devil)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "110 (13d8+52)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 18",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +3, DEX +3, CON +4, INT +1, WIS +2, CHA +2",
      "role": "Soldier"
    },
    "savingThrows": {
      "str": 6,
      "con": 7,
      "wis": 5,
      "cha": 5
    },
    "abilitiesAndTraits": "**Barbed Hide.** At the start of each of its turns, the barbed devil deals 5 (1d10) piercing damage to any creature grappling it.\n\n**Devil's Sight.** Magical darkness doesn't impede the devil's darkvision.\n\n**Magic Resistance.** The devil has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The devil makes three melee attacks: one with its tail and two with its claws. Alternatively, it can use Hurl Flame twice.\n\n**Claw.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n**Tail.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage.\n\n**Hurl Flame.** *Ranged Spell Attack:* +5 to hit, range 150 ft., one target. *Hit:* 10 (3d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire.",
    "roleplayingAndTactics": "Barbed devils are aggressive combatants that enjoy getting into the thick of a fight. Their Barbed Hide makes grappling them a painful proposition. They will use Hurl Flame on distant targets but prefer to close in and rend foes with their claws and tail."
  },
  "statblock": "### Barbed Devil\n\n*Medium fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 110 (13d8+52)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 17 (+3) | 18 (+4) | 12 (+1) | 14 (+2) | 14 (+2) |\n\n___\n\n- **Saving Throws** Str +6, Con +7, Wis +5, Cha +5\n- **Skills** Deception +5, Insight +5, Perception +8\n\n- **Senses** darkvision 120 ft., passive Perception 18\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Barbed Hide.*** At the start of each of its turns, the barbed devil deals 5 (1d10) piercing damage to any creature grappling it.\n\n***Devil's Sight.*** Magical darkness doesn't impede the devil's darkvision.\n\n***Magic Resistance.*** The devil has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The devil makes three melee attacks: one with its tail and two with its claws. Alternatively, it can use Hurl Flame twice.\n\n***Claw.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n***Tail.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage.\n\n***Hurl Flame.*** *Ranged Spell Attack:* +5 to hit, range 150 ft., one target. *Hit:* 10 (3d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire."
};

export default SRD_MONSTER_BARBED_DEVIL;