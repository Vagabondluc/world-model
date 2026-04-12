"""Add-on management router for the AI backend framework."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.addon_manager import addon_manager
from core.config import settings


router: APIRouter = APIRouter(prefix="/addons", tags=["Add-ons"])


class AddonInfo(BaseModel):
    """Add-on information model."""
    id: str
    name: str
    version: str
    description: str
    enabled: bool


class AddonsAvailableResponse(BaseModel):
    """Response model for available add-ons."""
    addons: list[AddonInfo]


class AddonsEnabledResponse(BaseModel):
    """Response model for enabled add-ons."""
    enabled: list[str]


class ToggleAddonRequest(BaseModel):
    """Request model for toggling an add-on."""
    addon_id: str
    enabled: bool


class ToggleAddonResponse(BaseModel):
    """Response model for add-on toggle."""
    success: bool
    restart_required: bool
    message: str


@router.get("/available", response_model=AddonsAvailableResponse)
async def get_available_addons() -> AddonsAvailableResponse:
    """List all discoverable add-ons with their enabled status."""
    discovered = addon_manager.discover_addons()
    
    # Update enabled status based on current settings
    for addon in discovered:
        # Currently only D&D addon is tracked in settings
        if addon["id"] == "dnd":
            addon["enabled"] = settings.ENABLE_DND_ADDON
        else:
            addon["enabled"] = False
    
    return AddonsAvailableResponse(
        addons=[AddonInfo(**addon) for addon in discovered]
    )


@router.get("/enabled", response_model=AddonsEnabledResponse)
async def get_enabled_addons() -> AddonsEnabledResponse:
    """List currently enabled add-ons."""
    enabled = []
    
    if settings.ENABLE_DND_ADDON:
        enabled.append("dnd")
    
    return AddonsEnabledResponse(enabled=enabled)


@router.post("/toggle", response_model=ToggleAddonResponse)
async def toggle_addon(request: ToggleAddonRequest) -> ToggleAddonResponse:
    """
    Enable or disable an add-on.
    
    Note: This updates the configuration but requires a server restart to take effect.
    """
    # Verify add-on exists
    if not addon_manager.is_addon_available(request.addon_id):
        raise HTTPException(
            status_code=404,
            detail=f"Add-on '{request.addon_id}' not found"
        )
    
    # Update configuration (currently only supports D&D)
    if request.addon_id == "dnd":
        settings.ENABLE_DND_ADDON = request.enabled
        
        return ToggleAddonResponse(
            success=True,
            restart_required=True,
            message=f"Add-on '{request.addon_id}' {'enabled' if request.enabled else 'disabled'}. Restart required to apply changes."
        )
    else:
        return ToggleAddonResponse(
            success=False,
            restart_required=False,
            message=f"Add-on '{request.addon_id}' cannot be toggled (not implemented)"
        )
