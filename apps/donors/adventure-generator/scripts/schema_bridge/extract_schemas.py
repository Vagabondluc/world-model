import json
import os
import sys
import argparse
from pathlib import Path
from typing import Dict, Any, Optional
from rich.console import Console
from rich.progress import track

# Add parent directory to path to import schema_types
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from schema_bridge.schema_types import NarrativeSchema
    import instructor
    from pydantic import BaseModel
    import openai
except ImportError as e:
    print(f"Error importing dependencies: {e}")
    print("Please ensure you are running this from the python-backend environment with requirements installed.")
    sys.exit(1)

console = Console()

# Configuration
DOCS_ROOT = Path("d:/antigravity/dnd adventure generator/docs")
MANIFEST_PATH = DOCS_ROOT / "Narrative Scripts/manifest.json"
SCHEMAS_ROOT = DOCS_ROOT / "schemas"
STITCH_PROMPTS_ROOT = DOCS_ROOT / "Narrative Scripts/mockups/stitch_prompts"
RAW_SCRIPTS_ROOT = DOCS_ROOT / "Narrative Scripts"

def load_manifest() -> Dict[str, Any]:
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def find_source_content(category: str, script_name: str, script_path: Optional[Path] = None) -> str:
    """
    Tries to find the best source content for schema extraction.
    Priority:
    1. Stitch Prompt (mockups/stitch_prompts/{Category}/{script_name}.txt)
    2. Raw Script (Narrative Scripts/{script_path})
    """
    # 1. Try Stitch Prompt
    stitch_path = STITCH_PROMPTS_ROOT / category / f"{script_name}.txt"
    if stitch_path.exists():
        return stitch_path.read_text(encoding="utf-8")
    
    # 2. Try Raw Script path from manifest
    if script_path:
        raw_path = RAW_SCRIPTS_ROOT / script_path
        if raw_path.exists():
            return raw_path.read_text(encoding="utf-8")

    return ""

def extract_schema_with_llm(
    content: str,
    script_name: str,
    category: str,
    mock: bool = False,
    base_url: str = "http://localhost:11434/v1",
    api_key: str = "ollama",
    model: str = "llama3"
) -> NarrativeSchema:
    if mock:
        # Return a dummy schema for testing
        return NarrativeSchema(
            meta={
                "name": script_name,
                "category": category,
                "description": f"Mock extracted schema for {script_name}"
            },
            inputs=[
                {"name": "title", "type": "string", "label": "Title", "description": "The title of the encounter"},
                {"name": "level", "type": "integer", "default": 1, "label": "Party Level"}
            ],
            outputs=[
                {"name": "description", "type": "string", "description": "Sensory description"}
            ]
        )

    if not content.strip():
        raise ValueError("Source content is empty; cannot extract schema.")

    system_prompt = (
        "You are a schema extraction engine. "
        "Return a JSON object that strictly matches the NarrativeSchema model. "
        "Use snake_case field names, concise labels, and clear descriptions. "
        "Infer reasonable inputs and outputs from the script content."
    )

    user_prompt = f"""Extract a NarrativeSchema for the following script.

Script Name: {script_name}
Category: {category}

--- Script Content Start ---
{content}
--- Script Content End ---
"""

    client = instructor.from_openai(
        openai.OpenAI(base_url=base_url, api_key=api_key),
        mode=instructor.Mode.JSON,
    )

    return client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_model=NarrativeSchema,
    )

def main():
    parser = argparse.ArgumentParser(description="Extract schemas from Narrative Scripts")
    parser.add_argument("--dry-run", action="store_true", help="Don't write files")
    parser.add_argument("--mock", action="store_true", help="Use mock LLM responses")
    parser.add_argument("--category", type=str, help="Only process a specific category")
    parser.add_argument("--base-url", type=str, default=os.getenv("SCHEMA_EXTRACT_BASE_URL", "http://localhost:11434/v1"))
    parser.add_argument("--api-key", type=str, default=os.getenv("SCHEMA_EXTRACT_API_KEY", "ollama"))
    parser.add_argument("--model", type=str, default=os.getenv("SCHEMA_EXTRACT_MODEL", "llama3"))
    args = parser.parse_args()

    console.print("[bold green]Starting Schema Extraction...[/bold green]")

    if args.dry_run and not args.mock:
        console.print("[yellow]Dry-run enabled: forcing mock mode to avoid live LLM calls.[/yellow]")
        args.mock = True
    
    manifest = load_manifest()
    
    # Ensure schema root exists
    if not args.dry_run:
        SCHEMAS_ROOT.mkdir(exist_ok=True)

    # Traverse Manifest
    # The manifest structure is: Execution_Systems -> {Category} -> [List of paths]
    execution_systems = manifest.get("Execution_Systems", {})
    
    for category, scripts in execution_systems.items():
        if args.category and category.lower() != args.category.lower():
            continue
            
        console.print(f"Processing Category: [bold]{category}[/bold]")
        
        # Create category dir
        category_dir = SCHEMAS_ROOT / category
        if not args.dry_run:
            category_dir.mkdir(exist_ok=True)
            
        for script_path in track(scripts, description=f"Extracting {category}..."):
            # script_path is relative like "Execution_Systems/Encounters/EncounterDesign_v1.txt"
            p = Path(script_path)
            script_name = p.stem # EncounterDesign_v1
            
            # Find content
            # We need to correctly map the manifest path to the stitch prompt path if possible
            # For now, we'll try to resolve it relative to the root or use the find logic
            
            # Extract
            try:
                content = find_source_content(category, script_name, p)
                # If we can't find content (maybe path mismatch), skip or log
                
                schema = extract_schema_with_llm(
                    content,
                    script_name,
                    category,
                    mock=args.mock,
                    base_url=args.base_url,
                    api_key=args.api_key,
                    model=args.model
                )
                
                # Save
                output_path = category_dir / f"{script_name}.json"
                if not args.dry_run:
                    with open(output_path, "w", encoding="utf-8") as f:
                        f.write(schema.model_dump_json(indent=2))
                        
            except Exception as e:
                console.print(f"[red]Failed to proccess {script_name}: {e}[/red]")

    console.print("[bold green]Done![/bold green]")

if __name__ == "__main__":
    main()
