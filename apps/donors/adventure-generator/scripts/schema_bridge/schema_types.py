from typing import List, Optional, Union, Literal, Dict, Any
from pydantic import BaseModel, Field

# --- Type Definitions ---

class FieldSchema(BaseModel):
    """
    Describes a single field in a schema (input or output).
    Recursive to support nested objects.
    """
    name: str = Field(..., description="The key/variable name used in code (snake_case preferred).")
    type: Literal["string", "integer", "float", "boolean", "list", "object", "enum"] = Field(..., description="The data type.")
    label: Optional[str] = Field(None, description="Human-readable label for UI.")
    description: Optional[str] = Field(None, description="Detailed description/tooltip.")
    default: Optional[Any] = Field(None, description="Default value if not provided.")
    
    # For 'list' types: schema of the items in the list
    item_schema: Optional["FieldSchema"] = Field(None, description="If type is list, describes the schema of items.")
    
    # For 'object' types: fields inside the object
    fields: Optional[List["FieldSchema"]] = Field(None, description="If type is object, describes its internal fields.")
    
    # For 'enum' types: allowed values
    options: Optional[List[str]] = Field(None, description="If type is enum, list of allowed string values.")

class NarrativeSchema(BaseModel):
    """
    The root schema definition for a single Narrative Tool.
    Saved as {script_name}.json
    """
    meta: Dict[str, str] = Field(..., description="Metadata: name, category, description, version.")
    
    inputs: List[FieldSchema] = Field(default_factory=list, description="User configuration fields (UI inputs).")
    outputs: List[FieldSchema] = Field(default_factory=list, description="Generated content structure (LLM outputs).")

# Resolve forward references for recursive models
FieldSchema.model_rebuild()
