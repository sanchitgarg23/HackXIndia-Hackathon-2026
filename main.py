from fastapi import FastAPI, HTTPException
from models import VitalSign, RiskAssessment
from sentinel import analyze_vitals

app = FastAPI(title="Patient Deterioration Sentinel")

@app.get("/")
def read_root():
    return {"status": "Sentinel Active", "model_version": "0.1.0"}

@app.post("/ingest/vitals", response_model=RiskAssessment)
async def ingest_vitals(vitals: VitalSign):
    """
    Ingest stream of vitals, analyze them, and return risk assessment.
    """
    try:
        assessment = analyze_vitals(vitals)
        
        # In a real app, we'd save to DB here
        
        if assessment.risk_level in ["HIGH", "CRITICAL"]:
            print(f"!!! ALERT !!! Patient {assessment.patient_id} is at {assessment.risk_level} risk: {assessment.alert_message}")
            
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
