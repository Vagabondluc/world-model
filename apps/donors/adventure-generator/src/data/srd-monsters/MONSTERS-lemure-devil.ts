

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_LEMURE_DEVIL: SavedMonster = {
  "id": "srd-lemure-devil",
  "name": "Lemure (Devil)",
  "description": "Lemures are the lowest form of devil, mindless blobs of molten flesh from the Nine Hells. They are the tormented souls of the evil and corrupt, now serving as a mindless, endlessly regenerating infantry for their infernal masters.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend (devil)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "7",
      "hitPoints": "13 (3d8)",
      "speed": "15 ft.",
      "senses": "darkvision 120 ft., passive Perception 10",
      "languages": "understands Infernal but can't speak",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR +0, DEX -3, CON +0, INT -5, WIS +0, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Devil's Sight.** Magical darkness doesn't impede the lemure's darkvision.\n\n**Hellish Rejuvenation.** A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a *bless* spell cast on that creature or its remains are sprinkled with holy water.",
    "actions": "**Fist.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage.",
    "roleplayingAndTactics": "Lemures are mindless and attack any non-devil they see. They move in a shambling mass, their only tactic to overwhelm foes with their sheer numbers. They are utterly fearless and will fight until destroyed."
  },
  "statblock": "### Lemure (Devil)\n\n*Medium fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 7\n\n- **Hit Points** 13 (3d8)\n\n- **Speed** 15 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 5 (-3) | 11 (+0) | 1 (-5) | 11 (+0) | 3 (-4) |\n\n___\n\n- **Senses** darkvision 120 ft., passive Perception 10\n\n- **Languages** understands Infernal but can't speak\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Devil's Sight.*** Magical darkness doesn't impede the lemure's darkvision.\n\n***Hellish Rejuvenation.*** A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a *bless* spell cast on that creature or its remains are sprinkled with holy water."
};

export default SRD_MONSTER_LEMURE_DEVIL;