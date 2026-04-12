
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_NIGHTMARE: SavedMonster = {
    "id": "srd-nightmare",
    "name": "Nightmare",
    "description": "A nightmare is a fiendish steed of the lower planes, its coat the color of bruised night and its mane, tail, and hooves wreathed in hellfire. They serve powerful evil creatures as mounts.",
    "profile": {
      "table": {
        "creatureType": "Large fiend",
        "size": "Large",
        "alignment": "neutral evil",
        "armorClass": "13 (natural armor)",
        "hitPoints": "68 (8d10+24)",
        "speed": "60 ft., fly 90 ft.",
        "senses": "passive Perception 11",
        "languages": "understands Abyssal, Common, and Infernal but can't speak",
        "challengeRating": "3 (700 XP)",
        "keyAbilities": "STR +4, DEX +2, CON +3, INT +0, WIS +1, CHA +2",
        "role": "Skirmisher"
      },
      "abilitiesAndTraits": "**Confer Fire Resistance.** The nightmare can grant resistance to fire damage to anyone riding it.\n\n**Illumination.** The nightmare sheds bright light in a 10- foot radius and dim light for an additional 10 feet.",
      "actions": "**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage plus 7 (2d6) fire damage.\n\n**Ethereal Stride.** The nightmare and up to three willing creatures within 5 feet of it magically enter the Ethereal Plane from the Material Plane, or vice versa.",
      "roleplayingAndTactics": "Nightmares are intelligent and malicious creatures. They fight with fiery hooves and will often use their speed to trample foes. They can also travel between planes, making them difficult to corner. A nightmare is utterly loyal to its rider."
    },
    "statblock": "### Nightmare\n\n*Large fiend, neutral evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 68 (8d10+24)\n\n- **Speed** 60 ft., fly 90 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 10 (+0) | 13 (+1) | 15 (+2) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** understands Abyssal, Common, and Infernal but can't speak\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Confer Fire Resistance.*** The nightmare can grant resistance to fire damage to anyone riding it.\n\n***Illumination.*** The nightmare sheds bright light in a 10- foot radius and dim light for an additional 10 feet.\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage plus 7 (2d6) fire damage."
  };
export default SRD_MONSTER_NIGHTMARE;
