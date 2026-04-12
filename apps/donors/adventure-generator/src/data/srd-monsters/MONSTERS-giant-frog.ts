import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_FROG: SavedMonster = {
  "id": "srd-giant-frog",
  "name": "Giant Frog",
  "description": "An oversized amphibian, the giant frog is a common predator in swamps and marshlands, capable of swallowing a halfling whole.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "18 (4d8)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "darkvision 30 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +1, CON +0, INT -4, WIS +0, CHA -4",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Amphibious.** The frog can breathe air and water.\n\n**Standing Leap.** The frog's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage, and the target is grappled (escape DC 11). Until this grapple ends, the target is restrained, and the frog can't bite another target.\n\n**Swallow.** The frog makes one bite attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) acid damage at the start of each of the frog's turns. The frog can have only one target swallowed at a time.",
    "roleplayingAndTactics": "Giant frogs are ambush predators that hide in water or reeds. They use their long, sticky tongues (represented by their bite attack) to grapple prey and then swallow them. They are not intelligent and will attack the closest edible-looking creature."
  },
  "statblock": "### Giant Frog\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 18 (4d8)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 13 (+1) | 11 (+0) | 2 (-4) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Skills** Perception +2, Stealth +3\n\n- **Senses** darkvision 30 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Amphibious.*** The frog can breathe air and water.\n\n***Standing Leap.*** The frog's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage, and the target is grappled (escape DC 11). Until this grapple ends, the target is restrained, and the frog can't bite another target.\n\n***Swallow.*** The frog makes one bite attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) acid damage at the start of each of the frog's turns. The frog can have only one target swallowed at a time."
};

export default SRD_MONSTER_GIANT_FROG;