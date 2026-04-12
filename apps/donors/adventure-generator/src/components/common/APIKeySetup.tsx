import React, { useState } from 'react';
import { css } from '@emotion/css';
import { GoogleGenAI } from "@google/genai";
import { CONFIG } from '../../data/constants';
import { BrowserAPIKeyManager } from '../../services/apiKeyManager';
import { ImprovedAdventureAPIService } from '../../services/aiService';

// This is a temporary solution for development and will be removed.
// It allows using a pre-configured key from the environment.
const PUBLIC_DEV_KEY = process.env.API_KEY;

const styles = {
    container: css`
        max-width: 600px;
        margin: var(--space-xxl) auto;
        padding: var(--space-xl);
        background: var(--card-bg);
        border: var(--border-main);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        
        .form-group {
            margin-bottom: var(--space-l);
        }
    `,
    input: css`
        width: 100%;
    `,
    divider: css`
        text-align: center;
        margin: var(--space-l) 0;
        font-weight: bold;
    `,
    help: css`
        margin-top: var(--space-xl);
        padding-top: var(--space-l);
        border-top: var(--border-light);
        font-size: 0.9rem;

        ol {
            padding-left: var(--space-l);
            list-style-type: decimal;
        }
    `
};

interface APIKeySetupProps {
    onConfigured: (service: ImprovedAdventureAPIService) => void;
}
  
export const APIKeySetup: React.FC<APIKeySetupProps> = ({ onConfigured }) => {
    const [apiKey, setApiKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleValidation = async (key: string | undefined) => {
        if (!key || !key.trim()) {
            setError('API key cannot be empty.');
            return;
        }

        setIsValidating(true);
        setError(null);
        
        try {
            const testAI = new GoogleGenAI({ apiKey: key.trim() });
            await testAI.models.generateContent({
                model: CONFIG.AI_MODEL,
                contents: 'Test',
            });
            
            const apiKeyManager = new BrowserAPIKeyManager();
            apiKeyManager.setApiKey(key.trim());
            
            const service = new ImprovedAdventureAPIService();
            onConfigured(service);
            
        } catch (err) {
            setError('Invalid API key or connection failed. Please check your key and try again.');
            console.error(err);
        } finally {
            setIsValidating(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleValidation(apiKey);
    };

    const handleUsePublicKey = () => {
        handleValidation(PUBLIC_DEV_KEY);
    };
    
    return (
      <div className={styles.container}>
        <h2>Google Gemini API Key Required</h2>
        <p>This application requires a Google Gemini API key to generate content. Your key will be stored locally in your browser and will not be shared.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="api-key">Gemini API Key:</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Gemini API key..."
              className={styles.input}
              disabled={isValidating}
            />
          </div>
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={!apiKey.trim() || isValidating}
          >
            {isValidating ? 'Validating...' : 'Configure API Key'}
          </button>
        </form>

        {PUBLIC_DEV_KEY && (
            <>
                <div className={styles.divider}>OR</div>
                <button
                    onClick={handleUsePublicKey}
                    className="secondary-button"
                    disabled={isValidating}
                >
                    {isValidating ? 'Validating...' : 'Use Public Development Key'}
                </button>
            </>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <div className={styles.help}>
          <h3>How to get a Gemini API Key:</h3>
          <ol>
            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key"</li>
            <li>Copy the generated key and paste it above</li>
          </ol>
        </div>
      </div>
    );
};