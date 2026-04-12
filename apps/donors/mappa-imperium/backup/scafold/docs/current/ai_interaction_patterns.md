# AI Interaction Pattern

To protect user-written content and provide a clear user experience, a standard interaction pattern is used for AI generation interfaces:

-   **Non-Destructive by Default**: If a user has manually entered text into a main content field (like a "Description" or "Theme" input), the "Generate with AI" button for that element is disabled.
-   **Clear Feedback**: A message is displayed informing the user that AI generation is disabled to prevent overwriting their work. The user must clear the relevant field(s) to re-enable the button.
-   **Contextual Injection**: Even if the main content field is empty, any other data the user has entered (e.g., a Name, Type, or Symbol) is still injected into the AI prompt. This allows the AI to act as a creative partner, enhancing and completing the user's partial ideas rather than starting from scratch.

This pattern is the standard for all current and future AI-powered creation forms.