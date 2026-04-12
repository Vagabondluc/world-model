from __future__ import annotations

import pytest
from jinja2.exceptions import TemplateError

def test_template_rendering() -> None:
    """Verify PromptLibrary renders Jinja2 templates correctly."""
    from core.prompts import PromptLibrary
    
    # Initialize with simple templates
    templates = {
        "greeting": "Hello {{ name }}!"
    }
    lib = PromptLibrary(templates)
    
    result = lib.render("greeting", name="World")
    assert result == "Hello World!"

def test_missing_template() -> None:
    """Verify error when template not found."""
    from core.prompts import PromptLibrary
    lib = PromptLibrary({})
    
    with pytest.raises(ValueError, match="Template 'unknown' not found"):
        lib.render("unknown")

def test_missing_variables() -> None:
    """Verify behavior with undefined variables (strict vs loose)."""
    # By default Jinja2 returns empty string for undefined.
    # But for prompts, we often want strict validation.
    from core.prompts import PromptLibrary
    
    templates = {"strict": "Value: {{ required }}"}
    lib = PromptLibrary(templates)
    
    # If we configure Jinja env with undefined=StrictUndefined, this raises
    # Implementation decision: Let's default to strict for prompts to catch bugs.
    with pytest.raises(TemplateError):
        lib.render("strict")
