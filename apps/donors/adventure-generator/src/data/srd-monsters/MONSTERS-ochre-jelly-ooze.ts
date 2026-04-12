import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OCHRE_JELLY_OOZE: SavedMonster = {
  "id": "srd-ochre-jelly-ooze",
  "name": "Ochre Jelly (Ooze)",
  "description": "This amorphous, yellowish ooze creeps through dungeons and caverns, dissolving organic matter. It can squeeze through the narrowest of cracks in pursuit of a meal.",
  "profile": {
    "table": {
      "creatureType": "Large ooze",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "8",
      "hitPoints": "45 (6d10+12)",
      "speed": "10 ft., climb 10 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 8",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX -2, CON +2, INT -4, WIS -2, CHA -5",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Amorphous.** The jelly can move through a space as narrow as 1 inch wide without squeezing.\n\n**Spider Climb.** The jelly can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
    "actions": "**Pseudopod.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) bludgeoning damage plus 3 (1d6) acid damage.\n\n**Split (Reaction).** When a jelly that is Medium or larger is subjected to lightning or slashing damage, it splits into two new jellies if it has at least 10 hit points. Each new jelly has hit points equal to half the original jelly's, rounded down. New jellies are one size smaller than the original jelly.",
    "roleplayingAndTactics": "The ochre jelly is a mindless predator that attacks by engulfing its prey. It uses its ability to climb walls and ceilings to drop on unsuspecting creatures. When damaged by slashing or lightning, it splits, making it a difficult foe to deal with through conventional means."
  },
  "statblock": "### Ochre Jelly (Ooze)\n\n*Large ooze, unaligned*\n\n___\n\n- **Armor Class** 8\n\n- **Hit Points** 45 (6d10+12)\n\n- **Speed** 10 ft., climb 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 6 (-2) | 14 (+2) | 2 (-4) | 6 (-2) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Amorphous.*** The jelly can move through a space as narrow as 1 inch wide without squeezing.\n\n***Spider Climb.*** The jelly can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n### Actions\n***Pseudopod.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) bludgeoning damage plus 3 (1d6) acid damage."
};

export default SRD_MONSTER_OCHRE_JELLY_OOZE;