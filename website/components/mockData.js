export const mockCases = [
  {
    id: 1,
    name: "Marcus Thorne",
    age: 52,
    gender: "Male",
    language: "EN",
    status: "NEW",
    priority: "HIGH",
    source: "App",
    narrative: "Chest pain for 2 days, radiating to left shoulder and neck. Reports increasing shortness of breath.",
    redFlags: ["Radiating chest pain", "Shortness of breath"],
    medicalHistory: "Type 2 Diabetes, Hypertension (managed), Former smoker.",
    metrics: {
      urgencyScore: 88,
      aiConfidence: 94,
      activeTime: "12m",
      prevAppt: "None"
    },
    caseHistory: [
      { date: "2025-11-15", urgency: "MODERATE", outcome: "Physical Visit - Triage completed" },
      { date: "2024-06-20", urgency: "LOW", outcome: "Teleconsult - Self care advice" }
    ],
    appointments: {
      upcoming: [
        { id: 101, date: "2026-01-22", time: "10:00 AM", dept: "Cardiology", status: "CONFIRMED" }
      ],
      past: [
        { id: 98, date: "2025-11-17", dept: "General Medicine", status: "COMPLETED" }
      ]
    },
    reports: [
      { id: 1, title: "ECG Report - Pre-Triage", type: "Imaging", date: "2026-01-19", uploadedBy: "Patient", fileType: "pdf", url: "#" },
      { id: 2, title: "Lab Results - Troponin Level", type: "Lab Report", date: "2026-01-19", uploadedBy: "Clinic", fileType: "pdf", url: "#" }
    ]
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    age: 34,
    gender: "Female",
    language: "ES",
    priority: "MODERATE",
    status: "UNDER REVIEW",
    source: "App",
    narrative: "Persistent migraine with aura; unresponsive to Sumatriptan. Patient reports photophobia and nausea for over 12 hours.",
    redFlags: ["Photophobia", "Nausea"],
    medicalHistory: "Recurrent migraines, mild seasonal allergies.",
    metrics: {
      urgencyScore: 42,
      aiConfidence: 89,
      activeTime: "45m",
      prevAppt: "3 days ago"
    },
    caseHistory: [
      { date: "2026-01-17", urgency: "MODERATE", outcome: "Teleconsult - Medications prescribed" }
    ],
    appointments: {
      upcoming: [],
      past: [
        { id: 95, date: "2026-01-18", dept: "Neurology", status: "COMPLETED" }
      ]
    },
    reports: [
      { id: 3, title: "Brain MRI - Contrast", type: "Imaging", date: "2026-01-17", uploadedBy: "Clinic", fileType: "pdf", url: "#" }
    ]
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    age: 28,
    gender: "Female",
    language: "EN",
    priority: "HIGH",
    status: "ESCALATED",
    source: "Emergency",
    narrative: "Suspected appendicitis; lower right quadrant pain intensified over last 4 hours.",
    redFlags: ["Severe abdominal pain", "Fever"],
    medicalHistory: "No significant history.",
    metrics: {
      urgencyScore: 92,
      aiConfidence: 96,
      activeTime: "8m",
      prevAppt: "None"
    },
    caseHistory: [],
    appointments: { upcoming: [], past: [] },
    reports: []
  },
  {
    id: 4,
    name: "Robert Miller",
    age: 65,
    gender: "Male",
    language: "EN",
    priority: "LOW",
    status: "RESOLVED",
    source: "App",
    narrative: "Chronic lower back pain flare-up; requested medication refill and exercises.",
    redFlags: ["No neuro deficits"],
    medicalHistory: "Chronic LBP, Osteoarthritis.",
    metrics: {
      urgencyScore: 15,
      aiConfidence: 98,
      activeTime: "3h",
      prevAppt: "2 weeks ago"
    },
    caseHistory: [
      { date: "2025-12-10", urgency: "LOW", outcome: "Resolved - Exercises provided" }
    ],
    appointments: { upcoming: [], past: [] },
    reports: [
      { id: 4, title: "Lumbar Spine X-Ray", type: "Imaging", date: "2025-12-10", uploadedBy: "Clinic", fileType: "image", url: "#" },
      { id: 5, title: "Physiotherapy Prescription", type: "Prescription", date: "2025-12-11", uploadedBy: "Clinic", fileType: "pdf", url: "#" }
    ]
  }
];
