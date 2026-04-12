
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SHADOW: SavedMonster = {
  "id": "srd-shadow",
  "name": "Shadow",
  "description": "Shadows are undead creatures of living darkness, lurking in dark ruins and forgotten places. They despise all light and living things, draining strength from their victims.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "12",
      "hitPoints": "16 (3d8+3)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -2, DEX +2, CON +1, INT -2, WIS +0, CHA -1",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Amorphous.** The shadow can move through a space as narrow as 1 inch wide without squeezing.\n\n**Shadow Stealth.** While in dim light or darkness, the shadow can take the Hide action as a bonus action.\n\n**Sunlight Weakness.** While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws.",
    "actions": "**Strength Drain.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 9 (2d6+2) necrotic damage, and the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest.",
    "roleplayingAndTactics": "Shadows are incorporeal ambush predators, using their Shadow Stealth to hide in dim light before striking. Their strength-draining touch is their most terrifying weapon. They will focus on a single target, attempting to reduce its strength to zero and create a new shadow under their control."
  },
  "statblock": "### Shadow\n\n*Medium undead, chaotic evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 16 (3d8+3)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 14 (+2) | 13 (+1) | 6 (-2) | 10 (+0) | 8 (-1) |\n\n___\n\n- **Skills** Stealth +4 (+6 in dim light or darkness)\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Amorphous.*** The shadow can move through a space as narrow as 1 inch wide without squeezing.\n\n***Shadow Stealth.*** While in dim light or darkness, the shadow can take the Hide action as a bonus action.\n\n***Sunlight Weakness.*** While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws.\n\n### Actions\n***Strength Drain.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 9 (2d6+2) necrotic damage, and the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest."
};

export default SRD_MONSTER_SHADOW;