
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CULTIST: SavedMonster = {
  "id": "srd-cultist",
  "name": "Cultist",
  "description": "Cultists are fanatical followers of a dark power, willing to commit any atrocity in the name of their cause. They are often found in secret cabals, performing forbidden rituals.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any non-good alignment",
      "armorClass": "12 (leather armor)",
      "hitPoints": "9 (2d8)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language (usually Common)",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +0, DEX +1, CON +0, INT +0, WIS +0, CHA +0",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Dark Devotion.** The cultist has advantage on saving throws against being charmed or frightened.",
    "actions": "**Scimitar.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 4 (1d6 + 1) slashing damage.",
    "roleplayingAndTactics": "Cultists fight with fanatical zeal but little skill. They rely on numbers to overwhelm their enemies. They are not brave when isolated and will try to flee if their leader is defeated, but will fight to the death to protect a sacred object or place."
  },
  "statblock": "### Cultist\n\n*Medium humanoid (any race), any non-good alignment*\n\n___\n\n- **Armor Class** 12 (leather armor)\n\n- **Hit Points** 9 (2d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 12 (+1) | 10 (+0) | 10 (+0) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Skills** Deception +2, Religion +2\n\n- **Senses** passive Perception 10\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Dark Devotion.*** The cultist has advantage on saving throws against being charmed or frightened.\n\n### Actions\n***Scimitar.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 4 (1d6 + 1) slashing damage."
};

export default SRD_MONSTER_CULTIST;