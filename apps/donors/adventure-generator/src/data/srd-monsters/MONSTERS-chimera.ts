import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CHIMERA: SavedMonster = {
  "id": "srd-chimera",
  "name": "Chimera",
  "description": "A monstrous hybrid with the heads of a dragon, a lion, and a goat, and the body of a lion with draconic wings. Chimeras are vicious, ill-tempered creatures driven by the conflicting predatory instincts of their three heads.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "14 (natural armor)",
      "hitPoints": "114 (12d10+48)",
      "speed": "30 ft., fly 60 ft.",
      "senses": "darkvision 60 ft., passive Perception 18",
      "languages": "understands Draconic but can't speak",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +4, INT -4, WIS +2, CHA +0",
      "role": "Brute"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) piercing damage.\n\n**Horns.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 10 (1d12+4) bludgeoning damage.\n\n**Claws.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage.\n\n**Fire Breath (Recharge 5-6).** The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "The chimera is a chaotic and unpredictable foe. The dragon head will try to incinerate targets with its fire breath. The lion head will bite and claw nearby enemies, while the goat head attempts to gore anyone who gets too close. It is a terrifying aerial combatant, making diving attacks."
  },
  "statblock": "### Chimera\n\n*Large monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 114 (12d10+48)\n\n- **Speed** 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 11 (+0) | 19 (+4) | 3 (-4) | 14 (+2) | 10 (+0) |\n\n___\n\n- **Skills** Perception +8\n\n- **Senses** darkvision 60 ft., passive Perception 18\n\n- **Languages** understands Draconic but can't speak\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n### Actions\n***Multiattack.*** The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) piercing damage.\n\n***Horns.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 10 (1d12+4) bludgeoning damage.\n\n***Claws.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6 + 4) slashing damage.\n\n***Fire Breath (Recharge 5-6).*** The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_CHIMERA;