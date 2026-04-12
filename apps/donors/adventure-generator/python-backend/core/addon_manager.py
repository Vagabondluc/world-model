"""Add-on management for the AI backend framework."""
from __future__ import annotations

import importlib
import sys
from pathlib import Path
from typing import Any, Optional


class AddonManager:
    """Manages add-on discovery and lifecycle."""
    
    def __init__(self, addons_path: Path = Path("addons")) -> None:
        self.addons_path: Path = addons_path
        self._discovered_addons: Optional[list[dict[str, Any]]] = None
    
    def discover_addons(self) -> list[dict[str, Any]]:
        """
        Discover all available add-ons by scanning the addons directory.
        
        Returns:
            List of add-on metadata dictionaries
        """
        if self._discovered_addons is not None:
            return self._discovered_addons
        
        addons: list[dict[str, Any]] = []
        
        # Ensure addons path exists
        if not self.addons_path.exists():
            return addons
        
        # Scan for add-on packages
        for addon_dir in self.addons_path.iterdir():
            if not addon_dir.is_dir():
                continue
            
            # Skip __pycache__ and hidden directories
            if addon_dir.name.startswith(("__", ".")):
                continue
            
            # Check for __init__.py to confirm it's a package
            init_file = addon_dir / "__init__.py"
            if not init_file.exists():
                continue
            
            # Try to import and extract metadata
            try:
                module_name = f"addons.{addon_dir.name}"
                if module_name in sys.modules:
                    module = sys.modules[module_name]
                else:
                    module = importlib.import_module(module_name)
                
                # Extract metadata
                if hasattr(module, "__addon_metadata__"):
                    metadata = module.__addon_metadata__
                    addons.append({
                        "id": metadata.get("id", addon_dir.name),
                        "name": metadata.get("name", addon_dir.name.title()),
                        "version": metadata.get("version", "unknown"),
                        "description": metadata.get("description", "No description"),
                        "enabled": False  # Will be updated based on config
                    })
                else:
                    # Default metadata if not specified
                    addons.append({
                        "id": addon_dir.name,
                        "name": addon_dir.name.title(),
                        "version": "unknown",
                        "description": "No metadata available",
                        "enabled": False
                    })
            except Exception as e:
                # Skip add-ons that fail to import
                print(f"Warning: Could not load add-on {addon_dir.name}: {e}")
                continue
        
        self._discovered_addons = addons
        return addons
    
    def get_addon(self, addon_id: str) -> Optional[dict[str, Any]]:
        """Get metadata for a specific add-on."""
        addons = self.discover_addons()
        for addon in addons:
            if addon["id"] == addon_id:
                return addon
        return None
    
    def is_addon_available(self, addon_id: str) -> bool:
        """Check if an add-on is available for loading."""
        return self.get_addon(addon_id) is not None


# Singleton instance
addon_manager: AddonManager = AddonManager()
