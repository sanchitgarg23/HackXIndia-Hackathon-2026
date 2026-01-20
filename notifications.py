import logging
from datetime import datetime

# Setup a specific logger for the pager
pager_logger = logging.getLogger("pager")
pager_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler("pager.log")
formatter = logging.Formatter('%(asctime)s - %(message)s')
file_handler.setFormatter(formatter)
pager_logger.addHandler(file_handler)

def send_alert(patient_id: str, risk_level: str, message: str, interventions: list[str]):
    """
    Simulates sending an emergency alert to the appropriate staff.
    """
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    # 1. Determine Recipient
    recipient = "NURSE STATION"
    priority = "NORMAL"
    
    if risk_level == "CRITICAL":
        recipient = "ON-CALL DOCTOR + RAPID RESPONSE TEAM"
        priority = "URGENT"
    elif risk_level == "HIGH":
        recipient = "CHARGE NURSE"
        priority = "HIGH"
        
    # 2. Format Message
    alert_text = (
        f"[{priority}] To: {recipient} | "
        f"Patient: {patient_id} | "
        f"Risk: {risk_level} | "
        f"Msg: {message} | "
        f"Actions: {', '.join(interventions)}"
    )
    
    # 3. "Send" (Log to file and Print)
    pager_logger.info(alert_text)
    
    # Also print to console so user sees it actively
    print(f"\n>>>>> 📟 PAGING ALERT SENT 📟 <<<<<")
    print(f"To: {recipient}")
    print(f"Message: {message}")
    print(f"Recommended Actions: {', '.join(interventions)}")
    print(">>>>> ------------------------- <<<<<\n")
