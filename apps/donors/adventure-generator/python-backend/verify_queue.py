from __future__ import annotations

import time

import requests

BASE_URL: str = "http://localhost:8000"
API_KEY: str = "test-key"  # Adjust if needed

HEADERS: dict[str, str] = {"X-API-Key": API_KEY}

def test_queue() -> None:
    print("🚀 Testing AI Queue System...")

    # 1. Submit Job
    print("\n1. Submitting Job...")
    payload = {
        "type": "generate",
        "priority": 1,
        "payload": {
            "prompt": "Say hello to the queue!",
            "model": "llama3" # Or whatever is valid
        }
    }
    
    try:
        res = requests.post(f"{BASE_URL}/queue/submit", json=payload, headers=HEADERS)
        if res.status_code != 200:
            print(f"❌ Submit Failed: {res.text}")
            return
            
        data = res.json()
        job_id = data["job_id"]
        print(f"✅ Job Submitted: {job_id} (Status: {data['status']})")
        
        # 2. Poll Status
        print("\n2. Polling Status...")
        for _ in range(10):
            res = requests.get(f"{BASE_URL}/queue/status/{job_id}", headers=HEADERS)
            status_data = res.json()
            status = status_data["status"]
            print(f"   - Status: {status}")
            
            if status == "completed":
                print(f"✅ Job Completed! Result: {status_data['result']}")
                break
            elif status == "failed":
                print(f"❌ Job Failed: {status_data['error']}")
                break
            time.sleep(1)
            
    except Exception as e:
        print(f"❌ Test Failed: {e}")

if __name__ == "__main__":
    test_queue()
