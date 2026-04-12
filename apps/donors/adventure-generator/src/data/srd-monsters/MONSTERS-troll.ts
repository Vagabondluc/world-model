
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TROLL: SavedMonster = {
  "id": "srd-troll",
  "name": "Troll",
  "description": "Trolls are loathsome, green-skinned giants known for their voracious appetites and their incredible ability to regenerate from almost any wound. Only fire or acid can permanently put a stop to their rampage.",
  "profile": {
    "table": {
      "creatureType": "Large giant",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "84 (8d10+40)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 12",
      "languages": "Giant",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +5, INT -2, WIS -1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Smell.** The troll has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Regeneration.** The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate.",
    "actions": "**Multiattack.** The troll makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 7 (1d6+4) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage.",
    "roleplayingAndTactics": "Trolls are driven by a simple, all-consuming hunger. They will attack anything that looks edible. They are not intelligent, relying on their brute strength and regeneration to win fights. They have a deep, instinctual fear of fire."
  },
  "statblock": "### Troll\n\n*Large giant, chaotic evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 84 (8d10+40)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 13 (+1) | 20 (+5) | 7 (-2) | 9 (-1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** darkvision 60 ft., passive Perception 12\n\n- **Languages** Giant\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Keen Smell.*** The troll has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Regeneration.*** The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate.\n\n### Actions\n***Multiattack.*** The troll makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 7 (1d6+4) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage."
};

export default SRD_MONSTER_TROLL;