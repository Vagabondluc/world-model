import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FIRE_ELEMENTAL: SavedMonster = {
  "id": "srd-fire-elemental",
  "name": "Fire Elemental",
  "description": "A being of pure, sentient flame, a fire elemental appears as a whirlwind of fire that scorches everything it touches. It is a creature of pure, destructive instinct.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "neutral",
      "armorClass": "13",
      "hitPoints": "102 (12d10+36)",
      "speed": "50 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Ignan",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +0, DEX +3, CON +3, INT -2, WIS +0, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Fire Form.** The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns.\n\n**Illumination.** The elemental sheds bright light in a 30- foot radius and dim light in an additional 30 feet.\n\n**Water Susceptibility.** For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.",
    "actions": "**Multiattack.** The elemental makes two touch attacks.",
    "roleplayingAndTactics": "A fire elemental is a chaotic force of destruction. It uses its high speed to move across the battlefield, setting as many flammable objects and creatures on fire as possible with its Fire Form. It is not strategic and will attack the nearest target relentlessly until extinguished."
  },
  "statblock": "### Fire Elemental\n\n*Large elemental, neutral*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 102 (12d10+36)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 17 (+3) | 16 (+3) | 6 (-2) | 10 (+0) | 7 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Ignan\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Fire Form.*** The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns.\n\n***Illumination.*** The elemental sheds bright light in a 30- foot radius and dim light in an additional 30 feet.\n\n***Water Susceptibility.*** For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.\n\n### Actions\n***Multiattack.*** The elemental makes two touch attacks."
};

export default SRD_MONSTER_FIRE_ELEMENTAL;