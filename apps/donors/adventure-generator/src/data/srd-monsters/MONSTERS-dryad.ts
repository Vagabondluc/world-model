
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DRYAD: SavedMonster = {
  "id": "srd-dryad",
  "name": "Dryad",
  "description": "A dryad is a fey spirit of the trees, a shy and reclusive creature bound to a single mighty oak. She is as beautiful and wild as the forest itself.",
  "profile": {
    "table": {
      "creatureType": "Medium fey",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "11 (16 with *barkskin*)",
      "hitPoints": "22 (5d8)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Elvish, Sylvan",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +0, DEX +1, CON +0, INT +2, WIS +2, CHA +4",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Innate Spellcasting.** The dryad's innate spellcasting ability is Charisma (spell save DC 14). The dryad can innately cast the following spells, requiring no material Components\n\n**Magic Resistance.** The dryad has advantage on saving throws against spells and other magical effects.\n\n**Speak with Beasts and Plants.** The dryad can communicate with beasts and plants as if they shared a language.\n\n**Tree Stride.** Once on her turn, the dryad can use 10 feet of her movement to step magically into one living tree within her reach and emerge from a second living tree within 60 feet of the first tree, appearing in an unoccupied space within 5 feet of the second tree. Both trees must be Large or bigger.",
    "actions": "**Club.** *Melee Weapon Attack:* +2 to hit (+6 to hit with *shillelagh*), reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage, or 8 (1d8+4) bludgeoning damage with *shillelagh*.\n\n**Fey Charm.** The dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Wisdom saving throw or be magically charmed. The charmed creature regards the dryad as a trusted friend to be heeded and protected. Although the target isn't under the dryad's control, it takes the dryad's requests or actions in the most favorable way it can.",
    "roleplayingAndTactics": "A dryad is a guardian of the woods and avoids violence. She will use her Fey Charm to turn intruders against one another or to persuade them to leave. If pressed, she uses Tree Stride to evade attackers, striking with her shillelagh-enchanted club before disappearing into another tree."
  },
  "statblock": "### Dryad\n\n*Medium fey, neutral*\n\n___\n\n- **Armor Class** 11 (16 with *barkskin*)\n\n- **Hit Points** 22 (5d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 12 (+1) | 11 (+0) | 14 (+2) | 15 (+2) | 18 (+4) |\n\n___\n\n- **Skills** Perception +4, Stealth +5\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Elvish, Sylvan\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Innate Spellcasting.*** The dryad's innate spellcasting ability is Charisma (spell save DC 14). The dryad can innately cast the following spells, requiring no material Components\n\n***Magic Resistance.*** The dryad has advantage on saving throws against spells and other magical effects.\n\n***Speak with Beasts and Plants.*** The dryad can communicate with beasts and plants as if they shared a language.\n\n***Tree Stride.*** Once on her turn, the dryad can use 10 feet of her movement to step magically into one living tree within her reach and emerge from a second living tree within 60 feet of the first tree, appearing in an unoccupied space within 5 feet of the second tree. Both trees must be Large or bigger.\n\n### Actions\n***Club.*** *Melee Weapon Attack:* +2 to hit (+6 to hit with *shillelagh*), reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage, or 8 (1d8+4) bludgeoning damage with *shillelagh*.\n\n***Fey Charm.*** The dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Wisdom saving throw or be magically charmed. The charmed creature regards the dryad as a trusted friend to be heeded and protected. Although the target isn't under the dryad's control, it takes the dryad's requests or actions in the most favorable way it can."
};

export default SRD_MONSTER_DRYAD;