
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PEGASUS: SavedMonster = {
  "id": "srd-pegasus",
  "name": "Pegasus",
  "description": "A pegasus is a magnificent winged horse that serves the cause of good. They are shy, noble creatures that form strong bonds with worthy riders.",
  "profile": {
    "table": {
      "creatureType": "Large celestial",
      "size": "Large",
      "alignment": "chaotic good",
      "armorClass": "12",
      "hitPoints": "59 (7d10+21)",
      "speed": "60 ft., fly 90 ft.",
      "senses": "passive Perception 16",
      "languages": "understands Celestial, Common, Elvish, and Sylvan but can't speak",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT +0, WIS +2, CHA +1",
      "role": "Skirmisher"
    },
    "savingThrows": {
        "dex": 5,
        "wis": 5,
        "cha": 4
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The pegasus makes two attacks: one with its hooves and one with its horn.\n\n**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6 + 4) bludgeoning damage.\n\n**Horn.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 7 (1d6 + 4) piercing damage.",
    "roleplayingAndTactics": "A pegasus is a timid creature that will avoid combat if it can. If forced to fight, it uses its superior flight to make diving attacks. It will only offer itself as a mount to a creature of pure heart and noble intention."
  },
  "statblock": "### Pegasus\n\n*Large celestial, chaotic good*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 59 (7d10+21)\n\n- **Speed** 60 ft., fly 90 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 10 (+0) | 15 (+2) | 13 (+1) |\n\n___\n\n- **Saving Throws** Dex +5, Wis +5, Cha +4\n- **Skills** Perception +6\n\n- **Senses** passive Perception 16\n\n- **Languages** understands Celestial, Common, Elvish, and Sylvan but can't speak\n\n- **Challenge** 2 (450 XP)\n\n___\n\n### Actions\n***Multiattack.*** The pegasus makes two attacks: one with its hooves and one with its horn.\n\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6 + 4) bludgeoning damage.\n\n***Horn.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 7 (1d6 + 4) piercing damage."
};

export default SRD_MONSTER_PEGASUS;
