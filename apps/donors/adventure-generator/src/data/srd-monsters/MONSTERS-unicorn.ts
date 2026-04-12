
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_UNICORN: SavedMonster = {
  "id": "srd-unicorn",
  "name": "Unicorn",
  "description": "A unicorn is a celestial creature of pure goodness, a symbol of purity and grace. It appears as a beautiful white horse with a single, spiraling horn on its forehead.",
  "profile": {
    "table": {
      "creatureType": "Large celestial",
      "size": "Large",
      "alignment": "lawful good",
      "armorClass": "12",
      "hitPoints": "67 (9d10+18)",
      "speed": "50 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "Celestial, Elvish, Sylvan, telepathy 60 ft.",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +2, INT +0, WIS +3, CHA +3",
      "role": "Leader"
    },
    "abilitiesAndTraits": "**Charge.** If the unicorn moves at least 20 feet straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.\n\n**Innate Spellcasting.** The unicorn's innate spellcasting ability is Charisma (spell save DC 14). The unicorn can innately cast the following spells, requiring no Components:\nAt will: *detect evil and good, druidcraft, pass without trace*\n1/day each: *calm emotions, dispel evil and good, entangle*\n\n**Magic Resistance.** The unicorn has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The unicorn's weapon attacks are magical.",
    "actions": "**Multiattack.** The unicorn makes two attacks: one with its hooves and one with its horn.\n\n**Hooves.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.\n\n**Horn.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage.\n\n**Healing Touch (3/Day).** The unicorn touches another creature with its horn. The target magically regains 11 (2d8+2) hit points. In addition, the touch removes all diseases and neutralizes all poisons afflicting the target.\n\n**Teleport (1/Day).** The unicorn magically teleports itself and up to three willing creatures it can see within 5 feet of it, along with any equipment they are wearing or carrying, to a location the unicorn is familiar with, up to 1 mile away.",
    "roleplayingAndTactics": "Unicorns are shy creatures that only reveal themselves to the pure of heart. They will avoid combat, but if forced to defend their forest, they are formidable foes, using their charge and magical horn to strike down evil. Their horn can also heal the sick and cure poison."
  },
  "statblock": "### Unicorn\n\n*Large celestial, lawful good*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 67 (9d10+18)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 14 (+2) | 15 (+2) | 11 (+0) | 17 (+3) | 16 (+3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** Celestial, Elvish, Sylvan, telepathy 60 ft.\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Charge.*** If the unicorn moves at least 20 feet straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.\n\n***Innate Spellcasting.*** The unicorn's innate spellcasting ability is Charisma (spell save DC 14). The unicorn can innately cast the following spells, requiring no Components\n\n***Magic Resistance.*** The unicorn has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The unicorn's weapon attacks are magical.\n\n### Actions\n***Multiattack.*** The unicorn makes two attacks: one with its hooves and one with its horn.\n\n***Hooves.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.\n\n***Horn.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage.\n\n***Healing Touch (3/Day).*** The unicorn touches another creature with its horn. The target magically regains 11 (2d8+2) hit points. In addition, the touch removes all diseases and neutralizes all poisons afflicting the target.\n\n***Teleport (1/Day).*** The unicorn magically teleports itself and up to three willing creatures it can see within 5 feet of it, along with any equipment they are wearing or carrying, to a location the unicorn is familiar with, up to 1 mile away."
};

export default SRD_MONSTER_UNICORN;