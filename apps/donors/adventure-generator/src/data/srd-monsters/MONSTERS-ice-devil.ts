

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ICE_DEVIL: SavedMonster = {
  "id": "srd-ice-devil",
  "name": "Ice Devil",
  "description": "Also known as gelugons, ice devils are the insect-like shock troops of the Nine Hells. They command legions of lesser devils and their bodies radiate a bone-chilling cold.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (devil)",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "180 (19d10+76)",
      "speed": "40 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 12",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "14 (11,500 XP)",
      "keyAbilities": "STR +5, DEX +2, CON +4, INT +4, WIS +2, CHA +4",
      "role": "Controller"
    },
    "savingThrows": {
      "str": 10,
      "con": 9,
      "wis": 7,
      "cha": 9
    },
    "abilitiesAndTraits": "**Devil's Sight.** Magical darkness doesn't impede the devil's darkvision.\n\n**Magic Resistance.** The devil has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The devil makes three attacks: one with its bite, one with its claws, and one with its tail.\n\n**Bite.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) piercing damage plus 10 (3d6) cold damage.\n\n**Claws.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 10 (2d4+5) slashing damage plus 10 (3d6) cold damage.\n\n**Tail.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 12 (2d6+5) bludgeoning damage plus 10 (3d6) cold damage.\n\n**Wall of Ice (Recharge 6).** The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter.",
    "roleplayingAndTactics": "Ice devils are cunning and tactical leaders. They will use their Wall of Ice ability to divide and conquer their enemies, isolating weaker targets. In melee, they are formidable, their attacks chilling creatures to the bone. They are utterly loyal to the hierarchy of Hell and will execute any command without hesitation."
  },
  "statblock": "### Ice Devil\n\n*Large fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 180 (19d10+76)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 14 (+2) | 18 (+4) | 18 (+4) | 15 (+2) | 18 (+4) |\n\n___\n\n- **Saving Throws** Str +10, Con +9, Wis +7, Cha +9\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 12\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 14 (11,500 XP)\n\n___\n\n***Devil's Sight.*** Magical darkness doesn't impede the devil's darkvision.\n\n***Magic Resistance.*** The devil has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The devil makes three attacks: one with its bite, one with its claws, and one with its tail.\n\n***Bite.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) piercing damage plus 10 (3d6) cold damage.\n\n***Claws.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 10 (2d4+5) slashing damage plus 10 (3d6) cold damage.\n\n***Tail.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 12 (2d6+5) bludgeoning damage plus 10 (3d6) cold damage.\n\n***Wall of Ice (Recharge 6).*** The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter."
};

export default SRD_MONSTER_ICE_DEVIL;