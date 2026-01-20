const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Case = require('./models/Case');
const HealthRecord = require('./models/HealthRecord');
const Appointment = require('./models/Appointment');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medassist');

// Mock Data
const users = [
  {
    _id: "65a954429d312c1234567890",
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@hospital.com',
    password: 'password123',
    role: 'DOCTOR',
    specialization: 'Emergency Medicine',
    department: 'Emergency',
    hospital: 'General Hospital',
    licenseId: 'MD-2024-8472',
    stats: { casesReviewed: 247, accuracy: 98.5 }
  },
  {
    _id: "65a954429d312c1234567891",
    name: 'Marcus Thorne',
    email: 'marcus@test.com',
    password: 'password123',
    role: 'PATIENT',
    dob: '1972-05-15', // Age 52
    gender: 'Male',
    bloodGroup: 'O+',
    chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: { name: 'Martha Thorne', phone: '555-0101', relationship: 'Wife' },
    settings: { language: 'en' }
  },
  {
    _id: "65a954429d312c1234567892",
    name: 'Elena Rodriguez',
    email: 'elena@test.com',
    password: 'password123',
    role: 'PATIENT',
    dob: '1990-08-22', // Age 34
    gender: 'Female',
    chronicConditions: ['Migraines'],
    settings: { language: 'es' }
  }
];

const cases = [
  {
    patientId: "65a954429d312c1234567891", // Marcus
    inputMode: 'VOICE',
    transcript: "Chest pain for 2 days, radiating to left shoulder and neck. Reports increasing shortness of breath.",
    symptoms: ["Chest pain", "Radiating pain", "Shortness of breath"],
    aiAnalysis: {
      severity: 'high',
      urgencyScore: 88,
      riskFactors: ['Hypertension', 'Age > 50'],
      redFlags: ['Radiating chest pain', 'Shortness of breath'],
      summary: 'Patient reports classic ACS symptoms. High risk.',
      possibleCauses: ['Acute Coronary Syndrome', 'Angina']
    },
    status: 'NEW',
    priority: 'HIGH',
    createdAt: new Date('2026-01-20T10:00:00')
  },
  {
    patientId: "65a954429d312c1234567892", // Elena
    inputMode: 'TEXT',
    transcript: "Persistent migraine with aura; unresponsive to Sumatriptan. Photophobia and nausea for over 12 hours.",
    symptoms: ["Headache", "Photophobia", "Nausea"],
    aiAnalysis: {
      severity: 'medium',
      urgencyScore: 42,
      riskFactors: ['History of migraines'],
      summary: 'Status migrainosus likely. Unresponsive to home meds.',
    },
    status: 'UNDER_REVIEW',
    priority: 'MODERATE',
    createdAt: new Date('2026-01-20T09:30:00')
  }
];

const healthRecords = [
  {
    patientId: "65a954429d312c1234567891", // Marcus
    category: 'VITAL',
    title: 'Blood Pressure',
    date: new Date('2026-01-20T08:00:00'),
    data: { value: '145/92', unit: 'mmHg', trend: 'up' }
  },
  {
    patientId: "65a954429d312c1234567891", // Marcus
    category: 'MEDICATION',
    title: 'Metformin',
    data: { dosage: '500mg', frequency: 'Twice daily', active: true }
  },
  {
    patientId: "65a954429d312c1234567891", // Marcus
    category: 'DOCUMENT',
    title: 'Lab Results - Troponin',
    date: new Date('2026-01-19'),
    data: { fileType: 'pdf', summary: 'Troponin levels elevated' }
  }
];

const appointments = [
    {
        patientId: "65a954429d312c1234567891", // Marcus
        doctorId: "65a954429d312c1234567890", // Sarah
        date: new Date('2026-01-22T10:00:00'),
        time: "10:00 AM",
        type: "CLINIC",
        status: "CONFIRMED",
        location: "Room 302, Cardiology Dept"
    }
];

const importData = async () => {
  try {
    // Clear DB
    await User.deleteMany();
    await Case.deleteMany();
    await HealthRecord.deleteMany();
    await Appointment.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // Create Users with Hashed Passwords manually since insertMany doesn't trigger pre-save hooks
    // We will use a loop to create them properly
    const createdUsers = [];
    for (const user of users) {
        const newUser = new User(user);
        // The password will be hashed by the pre-save hook in the model
        // NO, actually insertMany DOES NOT trigger pre-save.
        // So we should instantiate and save, OR hash manually here.
        // Let's rely on the model logic by creating instances.
        
        // Actually for seeding, let's just hash manually to be safe/fast or use create
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(user.password, salt);
        // We want to keep the specific IDs for relations
        newUser._id = user._id; 
        
        // Mongoose might override _id if we new User(). Let's use direct create but with care
        // Better yet, let's just use the raw object with hashed password
        const userObj = { ...user, password: newUser.password };
        createdUsers.push(userObj);
    }
    
    await User.insertMany(createdUsers);

    await Case.insertMany(cases);
    await HealthRecord.insertMany(healthRecords);
    await Appointment.insertMany(appointments);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
    // destroyData(); // Not implementing destroy separate for now
} else {
    importData();
}
