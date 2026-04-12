# Design Document: Hybrid Game Mode Architecture
## Dual-Mode Mappa Imperium with Local LLM Integration
### 1. Executive Summary
This document outlines the architecture for implementing dual game modes within the existing Mappa Imperium React application, with configurable Local LLM integration via AI Studio API endpoints, enabling both real-time collaborative and asynchronous turn-based gameplay through shared components.
#### Core Features
- Unified Codebase: Single React app supporting both modes
- Local LLM Integration: Configurable API endpoint for local AI Studio instances
- AI Turn Generation: Automatic turn execution using local or remote AI
- Event System: Centralized game event management
- Component Reusability: 80%+ shared UI components
- World Publishing: Export completed worlds to public website
### 2. Local LLM Integration Architecture
#### 2.1 AI Configuration System
```typescript
// src/types/aiConfig.ts
export interface AIConfiguration {
  provider: 'google-gemini' | 'local-studio' | 'openai-compatible';
  endpoint: string;
  apiKey?: string;
  model: string;
  timeout: number;
  retryAttempts: number;
}

export interface LocalStudioConfig extends AIConfiguration {
  provider: 'local-studio';
  endpoint: string; // e.g., 'http://localhost:1234/v1'
  model: string;    // e.g., 'llama-3.1-8b-instruct'
  apiKey?: string;  // Optional for local instances
}
```
#### 2.2 AI Service Manager
```typescript
// src/services/aiServiceManager.ts
export class AIServiceManager {
  private currentConfig: AIConfiguration;
  private aiService: AIService;
  
  constructor() {
    this.loadConfigFromStorage();
    this.initializeAIService();
  }
  
  // Configure AI endpoint
  async updateConfiguration(config: AIConfiguration): Promise<boolean> {
    try {
      // Test connection to new endpoint
      await this.testConnection(config);
      
      // Save configuration
      this.currentConfig = config;
      this.saveConfigToStorage();
      
      // Reinitialize service
      this.initializeAIService();
      
      return true;
    } catch (error) {
      console.error('AI configuration failed:', error);
      return false;
    }
  }
  
  private async testConnection(config: AIConfiguration): Promise<void> {
    const testPrompt = "Test connection. Respond with 'Connected' only.";
    
    const response = await fetch(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: testPrompt }],
        max_tokens: 10,
        temperature: 0
      }),
      signal: AbortSignal.timeout(config.timeout || 10000)
    });
    
    if (!response.ok) {
      throw new Error(`Connection test failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI endpoint');
    }
  }
  
  private initializeAIService(): void {
    switch (this.currentConfig.provider) {
      case 'local-studio':
        this.aiService = new LocalStudioService(this.currentConfig);
        break;
      case 'google-gemini':
        this.aiService = new GeminiService(this.currentConfig);
        break;
      default:
        this.aiService = new OpenAICompatibleService(this.currentConfig);
    }
  }
  
  async generateContent(prompt: string, context?: any): Promise<string> {
    return this.aiService.generate(prompt, context);
  }
}
```
#### 2.3 Local AI Studio Service Implementation
```typescript
// src/services/localStudioService.ts
export class LocalStudioService implements AIService {
  private config: LocalStudioConfig;
  
  constructor(config: LocalStudioConfig) {
    this.config = config;
  }
  
  async generate(prompt: string, context?: any): Promise<string> {
    try {
      const response = await fetch(`${this.config.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a creative assistant for the Mappa Imperium worldbuilding game. Generate detailed, consistent fantasy content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`Local AI request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Local AI request timed out');
      }
      throw error;
    }
  }
  
  async generateWithRetry(prompt: string, context?: any): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await this.generate(prompt, context);
      } catch (error) {
        lastError = error;
        if (attempt < this.config.retryAttempts) {
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }
    
    throw new Error(`AI generation failed after ${this.config.retryAttempts} attempts: ${lastError.message}`);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```
### 3. AI Configuration UI
#### 3.1 AI Settings Modal
```typescript
// src/components/settings/AIConfigModal.tsx
export const AIConfigModal: React.FC<AIConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  currentConfig,
  onConfigUpdate 
}) => {
  const [config, setConfig] = useState<AIConfiguration>(currentConfig);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    
    try {
      const aiManager = new AIServiceManager();
      const success = await aiManager.updateConfiguration(config);
      
      if (success) {
        setConnectionStatus('success');
        setErrorMessage('');
      } else {
        setConnectionStatus('error');
        setErrorMessage('Connection test failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async () => {
    if (connectionStatus !== 'success') {
      await handleTestConnection();
      if (connectionStatus !== 'success') return;
    }
    
    onConfigUpdate(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">AI Configuration</h2>
        
        {/* Provider Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">AI Provider</label>
          <select
            value={config.provider}
            onChange={(e) => setConfig(prev => ({ 
              ...prev, 
              provider: e.target.value as AIConfiguration['provider'],
              ...(e.target.value === 'local-studio' && {
                endpoint: 'http://localhost:1234/v1',
                model: 'llama-3.1-8b-instruct'
              })
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="google-gemini">Google Gemini</option>
            <option value="local-studio">Local AI Studio</option>
            <option value="openai-compatible">OpenAI Compatible</option>
          </select>
        </div>

        {/* Endpoint Configuration */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">API Endpoint</label>
          <input
            type="text"
            value={config.endpoint}
            onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
            placeholder="http://localhost:1234/v1"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            {config.provider === 'local-studio' && 'Your local AI Studio server address'}
            {config.provider === 'google-gemini' && 'Google AI Studio endpoint (usually automatic)'}
            {config.provider === 'openai-compatible' && 'OpenAI-compatible API endpoint'}
          </p>
        </div>

        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Model</label>
          <input
            type="text"
            value={config.model}
            onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
            placeholder="llama-3.1-8b-instruct"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Model name as configured in your AI Studio
          </p>
        </div>

        {/* API Key (Optional for local) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            API Key 
            {config.provider === 'local-studio' && <span className="text-gray-500">(optional)</span>}
          </label>
          <input
            type="password"
            value={config.apiKey || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            placeholder={config.provider === 'local-studio' ? 'Leave empty if no auth required' : 'Your API key'}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Advanced Settings */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Timeout (seconds)</label>
            <input
              type="number"
              value={config.timeout / 1000}
              onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) * 1000 }))}
              min="5"
              max="120"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Retry Attempts</label>
            <input
              type="number"
              value={config.retryAttempts}
              onChange={(e) => setConfig(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
              min="1"
              max="5"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Connection Test */}
        <div className="mb-6">
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection || !config.endpoint || !config.model}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
          </button>
          
          {connectionStatus === 'success' && (
            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700">
              ✅ Connection successful!
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
              ❌ Connection failed: {errorMessage}
            </div>
          )}
        </div>

        {/* Local AI Studio Setup Instructions */}
        {config.provider === 'local-studio' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-900 mb-2">Local AI Studio Setup:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Install AI Studio (LM Studio, Ollama, etc.)</li>
              <li>Load your preferred model (e.g., Llama 3.1 8B Instruct)</li>
              <li>Start the local server (usually on port 1234)</li>
              <li>Use the server address above (e.g., http://localhost:1234/v1)</li>
              <li>Test the connection to verify it's working</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={connectionStatus !== 'success' && connectionStatus !== 'idle'}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
```
#### 3.2 AI Status Indicator
```typescript
// src/components/shared/AIStatusIndicator.tsx
export const AIStatusIndicator: React.FC = () => {
  const { aiConfig, connectionStatus } = useAIConfig();
  const [showConfig, setShowConfig] = useState(false);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'connecting': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setShowConfig(true)}
          className={`flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded ${getStatusColor()}`}
        >
          <span>{getStatusIcon()}</span>
          <span>
            {aiConfig.provider === 'local-studio' ? 'Local AI' : 'Cloud AI'}
          </span>
        </button>
      </div>

      {showConfig && (
        <AIConfigModal
          isOpen={showConfig}
          onClose={() => setShowConfig(false)}
          currentConfig={aiConfig}
          onConfigUpdate={(newConfig) => {
            // Update AI configuration
            updateAIConfig(newConfig);
          }}
        />
      )}
    </>
  );
};
```
### 4. Integration with Game Systems
#### 4.1 AI-Powered Turn Generation with Local LLM
```typescript
// src/services/aiTurnGenerator.ts
export class AITurnGenerator {
  private aiManager: AIServiceManager;

  constructor() {
    this.aiManager = new AIServiceManager();
  }

  async generateMissedTurn(
    playerId: number,
    currentEra: number,
    gameState: GameState
  ): Promise<GeneratedTurn> {
    
    const playerProfile = this.buildPlayerProfile(playerId, gameState);
    const turnContext = this.analyzeTurnContext(currentEra, gameState);
    
    // Build context-aware prompt optimized for local LLMs
    const prompt = this.buildLocalLLMPrompt(playerProfile, turnContext);
    
    try {
      // Use configured AI service (local or remote)
      const generatedContent = await this.aiManager.generateContent(prompt);
      
      // Parse AI response into game elements
      const newElements = this.parseAIResponse(generatedContent, playerId);
      
      return {
        playerId,
        era: currentEra,
        elements: newElements,
        aiGenerated: true,
        aiProvider: this.aiManager.getCurrentProvider(),
        reasoning: generatedContent,
        timestamp: new Date()
      };
      
    } catch (error) {
      // Fallback to simpler generation if AI fails
      console.warn('AI generation failed, using fallback:', error);
      return this.generateFallbackTurn(playerId, currentEra, gameState);
    }
  }

  private buildLocalLLMPrompt(
    playerProfile: PlayerProfile, 
    turnContext: TurnContext
  ): string {
    // Optimized prompt structure for local LLMs
    return `
WORLDBUILDING TASK: Generate content for Mappa Imperium Era ${turnContext.era}

PLAYER CONTEXT:
- Cultural Themes: ${playerProfile.culturalThemes.join(', ')}
- Naming Style: ${playerProfile.namingStyle}
- Strategic Approach: ${playerProfile.strategicStyle}

CURRENT SITUATION:
- Era: ${turnContext.era} (${this.getEraName(turnContext.era)})
- Available Actions: ${turnContext.availableActions.join(', ')}
- Neighboring Players: ${turnContext.neighbors.map(n => n.name).join(', ')}

REQUIREMENTS:
- Generate 1-2 new elements consistent with player's established style
- Include specific names, descriptions, and relationships
- Maintain cultural consistency with previous elements
- Format as JSON with clear element structure

RESPONSE FORMAT:
{
  "elements": [
    {
      "type": "Settlement|Faction|Event|etc",
      "name": "Specific Name",
      "description": "Detailed description",
      "relationships": ["connects to existing element IDs"]
    }
  ],
  "reasoning": "Brief explanation of choices made"
}
`;
  }
}
```
#### 4.2 AI Configuration Persistence
```typescript
// src/hooks/useAIConfig.ts
export function useAIConfig() {
  const [aiConfig, setAIConfig] = useState<AIConfiguration>(() => {
    // Load from localStorage on initial load
    const saved = localStorage.getItem('mappa-ai-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Invalid AI config in storage, using defaults');
      }
    }
    
    // Default configuration
    return {
      provider: 'google-gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-1.5-flash',
      timeout: 30000,
      retryAttempts: 3
    };
  });

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');

  const updateAIConfig = useCallback(async (newConfig: AIConfiguration) => {
    try {
      // Test the new configuration
      const aiManager = new AIServiceManager();
      const success = await aiManager.updateConfiguration(newConfig);
      
      if (success) {
        setAIConfig(newConfig);
        setConnectionStatus('connected');
        
        // Persist to localStorage
        localStorage.setItem('mappa-ai-config', JSON.stringify(newConfig));
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Failed to update AI config:', error);
      setConnectionStatus('error');
    }
  }, []);

  return {
    aiConfig,
    connectionStatus,
    updateAIConfig,
    getCurrentProvider: () => aiConfig.provider
  };
}
```
### 5. Implementation Benefits
#### 5.1 Local AI Advantages
- **Privacy:** All AI processing happens locally, no data sent to external services
- **Cost Control:** No per-request charges for AI generation
- **Customization:** Users can choose specialized models for worldbuilding
- **Offline Capability:** Works without internet connection
- **Performance:** Potentially faster responses with local hardware
#### 5.2 Fallback Strategy
```typescript
// Graceful degradation if local AI fails
const AIFallbackService = {
  async generateBasicContent(context: any): Promise<string> {
    // Simple template-based generation without AI
    return this.generateFromTemplates(context);
  },
  
  generateFromTemplates(context: any): string {
    // Use predefined templates and random selection
    const templates = this.getTemplatesForEra(context.era);
    return this.fillTemplate(templates[Math.floor(Math.random() * templates.length)], context);
  }
};
```
This architecture provides flexible AI integration while maintaining the dual-mode game system and component reusability, giving users complete control over their AI backend choice.