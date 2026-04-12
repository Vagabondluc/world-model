# All Narrative Scripts — Minimal Questionnaire Stubs

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Generated: 2026-01-22
Note: This combined file contains minimal questionnaire stubs for each script discovered in `Narrative Scripts`. Each section is a starting point — replace TODOs with specifics during the phased implementation.

---

## Engines / Golden_Compass

### `Engines/Golden_Compass/Golden Compass Adventure Template.txt`
- Inferred primary output: Adventure Template (structured sections)
- Inputs: Title, Tone, Scope, Hook Tags, Seed
- AI context: "Create a compact adventure template about..."
- Procedural: Seed-based; table-picker optional
- Controls: [AI Fill] [Generate] [Save Template]
- TODO: confirm fields and expected exports (Foundry/MD/JSON)

### `Engines/Golden_Compass/Golden Compass Challenge Framework.txt`
- Inferred primary output: Challenge descriptions and difficulty metrics
- Inputs: challenge type, CR target, environment
- AI context: "Generate challenge text and mechanics notes"
- Procedural: seed + weighted challenge tables
- TODO: confirm stat system mapping

### `Engines/Golden_Compass/Golden Compass Danger and Combat Framework.txt`
- Inferred primary output: Combat scenes, encounter framework
- TODO: confirm required fields

### `Engines/Golden_Compass/Golden Compass Wealth and Vehicle System.txt`
- Inferred primary output: Wealth tables, vehicle mechanics
- TODO: confirm outputs and export formats

### `Engines/Golden_Compass/Three-Pass Adventure Creation Method.txt`
- Inferred primary output: Stepwise adventure drafts
- TODO: confirm AIS vs procedural split

---

## Engines / prompt creator

### `Engines/prompt creator/PromptCreator_v1.txt`
- Inferred primary output: Prompt templates
- Inputs: purpose, tone, constraints
- Controls: AI Fill, Save Prompt
- TODO: confirm template parameters

### `Engines/prompt creator/whimsy.txt`
- Inferred primary output: whimsical prompts generator
- TODO: confirm

---

## Execution Systems — Adventures

### `Execution_Systems/adventures/AI_QuestCreation_v1.txt`
- Inferred primary output: full quest narrative
- Inputs: seed, themes, main NPCs, difficulty
- TODO: confirm structure

### `Execution_Systems/adventures/arcane_library_method.txt`
- Inferred primary output: research-based adventure beats
- TODO: confirm

### `Execution_Systems/adventures/arcane_library_method2.txt`
- TODO

### `Execution_Systems/adventures/pointyhat travel adventure.txt`
- TODO

---

## Execution Systems — Dungeons

(Each dungeon script will use seed-based generation as default; AI for prose and complex summarization.)

- `Execution_Systems/Dungeons/DungeonCreation_PointyHat_v1.txt` — TODO: fields
- `Execution_Systems/Dungeons/DungeonDesign_5Room_Alternate_v1.txt` — TODO: fields
- `Execution_Systems/Dungeons/DungeonDesign_5Room_v1.txt` — TODO: fields
- `Execution_Systems/Dungeons/corridor-themes-generator.txt` — TODO: fields
- `Execution_Systems/Dungeons/dungeon-concept-brainstormer.txt` — TODO: fields
- `Execution_Systems/Dungeons/dungeon-features-summarizer.txt` — TODO: fields
- `Execution_Systems/Dungeons/dungeon-key-writer.txt` — TODO: fields
- `Execution_Systems/Dungeons/dungeon-map-creator.txt` — TODO: fields
- `Execution_Systems/Dungeons/dungeon-room-designer.txt` — TODO: fields
- `Execution_Systems/Dungeons/jp cooper 10 room dungeon.txt` — TODO: fields
- `Execution_Systems/Dungeons/megadungeon-planner.txt` — TODO: fields
- `Execution_Systems/Dungeons/xandered-dungeon-designer.txt` — TODO: fields

---

## Execution Systems — Encounters

(Encounter scripts: expect inputs for party CR, environment, pacing)
- `Execution_Systems/Encounters/EncounterDesign_Older_v1.txt` — TODO
- `Execution_Systems/Encounters/EncounterDesign_v1.txt` — TODO
- `Execution_Systems/Encounters/EncounterDesign_v1_DEPRECATED.txt` — TODO
- `Execution_Systems/Encounters/Encounter_genric_beta.txt` — TODO
- `Execution_Systems/Encounters/RPGAdventure_SceneCrafting_v1.txt` — TODO
- `Execution_Systems/Encounters/combat-encounter-balancer.txt` — TODO
- `Execution_Systems/Encounters/combat_encounter - V2.txt` — TODO
- `Execution_Systems/Encounters/combat_encounter.txt` — TODO
- `Execution_Systems/Encounters/social_event.txt` — TODO
- `Execution_Systems/Encounters/trap_prep.txt` — TODO
- `Execution_Systems/Encounters/urban_crawl.txt` — TODO

---

## Execution Systems — Factions
- `Execution_Systems/Factions/faction-conflict-simulator.txt` — TODO
- `Execution_Systems/Factions/faction_downtime.txt` — TODO
- `Execution_Systems/Factions/factions_creation.txt` — TODO

---

## Execution Systems — Heists
- `Execution_Systems/Heists/heist_prep.txt` — TODO
- `Execution_Systems/Heists/heist_running.txt` — TODO
- `Execution_Systems/Heists/raid_execution.txt` — TODO
- `Execution_Systems/Heists/raid_prep.txt` — TODO

---

## Execution Systems — Item
- `Execution_Systems/Item/magic weapon basic.txt` — TODO
- `Execution_Systems/Item/magic_item.txt` — TODO

---

## Execution Systems — Locations
- `Execution_Systems/Locations/CreateFantasyCity_v1.txt` — TODO (large-form city creation: seed + thematic tables)
- `Execution_Systems/Locations/Make a settlement.txt` — TODO
- `Execution_Systems/Locations/Quick_settlement.txt` — TODO
- `Execution_Systems/Locations/battlefield_generation.txt` — TODO
- `Execution_Systems/Locations/city_gazetteer.txt` — TODO
- `Execution_Systems/Locations/fantastic_location.txt` — TODO

---

## Execution Systems — Mysteries
- `Execution_Systems/Mysteries/5_node_mystery.txt` — TODO
- `Execution_Systems/Mysteries/5x5_mystery_campaign.txt` — TODO
- `Execution_Systems/Mysteries/mystery_node.txt` — TODO
- `Execution_Systems/Mysteries/node_cloud_mystery.txt` — TODO
- `Execution_Systems/Mysteries/non-linear_mystery.txt` — TODO
- `Execution_Systems/Mysteries/proactive_mystery_node.txt` — TODO
- `Execution_Systems/Mysteries/revelations_dm_aid.txt` — TODO
- `Execution_Systems/Mysteries/swap_mystery.txt` — TODO

---

## Execution Systems — NPCs
- `Execution_Systems/NPCs/CreateNPC_Alternate_v1.txt` — TODO
- `Execution_Systems/NPCs/NPC_Description_Simple_v1.txt` — TODO
- `Execution_Systems/NPCs/NPC_Description_v1.txt` — TODO
- `Execution_Systems/NPCs/QuickNPC_Creation_v1.txt` — TODO
- `Execution_Systems/NPCs/Quick_NPC.txt` — (already implemented earlier)
- `Execution_Systems/NPCs/npc_creator_bot.txt` — TODO

---

## Execution Systems — plot
- `Execution_Systems/plot/SceneDescriptor_v1.txt` — TODO
- `Execution_Systems/plot/campaign_prep.txt` — TODO
- `Execution_Systems/plot/crafting scenes.txt` — TODO
- `Execution_Systems/plot/create_hook.txt` — TODO
- `Execution_Systems/plot/rumors.txt` — TODO
- `Execution_Systems/plot/vivid_description.txt` — TODO

---

## Execution Systems — riddles
- `Execution_Systems/riddles/CreateRiddle_v1.txt` — TODO
- `Execution_Systems/riddles/CreateRiddle_v2.txt` — TODO
- `Execution_Systems/riddles/CreateToken_v1.txt` — TODO
- `Execution_Systems/riddles/createToken_v2.txt` — TODO

---

## Execution Systems — Travel
- `Execution_Systems/Travel/random-encounter-table-generator.txt` — TODO
- `Execution_Systems/Travel/wilderness_travel.txt` — TODO
- `Execution_Systems/Travel/wilderness_travel_long.txt` — TODO

---

## Execution Systems — Westmarsh
- `Execution_Systems/Westmarsh/Eldwyn_instant_generator.txt` — TODO
- `Execution_Systems/Westmarsh/Eldwyn_mission_prompt.txt` — TODO
- `Execution_Systems/Westmarsh/Eldwyn_pointyhat_travel_adventure.txt` — TODO
- `Execution_Systems/Westmarsh/Eldwyn_profil_npc_westmarsh.txt` — TODO
- `Execution_Systems/Westmarsh/Eldwyn_prompt_mission_fr.txt` — TODO
- `Execution_Systems/Westmarsh/Eldwyn_rail_road_quest_generator.txt` — TODO
- `Execution_Systems/Westmarsh/instant generator.txt` — TODO
- `Execution_Systems/Westmarsh/mission prompt.txt` — TODO
- `Execution_Systems/Westmarsh/profil_npc_westmarsh.txt` — TODO
- `Execution_Systems/Westmarsh/prompt mission francais.txt` — TODO
- `Execution_Systems/Westmarsh/rail road quest  generator.txt` — TODO

---

## Output — export
- `Output/export/Template_ImportFoundry_v1.txt` — TODO
- `Output/export/html template.html` — TODO
- `Output/export/scene_html.txt` — TODO

---

## Output — Handouts_Images
- `Output/Handouts_Images/CreateRiddle_v1.txt` — TODO
- `Output/Handouts_Images/CreateRiddle_v2.txt` — TODO
- `Output/Handouts_Images/CreateToken_v1.txt` — TODO
- `Output/Handouts_Images/artist_styles.txt` — TODO
- `Output/Handouts_Images/createToken_v2.txt` — TODO
- `Output/Handouts_Images/image_prompt_sword_and_sorcery.txt` — TODO
- `Output/Handouts_Images/text2art.md` — TODO
- `Output/Handouts_Images/themed_image_v01.txt` — TODO

---

## Output — homebrew 5e (many files) — TODO for each

---

## AI_Behavior files
- `AI_Behavior/dont_talk_but_do.txt` — TODO
- `AI_Behavior/ed_greenwood.txt` — TODO
- `AI_Behavior/encyclopedic_TextEntry_v1.txt` — TODO
- `AI_Behavior/hivemind/HiveMindConcept_v1.txt` — TODO
- `AI_Behavior/hivemind/Hivemind companion.txt` — TODO
- `AI_Behavior/hivemind/NarrativeMasterAI_v1.txt` — TODO
- `AI_Behavior/hivemind/personality_questionnaire.txt` — TODO
- `AI_Behavior/hivemind/roles.json` — TODO
- `AI_Behavior/new_behavior.txt` — TODO

---

## Prose & Resources
- `Prose/Story_beat_adv.md` — TODO
- `Prose/bring_ur_outline.md` — TODO
- `Prose/character_profile.md` — TODO
- `Prose/simple_style_prompt.md` — TODO
- `Prose/story_beat_simple.md` — TODO
- `Prose/story_hacker.md` — TODO
- `Prose/style_prompt_example.md` — TODO
- `Ressources/Chain-statblock-to-md.txt` — TODO
- `Ressources/Reference_CreatureRoles_v1.txt` — TODO
- `Ressources/Reference_Minigames_v1.txt` — TODO
- `Ressources/Reference_TerrainFeatures_v1.txt` — TODO
- `Ressources/big_list_rpg.md` — TODO
- `Ressources/game master apply template.txt` — TODO
- `Ressources/monster features raw.txt` — TODO
- `Ressources/monster template.txt` — TODO
- `Ressources/monster_features.txt` — TODO
- `database_schema.md` — TODO
- `dungeon-master-guide.txt` — TODO
- `dungeon-master-toolkit.txt` — TODO
- `index.json` — TODO
- `manifest.json` — TODO
- `manifest.yaml` — TODO

---

## Summary
- Minimal questionnaire stubs created in this single combined file.  
- Next: expand into individual per-script questionnaire files, ASCII wireframes, UI docs, and samples in phased order.

*Autogenerated stub file created: `docs/mockups/questionnaires/all-narrative-questionnaire-stubs.md`
*Last Updated: 2026-01-22
