

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MAMMOTH: SavedMonster = {
  "id": "srd-mammoth",
  "name": "Mammoth",
  "description": "These colossal, shaggy-haired relatives of the elephant are icons of the frozen tundra and prehistoric plains. Their massive tusks and thunderous charge make them a formidable force of nature.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "126 (11d12+55)",
      "speed": "40 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +7, DEX -1, CON +5, INT -4, WIS +0, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Trampling Charge.** If the mammoth moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action.",
    "actions": "**Gore.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 25 (4d8+7) piercing damage.\n\n**Stomp.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one prone creature. *Hit:* 29 (4d10+7) bludgeoning damage.",
    "roleplayingAndTactics": "Mammoths are herbivores and are generally peaceful unless threatened or protecting their young. When angered, a mammoth is a terrifying sight, using its Trampling Charge to flatten enemies before goring them with its tusks or crushing them underfoot."
  },
  "statblock": "### Mammoth\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 126 (11d12+55)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 24 (+7) | 9 (-1) | 21 (+5) | 3 (-4) | 11 (+0) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n***Trampling Charge.*** If the mammoth moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action.\n\n### Actions\n***Gore.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 25 (4d8+7) piercing damage.\n\n***Stomp.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one prone creature. *Hit:* 29 (4d10+7) bludgeoning damage."
};

export default SRD_MONSTER_MAMMOTH;