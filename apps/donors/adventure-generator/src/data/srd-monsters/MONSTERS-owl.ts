
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OWL: SavedMonster = {
  "id": "srd-owl",
  "name": "Owl",
  "description": "These nocturnal birds of prey are known for their silent flight and exceptional hearing and sight. They are common in forests and are often kept by wizards and scholars as familiars.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "1 (1d4-1)",
      "speed": "5 ft., fly 60 ft.",
      "senses": "darkvision 120 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +1, CON -1, INT -4, WIS +1, CHA -2",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Flyby.** The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.\n\n**Keen Hearing and Sight.** The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight.",
    "actions": "**Talons.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage.",
    "roleplayingAndTactics": "Owls are not aggressive and will flee from danger. They are silent hunters, using their Flyby ability to attack small prey without risking retaliation. An owl familiar is fiercely loyal to its master."
  },
  "statblock": "### Owl\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 5 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 13 (+1) | 8 (-1) | 2 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3, Stealth +3\n\n- **Senses** darkvision 120 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Flyby.*** The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.\n\n***Keen Hearing and Sight.*** The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight.\n\n### Actions\n***Talons.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage."
};

export default SRD_MONSTER_OWL;
