1. System philosophy (this guides all implementation)

Primary Goal:
Convert unstructured patient complaints into structured, clinically useful intelligence before a doctor sees the patient.

Secondary Goal:
Reduce friction in care escalation (teleconsult → clinic → hospital).

Explicitly NOT goals:

Diagnosis

Prescription

Treatment recommendation

Antigravity should treat these as hard constraints.

2. Locked Tech Stack (judge-safe, modern, realistic)
Client

Mobile App: React Native (Expo if speed matters)

Web Portal: Next.js (App Router)

Backend

API Layer: Node.js + Fastify

Database: PostgreSQL

ORM: Prisma

Auth: Clerk (or Auth0)

Realtime (optional): WebSockets for doctor queue updates

AI / ML

On-device model: MedGemma (quantized)

Inference: Local device runtime (Android-first)

Rules Engine: Custom clinical rule layer (Node)

Infra

Cloud: GCP or AWS

Storage: Encrypted object storage (summaries only)

Deployment: Dockerized services

This stack signals production thinking.

3. Core Intelligence Pipeline (shared backbone)

This pipeline is the actual product.

Step 1: Symptom Capture

Voice / text

Multilingual

Guided prompts (not free chat)

Step 2: On-device Medical Reasoning (MedGemma)

Outputs:

Normalized symptoms

Duration & severity

Risk factors

Confidence gaps

Red-flag signals

Step 3: Clinical Structuring

Convert model output into:

Timeline

SOAP-like structure (Subjective only)

Severity buckets

Urgency score (low / medium / high)

Step 4: Escalation Logic

Rules decide:

Self-care info

Teleconsult

Physical visit

Emergency escalation

Step 5: Output Adapters

Patient-facing explanation

Doctor-facing summary

Appointment booking trigger

This pipeline feeds both apps.

FOCUS 1: MOBILE APP (Patient-side)

This is your signal acquisition layer.

Target Users

Patients

ASHA workers

Nurses / PHC staff

Mobile App — Core Modules
1. Onboarding & Consent

Language selection

Privacy explanation (simple)

Consent for data usage & sharing

Judges like explicit consent flows.

2. Symptom Intake Engine (Most Important)

UI Philosophy:
Feels like a calm medical assistant, not a chatbot.

Input Modes

Voice-first (default)

Text fallback

Simple yes/no follow-ups

Intelligence Behavior

Ask only medically relevant questions

Stop early if confidence is high

Ask more if ambiguity remains

MedGemma is active here, not later.

3. On-device Processing

MedGemma runs locally

No raw audio/text uploaded

Only structured output stored

This is a major differentiator — emphasize it.

4. Patient Feedback Screen

Patient sees:

“Based on what you shared…”

Urgency level (color-coded)

Recommended next step

Clear disclaimer

No disease names unless extremely generic (e.g. “respiratory symptoms”).

5. Escalation Actions

Depending on severity:

Teleconsult option

Clinic visit recommendation

Hospital escalation

Appointment booking CTA

The app does not choose a hospital emotionally — it follows logic.

6. History & Follow-up

Previous visits

Symptom timeline

Doctor notes (read-only)

FOCUS 2: WEB PORTAL (Doctor / System-side)

This is your signal consumption & decision surface.

Judges will spend more time here mentally than on the app.

Web Portal — Core Modules
1. Doctor Authentication & Role Management

Doctor

Nurse

Admin

Clinic operator

2. Patient Queue Dashboard

Each patient card shows:

Urgency level

Key symptoms

Time waiting

Risk flags

Doctors instantly prioritize.

3. AI-Generated Clinical Summary (Hero Feature)

This is the money slide.

Structure:

Chief complaint

Symptom timeline

Risk factors

Red flags

AI confidence gaps (“needs clarification”)

Doctors can:

Accept

Edit

Add notes

This positions AI as an assistant, not authority.

4. Consultation Workspace

Patient history

Previous summaries

Doctor notes

Decision logging

Optional for hackathon, but shows depth.

5. Care Routing & Disposition

Doctor selects:

Teleconsult completed

Physical visit required

Referral to hospital

Emergency escalation

This feeds back into the system.

6. Admin / Analytics Panel (Lightweight)

Case volumes

Escalation rates

Average consultation time

Judges love seeing “we thought about scale”.

Appointment Booking & Escalation Flow

This must feel inevitable, not flashy.

Trigger Conditions

High-risk flags

Doctor confirmation

Rule-based thresholds

Booking Logic

Location-aware

Partner hospitals / clinics

Time slot availability (mocked if needed)

Output

Appointment confirmation

Directions

Pre-filled clinical summary shared

This closes the loop.

Implementation Roadmap (Antigravity-friendly)
Phase 1: Core Intelligence (Highest Priority)

Symptom intake flow

MedGemma integration

Structured output

Rule engine

Phase 2: Mobile App MVP

Onboarding

Intake

Feedback

Escalation CTA

Phase 3: Web Portal MVP

Doctor dashboard

AI summaries

Queue management

Phase 4: Appointment & Polish

Booking flow

History

Analytics

Demo data

This is realistic for a national hackathon.

Why this plan works

Clear separation of concerns

MedGemma used correctly

Mobile and web both essential, not decorative

Strong system narrative

Feels deployable, not hypothetical