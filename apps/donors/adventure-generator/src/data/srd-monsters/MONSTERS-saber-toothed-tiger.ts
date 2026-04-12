
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SABER_TOOTHED_TIGER: SavedMonster = {
  "id": "srd-saber-toothed-tiger",
  "name": "Saber-Toothed Tiger",
  "description": "A prehistoric predator, this massive cat is known for its two enormous, dagger-like canine teeth. It is a powerful and stealthy hunter of the tundra and plains.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "52 (7d10+14)",
      "speed": "40 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +2, INT -4, WIS +1, CHA -1",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Keen Smell.** The tiger has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Pounce.** If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (1d10+5) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) slashing damage.",
    "roleplayingAndTactics": "A saber-toothed tiger is an ambush predator that uses stealth to get close to its prey. It will use its Pounce to knock a target to the ground, then deliver a devastating bite with its massive fangs. It is a solitary hunter but no less dangerous for it."
  },
  "statblock": "### Saber-Toothed Tiger\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 52 (7d10+14)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 14 (+2) | 15 (+2) | 3 (-4) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +3, Stealth +6\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Keen Smell.*** The tiger has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Pounce.*** If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (1d10+5) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) slashing damage."
};

export default SRD_MONSTER_SABER_TOOTHED_TIGER;
