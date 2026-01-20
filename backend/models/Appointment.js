const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date, // The actual date of the appointment
    required: true
  },
  time: {
    type: String, // String representation e.g. "10:00 AM" for display
    required: true
  },
  type: {
    type: String,
    enum: ['TELECONSULT', 'CLINIC'],
    default: 'TELECONSULT'
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING'],
    default: 'CONFIRMED'
  },
  meetingLink: String, // For teleconsult
  location: String,    // For clinic visit
  
  notes: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
