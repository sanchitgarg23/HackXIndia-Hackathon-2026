from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VitalSign(BaseModel):
    patient_id: str
    timestamp: datetime
    heart_rate: int
    systolic_bp: int
    diastolic_bp: int
    sp_o2: int
    temperature: float
    respiratory_rate: int

    class Config:
        json_schema_extra = {
            "example": {
                "patient_id": "P-101",
                "timestamp": "2024-10-27T10:00:00",
                "heart_rate": 88,
                "systolic_bp": 120,
                "diastolic_bp": 80,
                "sp_o2": 98,
                "temperature": 37.0,
                "respiratory_rate": 16
            }
        }

class Patient(BaseModel):
    id: str
    name: str
    age: int
    condition: Optional[str] = None
    bed_number: str

class RiskAssessment(BaseModel):
    patient_id: str
    timestamp: datetime
    risk_score: float # 0.0 to 1.0
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    alert_message: Optional[str] = None
    suggested_interventions: list[str] = []
