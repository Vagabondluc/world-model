
import sys
from llama_index.core import VectorStoreIndex, Document
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.ollama import OllamaEmbedding

if 'torch' in sys.modules:
    print("Torch IS imported by LlamaIndex/OllamaEmbedding")
else:
    print("Torch is NOT imported by LlamaIndex/OllamaEmbedding")
