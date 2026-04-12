import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GLABREZU_DEMON: SavedMonster = {
  "id": "srd-glabrezu-demon",
  "name": "Glabrezu (Demon)",
  "description": "Glabrezus are massive demons of great power and cunning, serving as tempters and deceivers in the Abyss. They delight in granting wishes that lead mortals to ruin.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (demon)",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "157 (15d10+75)",
      "speed": "40 ft.",
      "senses": "truesight 120 ft., passive Perception 13",
      "languages": "Abyssal, telepathy 120 ft.",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +5, DEX +2, CON +5, INT +4, WIS +3, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "str": 9,
      "con": 9,
      "wis": 7
    },
    "abilitiesAndTraits": "**Innate Spellcasting.** The glabrezu's spellcasting ability is Intelligence (spell save DC 16). The glabrezu can innately cast the following spells, requiring no material Components:\n\nAt will: *darkness, detect magic, dispel magic*\n1/day each: *confusion, fly, power word stun*\n\n**Magic Resistance.** The glabrezu has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The glabrezu makes four attacks: two with its pincers and two with its fists. Alternatively, it makes two attacks with its pincers and casts one spell.\n\n**Pincer.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 16 (2d10+5) bludgeoning damage. If the target is a Medium or smaller creature, it is grappled (escape DC 15). The glabrezu has two pincers, each of which can grapple only one target.\n\n**Fist.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 7 (2d4+2) bludgeoning damage.",
    "roleplayingAndTactics": "A glabrezu prefers to use its spells to sow confusion and chaos before wading into melee. It will offer a wish to a desperate creature, twisting the words to bring about the most destructive outcome. In combat, it uses its pincers to grapple spellcasters and its fists to pummel other foes."
  },
  "statblock": "### Glabrezu (Demon)\n\n*Large fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 157 (15d10+75)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 20 (+5) | 15 (+2) | 21 (+5) | 19 (+4) | 17 (+3) | 16 (+3) |\n\n___\n\n- **Saving Throws** Str +9, Con +9, Wis +7\n- **Senses** truesight 120 ft., passive Perception 13\n\n- **Languages** Abyssal, telepathy 120 ft.\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n***Innate Spellcasting.*** The glabrezu's spellcasting ability is Intelligence (spell save DC 16). The glabrezu can innately cast the following spells, requiring no material Components\n\n***Magic Resistance.*** The glabrezu has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The glabrezu makes four attacks: two with its pincers and two with its fists. Alternatively, it makes two attacks with its pincers and casts one spell.\n\n***Pincer.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 16 (2d10+5) bludgeoning damage. If the target is a Medium or smaller creature, it is grappled (escape DC 15). The glabrezu has two pincers, each of which can grapple only one target."
};

export default SRD_MONSTER_GLABREZU_DEMON;