import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GRIFFON: SavedMonster = {
  "id": "srd-griffon",
  "name": "Griffon",
  "description": "A griffon has the body of a lion and the head and wings of an eagle. These majestic creatures are fierce predators, known for their love of horseflesh and their tendency to guard remote treasures.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "59 (7d10+21)",
      "speed": "30 ft., fly 80 ft.",
      "senses": "darkvision 60 ft., passive Perception 15",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT -4, WIS +1, CHA -1",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Sight.** The griffon has advantage on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Multiattack.** The griffon makes two attacks: one with its beak and one with its claws.\n\n**Beak.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage.",
    "roleplayingAndTactics": "Griffons are noble but savage hunters. They prefer to attack from the air, diving down to strike with their beak and claws. They are highly territorial and will fiercely defend their nests and hunting grounds. They can be tamed and ridden by skilled individuals, making for formidable aerial mounts."
  },
  "statblock": "### Griffon\n\n*Large monstrosity, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 59 (7d10+21)\n\n- **Speed** 30 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 2 (-4) | 13 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +5\n\n- **Senses** darkvision 60 ft., passive Perception 15\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Keen Sight.*** The griffon has advantage on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Multiattack.*** The griffon makes two attacks: one with its beak and one with its claws.\n\n***Beak.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage."
};

export default SRD_MONSTER_GRIFFON;