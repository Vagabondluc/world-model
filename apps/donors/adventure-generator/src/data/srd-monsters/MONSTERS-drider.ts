
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DRIDER: SavedMonster = {
  "id": "srd-drider",
  "name": "Drider",
  "description": "A horrifying blend of a drow's upper body and a giant spider's lower half, a drider is a terrifying hunter of the Underdark, created by Lolth as a punishment for failure.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "19 (natural armor)",
      "hitPoints": "123 (13d10+52)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "darkvision 120 ft., passive Perception 15",
      "languages": "Elvish, Undercommon",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +3, DEX +3, CON +4, INT +1, WIS +2, CHA +1",
      "role": "Ambusher"
    },
    "savingThrows": {
      "int": 4,
      "wis": 5,
      "cha": 4
    },
    "abilitiesAndTraits": "**Fey Ancestry.** The drider has advantage on saving throws against being charmed, and magic can't put the drider to sleep.\n\n**Innate Spellcasting.** The drider's innate spellcasting ability is Wisdom (spell save DC 13). The drider can innately cast the following spells, requiring no material Components\n\n**Spider Climb.** The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Sunlight Sensitivity.** While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n**Web Walker.** The drider ignores movement restrictions caused by webbing.",
    "actions": "**Multiattack.** The drider makes three attacks, either with its longsword or its longbow. It can replace one of those attacks with a bite attack.\n\n**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 2 (1d4) piercing damage plus 9 (2d8) poison damage.\n\n**Longsword.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage, or 8 (1d10+3) slashing damage if used with two hands.",
    "roleplayingAndTactics": "Driders are bitter and hateful hunters. They use their spider climb ability to attack from ceilings, peppering foes with longbow shots before dropping down for a multiattack. They often use their innate spells like *darkness* to gain a tactical advantage. They fight with a mix of drow cunning and arachnid ferocity."
  },
  "statblock": "### Drider\n\n*Large monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 123 (13d10+52)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 16 (+3) | 18 (+4) | 13 (+1) | 14 (+2) | 12 (+1) |\n\n___\n\n- **Saving Throws** Int +4, Wis +5, Cha +4\n- **Skills** Perception +5, Stealth +9\n\n- **Senses** darkvision 120 ft., passive Perception 15\n\n- **Languages** Elvish, Undercommon\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n***Fey Ancestry.*** The drider has advantage on saving throws against being charmed, and magic can't put the drider to sleep.\n\n***Innate Spellcasting.*** The drider's innate spellcasting ability is Wisdom (spell save DC 13). The drider can innately cast the following spells, requiring no material Components\n\n***Spider Climb.*** The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Sunlight Sensitivity.*** While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n***Web Walker.*** The drider ignores movement restrictions caused by webbing.\n\n### Actions\n***Multiattack.*** The drider makes three attacks, either with its longsword or its longbow. It can replace one of those attacks with a bite attack.\n\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 2 (1d4) piercing damage plus 9 (2d8) poison damage.\n\n***Longsword.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage, or 8 (1d10+3) slashing damage if used with two hands."
};

export default SRD_MONSTER_DRIDER;