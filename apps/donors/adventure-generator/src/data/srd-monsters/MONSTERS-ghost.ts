
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GHOST: SavedMonster = {
  "id": "srd-ghost",
  "name": "Ghost",
  "description": "The restless spirit of a dead humanoid, bound to a specific location or object. Ghosts are driven by unfinished business and often appear translucent and spectral.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "11",
      "hitPoints": "45 (10d8)",
      "speed": "0 ft., fly 40 ft. (hover)",
      "senses": "darkvision 60 ft., passive Perception 11",
      "languages": "any languages it knew in life",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR -2, DEX +1, CON +0, INT +0, WIS +1, CHA +3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Ethereal Sight.** The ghost can see 60 feet into the Ethereal Plane when it is on the Material Plane, and vice versa.\n\n**Incorporeal Movement.** The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
    "actions": "**Withering Touch.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 17 (4d6+3) necrotic damage.\n\n**Etherealness.** The ghost enters the Ethereal Plane from the Material Plane, or vice versa. It is visible on the Material Plane while it is in the Border Ethereal, and vice versa, yet it can't affect or be affected by anything on the other plane.\n\n**Horrifying Visage.** Each non-undead creature within 60 feet of the ghost that can see it must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years. A frightened target can repeat the saving throw at the end of each of its turns, ending the frightened condition on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to this ghost's Horrifying Visage for the next 24 hours. The aging effect can be reversed with a *greater restoration* spell, but only within 24 hours of it occurring.\n\n**Possession (Recharge 6).** One humanoid that the ghost can see within 5 feet of it must succeed on a DC 13 Charisma saving throw or be possessed by the ghost; the ghost then disappears, and the target is incapacitated and loses control of its body. The ghost now controls the body but doesn't deprive the target of awareness. The ghost can't be targeted by any attack, spell, or other effect, except ones that turn undead, and it retains its alignment, Intelligence, Wisdom, Charisma, and immunity to being charmed and frightened. It otherwise uses the possessed target's statistics, but doesn't gain access to the target's knowledge, class features, or proficiencies.",
    "roleplayingAndTactics": "Ghosts are bound by their emotions and unfinished business. They will often try to scare intruders away with their Horrifying Visage. If that fails, they use Possession to control a strong warrior or spellcaster, turning them against their allies. They retreat to the Ethereal Plane if they are in danger of being destroyed."
  },
  "statblock": "### Ghost\n\n*Medium undead, any alignment*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 45 (10d8)\n\n- **Speed** 0 ft., fly 40 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 7 (-2) | 13 (+1) | 10 (+0) | 10 (+0) | 12 (+1) | 17 (+3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 11\n\n- **Languages** any languages it knew in life\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Ethereal Sight.*** The ghost can see 60 feet into the Ethereal Plane when it is on the Material Plane, and vice versa.\n\n***Incorporeal Movement.*** The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n### Actions\n***Withering Touch.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 17 (4d6+3) necrotic damage.\n\n***Etherealness.*** The ghost enters the Ethereal Plane from the Material Plane, or vice versa. It is visible on the Material Plane while it is in the Border Ethereal, and vice versa, yet it can't affect or be affected by anything on the other plane.\n\n***Horrifying Visage.*** Each non-undead creature within 60 feet of the ghost that can see it must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years. A frightened target can repeat the saving throw at the end of each of its turns, ending the frightened condition on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to this ghost's Horrifying Visage for the next 24 hours. The aging effect can be reversed with a *greater restoration* spell, but only within 24 hours of it occurring.\n\n***Possession (Recharge 6).*** One humanoid that the ghost can see within 5 feet of it must succeed on a DC 13 Charisma saving throw or be possessed by the ghost; the ghost then disappears, and the target is incapacitated and loses control of its body. The ghost now controls the body but doesn't deprive the target of awareness. The ghost can't be targeted by any attack, spell, or other effect, except ones that turn undead, and it retains its alignment, Intelligence, Wisdom, Charisma, and immunity to being charmed and frightened. It otherwise uses the possessed target's statistics, but doesn't gain access to the target's knowledge, class features, or proficiencies."
};

export default SRD_MONSTER_GHOST;
