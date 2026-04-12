

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MARILITH_DEMON: SavedMonster = {
  "id": "srd-marilith-demon",
  "name": "Marilith (Demon)",
  "description": "A marilith is a terrifying sight, a fusion of a beautiful humanoid female torso with the lower body of a great serpent. With six arms, each wielding a wicked blade, she is a whirlwind of death and a brilliant commander of Abyssal legions.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (demon)",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "189 (18d10+90)",
      "speed": "40 ft.",
      "senses": "truesight 120 ft., passive Perception 13",
      "languages": "Abyssal, telepathy 120 ft.",
      "challengeRating": "16 (15,000 XP)",
      "keyAbilities": "STR +4, DEX +5, CON +5, INT +4, WIS +3, CHA +5",
      "role": "Solo"
    },
    "savingThrows": {
      "str": 9,
      "con": 10,
      "wis": 8,
      "cha": 10
    },
    "abilitiesAndTraits": "**Magic Resistance.** The marilith has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The marilith's weapon attacks are magical.\n\n**Reactive.** The marilith can take one reaction on every turn in a combat.",
    "actions": "**Multiattack.** The marilith makes seven attacks: six with its longswords and one with its tail.\n\n**Longsword.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one creature. *Hit:* 15 (2d10+4) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 19). Until this grapple ends, the target is restrained, the marilith can automatically hit the target with its tail, and the marilith can't make tail attacks against other targets.\n\n**Teleport.** The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
    "roleplayingAndTactics": "A marilith is a brilliant tactician and a devastating combatant. She will teleport into the heart of the enemy, using her multiple attacks and reactions to engage several foes at once. She will use her tail to grapple a powerful enemy, then focus her six longsword attacks on another target. She is a proud and arrogant commander, and will not suffer fools or cowards."
  },
  "statblock": "### Marilith (Demon)\n\n*Large fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 189 (18d10+90)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 20 (+5) | 20 (+5) | 18 (+4) | 16 (+3) | 20 (+5) |\n\n___\n\n- **Saving Throws** Str +9, Con +10, Wis +8, Cha +10\n- **Senses** truesight 120 ft., passive Perception 13\n\n- **Languages** Abyssal, telepathy 120 ft.\n\n- **Challenge** 16 (15,000 XP)\n\n___\n\n***Magic Resistance.*** The marilith has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The marilith's weapon attacks are magical.\n\n***Reactive.*** The marilith can take one reaction on every turn in a combat.\n\n#### Actions\n\n***Multiattack.*** The marilith makes seven attacks: six with its longswords and one with its tail.\n\n***Longsword.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one creature. *Hit:* 15 (2d10+4) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 19). Until this grapple ends, the target is restrained, the marilith can automatically hit the target with its tail, and the marilith can't make tail attacks against other targets.\n\n***Teleport.*** The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
};