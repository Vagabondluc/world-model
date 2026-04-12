
import sys
import chromadb
if 'torch' in sys.modules:
    print("Torch IS imported by ChromaDB")
else:
    print("Torch is NOT imported by ChromaDB")
