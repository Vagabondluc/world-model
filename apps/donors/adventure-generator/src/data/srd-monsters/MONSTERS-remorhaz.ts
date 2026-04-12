
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_REMORHAZ: SavedMonster = {
  "id": "srd-remorhaz",
  "name": "Remorhaz",
  "description": "A remorhaz, or \"polar worm,\" is a massive, centipede-like predator of the frozen wastes. The chitinous plates along its back glow with an intense, internal heat.",
  "profile": {
    "table": {
      "creatureType": "Huge monstrosity",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "17 (natural armor)",
      "hitPoints": "195 (17d12+85)",
      "speed": "30 ft., burrow 20 ft.",
      "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +7, DEX +1, CON +5, INT -3, WIS +0, CHA -3",
      "role": "Brute"
    },
    "savingThrows": {
        "con": 9,
        "wis": 4
    },
    "abilitiesAndTraits": "**Heated Body.** A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.",
    "actions": "**Bite.** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 40 (6d10+7) piercing damage plus 10 (3d6) fire damage. If the target is a creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the remorhaz can't bite another target.\n\n**Swallow.** The remorhaz makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the bite's damage and is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) acid damage at the start of each of the remorhaz's turns.",
    "roleplayingAndTactics": "A remorhaz is an ambush predator, burrowing beneath the ice and snow to erupt under its prey. Its heated body can melt weapons and armor, making melee combat incredibly dangerous. It will attempt to swallow a creature whole to quickly neutralize it."
  },
  "statblock": "### Remorhaz\n\n*Huge monstrosity, unaligned*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 195 (17d12+85)\n\n- **Speed** 30 ft., burrow 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 24 (+7) | 13 (+1) | 21 (+5) | 4 (-3) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Saving Throws** Con +9, Wis +4\n- **Senses** darkvision 60 ft., tremorsense 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n***Heated Body.*** A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 40 (6d10+7) piercing damage plus 10 (3d6) fire damage. If the target is a creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the remorhaz can't bite another target.\n\n***Swallow.*** The remorhaz makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the bite's damage and is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) acid damage at the start of each of the remorhaz's turns."
};

export default SRD_MONSTER_REMORHAZ;
