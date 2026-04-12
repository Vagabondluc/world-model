export interface ProviderInfo {
    id: string;
    name: string;
    description: string;
    baseUrl?: string;
    defaultModel?: string;
    fields: { name: string; label: string; type: 'text' | 'password'; placeholder?: string; required: boolean }[];
    tutorial: string;
    links: { label: string; url: string }[];
    image?: string;
}

export const PROVIDERS: ProviderInfo[] = [
    {
        id: 'claude',
        name: 'Claude (Anthropic)',
        description: 'Elite reasoning and coding capabilities via the Anthropic API.',
        baseUrl: 'https://api.anthropic.com/v1',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-ant-...', required: true },
            { name: 'apiVersion', label: 'API Version', type: 'text', placeholder: '2024-10-31', required: false }
        ],
        links: [
            { label: 'Anthropic Console', url: 'https://console.anthropic.com/' },
            { label: 'Model Docs', url: 'https://docs.anthropic.com/en/docs/models-overview' }
        ],
        image: 'C:/Users/vagab/.gemini/antigravity/brain/b9193317-8de1-42cd-876c-8fb4d26091b9/claude_console_mockup_1769085021538.png',
        tutorial: `
### Setting up Claude
1. Create an account at the **Anthropic Console**.
2. Add credits to your account.
3. Generate an **API Key** in the "API Keys" section.
4. Paste the key below to begin. Claude Sonnet 4.5 is recommended for the best experience.
        `
    },
    {
        id: 'openai',
        name: 'OpenAI (GPT)',
        description: 'The industry standard for reasoning and creative writing.',
        baseUrl: 'https://api.openai.com/v1',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
            { name: 'organizationId', label: 'Organization ID', type: 'text', placeholder: 'org-...', required: false }
        ],
        links: [
            { label: 'OpenAI Dashboard', url: 'https://platform.openai.com/' },
            { label: 'API Keys', url: 'https://platform.openai.com/api-keys' }
        ],
        image: 'C:/Users/vagab/.gemini/antigravity/brain/b9193317-8de1-42cd-876c-8fb4d26091b9/openai_platform_mockup_v2_1769085085103.png',
        tutorial: `
### Setting up OpenAI
1. Sign up at **platform.openai.com**.
2. Go to **API Keys** and create a new secret key.
3. Ensure you have usage credits.
4. Input your key below. GPT-4o or GPT-4o-mini are excellent options.
        `
    },
    {
        id: 'ollama',
        name: 'Ollama (Local)',
        description: 'Run powerful models locally on your own hardware for free.',
        baseUrl: 'http://localhost:11434',
        fields: [
            { name: 'baseUrl', label: 'Base URL', type: 'text', placeholder: 'http://localhost:11434', required: true }
        ],
        links: [
            { label: 'Download Ollama', url: 'https://ollama.com/' },
            { label: 'Model Library', url: 'https://ollama.com/library' }
        ],
        tutorial: `
### Setting up Ollama
1. Download and install **Ollama** from ollama.com.
2. Run the application on your computer.
3. Pull models using the CLI: \`ollama pull llama3\`.
4. The generator will connect to your local instance automatically.
        `
    },
    {
        id: 'lm-studio',
        name: 'LM Studio',
        description: 'Local hosting for Open-Source models via OpenAI-compatible endpoints.',
        baseUrl: 'http://localhost:8080/v1',
        fields: [
            { name: 'baseUrl', label: 'Base URL', type: 'text', placeholder: 'http://localhost:8080/v1', required: true }
        ],
        links: [
            { label: 'Download LM Studio', url: 'https://lmstudio.ai/' }
        ],
        image: 'C:/Users/vagab/.gemini/antigravity/brain/b9193317-8de1-42cd-876c-8fb4d26091b9/lm_studio_server_mockup_v2_1769085098539.png',
        tutorial: `
### Setting up LM Studio
1. Install **LM Studio**.
2. Download a model (e.g., DeepSeek-R1).
3. Start the **Local Server** in the developer tab.
4. Ensure "CORS" is enabled in settings.
        `
    },
    {
        id: 'grok',
        name: 'Grok (xAI)',
        description: 'Real-time knowledge and advanced reasoning from xAI.',
        baseUrl: 'https://api.x.ai/v1',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'xai-...', required: true }
        ],
        links: [
            { label: 'xAI Console', url: 'https://console.x.ai/' }
        ],
        tutorial: `
### Setting up Grok
1. Access the **xAI Developer Console**.
2. Create an API key.
3. Grok-4 is the flagship model with massive context.
        `
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        description: 'Ultra-long context and multimodal capabilities from Google.',
        baseUrl: 'https://gemini.googleapis.com/v1',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: '...', required: true }
        ],
        links: [
            { label: 'Google AI Studio', url: 'https://aistudio.google.com/' }
        ],
        image: 'C:/Users/vagab/.gemini/antigravity/brain/b9193317-8de1-42cd-876c-8fb4d26091b9/google_ai_studio_mockup_1769085121935.png',
        tutorial: `
### Setting up Gemini
1. Go to **Google AI Studio**.
2. Get an API key (Free tier often available).
3. Gemini 3 Pro supports up to 1M tokens.
        `
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        description: 'A single API for hundreds of AI models with easy fallback.',
        baseUrl: 'https://openrouter.ai/api/v1',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-or-...', required: true }
        ],
        links: [
            { label: 'OpenRouter.ai', url: 'https://openrouter.ai/' }
        ],
        tutorial: `
### Setting up OpenRouter
1. Create an account at **OpenRouter**.
2. Generate an API key.
3. You can access any model (Claude, GPT, Llama) through this one interface.
        `
    },
    {
        id: 'zai',
        name: 'Z.ai (Zhipu)',
        description: 'Top-tier reasoning and coding models from Zhipu GLM.',
        baseUrl: 'https://api.z.ai/api/paas/v4',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: '...', required: true }
        ],
        links: [
            { label: 'Zhipu AI Developer', url: 'https://open.bigmodel.cn/' }
        ],
        tutorial: `
### Setting up Z.ai
1. Sign up at the **Zhipu AI Platform**.
2. Go to your API keys and create a new one.
3. The GLM-4 series matches Sonnet 3.5 in many coding benchmarks.
        `
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        description: 'Real-time search-grounded generation for accurate facts.',
        baseUrl: 'https://api.perplexity.ai',
        fields: [
            { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'pplx-...', required: true }
        ],
        links: [
            { label: 'Perplexity API', url: 'https://www.perplexity.ai/settings/api' }
        ],
        tutorial: `
### Setting up Perplexity
1. Go to **Perplexity Settings** and enable API access.
2. Generate an API key.
3. Use the 'sonar' or 'sonar-pro' models for up-to-date information.
        `
    }
];
