const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Input Data
  inputMode: {
    type: String,
    enum: ['VOICE', 'TEXT'],
    required: true
  },
  transcript: String,
  symptoms: [String],
  
  // AI Analysis (LLaVA/Gemma Inference)
  aiAnalysis: {
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    urgencyScore: Number,
    riskFactors: [String],
    redFlags: [String],
    possibleCauses: [String],
    summary: String,
    rawResponse: String
  },
  
  // Workflow Status
  status: {
    type: String,
    enum: ['NEW', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED'],
    default: 'NEW'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MODERATE', 'HIGH'],
    default: 'LOW'
  },
  
  // Doctor Review
  doctorNotes: String,
  actionPlan: String, // e.g., "Prescribed antibiotics", "Referred to specialist"
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
caseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Case', caseSchema);
