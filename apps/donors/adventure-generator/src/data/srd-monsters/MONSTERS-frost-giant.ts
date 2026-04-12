
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FROST_GIANT: SavedMonster = {
  "id": "srd-frost-giant",
  "name": "Frost Giant",
  "description": " towering reavers from the frozen peaks, frost giants respect only brute strength. Their hair and beards are wild and rimed with frost, and they adorn themselves with the trophies of their kills—dragon scales, mammoth ivory, and iron.",
  "profile": {
    "table": {
      "creatureType": "Huge giant",
      "size": "Huge",
      "alignment": "neutral evil",
      "armorClass": "15 (patchwork armor)",
      "hitPoints": "138 (12d12+60)",
      "speed": "40 ft.",
      "senses": "passive Perception 13",
      "languages": "Giant",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +6, DEX -1, CON +5, INT -1, WIS +0, CHA +1",
      "role": "Brute"
    },
    "savingThrows": {
      "str": 9,
      "con": 8,
      "wis": 3
    },
    "abilitiesAndTraits": "**Immunity to Cold.** The giant is immune to cold damage.",
    "actions": "**Multiattack.** The giant makes two greataxe attacks.\n\n**Greataxe.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 25 (3d12+6) slashing damage.\n\n**Rock.** *Ranged Weapon Attack:* +9 to hit, range 60/240 ft., one target. *Hit:* 28 (4d10+6) bludgeoning damage.",
    "roleplayingAndTactics": "Frost giants are raiders who value strength above all else. They soften up targets with boulders before charging in to swing their massive greataxes. They will focus on the strongest-looking opponent to prove their dominance, ignoring weaker foes unless they become annoying."
  },
  "statblock": "### Frost Giant\n\n*Huge giant, neutral evil*\n\n___\n\n- **Armor Class** 15 (patchwork armor)\n\n- **Hit Points** 138 (12d12+60)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 9 (-1) | 21 (+5) | 9 (-1) | 10 (+0) | 12 (+1) |\n\n___\n\n- **Saving Throws** Str +9, Con +8, Wis +3\n- **Skills** Athletics +9, Perception +3\n\n- **Damage Immunities** cold\n- **Senses** passive Perception 13\n\n- **Languages** Giant\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n### Actions\n***Multiattack.*** The giant makes two greataxe attacks.\n\n***Greataxe.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 25 (3d12+6) slashing damage.\n\n***Rock.*** *Ranged Weapon Attack:* +9 to hit, range 60/240 ft., one target. *Hit:* 28 (4d10 + 6) bludgeoning damage."
};

export default SRD_MONSTER_FROST_GIANT;
