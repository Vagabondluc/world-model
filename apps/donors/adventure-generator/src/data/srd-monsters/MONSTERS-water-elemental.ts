
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WATER_ELEMENTAL: SavedMonster = {
  "id": "srd-water-elemental",
  "name": "Water Elemental",
  "description": "A creature of living water, a water elemental appears as a crashing wave given humanoid form. It is a powerful force of nature, capable of drowning creatures by engulfing them.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "neutral",
      "armorClass": "14 (natural armor)",
      "hitPoints": "114 (12d10+48)",
      "speed": "30 ft., swim 90 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Aquan",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +4, INT -3, WIS +0, CHA -1",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Water Form.** The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.\n\n**Freeze.** If the elemental takes cold damage, it partially freezes; its speed is reduced by 20 feet until the end of its next turn.",
    "actions": "**Multiattack.** The elemental makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage.\n\n**Whelm (Recharge 4-6).** Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8+4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental's space.",
    "roleplayingAndTactics": "A water elemental will use its Whelm ability to grapple and drown its enemies. It can move through small spaces, making it a surprising and dangerous foe in dungeons and other confined areas."
  },
  "statblock": "### Water Elemental\n\n*Large elemental, neutral*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 114 (12d10+48)\n\n- **Speed** 30 ft., swim 90 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 14 (+2) | 18 (+4) | 5 (-3) | 10 (+0) | 8 (-1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Aquan\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Water Form.*** The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.\n\n***Freeze.*** If the elemental takes cold damage, it partially freezes; its speed is reduced by 20 feet until the end of its next turn.\n\n### Actions\n***Multiattack.*** The elemental makes two slam attacks.\n\n***Slam.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage.\n\n***Whelm (Recharge 4-6).*** Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8+4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental's space."
};

export default SRD_MONSTER_WATER_ELEMENTAL;
