import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CLOUD_GIANT: SavedMonster = {
  "id": "srd-cloud-giant",
  "name": "Cloud Giant",
  "description": "Cloud giants are opulent, reclusive giants who live in castles on high mountain peaks or solid clouds. They prize wealth and status above all else.",
  "profile": {
    "table": {
      "creatureType": "Huge giant",
      "size": "Huge",
      "alignment": "neutral good (50%) or neutral evil (50%)",
      "armorClass": "14 (natural armor)",
      "hitPoints": "200 (16d12+96)",
      "speed": "40 ft.",
      "senses": "passive Perception 17",
      "languages": "Common, Giant",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +8, DEX +0, CON +6, INT +1, WIS +3, CHA +3",
      "role": "Artillery"
    },
    "savingThrows": {
      "con": 10,
      "wis": 7,
      "cha": 7
    },
    "abilitiesAndTraits": "**Keen Smell.** The giant has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Innate Spellcasting.** The giant's innate spellcasting ability is Charisma. It can innately cast the following spells, requiring no material Components:\n\nAt will: *detect magic, fog cloud, light*\n3/day each: *feather fall, fly, misty step, telekinesis*\n1/day each: *control weather, gaseous form*",
    "actions": "**Multiattack.** The giant makes two morningstar attacks.\n\n**Morningstar.** *Melee Weapon Attack:* +12 to hit, reach 10 ft., one target. *Hit:* 21 (3d8+8) piercing damage.\n\n**Rock.** *Ranged Weapon Attack:* +12 to hit, range 60/240 ft., one target. *Hit:* 30 (4d10+8) bludgeoning damage.",
    "roleplayingAndTactics": "Cloud giants look down on smaller creatures with disdain. They are evenly split between good and evil alignments. In combat, they use their immense strength to hurl rocks from afar or wield their massive morningstars. Their innate spellcasting allows them to control the battlefield with fog and levitation."
  },
  "statblock": "### Cloud Giant\n\n*Huge giant, neutral good (50%) or neutral evil (50%)*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 200 (16d12+96)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 27 (+8) | 10 (+0) | 22 (+6) | 12 (+1) | 16 (+3) | 16 (+3) |\n\n___\n\n- **Saving Throws** Con +10, Wis +7, Cha +7\n- **Skills** Insight +7, Perception +7\n\n- **Senses** passive Perception 17\n\n- **Languages** Common, Giant\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n***Keen Smell.*** The giant has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Innate Spellcasting.*** The giant's innate spellcasting ability is Charisma. It can innately cast the following spells, requiring no material Components\n\n### Actions\n***Multiattack.*** The giant makes two morningstar attacks.\n\n***Morningstar.*** *Melee Weapon Attack:* +12 to hit, reach 10 ft., one target. *Hit:* 21 (3d8+8) piercing damage.\n\n***Rock.*** *Ranged Weapon Attack:* +12 to hit, range 60/240 ft., one target. *Hit:* 30 (4d10 + 8) bludgeoning damage."
};

export default SRD_MONSTER_CLOUD_GIANT;