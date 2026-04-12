

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_LAMIA: SavedMonster = {
  "id": "srd-lamia",
  "name": "Lamia",
  "description": "Lamias have the upper body of a beautiful humanoid and the lower body of a lion. They are decadent and cruel creatures that dwell in ruined desert temples, luring mortals to their doom with promises of pleasure and wealth.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "97 (13d10+26)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 12",
      "languages": "Abyssal, Common",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +2, INT +2, WIS +2, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 3,
      "con": 4,
      "wis": 4
    },
    "abilitiesAndTraits": "**Innate Spellcasting.** The lamia's innate spellcasting ability is Charisma (spell save DC 13). It can innately cast the following spells, requiring no material components.",
    "actions": "**Multiattack.** The lamia makes two attacks: one with its claws and one with its dagger or Intoxicating Touch.\n\n**Claws.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 14 (2d10+3) slashing damage.\n\n***Dagger.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage.\n\n**Intoxicating Touch.** *Melee Spell Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* The target is magically cursed for 1 hour. Until the curse ends, the target has disadvantage on Wisdom saving throws and all ability checks.",
    "roleplayingAndTactics": "A lamia uses its seductive appearance and magical charms to beguile its victims. It prefers to avoid direct combat, using its spells to dominate and confuse. If forced into a fight, it will use its Intoxicating Touch to disable a foe before striking with its claws."
  },
  "statblock": "### Lamia\n\n*Large monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 97 (13d10+26)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 13 (+1) | 15 (+2) | 14 (+2) | 15 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Dex +3, Con +4, Wis +4\n- **Skills** Deception +7, Insight +4, Stealth +3\n\n- **Senses** darkvision 60 ft., passive Perception 12\n\n- **Languages** Abyssal, Common\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Innate Spellcasting.*** The lamia's innate spellcasting ability is Charisma (spell save DC 13). It can innately cast the following spells, requiring no material components.\n\n### Actions\n***Multiattack.*** The lamia makes two attacks: one with its claws and one with its dagger or Intoxicating Touch.\n\n***Claws.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 14 (2d10+3) slashing damage.\n\n***Dagger.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage."
};

export default SRD_MONSTER_LAMIA;