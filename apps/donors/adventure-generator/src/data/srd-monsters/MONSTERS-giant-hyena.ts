import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_HYENA: SavedMonster = {
  "id": "srd-giant-hyena",
  "name": "Giant Hyena",
  "description": "Larger and more aggressive than a common hyena, this bone-crushing scavenger is a formidable predator, often used as a mount by gnolls.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "45 (6d10+12)",
      "speed": "50 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +2, INT -4, WIS +1, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Rampage.** When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a bonus action to move up to half its speed and make a bite attack.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage.",
    "roleplayingAndTactics": "Giant hyenas are vicious pack hunters. Their Rampage ability makes them incredibly dangerous when they manage to fell an opponent, as it triggers a frenzy of subsequent attacks. They often cackle madly as they close in on their prey."
  },
  "statblock": "### Giant Hyena\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 45 (6d10+12)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 14 (+2) | 14 (+2) | 2 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Rampage.*** When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a bonus action to move up to half its speed and make a bite attack.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage."
};

export default SRD_MONSTER_GIANT_HYENA;