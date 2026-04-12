"""Prompt Template Management using Jinja2."""
from __future__ import annotations

from typing import Any

from jinja2 import Environment, BaseLoader, StrictUndefined, TemplateError

class PromptLibrary:
    """Manages collection of prompt templates."""
    
    def __init__(self, templates: dict[str, str]) -> None:
        """
        Initialize library with dictionary of templates.
        
        Args:
            templates: Dict mapping template_name -> template_string
        """
        self.templates: dict[str, str] = templates
        self.env: Environment = Environment(
            loader=BaseLoader(),
            undefined=StrictUndefined # Raise error on missing vars
        )
        
    def render(self, template_name: str, **kwargs: Any) -> str:
        """
        Render a template by name with context variables.
        
        Args:
            template_name: Key in the templates dict
            **kwargs: Variables to pass to the template
            
        Returns:
            Rendered string
            
        Raises:
            ValueError: If template not found
            TemplateError: If rendering fails (e.g. missing variables)
        """
        template_str = self.templates.get(template_name)
        if template_str is None:
            raise ValueError(f"Template '{template_name}' not found")
            
        try:
            template = self.env.from_string(template_str)
            return template.render(**kwargs)
        except TemplateError as e:
            raise e
        except Exception as e:
            raise TemplateError(f"Rendering failed: {str(e)}")
