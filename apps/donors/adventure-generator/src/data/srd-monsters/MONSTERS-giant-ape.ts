
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_APE: SavedMonster = {
  "id": "srd-giant-ape",
  "name": "Giant Ape",
  "description": "A colossal primate of immense strength and agility. These jungle titans are intelligent and territorial, capable of hurling boulders like pebbles.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "157 (15d12+60)",
      "speed": "40 ft., climb 40 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "7 (2,900 XP)",
      "keyAbilities": "STR +6, DEX +2, CON +4, INT -2, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The ape makes two fist attacks.\n\n**Fist.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 22 (3d10+6) bludgeoning damage.\n\n**Rock.** *Ranged Weapon Attack:* +9 to hit, range 50/100 ft., one target. *Hit:* 30 (7d6 + 6) bludgeoning damage.",
    "roleplayingAndTactics": "The giant ape is a terrifying physical combatant. It will use its climbing speed to gain high ground or bypass obstacles. At range, it hurls massive rocks. In melee, it pummels enemies with devastating fist attacks. It is protective of its territory and will display aggression to scare off intruders before attacking."
  },
  "statblock": "### Giant Ape\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 157 (15d12+60)\n\n- **Speed** 40 ft., climb 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 14 (+2) | 18 (+4) | 7 (-2) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Athletics +9, Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 7 (2,900 XP)\n\n___\n\n### Actions\n***Multiattack.*** The ape makes two fist attacks.\n\n***Fist.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 22 (3d10+6) bludgeoning damage.\n\n***Rock.*** *Ranged Weapon Attack:* +9 to hit, range 50/100 ft., one target. *Hit:* 30 (7d6 + 6) bludgeoning damage."
};

export default SRD_MONSTER_GIANT_APE;
