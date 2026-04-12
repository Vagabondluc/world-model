

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_IRON_GOLEM: SavedMonster = {
  "id": "srd-iron-golem",
  "name": "Iron Golem",
  "description": "The mightiest of the golems, an iron golem is a towering automaton of heavy metal, its face a mask of soulless fury. They are nearly unstoppable guardians, obeying their master's commands without question.",
  "profile": {
    "table": {
      "creatureType": "Large construct",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "20 (natural armor)",
      "hitPoints": "210 (20d10+100)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 10",
      "languages": "understands the languages of its creator but can't speak",
      "challengeRating": "16 (15,000 XP)",
      "keyAbilities": "STR +7, DEX -1, CON +5, INT -4, WIS +0, CHA -5",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Fire Absorption.** Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt.\n\n**Immutable Form.** The golem is immune to any spell or effect that would alter its form.\n\n**Magic Resistance.** The golem has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The golem's weapon attacks are magical.",
    "actions": "**Multiattack.** The golem makes two melee attacks.\n\n**Slam.** *Melee Weapon Attack:* +13 to hit, reach 5 ft., one target. *Hit:* 20 (3d8+7) bludgeoning damage.\n\n**Sword.** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 23 (3d10+7) slashing damage.\n\n**Poison Breath (Recharge 6).** The golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "An iron golem is a mindless engine of destruction. It follows its last command to the letter, attacking relentlessly until its target is destroyed or it is defeated. It will use its Poison Breath on groups of enemies before wading into melee with its powerful slam and sword attacks."
  },
  "statblock": "### Iron Golem\n\n*Large construct, unaligned*\n\n___\n\n- **Armor Class** 20 (natural armor)\n\n- **Hit Points** 210 (20d10+100)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 24 (+7) | 9 (-1) | 20 (+5) | 3 (-4) | 11 (+0) | 1 (-5) |\n\n___\n\n- **Senses** darkvision 120 ft., passive Perception 10\n\n- **Languages** understands the languages of its creator but can't speak\n\n- **Challenge** 16 (15,000 XP)\n\n___\n\n***Fire Absorption.*** Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt.\n\n***Immutable Form.*** The golem is immune to any spell or effect that would alter its form.\n\n***Magic Resistance.*** The golem has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The golem's weapon attacks are magical.\n\n### Actions\n***Multiattack.*** The golem makes two melee attacks.\n\n***Slam.*** *Melee Weapon Attack:* +13 to hit, reach 5 ft., one target. *Hit:* 20 (3d8+7) bludgeoning damage.\n\n***Sword.*** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 23 (3d10+7) slashing damage.\n\n***Poison Breath (Recharge 6).*** The golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_IRON_GOLEM;