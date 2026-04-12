# Narrative Scripts — Loom Classification Manifest

Generated: 2026-03-31. Source root: `Narrative Scripts/Execution_Systems/`

Legend: **class** = generator | descriptor | method | compound | locale  
**treatment** = single-step | full

---

## adventures/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `Three-Pass Adventure Creation Method.txt` | `three_pass_adventure` | method | seed, create_entities, synthesize×3, finalize | full |
| `AI_QuestCreation_v1.txt` | `quest_creation` | method | seed, node_generation, create_entities, link_nodes, synthesize, finalize | full |
| `arcane_library_method.txt` | `arcane` | method | table, matrix, node_generation, create_entities, link_nodes, synthesize, finalize | **done** |
| `arcane_library_method2.txt` | `arcane_v2` | locale | inherits `arcane` | single-step |
| `pointyhat travel adventure.txt` | `pointyhat_travel_adventure` | locale | inherits `three_pass_adventure` | single-step |

---

## Dungeons/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `DungeonDesign_5Room_v1.txt` | `five_room_dungeon` | method | seed, matrix, create_entities, link_nodes, synthesize, finalize | full |
| `DungeonDesign_5Room_Alternate_v1.txt` | `five_room_dungeon_alt` | locale | inherits `five_room_dungeon` | single-step |
| `DungeonCreation_PointyHat_v1.txt` | `dungeon_pointyhat` | locale | inherits `five_room_dungeon` | single-step |
| `megadungeon-planner.txt` | `megadungeon` | method | seed, table, matrix, node_generation, create_entities, link_nodes, synthesize, finalize | full |
| `corridor-themes-generator.txt` | `corridor_themes` | generator | table | single-step |
| `dungeon-concept-brainstormer.txt` | `dungeon_concept` | generator | seed | single-step |
| `dungeon-features-summarizer.txt` | `dungeon_features` | descriptor | finalize | single-step |
| `dungeon-key-writer.txt` | `dungeon_key` | descriptor | finalize | single-step |
| `dungeon-map-creator.txt` | `dungeon_map` | generator | matrix | single-step |
| `dungeon-room-designer.txt` | `dungeon_room` | descriptor | create_entities | single-step |
| `jp cooper 10 room dungeon.txt` | `ten_room_dungeon` | method | seed, create_entities, link_nodes, synthesize | full |
| `xandered-dungeon-designer.txt` | `xandered_dungeon` | method | seed, node_generation, create_entities, link_nodes, synthesize, finalize | full |

---

## Encounters/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `EncounterDesign_v1.txt` | `encounter_design` | method | seed, create_entities, synthesize, finalize | full |
| `combat_encounter.txt` | `combat_encounter` | method | seed, create_entities, synthesize | full |
| `combat_encounter - V2.txt` | `combat_encounter_v2` | locale | inherits `combat_encounter` | single-step |
| `combat-encounter-balancer.txt` | `encounter_balancer` | generator | table | single-step |
| `Encounter_genric_beta.txt` | `encounter_generic` | generator | seed, table | single-step |
| `EncounterDesign_Older_v1.txt` | — | descriptor | — | **deprecated** |
| `EncounterDesign_v1_DEPRECATED.txt` | — | — | — | **deprecated** |
| `RPGAdventure_SceneCrafting_v1.txt` | `scene_craft` | method | seed, node_generation, create_entities, link_nodes, synthesize | full |
| `social_event.txt` | `social_event` | method | seed, create_entities, synthesize | full |
| `trap_prep.txt` | `trap_prep` | method | seed, node_generation, create_entities, synthesize | full |
| `urban_crawl.txt` | `urban_crawl` | method | seed, table, matrix, node_generation, create_entities, synthesize, finalize | full |

---

## Factions/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `factions_creation.txt` | `faction_creation` | method | seed, create_entities (leader, agents, clocks), link_nodes, synthesize | full |
| `faction-conflict-simulator.txt` | `faction_conflict` | method | seed, node_generation, link_nodes, synthesize | full |
| `faction_downtime.txt` | `faction_downtime` | generator | seed, table | single-step |

---

## Heists/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `heist_prep.txt` | `heist` (prep stage) | compound | seed, node_generation, create_entities, link_nodes | full (compound with heist_running) |
| `heist_running.txt` | `heist` (run stage) | compound | synthesize, finalize | full (same compound) |
| `raid_prep.txt` | `raid` (prep stage) | compound | seed, node_generation, create_entities | full (compound with raid_execution) |
| `raid_execution.txt` | `raid` (run stage) | compound | synthesize, finalize | full (same compound) |

---

## Item/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `magic_item.txt` | `magic_item` | descriptor | seed, synthesize | single-step |
| `magic weapon basic.txt` | `magic_weapon` | descriptor | seed, synthesize | single-step |

---

## Locations/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `city_gazetteer.txt` | `city_gazetteer` | method | seed, table, node_generation, create_entities (districts, landmarks, services), link_nodes, synthesize, finalize | full |
| `CreateFantasyCity_v1.txt` | `city_creation` | method | seed, create_entities, link_nodes, synthesize | full |
| `battlefield_generation.txt` | `battlefield` | method | seed, matrix, create_entities, synthesize | full |
| `fantastic_location.txt` | `fantastic_location` | descriptor | seed, create_entities, synthesize | single-step |
| `Make a settlement.txt` | `settlement` | method | seed, create_entities, link_nodes, synthesize | full |
| `Quick_settlement.txt` | `quick_settlement` | generator | seed, synthesize | single-step |

---

## Mysteries/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `5_node_mystery.txt` | `five_node_mystery` | method | seed, node_generation×5, link_nodes, synthesize, finalize | full |
| `5x5_mystery_campaign.txt` | `5x5_mystery` | method | seed, matrix (5×5), node_generation, link_nodes, synthesize | full |
| `mystery_node.txt` | `mystery_node` | descriptor | node_generation | single-step |
| `node_cloud_mystery.txt` | `node_cloud` | method | seed, node_generation, link_nodes, synthesize | **done** |
| `non-linear_mystery.txt` | `non_linear_mystery` | method | seed, node_generation, link_nodes, synthesize | full |
| `proactive_mystery_node.txt` | `proactive_mystery` | descriptor | node_generation | single-step |
| `revelations_dm_aid.txt` | `revelations` | descriptor | finalize | single-step |
| `swap_mystery.txt` | `swap_mystery` | method | seed, node_generation, link_nodes, synthesize | full |

---

## NPCs/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `CreateNPC_Alternate_v1.txt` | `npc_creation` | method | seed, create_entities, synthesize | full |
| `npc_creator_bot.txt` | `npc_bot` | method | seed, create_entities, synthesize | full |
| `NPC_Description_v1.txt` | `npc_description` | descriptor | create_entities | single-step |
| `NPC_Description_Simple_v1.txt` | `npc_description_simple` | descriptor | create_entities | single-step |
| `Quick_NPC.txt` | `quick_npc` | generator | seed, synthesize | single-step |
| `QuickNPC_Creation_v1.txt` | `quicknpc` | generator | seed, synthesize | single-step |

---

## plot/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `campaign_prep.txt` | `campaign_prep` | method | seed, create_entities (metaplot, arcs, npcs), link_nodes, synthesize, finalize | full |
| `crafting scenes.txt` | `crafting_scenes` | method | seed, create_entities, link_nodes, synthesize | full |
| `create_hook.txt` | `hook` | generator | seed, synthesize | single-step |
| `rumors.txt` | `rumor` | generator | seed, table | single-step |
| `SceneDescriptor_v1.txt` | `scene_descriptor` | descriptor | create_entities, finalize | single-step |
| `vivid_description.txt` | `vivid_description` | descriptor | finalize | single-step |

---

## riddles/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `CreateRiddle_v1.txt` | `riddle` | generator | seed, synthesize | single-step |
| `CreateRiddle_v2.txt` | `riddle_v2` | generator | seed, synthesize | single-step |
| `CreateToken_v1.txt` | `token` | generator | seed, synthesize | single-step |
| `createToken_v2.txt` | `token_v2` | generator | seed, synthesize | single-step |

---

## Travel/

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `wilderness_travel.txt` | `wilderness_travel` | method | seed, table, matrix, node_generation, create_entities, synthesize, finalize | full |
| `wilderness_travel_long.txt` | `wilderness_travel_long` | locale | inherits `wilderness_travel` | single-step |
| `random-encounter-table-generator.txt` | `encounter_table` | generator | seed, table, matrix | single-step |
| `urban_crawl.txt` | `urban_crawl_travel` | locale | inherits `urban_crawl` | single-step |

---

## Westmarsh/ (locale variants)

| File | Method ID | Class | Loom Stages | Treatment |
|------|-----------|-------|-------------|-----------|
| `Eldwyn_mission_prompt.txt` | `westmarsh_mission` | locale | inherits `mission` | single-step |
| `Eldwyn_rail_road_quest_generator.txt` | `railroad_quest` | method | seed, matrix, synthesize, finalize | full |
| `Eldwyn_instant_generator.txt` | `instant_generator` | generator | seed, synthesize | single-step |
| `Eldwyn_pointyhat_travel_adventure.txt` | `westmarsh_travel` | locale | inherits `three_pass_adventure` | single-step |
| `Eldwyn_profil_npc_westmarsh.txt` | `westmarsh_npc` | locale | inherits `npc_creation` | single-step |
| `Eldwyn_prompt_mission_fr.txt` | `westmarsh_mission_fr` | locale | inherits `westmarsh_mission` | single-step |
| `instant generator.txt` | `instant_generator_base` | generator | seed, synthesize | single-step |
| `mission prompt.txt` | `mission` | method | seed, synthesize, finalize | **done** |
| `profil_npc_westmarsh.txt` | `westmarsh_npc_base` | locale | inherits `npc_creation` | single-step |
| `prompt mission francais.txt` | `mission_fr` | locale | inherits `mission` | single-step |
| `rail road quest  generator.txt` | `railroad_quest_base` | method | seed, matrix, synthesize, finalize | full |

---

## Summary

| Category | Total scripts | Full treatment | Single-step | Deprecated | Done |
|----------|--------------|----------------|-------------|------------|------|
| adventures | 5 | 2 | 2 | 0 | 1 |
| Dungeons | 12 | 4 | 8 | 0 | 0 |
| Encounters | 11 | 6 | 3 | 2 | 0 |
| Factions | 3 | 2 | 1 | 0 | 0 |
| Heists | 4 | 2 (compound) | 0 | 0 | 0 |
| Item | 2 | 0 | 2 | 0 | 0 |
| Locations | 6 | 4 | 2 | 0 | 0 |
| Mysteries | 8 | 4 | 3 | 0 | 1 |
| NPCs | 6 | 2 | 4 | 0 | 0 |
| plot | 6 | 2 | 4 | 0 | 0 |
| riddles | 4 | 0 | 4 | 0 | 0 |
| Travel | 4 | 1 | 3 | 0 | 0 |
| Westmarsh | 11 | 2 | 9 | 0 | 1 |
| **Total** | **82** | **31** | **45** | **2** | **3** |
