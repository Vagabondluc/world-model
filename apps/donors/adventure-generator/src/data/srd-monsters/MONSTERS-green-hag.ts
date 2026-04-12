import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GREEN_HAG: SavedMonster = {
  "id": "srd-green-hag",
  "name": "Green Hag",
  "description": "Green hags are crones of the swamp and forest, using their deceptive magics to lure travelers to their doom. They delight in tragedy and the corruption of the innocent.",
  "profile": {
    "table": {
      "creatureType": "Medium fey",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "82 (11d8+33)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Common, Draconic, Sylvan",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +3, INT +1, WIS +2, CHA +2",
      "role": "Controller"
    },
    "savingThrows": {
      "wis": 4,
      "cha": 4
    },
    "abilitiesAndTraits": "**Amphibious.** The hag can breathe air and water.\n\n**Innate Spellcasting.** The hag's innate spellcasting ability is Charisma (spell save DC 12). She can innately cast the following spells, requiring no material Components:\n\nAt will: *dancing lights, minor illusion, vicious mockery*\n\n**Mimicry.** The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Wisdom (Insight) check.",
    "actions": "**Claws.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n**Illusory Appearance.** The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like another creature of her general size and humanoid shape. The illusion ends if the hag takes a bonus action to end it or if she dies.\n\n**Invisible Passage.** The hag magically turns invisible until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisible, she leaves no physical evidence of her passage, so she can be tracked only by magic. Any equipment she wears or carries is invisible with her.",
    "roleplayingAndTactics": "Green hags delight in corrupting the good and virtuous. They use their mimicry and illusory appearance to sow discord and lure victims into traps. In combat, they prefer to weaken foes from a distance before closing in with their claws."
  },
  "statblock": "### Green Hag\n\n*Medium fey, neutral evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 82 (11d8+33)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 12 (+1) | 16 (+3) | 13 (+1) | 14 (+2) | 14 (+2) |\n\n___\n\n- **Saving Throws** Wis +4, Cha +4\n- **Skills** Arcana +3, Deception +4, Perception +4, Stealth +3\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Common, Draconic, Sylvan\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Amphibious.*** The hag can breathe air and water.\n\n***Innate Spellcasting.*** The hag's innate spellcasting ability is Charisma (spell save DC 12). She can innately cast the following spells, requiring no material Components:\n- At will: *dancing lights, minor illusion, vicious mockery*\n\n***Mimicry.*** The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Wisdom (Insight) check.\n\n### Actions\n***Claws.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n***Illusory Appearance.*** The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like another creature of her general size and humanoid shape. The illusion ends if the hag takes a bonus action to end it or if she dies.\n\n***Invisible Passage.*** The hag magically turns invisible until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisible, she leaves no physical evidence of her passage, so she can be tracked only by magic. Any equipment she wears or carries is invisible with her."
};

export default SRD_MONSTER_GREEN_HAG;