
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PIT_FIEND_DEVIL: SavedMonster = {
  "id": "srd-pit-fiend-devil",
  "name": "Pit Fiend (Devil)",
  "description": "The generals of the Nine Hells, pit fiends are towering, winged devils of immense power and cunning. They command infernal legions and are the architects of diabolical plots that span millennia.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (devil)",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "19 (natural armor)",
      "hitPoints": "300 (24d10+168)",
      "speed": "30 ft., fly 60 ft.",
      "senses": "truesight 120 ft., passive Perception 14",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "20 (25,000 XP)",
      "keyAbilities": "STR +8, DEX +2, CON +7, INT +6, WIS +4, CHA +7",
      "role": "Solo"
    },
    "savingThrows": {
        "dex": 8,
        "con": 14,
        "wis": 11
    },
    "abilitiesAndTraits": "**Fear Aura.** Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature's saving throw is successful, the creature is immune to the pit fiend's Fear Aura for the next 24 hours.\n\n**Magic Resistance.** The pit fiend has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The pit fiend's weapon attacks are magical.\n\n**Innate Spellcasting.** The pit fiend's spellcasting ability is Charisma (spell save DC 21). The pit fiend can innately cast the following spells, requiring no material Components",
    "actions": "**Multiattack.** The pit fiend makes four attacks: one with its bite, one with its claw, one with its mace, and one with its tail.\n\n**Bite.** *Melee Weapon Attack:* +14 to hit, reach 5 ft., one target. *Hit:* 22 (4d6+8) piercing damage. The target must succeed on a DC 21 Constitution saving throw or become poisoned. While poisoned in this way, the target can't regain hit points, and it takes 21 (6d6) poison damage at the start of each of its turns. The poisoned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\n**Claw.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 17 (2d8+8) slashing damage.\n\n**Mace.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) bludgeoning damage plus 21 (6d6) fire damage.",
    "roleplayingAndTactics": "A pit fiend is a master tactician and a devastating combatant. It uses its innate spellcasting to control the battlefield with fire and fear before wading into melee. Its multiattack is a storm of bites, claws, and mace strikes, each carrying a foul, infernal power. A pit fiend will not fight a battle it does not expect to win."
  },
  "statblock": "### Pit Fiend (Devil)\n\n*Large fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 300 (24d10+168)\n\n- **Speed** 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 26 (+8) | 14 (+2) | 24 (+7) | 22 (+6) | 18 (+4) | 24 (+7) |\n\n___\n\n- **Saving Throws** Dex +8, Con +14, Wis +11\n- **Senses** truesight 120 ft., passive Perception 14\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 20 (25,000 XP)\n\n___\n\n***Fear Aura.*** Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature's saving throw is successful, the creature is immune to the pit fiend's Fear Aura for the next 24 hours.\n\n***Magic Resistance.*** The pit fiend has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The pit fiend's weapon attacks are magical.\n\n***Innate Spellcasting.*** The pit fiend's spellcasting ability is Charisma (spell save DC 21). The pit fiend can innately cast the following spells, requiring no material Components\n\n### Actions\n***Multiattack.*** The pit fiend makes four attacks: one with its bite, one with its claw, one with its mace, and one with its tail.\n\n***Bite.*** *Melee Weapon Attack:* +14 to hit, reach 5 ft., one target. *Hit:* 22 (4d6+8) piercing damage. The target must succeed on a DC 21 Constitution saving throw or become poisoned. While poisoned in this way, the target can't regain hit points, and it takes 21 (6d6) poison damage at the start of each of its turns. The poisoned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\n***Claw.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 17 (2d8+8) slashing damage.\n\n***Mace.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) bludgeoning damage plus 21 (6d6) fire damage."
};

export default SRD_MONSTER_PIT_FIEND_DEVIL;
