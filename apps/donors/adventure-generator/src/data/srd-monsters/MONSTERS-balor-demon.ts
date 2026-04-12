import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BALOR_DEMON: SavedMonster = {
  "id": "srd-balor-demon",
  "name": "Balor (Demon)",
  "description": "Balors are the generals of demonic armies, towering figures of fire and shadow armed with a lightning sword and a flaming whip. Their very presence scorches the ground and fills the air with the scent of brimstone.",
  "profile": {
    "table": {
      "creatureType": "Huge fiend (demon)",
      "size": "Huge",
      "alignment": "chaotic evil",
      "armorClass": "19 (natural armor)",
      "hitPoints": "262 (21d12+126)",
      "speed": "40 ft., fly 80 ft.",
      "senses": "truesight 120 ft., passive Perception 13",
      "languages": "Abyssal, telepathy 120 ft.",
      "challengeRating": "19 (22,000 XP)",
      "keyAbilities": "STR +8, DEX +2, CON +6, INT +5, WIS +3, CHA +6",
      "role": "Solo"
    },
    "abilitiesAndTraits": "**Death Throes.** When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons.\n\n**Fire Aura.** At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.\n\n**Magic Resistance.** The balor has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The balor's weapon attacks are magical.",
    "actions": "**Multiattack.** The balor makes two attacks: one with its longsword and one with its whip.\n\n**Longsword.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 21 (3d8+8) slashing damage plus 13 (3d8) lightning damage. If the balor scores a critical hit, it rolls damage dice three times, instead of twice.\n\n**Whip.** *Melee Weapon Attack:* +14 to hit, reach 30 ft., one target. *Hit:* 15 (2d6+8) slashing damage plus 10 (3d6) fire damage, and the target must succeed on a DC 20 Strength saving throw or be pulled up to 25 feet toward the balor.",
    "roleplayingAndTactics": "A balor is a creature of pure destructive rage. It will teleport into the midst of its enemies to maximize its Fire Aura. It uses its whip to pull ranged attackers or spellcasters into melee range, then devastates them with its lightning-infused longsword. It fights to the death, knowing its demise will result in a massive explosion."
  },
  "statblock": "### Balor (Demon)\n\n*Huge fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 262 (21d12+126)\n\n- **Speed** 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 26 (+8) | 15 (+2) | 22 (+6) | 20 (+5) | 16 (+3) | 22 (+6) |\n\n___\n\n- **Senses** truesight 120 ft., passive Perception 13\n\n- **Languages** Abyssal, telepathy 120 ft.\n\n- **Challenge** 19 (22,000 XP)\n\n___\n\n***Death Throes.*** When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons.\n\n***Fire Aura.*** At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.\n\n***Magic Resistance.*** The balor has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The balor's weapon attacks are magical.\n\n### Actions\n***Multiattack.*** The balor makes two attacks: one with its longsword and one with its whip.\n\n***Longsword.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 21 (3d8+8) slashing damage plus 13 (3d8) lightning damage. If the balor scores a critical hit, it rolls damage dice three times, instead of twice.\n\n***Whip.*** *Melee Weapon Attack:* +14 to hit, reach 30 ft., one target. *Hit:* 15 (2d6+8) slashing damage plus 10 (3d6) fire damage, and the target must succeed on a DC 20 Strength saving throw or be pulled up to 25 feet toward the balor."
};

export default SRD_MONSTER_BALOR_DEMON;