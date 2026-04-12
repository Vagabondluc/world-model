import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GNOME_DEEP_SVIRFNEBLIN: SavedMonster = {
  "id": "srd-gnome-deep-svirfneblin",
  "name": "Gnome, Deep (Svirfneblin)",
  "description": "Also known as svirfneblin, deep gnomes are a reclusive and suspicious race that dwells in the deepest caverns of the Underdark. They are master miners and artisans, with a natural affinity for stone.",
  "profile": {
    "table": {
      "creatureType": "Small humanoid (gnome)",
      "size": "Small",
      "alignment": "neutral good",
      "armorClass": "15 (chain shirt)",
      "hitPoints": "16 (3d6+6)",
      "speed": "20 ft.",
      "senses": "darkvision 120 ft., passive Perception 12",
      "languages": "Gnomish, Terran, Undercommon",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +2, INT +1, WIS +0, CHA -1",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Stone Camouflage.** The gnome has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n**Gnome Cunning.** The gnome has advantage on Intelligence, Wisdom, and Charisma saving throws against magic.\n\n**Innate Spellcasting.** The gnome's innate spellcasting ability is Intelligence (spell save DC 11). It can innately cast the following spells, requiring no material Components:\n\nAt will: *nondetection* (self only)\n1/day each: *blindness/deafness, blur, disguise self*",
    "actions": "**War Pick.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage.\n\n**Poisoned Dart.** *Ranged Weapon Attack:* +4 to hit, range 30/120 ft., one creature. *Hit:* 4 (1d4+2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "Deep gnomes are cautious and prefer to avoid conflict. They use their Stone Camouflage to hide and observe intruders. If forced to fight, they use their innate spells like *blur* and *blindness/deafness* to disorient foes before striking with their war picks."
  },
  "statblock": "### Gnome, Deep (Svirfneblin)\n\n*Small humanoid (gnome), neutral good*\n\n___\n\n- **Armor Class** 15 (chain shirt)\n\n- **Hit Points** 16 (3d6+6)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 14 (+2) | 14 (+2) | 12 (+1) | 10 (+0) | 9 (-1) |\n\n___\n\n- **Skills** Investigation +3, Perception +2, Stealth +4\n\n- **Senses** darkvision 120 ft., passive Perception 12\n\n- **Languages** Gnomish, Terran, Undercommon\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Stone Camouflage.*** The gnome has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n***Gnome Cunning.*** The gnome has advantage on Intelligence, Wisdom, and Charisma saving throws against magic.\n\n***Innate Spellcasting.*** The gnome's innate spellcasting ability is Intelligence (spell save DC 11). It can innately cast the following spells, requiring no material Components\n\n### Actions\n***War Pick.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage."
};

export default SRD_MONSTER_GNOME_DEEP_SVIRFNEBLIN;