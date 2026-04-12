

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BLOOD_HAWK: SavedMonster = {
  "id": "srd-blood-hawk",
  "name": "Blood Hawk",
  "description": "These aggressive, carnivorous birds flock in great numbers, their plumage the color of dried blood. They have an unnerving intelligence and a taste for humanoid flesh.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "7 (2d6)",
      "speed": "10 ft., fly 60 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR -2, DEX +2, CON +0, INT -4, WIS +2, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Keen Sight.** The hawk has advantage on Wisdom (Perception) checks that rely on sight.\n\n**Pack Tactics.** The hawk has advantage on an attack roll against a creature if at least one of the hawk's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Beak.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage.",
    "roleplayingAndTactics": "Blood hawks are cowardly alone but fearless in a flock. They use their high-speed flight and Pack Tactics to swarm isolated targets, making repeated diving attacks with their sharp beaks. They will retreat if they face significant, organized resistance."
  },
  "statblock": "### Blood Hawk\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 7 (2d6)\n\n- **Speed** 10 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 14 (+2) | 10 (+0) | 3 (-4) | 14 (+2) | 5 (-3) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Keen Sight.*** The hawk has advantage on Wisdom (Perception) checks that rely on sight.\n\n***Pack Tactics.*** The hawk has advantage on an attack roll against a creature if at least one of the hawk's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Beak.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage."
};

export default SRD_MONSTER_BLOOD_HAWK;