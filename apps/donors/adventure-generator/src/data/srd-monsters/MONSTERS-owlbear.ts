
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OWLBEAR: SavedMonster = {
  "id": "srd-owlbear",
  "name": "Owlbear",
  "description": "A monstrous cross between a giant owl and a bear, an owlbear is a ferocious predator, known for its aggression, ferocity, and terrifyingly bad temper.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "59 (7d10+21)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +5, DEX +1, CON +3, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Sight and Smell.** The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell.",
    "actions": "**Multiattack.** The owlbear makes two attacks: one with its beak and one with its claws.\n\n**Beak.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one creature. *Hit:* 10 (1d10+5) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 14 (2d8 + 5) slashing damage.",
    "roleplayingAndTactics": "Owlbears are notoriously aggressive and territorial. They will attack any creature they perceive as a threat without hesitation. They are straightforward combatants, using their powerful beak and claws to tear enemies apart. An owlbear's screeching roar is often the last thing its victims hear."
  },
  "statblock": "### Owlbear\n\n*Large monstrosity, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 59 (7d10+21)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 20 (+5) | 12 (+1) | 17 (+3) | 3 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Keen Sight and Smell.*** The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell.\n\n### Actions\n***Multiattack.*** The owlbear makes two attacks: one with its beak and one with its claws.\n\n***Beak.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one creature. *Hit:* 10 (1d10+5) piercing damage."
};

export default SRD_MONSTER_OWLBEAR;
