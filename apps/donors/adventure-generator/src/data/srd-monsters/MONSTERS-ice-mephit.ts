

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ICE_MEPHIT: SavedMonster = {
  "id": "srd-ice-mephit",
  "name": "Ice Mephit",
  "description": "An ice mephit is a creature of elemental air and water that resembles a shard of ice with delicate wings.",
  "profile": {
    "table": {
      "creatureType": "Small elemental",
      "size": "Small",
      "alignment": "neutral evil",
      "armorClass": "11",
      "hitPoints": "21 (6d6)",
      "speed": "30 ft., fly 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 12",
      "languages": "Aquan, Auran",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -2, DEX +1, CON +0, INT -1, WIS +0, CHA +1",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Death Burst.** When the mephit dies, it explodes in a burst of jagged ice. Each creature within 5 feet of it must make a DC 10 Dexterity saving throw, taking 4 (1d8) slashing damage on a failed save, or half as much damage on a successful one.\n\n**False Appearance.** While the mephit remains motionless, it is indistinguishable from an ordinary shard of ice.\n\n**Innate Spellcasting (1/Day).** The mephit can innately cast *fog cloud*, requiring no material components. Its innate spellcasting ability is Charisma.",
    "actions": "**Claws.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 3 (1d4 + 1) slashing damage plus 2 (1d4) cold damage.\n\n**Frost Breath (Recharge 6).** The mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Ice mephits are cruel tricksters. They will use their Fog Cloud or Frost Breath to disorient foes before flying in to slash at them with their claws. Their death burst makes finishing them off in melee a risky proposition."
  },
  "statblock": "### Ice Mephit\n\n*Small elemental, neutral evil*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 21 (6d6)\n\n- **Speed** 30 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 7 (-2) | 13 (+1) | 10 (+0) | 9 (-1) | 11 (+0) | 12 (+1) |\n\n___\n\n- **Skills** Perception +2, Stealth +3\n\n- **Senses** darkvision 60 ft., passive Perception 12\n\n- **Languages** Aquan, Auran\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Death Burst.*** When the mephit dies, it explodes in a burst of jagged ice. Each creature within 5 feet of it must make a DC 10 Dexterity saving throw, taking 4 (1d8) slashing damage on a failed save, or half as much damage on a successful one.\n\n***False Appearance.*** While the mephit remains motionless, it is indistinguishable from an ordinary shard of ice.\n\n***Innate Spellcasting (1/Day).*** The mephit can innately cast *fog cloud*, requiring no material components. Its innate spellcasting ability is Charisma.\n\n### Actions\n***Claws.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 3 (1d4 + 1) slashing damage plus 2 (1d4) cold damage.\n\n***Frost Breath (Recharge 6).*** The mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ICE_MEPHIT;