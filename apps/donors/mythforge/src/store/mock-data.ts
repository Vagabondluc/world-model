import type { Entity, Relationship } from '@/lib/types';
import { CATEGORY_TEMPLATES } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const NOW = 1742000000000;
const DAY = 86400000;

export const MOCK_CAMPAIGN_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
export const MOCK_ADVENTURE_ID = 'f6e5d4c3-b2a1-4968-8574-3d2c1b0a9f8e';
export const MOCK_NPC_ID = '1a2b3c4d-5e6f-4789-abcd-ef0123456789';

export const mockEntities: Entity[] = [
  {
    id: MOCK_CAMPAIGN_ID, uuid_short: 'E-A7C3', title: "The Devil's Asylum", category: 'Campaign',
    markdown_content: `# The Devil's Asylum\n\nA dark gothic horror campaign set in the crumbling remains of the Blackspire Sanatorium, a once-prestigious asylum for the magically afflicted. Now overrun by eldritch horrors and the cursed remnants of its former patients, the sanatorium sits atop a planar rift that bleeds the Far Realm into the material plane.\n\n## Campaign Hooks\n- The players are investigators sent by the College of Thaumaturgic Studies\n- Strange disappearances in the surrounding village of Ashwick\n- The former head physician, Dr. Malachar Vex, has not been seen in 20 years\n\n## Key Themes\n- Madness and perception\n- The corruption of healing magic\n- Institutional horror\n- Reality fracturing`,
    json_attributes: CATEGORY_TEMPLATES['Campaign'], tags: ['active', 'horror'], isPinned: false, created_at: NOW - DAY * 30, updated_at: NOW - DAY * 2,
  },
  {
    id: MOCK_ADVENTURE_ID, uuid_short: 'E-B2D9', title: 'The Whispering Wards', category: 'Adventure',
    markdown_content: `# The Whispering Wards\n\nThe first major adventure arc of *The Devil's Asylum* campaign. The party must navigate the outer wards of the Blackspire Sanatorium, dealing with reanimated orderlies, sentient surgical tools, and the haunting melodies of the Phonograph Ghost.\n\n## Adventure Structure\n1. **Approach**: Travel through Ashwick, gather intel from terrified locals\n2. **Outer Gate**: Solve the Warden's Riddle to breach the perimeter\n3. **Admission Wing**: Survive the triage room and encounter the Suture Golem\n4. **The Phonograph Room**: Confront the spirit of Nurse Elara and learn the truth\n\n## Rewards\n- Access to the Inner Sanatorium\n- The Warden's Key (artifact)\n- Information about Dr. Vex's final experiment`,
    json_attributes: { ...CATEGORY_TEMPLATES['Adventure'], level_range: [3, 5], estimated_duration_hours: 8, difficulty_rating: 7 },
    tags: ['act-1'], isPinned: false, created_at: NOW - DAY * 14, updated_at: NOW - DAY * 1,
  },
  {
    id: MOCK_NPC_ID, uuid_short: 'E-F4E1', title: 'Dr. Malachar Vex', category: 'NPC',
    markdown_content: `# Dr. Malachar Vex\n\n*Former Head Physician of Blackspire Sanatorium*\n\n## Description\nA gaunt, towering figure with silver-white hair and eyes that glow with a faint, sickly violet luminescence. His fingers are impossibly long and ended in nails like surgical instruments.\n\n## Personality\n- Obsessive and methodical in speech\n- Speaks in clinical terms even about horrific subjects\n- Shows genuine affection for his "patients"\n\n## Stats\n- HP: 120 (Resistance: Necrotic, Psychic)\n- AC: 16\n- CR: 8`,
    json_attributes: { ...CATEGORY_TEMPLATES['NPC'], hp: 120, ac: 16, level: 8, age: 67, wealth_gold: 5000, disposition: 'Lawful Evil' },
    tags: ['bbeg', 'npc'], isPinned: true, created_at: NOW - DAY * 30, updated_at: NOW,
  },
];

export const mockRelationships: Relationship[] = [
  { id: uuidv4(), parent_id: MOCK_CAMPAIGN_ID, child_id: MOCK_ADVENTURE_ID, relationship_type: 'contains' },
  { id: uuidv4(), parent_id: MOCK_ADVENTURE_ID, child_id: MOCK_NPC_ID, relationship_type: 'related_to' },
];
