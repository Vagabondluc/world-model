import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BULETTE: SavedMonster = {
  "id": "srd-bulette",
  "name": "Bulette",
  "description": "Often called a \"land shark,\" the bulette is a terrifying predator that burrows through the earth as if it were water, its massive armored dorsal fin slicing through the ground.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "17 (natural armor)",
      "hitPoints": "94 (9d10+45)",
      "speed": "40 ft., burrow 40 ft.",
      "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 16",
      "languages": "-",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +5, INT -4, WIS +0, CHA -3",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Standing Leap.** The bulette's long jump is up to 30 feet and its high jump is up to 15 feet, with or without a running start.",
    "actions": "**Bite.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 30 (4d12+4) piercing damage.",
    "roleplayingAndTactics": "The bulette is a pure ambush predator. It uses its tremorsense to detect prey from below ground, then erupts from the earth to bite and drag a victim down. It has a voracious appetite and will attack nearly anything that moves. Its Standing Leap allows it to clear obstacles or pounce on unsuspecting prey from a distance."
  },
  "statblock": "### Bulette\n\n*Large monstrosity, unaligned*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 94 (9d10+45)\n\n- **Speed** 40 ft., burrow 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 11 (+0) | 21 (+5) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Skills** Perception +6\n\n- **Senses** darkvision 60 ft., tremorsense 60 ft., passive Perception 16\n\n- **Languages** -\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Standing Leap.*** The bulette's long jump is up to 30 feet and its high jump is up to 15 feet, with or without a running start.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 30 (4d12+4) piercing damage."
};

export default SRD_MONSTER_BULETTE;