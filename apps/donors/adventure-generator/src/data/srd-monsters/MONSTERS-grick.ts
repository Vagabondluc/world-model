import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GRICK: SavedMonster = {
  "id": "srd-grick",
  "name": "Grick",
  "description": "A grick has a wormlike body, a tangle of four tentacles, and a sharp, hungry beak. It is an ambush predator that blends in perfectly with the rock of its subterranean lairs.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "14 (natural armor)",
      "hitPoints": "27 (6d8)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +0, INT -4, WIS +2, CHA -3",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Stone Camouflage.** The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
    "actions": "**Multiattack.** The grick makes one attack with its tentacles. If that attack hits, the grick can make one beak attack against the same target.\n\n**Tentacles.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) slashing damage.\n\n**Beak.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.",
    "roleplayingAndTactics": "Gricks are patient ambushers, using their Stone Camouflage to wait for prey to wander close. Once engaged, they lash out with their tentacles and follow up with a vicious beak attack. They are simple creatures driven by hunger."
  },
  "statblock": "### Grick\n\n*Medium monstrosity, neutral*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 27 (6d8)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 14 (+2) | 11 (+0) | 3 (-4) | 14 (+2) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Stone Camouflage.*** The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n### Actions\n***Multiattack.*** The grick makes one attack with its tentacles. If that attack hits, the grick can make one beak attack against the same target.\n\n***Tentacles.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) slashing damage."
};

export default SRD_MONSTER_GRICK;