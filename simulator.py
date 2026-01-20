import time
import random
import requests
from datetime import datetime

API_URL = "http://localhost:8000/ingest/vitals"

class PatientSimulator:
    def __init__(self, pid):
        self.pid = pid
        # Initial healthy state
        self.heart_rate = random.randint(70, 80)
        self.systolic_bp = random.randint(115, 125)
        self.diastolic_bp = random.randint(75, 80)
        self.sp_o2 = 98
        self.temperature = 37.0
        
        self.trend = "stable" # stable, sepsis, recovery
        self.step_count = 0

    def step(self):
        """
        Evolve patient state based on current trend.
        """
        self.step_count += 1
        
        # Scenario: Start deteriorating after 5 steps
        if self.step_count == 5 and self.pid == "P-001":
            self.trend = "sepsis_onset"
            print(f"[{self.pid}] -> Sepsis Onset Started")

        if self.trend == "sepsis_onset":
            # BP drops, HR rises, Temp rises
            self.systolic_bp -= random.uniform(2, 5) # dropping
            self.heart_rate += random.uniform(1, 3)  # rising
            self.temperature += random.uniform(0.1, 0.3)
            
        elif self.trend == "stable":
            # Random jitter
            self.systolic_bp += random.uniform(-2, 2)
            self.heart_rate += random.uniform(-2, 2)

        # Clamping
        self.systolic_bp = max(60, min(180, self.systolic_bp))
        self.heart_rate = max(40, min(160, self.heart_rate))
        self.sp_o2 = max(80, min(100, self.sp_o2))

        return {
            "patient_id": self.pid,
            "timestamp": datetime.now().isoformat(),
            "heart_rate": int(self.heart_rate),
            "systolic_bp": int(self.systolic_bp),
            "diastolic_bp": int(self.diastolic_bp),
            "sp_o2": int(self.sp_o2),
            "temperature": round(self.temperature, 1),
            "respiratory_rate": 16
        }

def main():
    print(f"Starting Smart Simulator targeting {API_URL}...")
    patients = [PatientSimulator("P-001"), PatientSimulator("P-002")]
    
    while True:
        for p in patients:
            data = p.step()
            try:
                response = requests.post(API_URL, json=data)
                if response.status_code == 200:
                    result = response.json()
                    alert_bit = "!!!" if result["risk_level"] in ["HIGH", "CRITICAL"] else "..."
                    interventions = f" | Need: {', '.join(result['suggested_interventions'])}" if result['suggested_interventions'] else ""
                    
                    print(f"[{p.pid}] {alert_bit} Found Risk: {result['risk_level']} ({result['risk_score']}){interventions}")
                else:
                    print(f"[{p.pid}] Error: {response.text}")
            except Exception as e:
                print(f"[{p.pid}] Connection Error: {e}")
        
        time.sleep(2)

if __name__ == "__main__":
    main()
