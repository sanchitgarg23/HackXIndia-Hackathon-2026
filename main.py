from fastapi import FastAPI, HTTPException
from typing import Dict, List
from typing import Dict, List
from models import VitalSign, RiskAssessment
from sentinel import analyze_vitals
from notifications import send_alert

app = FastAPI(title="Patient Deterioration Sentinel")

# In-Memory Storage
# { "P-001": [VitalSign, VitalSign...] }
patient_history: Dict[str, List[VitalSign]] = {}
# { "P-001": RiskAssessment }
latest_risk_state: Dict[str, RiskAssessment] = {}

MAX_HISTORY_LEN = 50 # Keep last 50 readings

@app.get("/")
def read_root():
    return {"status": "Sentinel Active", "model_version": "0.2.0-enhanced"}

@app.post("/ingest/vitals", response_model=RiskAssessment)
async def ingest_vitals(vitals: VitalSign):
    """
    Ingest vitals, store history, analyze for trends, and return risk.
    """
    try:
        pid = vitals.patient_id
        
        # Initialize if not exists
        if pid not in patient_history:
            patient_history[pid] = []
            
        # Get history (copy to avoid mutation issues during analysis if async)
        history = patient_history[pid]
        
        # Analyze
        assessment = analyze_vitals(vitals, history)
        
        # Update State
        patient_history[pid].append(vitals)
        if len(patient_history[pid]) > MAX_HISTORY_LEN:
            patient_history[pid].pop(0) # Remove oldest
            
        latest_risk_state[pid] = assessment
        
        # In a real app, we'd save to DB here
        
        if assessment.risk_level in ["HIGH", "CRITICAL"]:
            print(f"!!! ALERT !!! Patient {pid} is at {assessment.risk_level} risk: {assessment.alert_message}")
            if assessment.suggested_interventions:
                 print(f"    --> SUGGESTED: {', '.join(assessment.suggested_interventions)}")
            
            # Send Notification
            send_alert(
                patient_id=pid,
                risk_level=assessment.risk_level,
                message=assessment.alert_message,
                interventions=assessment.suggested_interventions
            )
            
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patients/{patient_id}/status", response_model=RiskAssessment)
async def get_patient_status(patient_id: str):
    """
    Get the latest risk assessment for a patient.
    """
    if patient_id not in latest_risk_state:
         raise HTTPException(status_code=404, detail="Patient Not Found or No Data Ingested")
    return latest_risk_state[patient_id]

@app.get("/dashboard/overview")
async def dashboard_overview():
    """
    Return status of all monitored patients.
    """
    return latest_risk_state
