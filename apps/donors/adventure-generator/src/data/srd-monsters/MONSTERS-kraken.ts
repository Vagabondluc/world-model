

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_KRAKEN: SavedMonster = {
  "id": "srd-kraken",
  "name": "Kraken",
  "description": "Legends of the deep, krakens are colossal cephalopods of immense power and malevolence. They can crush ships with their tentacles and drag entire fleets to a watery grave, their intelligence as vast and ancient as the oceans they inhabit.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan monstrosity (titan)",
      "size": "Gargantuan",
      "alignment": "chaotic evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "472 (27d20+189)",
      "speed": "20 ft., swim 60 ft.",
      "senses": "truesight 120 ft., passive Perception 14",
      "languages": "understands Abyssal, Celestial, Infernal, and Primordial but can't speak, telepathy 120 ft.",
      "challengeRating": "23 (50,000 XP)",
      "keyAbilities": "STR +10, DEX +0, CON +7, INT +6, WIS +4, CHA +5",
      "role": "Solo"
    },
    "savingThrows": {
      "str": 17,
      "dex": 7,
      "con": 14,
      "int": 13,
      "wis": 11
    },
    "abilitiesAndTraits": "**Amphibious.** The kraken can breathe air and water.\n\n**Freedom of Movement.** The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled.\n\n**Siege Monster.** The kraken deals double damage to objects and structures.",
    "actions": "**Multiattack.** The kraken makes three tentacle attacks, each of which it can replace with one use of Fling.\n\n**Bite.** *Melee Weapon Attack:* +17 to hit, reach 5 ft., one target. *Hit:* 23 (3d8+10) piercing damage. If the target is a Large or smaller creature grappled by the kraken, that creature is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the kraken, and it takes 42 (12d6) acid damage at the start of each of the kraken's turns.\n\n**Tentacle.** *Melee Weapon Attack:* +17 to hit, reach 30 ft., one target. *Hit:* 20 (3d6+10) bludgeoning damage, and the target is grappled (escape DC 18). Until this grapple ends, the target is restrained. The kraken has ten tentacles, each of which can grapple one target.\n\n**Fling.** One Large or smaller object held or creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone. If a thrown target strikes a solid surface, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 18 Dexterity saving throw or take the same damage and be knocked prone.\n\n**Lightning Storm.** The kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A kraken is a cataclysmic encounter. It will use its tentacles to grapple and fling ships or creatures, and its Lightning Storm to soften up targets from a distance. It is highly intelligent and will target the greatest threats first. It is a creature of immense ego and may toy with its prey before destroying it."
  },
  "statblock": "### Kraken\n\n*Gargantuan monstrosity (titan), chaotic evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 472 (27d20+189)\n\n- **Speed** 20 ft., swim 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 30 (+10) | 11 (+0) | 25 (+7) | 22 (+6) | 18 (+4) | 20 (+5) |\n\n___\n\n- **Saving Throws** Str +17, Dex +7, Con +14, Int +13, Wis +11\n- **Senses** truesight 120 ft., passive Perception 14\n\n- **Languages** understands Abyssal, Celestial, Infernal, and Primordial but can't speak, telepathy 120 ft.\n\n- **Challenge** 23 (50,000 XP)\n\n___\n\n***Amphibious.*** The kraken can breathe air and water.\n\n***Freedom of Movement.*** The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled.\n\n***Siege Monster.*** The kraken deals double damage to objects and structures.\n\n### Actions\n***Multiattack.*** The kraken makes three tentacle attacks, each of which it can replace with one use of Fling.\n\n***Bite.*** *Melee Weapon Attack:* +17 to hit, reach 5 ft., one target. *Hit:* 23 (3d8+10) piercing damage. If the target is a Large or smaller creature grappled by the kraken, that creature is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the kraken, and it takes 42 (12d6) acid damage at the start of each of the kraken's turns.\n\n***Tentacle.*** *Melee Weapon Attack:* +17 to hit, reach 30 ft., one target. *Hit:* 20 (3d6+10) bludgeoning damage, and the target is grappled (escape DC 18). Until this grapple ends, the target is restrained. The kraken has ten tentacles, each of which can grapple one target.\n\n***Fling.*** One Large or smaller object held or creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone. If a thrown target strikes a solid surface, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 18 Dexterity saving throw or take the same damage and be knocked prone.\n\n***Lightning Storm.*** The kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_KRAKEN;