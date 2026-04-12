export const DEITY_PROMPT_TEMPLATE = `
# Era II: Divine Entities Prompt Template

Generate a deity for a fantasy world. If specific domains, symbols, or other details are provided, incorporate them meaningfully into the deity's narrative.

## For Each Deity, Please Provide in JSON format:

### Core Identity
1. Name: A unique, evocative name.
2. Primary Domain: The main area of influence.
3. Sacred Symbol (descriptive text): A rich text description of their holy symbol (e.g., "A cracked stone hammer wreathed in lightning").
4. Map Emoji (a single emoji character): A single emoji to represent them on a map.
5. Description: A detailed 3-4 sentence paragraph covering:
   - Primary motivation (their driving force).
   - Greatest virtue (a defining positive trait).
   - Fatal flaw (a character weakness).
   - Influence on the world and their followers.

## Context from the user may include:
- Existing deities in the pantheon (to ensure the new one is distinct).
- Specific ideas or themes to incorporate.

## Example Format (you must respond with a JSON object that matches this structure):
{
  "name": "Khardak the Unbroken",
  "domain": "War and Smithing",
  "symbol": "A cracked anvil that perpetually glows with a dull, red heat.",
  "emoji": "🔨",
  "description": "Khardak is the embodiment of resilience and strength forged through hardship. His primary motivation is to see mortals overcome their limits, believing that true strength is only found after being broken and remade. His greatest virtue is his unwavering honor, but his fatal flaw is a stubborn refusal to yield, even when it leads to ruin. He inspires smiths to create legendary weapons and soldiers to fight to their last breath."
}
`;

export const SACRED_SITE_PROMPT_TEMPLATE = `
# Sacred Site Generation Prompt

You are an AI assistant for a fantasy worldbuilding game. Your task is to generate a rich description for a sacred site based on the provided context.

## CONTEXT FOR GENERATION
- **Deity Name:** {DEITY_NAME}
- **Deity's Domain:** {DEITY_DOMAIN}
- **Site Type:** {SITE_TYPE}
- **Deity's Nature:** {DEITY_DESCRIPTION}
- **User's Ideas (Optional):** {USER_IDEAS}

## INSTRUCTIONS
Based on the context, generate a JSON object for the sacred site. The response should be creative, evocative, and consistent with the deity's themes.

The JSON object must have the following properties:
- **name**: A unique, evocative name for the sacred site (e.g., "The Sunken Grove of Whispers", "Mount Ka'Gorr's Heart").
- **symbol**: A single emoji character that best represents the site.
- **description**: A detailed paragraph of 4-6 sentences describing the site. The description must:
    1.  Vividly paint a picture of the location and its atmosphere.
    2.  Explain *why* this specific place is sacred to the provided deity, connecting it to their domain and nature.
    3.  Hint at its history, a pivotal event, a miracle, or a legend associated with it.
    4.  Mention any unique properties, phenomena, guardians, or rituals associated with the site.
`;