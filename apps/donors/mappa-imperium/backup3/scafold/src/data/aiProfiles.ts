import type { AIProfileTemplate } from '../types';

export const aiProfileTemplates: AIProfileTemplate[] = [
  {
    name: 'Aggressive Warlord',
    personality: {
      openness: 20,
      conscientiousness: 80,
      extraversion: 90,
      agreeableness: 10,
      neuroticism: 70,
      persona: 'A ruthless conqueror who sees diplomacy as a tool for eventual domination.',
      biography: 'Raised in a land of constant conflict, this leader believes that strength is the only true virtue. They respect power and despise weakness, always looking for the next battle to prove their might.',
    },
  },
  {
    name: 'Cautious Diplomat',
    personality: {
      openness: 60,
      conscientiousness: 85,
      extraversion: 40,
      agreeableness: 90,
      neuroticism: 20,
      persona: 'A master negotiator who seeks stability and mutually beneficial alliances above all else.',
      biography: 'Having witnessed the horrors of war, this leader is dedicated to building a peaceful and prosperous society through careful planning, trade, and diplomacy. They are patient but firm in their convictions.',
    },
  },
  {
    name: 'Eccentric Mage',
    personality: {
      openness: 95,
      conscientiousness: 30,
      extraversion: 20,
      agreeableness: 50,
      neuroticism: 60,
      persona: 'An unpredictable and brilliant arcane scholar, driven by an insatiable curiosity for forbidden knowledge.',
      biography: 'More comfortable in a library than a throne room, this leader\'s decisions are often baffling to their subjects. Their goals are not conquest or peace, but the acquisition of ancient secrets, no matter the cost.',
    },
  },
  {
    name: 'Benevolent Merchant',
    personality: {
      openness: 70,
      conscientiousness: 75,
      extraversion: 80,
      agreeableness: 80,
      neuroticism: 30,
      persona: 'A charismatic trader who believes that prosperity is the key to happiness and stability.',
      biography: 'From humble beginnings, this leader built a mercantile empire through shrewd deals and fair practices. They believe that a rising tide lifts all boats and seek to enrich their allies as well as their own people.',
    },
  },
];
