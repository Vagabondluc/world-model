
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TREANT: SavedMonster = {
  "id": "srd-treant",
  "name": "Treant",
  "description": "Treants are ancient, sentient trees, the guardians of the forest. They are slow to anger but are terrifying foes when roused, their woody limbs capable of crushing stone.",
  "profile": {
    "table": {
      "creatureType": "Huge plant",
      "size": "Huge",
      "alignment": "chaotic good",
      "armorClass": "16 (natural armor)",
      "hitPoints": "138 (12d12+60)",
      "speed": "30 ft.",
      "senses": "passive Perception 13",
      "languages": "Common, Druidic, Elvish, Sylvan",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +6, DEX -1, CON +5, INT +1, WIS +3, CHA +1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**False Appearance.** While the treant remains motionless, it is indistinguishable from a normal tree.\n\n**Siege Monster.** The treant deals double damage to objects and structures.",
    "actions": "**Multiattack.** The treant makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 16 (3d6+6) bludgeoning damage.\n\n**Rock.** *Ranged Weapon Attack:* +10 to hit, range 60/180 ft., one target. *Hit:* 28 (4d10+6) bludgeoning damage.\n\n**Animate Trees (1/Day).** The treant magically animates one or two trees it can see within 60 feet of it. These trees have the same statistics as a treant, except they have Intelligence and Charisma scores of 1, they can't speak, and they have only the Slam action option. An animated tree acts as an ally of the treant. The tree remains animate for 1 day or until it dies; until the treant dies or is more than 120 feet from the tree; or until the treant takes a bonus action to turn it back into an inanimate tree.",
    "roleplayingAndTactics": "Treants are peaceful protectors of the forest and will only attack if their woods are threatened. In combat, they are slow but immensely powerful. They can animate other trees to fight alongside them, overwhelming foes with the wrath of the forest itself."
  },
  "statblock": "### Treant\n\n*Huge plant, chaotic good*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 138 (12d12+60)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 8 (-1) | 21 (+5) | 12 (+1) | 16 (+3) | 12 (+1) |\n\n___\n\n- **Senses** passive Perception 13\n\n- **Languages** Common, Druidic, Elvish, Sylvan\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n***False Appearance.*** While the treant remains motionless, it is indistinguishable from a normal tree.\n\n***Siege Monster.*** The treant deals double damage to objects and structures.\n\n### Actions\n***Multiattack.*** The treant makes two slam attacks.\n\n***Slam.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 16 (3d6+6) bludgeoning damage.\n\n***Rock.*** *Ranged Weapon Attack:* +10 to hit, range 60/180 ft., one target. *Hit:* 28 (4d10+6) bludgeoning damage."
};

export default SRD_MONSTER_TREANT;