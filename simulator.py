import time
import random
import requests
from datetime import datetime

API_URL = "http://localhost:8000/ingest/vitals"

def generate_vitals(patient_id: str):
    """
    Generates plausible vital signs with occasional deterioration.
    """
    # Base values
    heart_rate = random.randint(60, 100)
    systolic_bp = random.randint(110, 130)
    diastolic_bp = random.randint(70, 85)
    sp_o2 = random.randint(95, 100)
    temperature = round(random.uniform(36.5, 37.5), 1)
    
    # Simulate deterioration event (10% chance)
    if random.random() < 0.1:
        scenario = random.choice(["sepsis", "hypoxia", "tachycardia"])
        if scenario == "sepsis":
            # hypotension + fever + tachycardia
            systolic_bp = random.randint(70, 90)
            temperature = round(random.uniform(38.0, 40.0), 1)
            heart_rate = random.randint(100, 130)
        elif scenario == "hypoxia":
            sp_o2 = random.randint(85, 92)
        elif scenario == "tachycardia":
            heart_rate = random.randint(110, 140)

    return {
        "patient_id": patient_id,
        "timestamp": datetime.now().isoformat(),
        "heart_rate": heart_rate,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "sp_o2": sp_o2,
        "temperature": temperature,
        "respiratory_rate": random.randint(12, 20)
    }

def main():
    print(f"Starting Vital Signs Simulator targeting {API_URL}...")
    patient_ids = ["P-001", "P-002", "P-003"]
    
    while True:
        for pid in patient_ids:
            data = generate_vitals(pid)
            try:
                response = requests.post(API_URL, json=data)
                if response.status_code == 200:
                    result = response.json()
                    print(f"[{pid}] Sent Vitals -> Risk: {result['risk_level']} ({result['risk_score']}) | Alert: {result['alert_message']}")
                else:
                    print(f"[{pid}] Error: {response.text}")
            except Exception as e:
                print(f"[{pid}] Connection Error: {e}")
        
        time.sleep(2)

if __name__ == "__main__":
    main()
