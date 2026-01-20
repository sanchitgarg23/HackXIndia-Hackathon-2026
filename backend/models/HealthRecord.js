const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['VITAL', 'DIAGNOSIS', 'MEDICATION', 'DOCUMENT'],
    required: true
  },
  
  // Common Metadata
  title: {
    type: String,
    required: true // e.g., "Blood Pressure", "Migraine", "Amlodipine"
  },
  date: {
    type: Date,
    default: Date.now
  },
  
  // Flexible Payload based on category
  // Stored as a mixed object to allow flexibility
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Examples of 'data' structure per category:
  // VITAL:      { value: "120/80", unit: "mmHg", trend: "stable" }
  // DIAGNOSIS:  { severity: "medium", status: "active", notes: "..." }
  // MEDICATION: { dosage: "5mg", freq: "Daily", active: true, endDate: "..." }
  // DOCUMENT:   { fileUrl: "...", type: "Lab Report", summary: "..." }
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
