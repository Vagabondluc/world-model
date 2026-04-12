
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_EARTH_ELEMENTAL: SavedMonster = {
  "id": "srd-earth-elemental",
  "name": "Earth Elemental",
  "description": "An earth elemental is a hulking, humanoid figure of rock and stone, a living piece of the earth itself given motion and a dim, stubborn consciousness.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "neutral",
      "armorClass": "17 (natural armor)",
      "hitPoints": "126 (12d10+60)",
      "speed": "30 ft., burrow 30 ft.",
      "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 10",
      "languages": "Terran",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +5, DEX -1, CON +5, INT -3, WIS +0, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Earth Glide.** The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.\n\n**Siege Monster.** The elemental deals double damage to objects and structures.",
    "actions": "**Multiattack.** The elemental makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 14 (2d8 + 5) bludgeoning damage.",
    "roleplayingAndTactics": "Slow but implacable, an earth elemental is a straightforward combatant. It uses its Earth Glide to travel through walls and floors to surprise its enemies. Once in melee, it pummels targets with its powerful slam attacks. It is not cunning, but its sheer resilience makes it a dangerous foe."
  },
  "statblock": "### Earth Elemental\n\n*Large elemental, neutral*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 126 (12d10+60)\n\n- **Speed** 30 ft., burrow 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 20 (+5) | 8 (-1) | 20 (+5) | 5 (-3) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., tremorsense 60 ft., passive Perception 10\n\n- **Languages** Terran\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Earth Glide.*** The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.\n\n***Siege Monster.*** The elemental deals double damage to objects and structures.\n\n### Actions\n***Multiattack.*** The elemental makes two slam attacks."
};

export default SRD_MONSTER_EARTH_ELEMENTAL;