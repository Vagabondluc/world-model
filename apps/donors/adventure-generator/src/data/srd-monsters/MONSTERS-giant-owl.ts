import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_OWL: SavedMonster = {
  "id": "srd-giant-owl",
  "name": "Giant Owl",
  "description": "These massive nocturnal birds of prey are intelligent, noble creatures of the deep forests and ancient ruins. They are silent hunters and valued allies of sylvan beings.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "neutral",
      "armorClass": "12",
      "hitPoints": "19 (3d10+3)",
      "speed": "5 ft., fly 60 ft.",
      "senses": "darkvision 120 ft., passive Perception 15",
      "languages": "Giant Owl, understands Common, Elvish, and Sylvan but can't speak them",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +1, INT -1, WIS +1, CHA +0",
      "role": "Skirmisher"
    },
    "savingThrows": {
      "wis": 3
    },
    "abilitiesAndTraits": "**Flyby.** The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.\n\n**Keen Hearing and Sight.** The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight.",
    "actions": "**Talons.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 8 (2d6+1) slashing damage.",
    "roleplayingAndTactics": "Giant owls are silent stalkers of the night. They use their exceptional darkvision and keen senses to spot prey from high above, then swoop down for a devastating strike with their talons. Thanks to their Flyby ability, they can attack and retreat without fear of retaliation."
  },
  "statblock": "### Giant Owl\n\n*Large beast, neutral*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 5 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 15 (+2) | 12 (+1) | 8 (-1) | 13 (+1) | 10 (+0) |\n\n___\n\n- **Saving Throws** Wis +3\n- **Skills** Perception +5, Stealth +4\n\n- **Senses** darkvision 120 ft., passive Perception 15\n\n- **Languages** Giant Owl, understands Common, Elvish, and Sylvan but can't speak them\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Flyby.*** The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.\n\n***Keen Hearing and Sight.*** The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight.\n\n### Actions\n***Talons.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 8 (2d6+1) slashing damage."
};

export default SRD_MONSTER_GIANT_OWL;