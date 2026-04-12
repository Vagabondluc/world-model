"""Configuration management for the AI backend framework."""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, Any


class Settings(BaseSettings):
    """Application settings."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    
    # Core Framework Settings
    API_KEY: Optional[str] = None # If set, requires X-API-Key header
    AI_PROVIDER: str = "ollama"  # ollama, lm_studio, webui
    OLLAMA_BASE_URL: str = "http://localhost:11434/v1"
    LM_STUDIO_BASE_URL: str = "http://localhost:1234/v1"
    WEBUI_BASE_URL: str = "http://localhost:5000/v1"
    
    RAG_PERSIST_PATH: str = "rag/chroma"
    DEFAULT_MODEL: str = "llama3"
    DEFAULT_EMBED_MODEL: str = "mxbai-embed-large"
    
    # Add-on Toggles
    ENABLE_DND_ADDON: bool = True
    
    # D&D Add-on Specific Settings
    DND_COLLECTION_NAME: str = "dnd_campaign_lore"
    DND_DEFAULT_MODEL: str = "llama3"
    
    # D&D Add-on Specific Settings
    DND_COLLECTION_NAME: str = "dnd_campaign_lore"
    DND_DEFAULT_MODEL: str = "llama3"
    
    
    def get_active_url(self) -> str:
        """Get the base URL for the active provider."""
        if self.AI_PROVIDER == "ollama":
            return self.OLLAMA_BASE_URL
        elif self.AI_PROVIDER == "lm_studio":
            return self.LM_STUDIO_BASE_URL
        elif self.AI_PROVIDER == "webui":
            return self.WEBUI_BASE_URL
        return self.OLLAMA_BASE_URL

    def update_provider(self, provider: str) -> bool:
        """Update the active provider."""
        if provider in ["ollama", "lm_studio", "webui"]:
            self.AI_PROVIDER = provider
            return True
        return False

    def update_ollama_url(self, url: str) -> bool:
        """Update Ollama base URL and validate format."""
        if not url.startswith(("http://", "https://")):
            return False
        self.OLLAMA_BASE_URL = url
        return True
    
    def update_model(self, model: str) -> None:
        """Update the default model."""
        self.DEFAULT_MODEL = model

    def update_rag_persist_path(self, path: str) -> bool:
        """Update the RAG persistence path."""
        # Visual check for valid path format
        if not path:
            return False
        self.RAG_PERSIST_PATH = path
        return True

    def update_setting(self, key: str, value: Any) -> bool:
        """Update a generic setting by key."""
        if hasattr(self, key):
            # Basic type conversion could go here if needed
            # For now, we assume the value matches the type or is compatible
            setattr(self, key, value)
            return True
        return False


# Singleton instance
settings = Settings()
