
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TIGER: SavedMonster = {
  "id": "srd-tiger",
  "name": "Tiger",
  "description": "A large, powerful feline predator of the jungle and forest, known for its distinctive striped coat and stealthy hunting style.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "37 (5d10+10)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +2, INT -4, WIS +1, CHA -1",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Keen Smell.** The tiger has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Pounce.** If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage.",
    "roleplayingAndTactics": "Tigers are solitary ambush predators. They use their stealth to get close to prey, then use their Pounce ability to knock it to the ground before delivering a killing bite."
  },
  "statblock": "### Tiger\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 37 (5d10+10)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 15 (+2) | 14 (+2) | 3 (-4) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +3, Stealth +6\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Smell.*** The tiger has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Pounce.*** If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage."
};

export default SRD_MONSTER_TIGER;