
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OGRE: SavedMonster = {
  "id": "srd-ogre",
  "name": "Ogre",
  "description": "Ogres are dim-witted, brutish giants who live by raiding and scavenging. They are known for their short tempers, immense strength, and voracious appetites.",
  "profile": {
    "table": {
      "creatureType": "Large giant",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "11 (hide armor)",
      "hitPoints": "59 (7d10+21)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 8",
      "languages": "Common, Giant",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX -1, CON +3, INT -3, WIS -2, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "",
    "actions": "**Greatclub.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage.\n\n**Javelin.** *Melee or Ranged Weapon Attack:* +6 to hit, reach 5 ft. or range 30/120 ft., one target. *Hit:* 11 (2d6+4) piercing damage.",
    "roleplayingAndTactics": "Ogres are bullies who enjoy demonstrating their strength. They will charge into a fight, swinging their greatclubs wildly. They are not strategic and will attack the most obvious threat. They can be easily baited or tricked by clever opponents."
  },
  "statblock": "### Ogre\n\n*Large giant, chaotic evil*\n\n___\n\n- **Armor Class** 11 (hide armor)\n\n- **Hit Points** 59 (7d10+21)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 8 (-1) | 16 (+3) | 5 (-3) | 7 (-2) | 7 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 8\n\n- **Languages** Common, Giant\n\n- **Challenge** 2 (450 XP)\n\n___\n\n### Actions\n***Greatclub.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage.\n\n***Javelin.*** *Melee or Ranged Weapon Attack:* +6 to hit, reach 5 ft. or range 30/120 ft., one target. *Hit:* 11 (2d6+4) piercing damage."
};

export default SRD_MONSTER_OGRE;
