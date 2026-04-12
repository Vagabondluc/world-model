import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CHUUL: SavedMonster = {
  "id": "srd-chuul",
  "name": "Chuul",
  "description": "A chuul is a crustacean-like predator that lurks in subterranean lakes and damp ruins. It is an ancient servitor of the aboleths, bred to collect magic items and sentient creatures for its masters.",
  "profile": {
    "table": {
      "creatureType": "Large aberration",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "16 (natural armor)",
      "hitPoints": "93 (11d10+33)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "understands Deep Speech but can't speak",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT -3, WIS +0, CHA -3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Amphibious.** The chuul can breathe air and water.\n\n**Sense Magic.** The chuul senses magic within 120 feet of it at will. This trait otherwise works like the *detect magic* spell but isn't itself magical.",
    "actions": "**Multiattack.** The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once.\n\n**Pincer.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage. The target is grappled (escape DC 14) if it is a Large or smaller creature and the chuul doesn't have two other creatures grappled.\n\n**Tentacles.** One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "Chuuls are patient ambush hunters. They use their amphibious nature to hide underwater. In combat, they grapple targets with their pincers and then paralyze them with their tentacles. They are drawn to magic and will prioritize attacking spellcasters or creatures carrying magic items."
  },
  "statblock": "### Chuul\n\n*Large aberration, chaotic evil*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 93 (11d10+33)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 16 (+3) | 5 (-3) | 11 (+0) | 5 (-3) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** understands Deep Speech but can't speak\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Amphibious.*** The chuul can breathe air and water.\n\n***Sense Magic.*** The chuul senses magic within 120 feet of it at will. This trait otherwise works like the *detect magic* spell but isn't itself magical.\n\n### Actions\n***Multiattack.*** The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once.\n\n***Pincer.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage. The target is grappled (escape DC 14) if it is a Large or smaller creature and the chuul doesn't have two other creatures grappled.\n\n***Tentacles.*** One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
};

export default SRD_MONSTER_CHUUL;