import argparse
import sys
import os
from rich.console import Console

# Import the generators
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from schema_bridge import json_to_pydantic
from schema_bridge import json_to_zod
from schema_bridge import json_to_zustand

console = Console()

def main():
    parser = argparse.ArgumentParser(description="Generate code from Narrative Schemas")
    parser.add_argument("--all", action="store_true", help="Generate all (Backend, Frontend, Store)")
    parser.add_argument("--backend", action="store_true", help="Generate Pydantic models")
    parser.add_argument("--frontend", action="store_true", help="Generate Zod schemas")
    parser.add_argument("--store", action="store_true", help="Generate Zustand stores")
    
    args = parser.parse_args()
    
    if not any([args.all, args.backend, args.frontend, args.store]):
        # Default to all if nothing specified
        args.all = True

    console.print("[bold blue]Starting Narrative Code Generation...[/bold blue]")

    if args.all or args.backend:
        console.rule("[bold]Generating Backend (Pydantic)[/bold]")
        json_to_pydantic.main()
        
    if args.all or args.frontend:
        console.rule("[bold]Generating Frontend (Zod)[/bold]")
        json_to_zod.main()
        
    if args.all or args.store:
        console.rule("[bold]Generating State (Zustand)[/bold]")
        json_to_zustand.main()

    console.print("[bold green]All Generation Tasks Complete![/bold green]")

if __name__ == "__main__":
    main()
