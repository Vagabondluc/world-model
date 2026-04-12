
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SOLAR_ANGEL: SavedMonster = {
  "id": "srd-solar-angel",
  "name": "Solar (Angel)",
  "description": "Solars are the most powerful of angels, the direct instruments of a deity's will. They are beings of pure light and goodness, and their presence can turn the tide of cosmic battles.",
  "profile": {
    "table": {
      "creatureType": "Large celestial",
      "size": "Large",
      "alignment": "lawful good",
      "armorClass": "21 (natural armor)",
      "hitPoints": "243 (18d10+144)",
      "speed": "50 ft., fly 150 ft.",
      "senses": "truesight 120 ft., passive Perception 24",
      "languages": "all, telepathy 120 ft.",
      "challengeRating": "21 (33,000 XP)",
      "keyAbilities": "STR +8, DEX +6, CON +8, INT +7, WIS +7, CHA +10",
      "role": "Leader"
    },
    "savingThrows": {
      "int": 14,
      "wis": 14,
      "cha": 17
    },
    "abilitiesAndTraits": "**Angelic Weapons.** The solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack).\n\n**Divine Awareness.** The solar knows if it hears a lie.\n\n**Innate Spellcasting.** The solar's spellcasting ability is Charisma (spell save DC 25). It can innately cast the following spells, requiring no material Components\n\n**Magic Resistance.** The solar has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The solar makes two greatsword attacks.\n\n**Greatsword.** *Melee Weapon Attack:* +15 to hit, reach 5 ft., one target. *Hit:* 22 (4d6+8) slashing damage plus 27 (6d8) radiant damage.\n\n**Slaying Longbow.** *Ranged Weapon Attack:* +13 to hit, range 150/600 ft., one target. *Hit:* 15 (2d8+6) piercing damage plus 27 (6d8) radiant damage. If the target is a creature that has 100 hit points or fewer, it must succeed on a DC 15 Constitution saving throw or die.\n\n**Flying Sword.** The solar releases its greatsword to hover magically in an unoccupied space within 5 feet of it. If the solar can see the sword, the solar can mentally command it as a bonus action to fly up to 50 feet and either make one attack against a target or return to the solar's hands. If the hovering sword is targeted by any effect, the solar is considered to be holding it. The hovering sword falls if the solar dies.\n\n**Healing Touch (4/Day).** The solar touches another creature. The target magically regains 40 (8d8+4) hit points and is freed from any curse, disease, poison, blindness, or deafness.",
    "roleplayingAndTactics": "A solar is a being of awesome power and unwavering justice. It will not hesitate to destroy ultimate evil. In combat, it is a devastating force, using its Slaying Longbow to eliminate threats from afar and its radiant greatsword to smite foes in melee. It is a brilliant tactician and a peerless warrior."
  },
  "statblock": "### Solar (Angel)\n\n*Large celestial, lawful good*\n\n___\n\n- **Armor Class** 21 (natural armor)\n\n- **Hit Points** 243 (18d10+144)\n\n- **Speed** 50 ft., fly 150 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 26 (+8) | 22 (+6) | 26 (+8) | 25 (+7) | 25 (+7) | 30 (+10) |\n\n___\n\n- **Saving Throws** Int +14, Wis +14, Cha +17\n- **Skills** Perception +14\n\n- **Senses** truesight 120 ft., passive Perception 24\n\n- **Languages** all, telepathy 120 ft.\n\n- **Challenge** 21 (33,000 XP)\n\n___\n\n***Angelic Weapons.*** The solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack).\n\n***Divine Awareness.*** The solar knows if it hears a lie.\n\n***Innate Spellcasting.*** The solar's spellcasting ability is Charisma (spell save DC 25). It can innately cast the following spells, requiring no material Components\n\n***Magic Resistance.*** The solar has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The solar makes two greatsword attacks.\n\n***Greatsword.*** *Melee Weapon Attack:* +15 to hit, reach 5 ft., one target. *Hit:* 22 (4d6+8) slashing damage plus 27 (6d8) radiant damage.\n\n***Slaying Longbow.*** *Ranged Weapon Attack:* +13 to hit, range 150/600 ft., one target. *Hit:* 15 (2d8+6) piercing damage plus 27 (6d8) radiant damage. If the target is a creature that has 100 hit points or fewer, it must succeed on a DC 15 Constitution saving throw or die.\n\n***Flying Sword.*** The solar releases its greatsword to hover magically in an unoccupied space within 5 feet of it. If the solar can see the sword, the solar can mentally command it as a bonus action to fly up to 50 feet and either make one attack against a target or return to the solar's hands. If the hovering sword is targeted by any effect, the solar is considered to be holding it. The hovering sword falls if the solar dies.\n\n***Healing Touch (4/Day).*** The solar touches another creature. The target magically regains 40 (8d8+4) hit points and is freed from any curse, disease, poison, blindness, or deafness."
};

export default SRD_MONSTER_SOLAR_ANGEL;