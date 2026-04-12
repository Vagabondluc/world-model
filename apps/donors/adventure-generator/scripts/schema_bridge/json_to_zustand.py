import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any
from rich.console import Console

console = Console()

SCHEMAS_ROOT = Path("d:/antigravity/dnd adventure generator/docs/schemas")
FRONTEND_STORES_ROOT = Path("d:/antigravity/dnd adventure generator/src/stores")

def clean_name(name: str) -> str:
    return name.replace(" ", "_").replace("-", "_").lower()

def to_pascal_case(name: str) -> str:
    return "".join(word.capitalize() for word in clean_name(name).split("_"))

def generate_store_file(category: str, schema_path: Path):
    try:
        with open(schema_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        meta = data.get('meta', {})
        raw_name = meta.get('name', schema_path.stem)
        base_name = to_pascal_case(raw_name)
        
        # Imports from the generated Zod schemas
        # Assuming we put them in src/schemas/{category_slug}/index.ts
        category_slug = clean_name(category)
        
        lines = [
            "import { create } from 'zustand';",
            f"import {{ {base_name}Config, {base_name}Result }} from '@/schemas/{category_slug}';",
            "",
            f"interface {base_name}State {{",
            f"  input: {base_name}Config;",
            f"  output: {base_name}Result | null;",
            "  isGenerating: boolean;",
            "  error: string | null;",
            "",
            f"  setInput: (input: Partial<{base_name}Config>) => void;",
            "  generate: () => Promise<void>;",
            "  reset: () => void;",
            "}",
            "",
            f"export const use{base_name}Store = create<{base_name}State>((set, get) => ({{",
            "  input: {} as any, // Initial state should ideally be populated with defaults",
            "  output: null,",
            "  isGenerating: false,",
            "  error: null,",
            "",
            f"  setInput: (newInput) => set((state) => ({{ input: {{ ...state.input, ...newInput }} }})),",
            "",
            "  generate: async () => {",
            "    set({ isGenerating: true, error: null });",
            "    try {",
            "       // TODO: Call AI Service with get().input",
            "       console.log('Generating with:', get().input);",
            "       // const result = await aiService.generate(...);",
            "       // set({ output: result, isGenerating: false });",
            "       ",
            "       // Simulate delay for now",
            "       await new Promise(resolve => setTimeout(resolve, 1000));",
            "       set({ isGenerating: false });",
            "    } catch (err: any) {",
            "      set({ error: err.message || 'Generation failed', isGenerating: false });",
            "    }",
            "  },",
            "",
            "  reset: () => set({ output: null, error: null })",
            "}));",
        ]
        
        # Write file
        out_dir = FRONTEND_STORES_ROOT / category_slug
        if not out_dir.exists():
            out_dir.mkdir(parents=True, exist_ok=True)
            
        out_file = out_dir / f"use{base_name}Store.ts"
        
        with open(out_file, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
            
        console.print(f"Generated [bold]{out_file}[/bold]")
        
    except Exception as e:
        console.print(f"[red]Error generating Store for {schema_path}: {e}[/red]")

def main():
    console.print("[bold green]Starting Zustand Generation...[/bold green]")
    
    if not SCHEMAS_ROOT.exists():
        console.print("[red]No schemas found.[/red]")
        return

    categories = set(p.name for p in SCHEMAS_ROOT.iterdir() if p.is_dir())
    
    for cat in categories:
        schemas = list((SCHEMAS_ROOT / cat).glob("*.json"))
        for schema_path in schemas:
            generate_store_file(cat, schema_path)

    console.print("[bold green]Zustand Generation Complete![/bold green]")

if __name__ == "__main__":
    main()
