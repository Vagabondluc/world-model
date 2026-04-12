

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_LION: SavedMonster = {
  "id": "srd-lion",
  "name": "Lion",
  "description": "Known as the king of the savanna, the lion is a powerful predator that hunts in prides. It is a symbol of courage and strength.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "26 (4d10+4)",
      "speed": "50 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +1, INT -4, WIS +1, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Smell.** The lion has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Pack Tactics.** The lion has advantage on an attack roll against a creature if at least one of the lion's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n**Pounce.** If the lion moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action.\n\n**Running Leap.** With a 10-foot running start, the lion can long jump up to 25 feet.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.",
    "roleplayingAndTactics": "Lions hunt in coordinated packs, using their Pounce ability to knock down prey. The pride will then swarm the downed target. They are territorial and will attack any creature that threatens their pride or their kill."
  },
  "statblock": "### Lion\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 26 (4d10+4)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 15 (+2) | 13 (+1) | 3 (-4) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +3, Stealth +6\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Smell.*** The lion has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Pack Tactics.*** The lion has advantage on an attack roll against a creature if at least one of the lion's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n***Pounce.*** If the lion moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action.\n\n***Running Leap.*** With a 10-foot running start, the lion can long jump up to 25 feet.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage."
};

export default SRD_MONSTER_LION;