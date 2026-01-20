from datetime import datetime, timedelta
from typing import List
from models import VitalSign, RiskAssessment

def analyze_vitals(vitals: VitalSign, history: List[VitalSign]) -> RiskAssessment:
    """
    Advanced analysis using current vitals AND history for trend detection.
    """
    risk_score = 0.0
    alerts = []
    interventions = []

    # --- 1. CURRENT STATE CHECKS (Standard Early Warning Score - SEWS inspired) ---
    
    # Heart Rate
    if vitals.heart_rate > 110:
        risk_score += 0.3
        alerts.append("Severe Tachycardia")
        interventions.append("Check ECG")
        interventions.append("Assess for pain/distress")
    elif vitals.heart_rate > 100:
        risk_score += 0.1
        alerts.append("Tachycardia")
    elif vitals.heart_rate < 50:
        risk_score += 0.3
        alerts.append("Severe Bradycardia")
        interventions.append("Prepare Atropine if symptomatic")

    # Blood Pressure (Systolic)
    if vitals.systolic_bp < 90:
        risk_score += 0.5
        alerts.append("Hypotension (Septic Shock Risk)")
        interventions.append("Start IV Fluids Bolus")
        interventions.append("Check Lactate")
    elif vitals.systolic_bp > 180:
        risk_score += 0.3
        alerts.append("Hypertensive Crisis")
        interventions.append("Check neurological status")

    # SpO2
    if vitals.sp_o2 < 90:
        risk_score += 0.4
        alerts.append("Critical Hypoxia")
        interventions.append("Start High-flow Oxygen")
    elif vitals.sp_o2 < 94:
        risk_score += 0.1
        alerts.append("Hypoxia")
        interventions.append("Titrate O2 to maintain >94%")

    # --- 2. TREND ANALYSIS (The "Sentinel" Part) ---
    # Look back at last 3 readings (approx 45 mins if every 15 mins)
    
    if len(history) >= 2:
        # Get averages or diffs
        prev = history[-1]
        
        # TREND: Rapid BP Drop (>20 mmHg drop since last reading)
        if (prev.systolic_bp - vitals.systolic_bp) > 20:
            risk_score += 0.3
            alerts.append("Rapid BP Drop Detected")
            interventions.append("Call Senior Doctor immediately")

        # TREND: Climbing Heart Rate (Compensatory mechanism)
        if (vitals.heart_rate - prev.heart_rate) > 15:
            risk_score += 0.2
            alerts.append("Rising Heart Rate (Compensatory Shock?)")

    # --- 3. COMPOSITE SCORING ---
    
    # Calculate final risk level
    if risk_score >= 0.8:
        risk_level = "CRITICAL"
        interventions.append("ACTIVATE RAPID RESPONSE TEAM")
    elif risk_score >= 0.5:
        risk_level = "HIGH"
        interventions.append("Notify Charge Nurse")
    elif risk_score >= 0.2:
        risk_level = "MEDIUM"
        interventions.append("Increase monitoring frequency")
    else:
        risk_level = "LOW"
    
    risk_score = min(risk_score, 1.0)

    if not alerts:
        alerts.append("Stable")

    return RiskAssessment(
        patient_id=vitals.patient_id,
        timestamp=datetime.now(),
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        alert_message=", ".join(alerts),
        suggested_interventions=list(set(interventions)) # Dedup
    )
