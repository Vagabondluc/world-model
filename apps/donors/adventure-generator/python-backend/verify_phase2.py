from __future__ import annotations

import json

import requests
import sseclient

BASE_URL: str = "http://127.0.0.1:8000"
API_KEY: str = "test-key"

def test_public() -> None:
    print("Testing Public /health...")
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code == 200:
            print("PASS: /health is accessible")
        else:
            print(f"FAIL: /health returned {r.status_code}")
    except Exception as e:
        print(f"FAIL: /health connection error: {e}")

def test_auth_rejection() -> None:
    print("\nTesting Auth Rejection...")
    try:
        r = requests.post(f"{BASE_URL}/llm/generate", json={"prompt": "hi"})
        if r.status_code == 403:
            print("PASS: Request without key rejected (403)")
        else:
            print(f"FAIL: Request without key returned {r.status_code}")
    except Exception as e:
        print(f"FAIL: Connection error: {e}")

def test_auth_success() -> None:
    print("\nTesting Auth Success...")
    headers = {"X-API-Key": API_KEY}
    try:
        # Simple generation check
        r = requests.post(
            f"{BASE_URL}/llm/generate", 
            json={"prompt": "Say 'Auth Works'"}, 
            headers=headers
        )
        if r.status_code == 200:
            print(f"PASS: Request with key accepted. Response: {r.json().get('response')}[...]")
        else:
            print(f"FAIL: Request with key returned {r.status_code} - {r.text}")
    except Exception as e:
        print(f"FAIL: Connection error: {e}")

def test_streaming() -> None:
    print("\nTesting Streaming...")
    headers = {"X-API-Key": API_KEY}
    url = f"{BASE_URL}/llm/generate/stream"
    
    try:
        r = requests.post(url, json={"prompt": "Count to 5"}, headers=headers, stream=True)
        if r.status_code == 200:
            print("PASS: Stream connected.")
            print("Chunks received:")
            count = 0
            for line in r.iter_lines():
                if line:
                    decoded = line.decode('utf-8')
                    print(f"Chunk: {decoded}")
                    count += 1
                    if count >= 3: break # Just proof of concept
            print(f"\nSuccessfully read {count} chunks.")
        else:
            print(f"FAIL: Stream endpoint returned {r.status_code} - {r.text}")
    except Exception as e:
        print(f"FAIL: Stream connection error: {e}")

if __name__ == "__main__":
    test_public()
    test_auth_rejection()
    test_auth_success()
    test_streaming()
