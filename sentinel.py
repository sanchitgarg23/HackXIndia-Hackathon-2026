from datetime import datetime
from models import VitalSign, RiskAssessment

def analyze_vitals(vitals: VitalSign) -> RiskAssessment:
    """
    Basic heuristic analysis of vitals to determine risk score.
    In a real system, this would use a loaded ML model.
    """
    risk_score = 0.0
    alerts = []

    # 1. Heart Rate Checks
    if vitals.heart_rate > 100:
        risk_score += 0.2
        alerts.append("Tachycardia detected")
    elif vitals.heart_rate < 60:
        risk_score += 0.2
        alerts.append("Bradycardia detected")

    # 2. Blood Pressure Checks (Systolic)
    if vitals.systolic_bp < 90:
        risk_score += 0.4
        alerts.append("Hypotension (Septic Shock Risk)")
    elif vitals.systolic_bp > 160:
        risk_score += 0.2
        alerts.append("Severe Hypertension")

    # 3. SpO2 Checks
    if vitals.sp_o2 < 92:
        risk_score += 0.3
        alerts.append("Hypoxia detected")

    # Calculate final risk level
    if risk_score >= 0.7:
        risk_level = "CRITICAL"
    elif risk_score >= 0.4:
        risk_level = "HIGH"
    elif risk_score >= 0.2:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
    
    # Cap score at 1.0
    risk_score = min(risk_score, 1.0)

    return RiskAssessment(
        patient_id=vitals.patient_id,
        timestamp=datetime.now(),
        risk_score=risk_score,
        risk_level=risk_level,
        alert_message=", ".join(alerts) if alerts else "Stable"
    )
