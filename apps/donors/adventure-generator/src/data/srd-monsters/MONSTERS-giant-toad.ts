import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_TOAD: SavedMonster = {
  "id": "srd-giant-toad",
  "name": "Giant Toad",
  "description": "An oversized amphibian, the giant frog is a common predator in swamps and marshlands, capable of swallowing a halfling whole.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "39 (6d10+6)",
      "speed": "20 ft., swim 40 ft.",
      "senses": "darkvision 30 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +1, INT -4, WIS +0, CHA -4",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Amphibious.** The toad can breathe air and water.\n\n**Standing Leap.** The toad's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 5 (1d10) poison damage, and the target is grappled (escape DC 13). Until this grapple ends, the target is restrained, and the toad can't bite another target.\n\n**Swallow.** The toad makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the toad, and it takes 10 (3d6) acid damage at the start of each of the toad's turns. The toad can have only one target swallowed at a time.",
    "roleplayingAndTactics": "Giant toads are ambush predators that hide in water or reeds. They use their long, sticky tongues (represented by their bite attack) to grapple prey and then swallow them. They are not intelligent and will attack the closest edible-looking creature."
  },
  "statblock": "### Giant Toad\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 39 (6d10+6)\n\n- **Speed** 20 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 13 (+1) | 13 (+1) | 2 (-4) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Amphibious.*** The toad can breathe air and water.\n\n***Standing Leap.*** The toad's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 5 (1d10) poison damage, and the target is grappled (escape DC 13). Until this grapple ends, the target is restrained, and the toad can't bite another target.\n\n***Swallow.*** The toad makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the toad, and it takes 10 (3d6) acid damage at the start of each of the toad's turns. The toad can have only one target swallowed at a time."
};

export default SRD_MONSTER_GIANT_TOAD;