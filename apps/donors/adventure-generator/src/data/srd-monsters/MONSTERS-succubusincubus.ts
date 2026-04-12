
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SUCCUBUSINCUBUS: SavedMonster = {
  "id": "srd-succubusincubus",
  "name": "Succubus/Incubus",
  "description": "These fiends are tempters who take humanoid form to lure mortals to sin and despair. A succubus is female, an incubus male.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend (shapechanger)",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "66 (12d8+12)",
      "speed": "30 ft., fly 60 ft.",
      "senses": "darkvision 60 ft., passive Perception 15",
      "languages": "Abyssal, Common, Infernal, telepathy 60 ft.",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR -1, DEX +3, CON +1, INT +2, WIS +1, CHA +5",
      "role": "Controller"
    },
    "savingThrows": {
      "wis": 5,
      "cha": 9
    },
    "abilitiesAndTraits": "**Telepathic Bond.** The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed. The two don't even need to be on the same plane of existence.\n\n**Shapechanger.** The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its flying speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
    "actions": "**Claw (Fiend Form Only).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.\n\n**Charm.** One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed target obeys the fiend's verbal or telepathic commands. If the target suffers any harm or receives a suicidal command, it can repeat the saving throw, ending the effect on a success. If the target successfully saves against the effect, or if the effect on it ends, the target is immune to this fiend's Charm for the next 24 hours.\n\n**Draining Kiss.** The fiend kisses a creature charmed by it or a willing creature. The target must make a DC 15 Constitution saving throw against this magic, taking 32 (5d10 + 5) psychic damage on a failed save, or half as much damage on a successful one. The target's hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.\n\n**Etherealness.** The fiend magically enters the Ethereal Plane from the Material Plane, or vice versa.",
    "roleplayingAndTactics": "Succubi and incubi are tempters who use their shapechanging abilities and charm to infiltrate mortal society. They prefer to manipulate and corrupt rather than engage in direct combat. If forced to fight, they will use their draining kiss on a charmed or helpless victim and then use Etherealness to escape."
  },
  "statblock": "### Succubus/Incubus\n\n*Medium fiend (shapechanger), neutral evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 66 (12d8+12)\n\n- **Speed** 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 17 (+3) | 13 (+1) | 15 (+2) | 12 (+1) | 20 (+5) |\n\n___\n\n- **Saving Throws** Wis +5, Cha +9\n- **Skills** Deception +9, Insight +5, Perception +5, Persuasion +9, Stealth +7\n\n- **Senses** darkvision 60 ft., passive Perception 15\n\n- **Languages** Abyssal, Common, Infernal, telepathy 60 ft.\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Telepathic Bond.*** The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed. The two don't even need to be on the same plane of existence.\n\n***Shapechanger.*** The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its flying speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n### Actions\n***Claw (Fiend Form Only).*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.\n\n***Charm.*** One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed target obeys the fiend's verbal or telepathic commands. If the target suffers any harm or receives a suicidal command, it can repeat the saving throw, ending the effect on a success. If the target successfully saves against the effect, or if the effect on it ends, the target is immune to this fiend's Charm for the next 24 hours.\n\n***Draining Kiss.*** The fiend kisses a creature charmed by it or a willing creature. The target must make a DC 15 Constitution saving throw, taking 32 (5d10 + 5) psychic damage on a failed save, or half as much damage on a successful one. The target's hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.\n\n***Etherealness.*** The fiend magically enters the Ethereal Plane from the Material Plane, or vice versa."
};

export default SRD_MONSTER_SUCCUBUSINCUBUS;