import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MINOTAUR_SKELETON: SavedMonster = {
  "id": "srd-minotaur-skeleton",
  "name": "Minotaur Skeleton",
  "description": "The animated bones of a minotaur, this undead guardian retains its predecessor's love of the labyrinth and its furious charge. It is a mindless engine of destruction, bound to protect its tomb.",
  "profile": {
    "table": {
      "creatureType": "Large undead",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "12 (natural armor)",
      "hitPoints": "67 (9d10+18)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "understands Abyssal but can't speak",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +2, INT -2, WIS -1, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the skeleton moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone.",
    "actions": "**Greataxe.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 17 (2d12+4) slashing damage.\n\n**Gore.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) piercing damage.",
    "roleplayingAndTactics": "A minotaur skeleton is a straightforward and aggressive combatant. It will use its Charge ability to knock down an opponent, then relentlessly attack with its greataxe. Being mindless, it cannot be reasoned with or frightened and will fight until it is destroyed."
  },
  "statblock": "### Minotaur Skeleton\n\n*Large undead, lawful evil*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 67 (9d10+18)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 11 (+0) | 15 (+2) | 6 (-2) | 8 (-1) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** understands Abyssal but can't speak\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Charge.*** If the skeleton moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone.\n\n### Actions\n***Greataxe.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 17 (2d12+4) slashing damage.\n\n***Gore.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) piercing damage."
};

export default SRD_MONSTER_MINOTAUR_SKELETON;