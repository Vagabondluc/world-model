
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_VROCK_DEMON: SavedMonster = {
  "id": "srd-vrock-demon",
  "name": "Vrock (Demon)",
  "description": "Vrocks are large, vulture-like demons that serve as flying shock troops in the Abyss. They delight in carnage and are often seen circling battlefields, waiting to pick at the fallen.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (demon)",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "104 (11d10+44)",
      "speed": "40 ft., fly 60 ft.",
      "senses": "darkvision 120 ft., passive Perception 11",
      "languages": "Abyssal, telepathy 120 ft.",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +4, INT -1, WIS +1, CHA -1",
      "role": "Skirmisher"
    },
    "savingThrows": {
      "dex": 5,
      "wis": 4,
      "cha": 2
    },
    "abilitiesAndTraits": "**Magic Resistance.** The vrock has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The vrock makes two attacks: one with its beak and one with its talons.\n\n**Beak.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage.\n\n**Talons.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 14 (2d10+3) slashing damage.\n\n**Spores (Recharge 6).** A 15-foot radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target takes 5 (1d10) poison damage at the start of each of its turns. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it.\n\n**Stunning Screech (1/Day).** The vrock emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn't a demon must succeed on a DC 14 Constitution saving throw or be stunned until the end of the vrock's next turn.",
    "roleplayingAndTactics": "Vrocks are savage and frenzied combatants. They will often begin a fight with their stunning screech, then release their toxic spores. They use their flight to their advantage, diving down to attack with their beaks and talons."
  },
  "statblock": "### Vrock (Demon)\n\n*Large fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 104 (11d10+44)\n\n- **Speed** 40 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 15 (+2) | 18 (+4) | 8 (-1) | 13 (+1) | 8 (-1) |\n\n___\n\n- **Saving Throws** Dex +5, Wis +4, Cha +2\n- **Senses** darkvision 120 ft., passive Perception 11\n\n- **Languages** Abyssal, telepathy 120 ft.\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n***Magic Resistance.*** The vrock has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The vrock makes two attacks: one with its beak and one with its talons.\n\n***Beak.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage.\n\n***Talons.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 14 (2d10+3) slashing damage.\n\n***Spores (Recharge 6).*** A 15-foot radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target takes 5 (1d10) poison damage at the start of each of its turns. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it."
};

export default SRD_MONSTER_VROCK_DEMON;
