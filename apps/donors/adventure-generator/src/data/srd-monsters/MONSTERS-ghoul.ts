
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GHOUL: SavedMonster = {
  "id": "srd-ghoul",
  "name": "Ghoul",
  "description": "Driven by an insatiable hunger for the flesh of the living, ghouls roam graveyards and ruins in packs. Their touch paralyzes their victims, allowing them to feast while the prey is still alive.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "12",
      "hitPoints": "22 (5d8)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Common",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +0, INT -2, WIS +0, CHA -2",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Paralyzing Claws.** If the ghoul hits a creature other than an elf or undead with a claw attack (see Actions), the target must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "actions": "**Bite.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 9 (2d6+2) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4 + 2) slashing damage.",
    "roleplayingAndTactics": "Ghouls are pack hunters that swarm their targets. They use their claws to paralyze victims, leaving them helpless for the pack to devour. They are feral and relentless, driven only by hunger."
  },
  "statblock": "### Ghoul\n\n*Medium undead, chaotic evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 22 (5d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 15 (+2) | 10 (+0) | 7 (-2) | 10 (+0) | 6 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Common\n\n- **Challenge** 1 (200 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 9 (2d6+2) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4 + 2) slashing damage. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
};

export default SRD_MONSTER_GHOUL;
