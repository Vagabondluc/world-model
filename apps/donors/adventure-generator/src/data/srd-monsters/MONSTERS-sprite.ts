
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SPRITE: SavedMonster = {
  "id": "srd-sprite",
  "name": "Sprite",
  "description": "Sprites are tiny, winged fey who appoint themselves as guardians of the forest. They are curious but shy, and have a strong sense of right and wrong.",
  "profile": {
    "table": {
      "creatureType": "Tiny fey",
      "size": "Tiny",
      "alignment": "neutral good",
      "armorClass": "15 (leather armor)",
      "hitPoints": "2 (1d4)",
      "speed": "10 ft., fly 40 ft.",
      "senses": "passive Perception 13",
      "languages": "Common, Elvish, Sylvan",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -4, DEX +4, CON +0, INT +2, WIS +1, CHA +0",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Invisibility.** The sprite magically turns invisible until it attacks or its concentration ends (as if concentrating on a spell). Any equipment the sprite wears or carries is invisible with it.",
    "actions": "**Longsword.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage.\n\n**Shortbow.** *Ranged Weapon Attack:* +6 to hit, range 40/160 ft., one target. *Hit:* 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or become poisoned for 1 minute. If its saving throw result is 5 or lower, the poisoned target falls unconscious for the same duration, or until it takes damage or another creature takes an action to shake it awake.\n\n**Heart Sight.** The sprite touches a creature and magically knows the creature's current emotional state. If the target fails a DC 10 Charisma saving throw, the sprite also knows the creature's alignment. Celestials, fiends, and undead automatically fail the saving throw.",
    "roleplayingAndTactics": "Sprites are not warriors and will use their invisibility to remain unseen. They use their Heart Sight to judge a creature's intentions. If they must fight, they will do so from a distance with their poisoned shortbows, aiming to render a foe unconscious rather than kill it."
  },
  "statblock": "### Sprite\n\n*Tiny fey, neutral good*\n\n___\n\n- **Armor Class** 15 (leather armor)\n\n- **Hit Points** 2 (1d4)\n\n- **Speed** 10 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 18 (+4) | 10 (+0) | 14 (+2) | 13 (+1) | 11 (+0) |\n\n___\n\n- **Skills** Perception +3, Stealth +8\n\n- **Senses** passive Perception 13\n\n- **Languages** Common, Elvish, Sylvan\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Longsword.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage.\n\n***Shortbow.*** *Ranged Weapon Attack:* +6 to hit, range 40/160 ft., one target. *Hit:* 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or become poisoned for 1 minute. If its saving throw result is 5 or lower, the poisoned target falls unconscious for the same duration, or until it takes damage or another creature takes an action to shake it awake.\n\n***Heart Sight.*** The sprite touches a creature and magically knows the creature's current emotional state. If the target fails a DC 10 Charisma saving throw, the sprite also knows the creature's alignment. Celestials, fiends, and undead automatically fail the saving throw."
};

export default SRD_MONSTER_SPRITE;