import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any
from rich.console import Console

console = Console()

SCHEMAS_ROOT = Path("d:/antigravity/dnd adventure generator/docs/schemas")
FRONTEND_SCHEMAS_ROOT = Path("d:/antigravity/dnd adventure generator/src/schemas")

# Mappings (Type -> Zod)
TYPE_MAPPING = {
    "string": "z.string()",
    "integer": "z.number().int()",
    "float": "z.number()",
    "boolean": "z.boolean()",
    "object": "z.record(z.string(), z.any())", # Fallback
    "list": "z.array"
}

def clean_name(name: str) -> str:
    return name.replace(" ", "_").replace("-", "_").lower()

def to_pascal_case(name: str) -> str:
    return "".join(word.capitalize() for word in clean_name(name).split("_"))

def generate_zod_field(field: Dict[str, Any], indent: int = 2) -> str:
    fname = clean_name(field['name'])
    ftype = field['type']
    base_indent = " " * indent
    
    zod_def = TYPE_MAPPING.get(ftype, "z.any()")
    
    if ftype == 'enum' and field.get('options'):
        opts = field['options']
        # z.enum(['a', 'b'])
        opts_str = ", ".join(f"'{o}'" for o in opts)
        zod_def = f"z.enum([{opts_str}])"
        
    elif ftype == 'list':
        item_schema = field.get('item_schema')
        if item_schema:
            item_def = generate_zod_schema_inline(item_schema, indent)
            zod_def = f"z.array({item_def})"
        else:
            zod_def = "z.array(z.any())"
            
    elif ftype == 'object':
        fields = field.get('fields')
        if fields:
            zod_def = generate_zod_object(fields, indent)
            
    # Modifiers
    default = field.get('default')
    desc = field.get('description')
    
    # Check if optional (if default is None AND it's not strictly required in our logic?)
    # For now, let's assume everything is required unless it has a default, or we can make .optional() default
    
    chain = zod_def
    if default is not None:
        if isinstance(default, str):
            chain += f".default('{default}')"
        else:
            chain += f".default({str(default).lower()})" # python bool True -> true
    else:
        # If no default, is it optional? "Optional" isn't a type in our schema yet, assume required
        pass
        
    if desc:
        chain += f".describe('{desc}')"
        
    return f"{base_indent}{fname}: {chain},"

def generate_zod_schema_inline(field_schema: Dict[str, Any], indent: int) -> str:
    """Generates a schema definition for a list item (singular), not a key:value pair."""
    ftype = field_schema.get('type', 'any')
    
    if ftype == 'object' and field_schema.get('fields'):
         return generate_zod_object(field_schema['fields'], indent)
    elif ftype == 'string':
         return "z.string()"
    # ... basic types ...
    return "z.any()"

def generate_zod_object(fields: List[Dict[str, Any]], indent: int) -> str:
    # z.object({ ... })
    lines = ["z.object({"]
    for f in fields:
        lines.append(generate_zod_field(f, indent + 2))
    lines.append(" " * indent + "})")
    return "\n".join(lines)


def generate_ts_file(category: str, schemas: List[Path]):
    # Note: Zod allows multiple exports per file easily
    
    lines = [
        "import { z } from 'zod';",
        "",
    ]
    
    for schema_path in schemas:
        try:
            with open(schema_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            meta = data.get('meta', {})
            base_name = to_pascal_case(meta.get('name', schema_path.stem))
            
            # Request Schema (Inputs)
            config_name = f"{base_name}Config"
            inputs = data.get('inputs', [])
            
            lines.append(f"export const {config_name}Schema = {generate_zod_object(inputs, 0)};")
            lines.append(f"export type {config_name} = z.infer<typeof {config_name}Schema>;")
            lines.append("")
            
            # Response Schema (Outputs)
            result_name = f"{base_name}Result"
            outputs = data.get('outputs', [])
            
            lines.append(f"export const {result_name}Schema = {generate_zod_object(outputs, 0)};")
            lines.append(f"export type {result_name} = z.infer<typeof {result_name}Schema>;")
            lines.append("")
            
        except Exception as e:
            console.print(f"[red]Error generating Zod for {schema_path}: {e}[/red]")
            lines.append(f"// Error: {e}")

    # Write file
    out_dir = FRONTEND_SCHEMAS_ROOT / clean_name(category)
    if not out_dir.exists():
        out_dir.mkdir(parents=True, exist_ok=True)
        
    # We could put them all in index.ts or separate files. 
    # Let's put them in index.ts for the category for now to minimize file count
    out_file = out_dir / "index.ts"
    
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        
    console.print(f"Generated [bold]{out_file}[/bold]")

def main():
    console.print("[bold green]Starting Zod Generation...[/bold green]")
    
    if not SCHEMAS_ROOT.exists():
        console.print("[red]No schemas found.[/red]")
        return

    categories = set(p.name for p in SCHEMAS_ROOT.iterdir() if p.is_dir())
    
    for cat in categories:
        schemas = list((SCHEMAS_ROOT / cat).glob("*.json"))
        if schemas:
            generate_ts_file(cat, schemas)

    console.print("[bold green]Zod Generation Complete![/bold green]")

if __name__ == "__main__":
    main()
