import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any, Set
from rich.console import Console

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from schema_bridge.schema_types import NarrativeSchema, FieldSchema
except ImportError:
    pass # Runtime usage does not strict require the types if we just process JSON

console = Console()

SCHEMAS_ROOT = Path("d:/antigravity/dnd adventure generator/docs/schemas")
BACKEND_MODELS_ROOT = Path("d:/antigravity/dnd adventure generator/python-backend/models")

TYPE_MAPPING = {
    "string": "str",
    "integer": "int",
    "float": "float",
    "boolean": "bool",
    "object": "Dict[str, Any]", # Fallback if nested schema missing
    "list": "List"
}

def clean_name(name: str) -> str:
    """Sanitizes names for usage as python identifiers."""
    return name.replace(" ", "_").replace("-", "_").lower()

def to_class_name(name: str) -> str:
    """Converts snake_case/kebab-case to PascalCase."""
    return "".join(word.capitalize() for word in clean_name(name).split("_"))

def generate_field_definition(field: Dict[str, Any], nested_models: List[str]) -> str:
    fname = clean_name(field['name'])
    ftype = field['type']
    opts = field.get('options')
    
    python_type = TYPE_MAPPING.get(ftype, "Any")
    
    # Handle Enums
    if ftype == 'enum' and opts:
        # For simplicity in this v1, using Literal
        options_str = ", ".join(f'"{o}"' for o in opts)
        python_type = f"Literal[{options_str}]"
        
    # Handle Lists
    elif ftype == 'list':
        item_schema = field.get('item_schema')
        if item_schema:
            item_type_str, _ = generate_nested_model(item_schema, nested_models, parent_name=fname)
            python_type = f"List[{item_type_str}]"
        else:
            python_type = "List[Any]"
            
    # Handle Objects (Nested)
    elif ftype == 'object':
        fields = field.get('fields')
        if fields:
            model_name, _ = generate_nested_model(field, nested_models, parent_name=fname)
            python_type = model_name
        else:
            python_type = "Dict[str, Any]"

    # Handle Optional/Default
    default = field.get('default')
    desc = field.get('description', '')
    
    field_code = f"    {fname}: {python_type}"
    
    if default is not None:
        if isinstance(default, str):
            field_code += f" = Field('{default}', description='{desc}')"
        else:
            field_code += f" = Field({default}, description='{desc}')"
    else:
        # Require field but allow description
        field_code += f" = Field(..., description='{desc}')"
        
    return field_code

def generate_nested_model(schema: Dict[str, Any], nested_models: List[str], parent_name: str) -> tuple[str, str]:
    """
    Generates a nested Pydantic model and returns (ClassName, CodeString).
    Adds the code string to the nested_models list list to be printed before the main class.
    """
    class_name = to_class_name(parent_name + "_item")
    
    # Check if we are defining a list item or an object
    fields = schema.get('fields', [])
    
    # Special case: The schema might be describing the item itself which might be just a primitive
    # But usually 'item_schema' is an object with fields if it's complex.
    # If item_schema is just type: string, we don't need a model.
    if schema.get('type') != 'object' and not fields:
        # Primitive list
        return TYPE_MAPPING.get(schema.get('type'), 'Any'), ""

    code = [f"class {class_name}(BaseModel):"]
    for f in fields:
        code.append(generate_field_definition(f, nested_models))
    
    if not fields:
        code.append("    pass")
        
    nested_models.append("\n".join(code))
    return class_name, ""

def generate_model_file(category: str, schemas: List[Path]):
    lines = [
        "from typing import List, Optional, Dict, Any, Literal",
        "from pydantic import BaseModel, Field",
        "",
    ]
    
    for schema_path in schemas:
        try:
            with open(schema_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            meta = data.get('meta', {})
            name = meta.get('name', schema_path.stem)
            class_name = to_class_name(name)
            
            # Use 'inputs' as the main model fields for the REQUEST
            # and 'outputs' for the RESPONSE model?
            # Or simplified: The schema describes the DATA OBJECT. 
            # Usually narrative scripts produce an object.
            
            # Let's generate a Request Model (configuration) and a Response Model (narrative content)
            
            # 1. Configuration Model
            config_class = f"{class_name}Config"
            lines.append(f"class {config_class}(BaseModel):")
            inputs = data.get('inputs', [])
            nested_models = []
            
            field_lines = []
            for field in inputs:
                field_lines.append(generate_field_definition(field, nested_models))
                
            # Print nested models first
            lines.extend(nested_models)
            if not inputs:
                lines.append("    pass")
            else:
                lines.extend(field_lines)
            lines.append("")

            # 2. Output Model
            output_class = f"{class_name}Result"
            lines.append(f"class {output_class}(BaseModel):")
            outputs = data.get('outputs', [])
            nested_models_out = []
            
            field_lines_out = []
            for field in outputs:
                field_lines_out.append(generate_field_definition(field, nested_models_out))
                
            lines.extend(nested_models_out)
            if not outputs:
                lines.append("    pass")
            else:
                lines.extend(field_lines_out)
            lines.append("")
            
        except Exception as e:
            console.print(f"[red]Error generating model for {schema_path}: {e}[/red]")
            lines.append(f"# Error generating {schema_path}: {e}")

    # Write file
    if not BACKEND_MODELS_ROOT.exists():
        BACKEND_MODELS_ROOT.mkdir(parents=True, exist_ok=True)
        # Add __init__.py
        (BACKEND_MODELS_ROOT / "__init__.py").touch()
        
    out_file = BACKEND_MODELS_ROOT / f"{clean_name(category)}.py"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    
    console.print(f"Generated [bold]{out_file}[/bold]")

def main():
    console.print("[bold green]Starting Pydantic Generation...[/bold green]")
    
    if not SCHEMAS_ROOT.exists():
        console.print("[red]No schemas found. Run extraction first.[/red]")
        return

    # Group by Category
    categories = set(p.name for p in SCHEMAS_ROOT.iterdir() if p.is_dir())
    
    for cat in categories:
        schemas = list((SCHEMAS_ROOT / cat).glob("*.json"))
        if schemas:
            generate_model_file(cat, schemas)

    console.print("[bold green]Pydantic Generation Complete![/bold green]")

if __name__ == "__main__":
    main()
