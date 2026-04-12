import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ELF_DROW: SavedMonster = {
  "id": "srd-elf-drow",
  "name": "Elf, Drow",
  "description": "Drow, also known as dark elves, are a cruel and cunning subterranean race. They are infamous for their treachery, their worship of the demon queen Lolth, and their weakness in sunlight.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (elf)",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "15 (chain shirt)",
      "hitPoints": "13 (3d8)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 12",
      "languages": "Elvish, Undercommon",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +0, INT +0, WIS +0, CHA +1",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Fey Ancestry.** The drow has advantage on saving throws against being charmed, and magic can't put the drow to sleep.\n\n**Innate Spellcasting.** The drow's spellcasting ability is Charisma (spell save DC 11). It can innately cast the following spells, requiring no material Components\n\n**Sunlight Sensitivity.** While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Shortsword.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.",
    "roleplayingAndTactics": "Drow are skilled skirmishers who use their innate magical abilities to gain the upper hand. They will use *darkness* to blind their enemies and *faerie fire* to give their allies an advantage. Most drow warriors coat their blades with poison."
  },
  "statblock": "### Elf, Drow\n\n*Medium humanoid (elf), neutral evil*\n\n___\n\n- **Armor Class** 15 (chain shirt)\n\n- **Hit Points** 13 (3d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 14 (+2) | 10 (+0) | 11 (+0) | 11 (+0) | 12 (+1) |\n\n___\n\n- **Skills** Perception +2, Stealth +4\n\n- **Senses** darkvision 120 ft., passive Perception 12\n\n- **Languages** Elvish, Undercommon\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Fey Ancestry.*** The drow has advantage on saving throws against being charmed, and magic can't put the drow to sleep.\n\n***Innate Spellcasting.*** The drow's spellcasting ability is Charisma (spell save DC 11). It can innately cast the following spells, requiring no material Components\n\n***Sunlight Sensitivity.*** While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Shortsword.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_ELF_DROW;