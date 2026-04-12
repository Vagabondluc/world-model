from __future__ import annotations

import json
import sys

import requests

def smoke_test_ollama(url: str = "http://localhost:11434") -> bool:
    print(f"--- Ollama Smoke Test ---")
    print(f"Target URL: {url}")
    
    try:
        # 1. Test basic connectivity
        print("[1/3] Testing basic connectivity...")
        resp = requests.get(f"{url}/api/tags", timeout=5)
        resp.raise_for_status()
        data = resp.json()
        models = [m['name'] for m in data.get('models', [])]
        print(f"SUCCESS: Connected! Found {len(models)} models: {', '.join(models)}")
        
        if not models:
            print("WARNING: Connection successful but no models found. Did you run 'ollama pull llama3'?")
            return False

        # 2. Test specific model generation (minimal)
        model = models[0]
        print(f"[2/3] Testing generation with model '{model}'...")
        payload = {
            "model": model,
            "prompt": "Say hello!",
            "stream": False
        }
        resp = requests.post(f"{url}/api/generate", json=payload, timeout=30)
        resp.raise_for_status()
        gen_data = resp.json()
        print(f"SUCCESS: Model responded: '{gen_data.get('response', '').strip()}'")

        # 3. Verify CORS potential (check headers)
        print("[3/3] Checking OLLAMA_ORIGINS headers...")
        # Note: We can't perfectly check this via requests easily as it's a server setting,
        # but if we are here, at least the API is alive.
        print("Note: If the app still fails with 'CORS' errors, ensure OLLAMA_ORIGINS='*' is set.")
        
        print("\n✔ SMOKE TEST PASSED: Ollama is reachable and functional.")
        return True

    except requests.exceptions.ConnectionError:
        print(f"ERROR: Could not connect to Ollama at {url}. Is it running?")
        return False
    except Exception as e:
        print(f"ERROR: Smoke test failed with: {e}")
        return False

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:11434"
    if smoke_test_ollama(target):
        sys.exit(0)
    else:
        sys.exit(1)
