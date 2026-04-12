
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GHAST_GHOUL: SavedMonster = {
  "id": "srd-ghast-ghoul",
  "name": "Ghast (Ghoul)",
  "description": "Ghasts are more powerful and cunning versions of ghouls. They exude a sickening stench that can overwhelm the living, and their presence inspires their lesser kin.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "13",
      "hitPoints": "36 (8d8)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Common",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +3, CON +0, INT +0, WIS +0, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Stench.** Any creature that starts its turn within 5 feet of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast's Stench for 24 hours.\n\n**Turning Defiance.** The ghast and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead.\n\n**Paralyzing Claws.** If the ghast hits a creature other than an elf or undead with a claw attack (see Actions), the target must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 12 (2d8+3) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) slashing damage.",
    "roleplayingAndTactics": "Ghasts lead packs of ghouls with cunning and cruelty. They use their Stench to sicken foes before closing in to use their paralyzing claws. They are intelligent enough to target clerics or paladins first to remove the threat of Turning."
  },
  "statblock": "### Ghast (Ghoul)\n\n*Medium undead, chaotic evil*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 36 (8d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 17 (+3) | 10 (+0) | 11 (+0) | 10 (+0) | 8 (-1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Common\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Stench.*** Any creature that starts its turn within 5 feet of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast's Stench for 24 hours.\n\n***Turning Defiance.*** The ghast and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 12 (2d8+3) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) slashing damage. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
};

export default SRD_MONSTER_GHAST_GHOUL;
