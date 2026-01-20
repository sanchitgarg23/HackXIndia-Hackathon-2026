const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Case = require('../models/Case');
const HealthRecord = require('../models/HealthRecord');
const Appointment = require('../models/Appointment');

// @desc    Get Patient Dashboard Data (Health Score, Recent Vitals, Active Conditions)
// @route   GET /api/patients/dashboard
// @access  Private (Patient only)
router.get('/dashboard', protect, authorize('PATIENT'), async (req, res) => {
    try {
        const patientId = req.user._id;

        // 1. Get Health Score (Mock logic for now, or calc from vitals)
        // In a real app, this would be a complex algo.
        // For now, let's fetch the latest 'Health Score' record or default to 85
        // We didn't seed a 'Health Score' record type, so we can mock or fetch
        const healthScore = 85; 

        // 2. Get Recent Vitals (Last 4 distinct types)
        // This is a bit complex in Mongo aggregation, simplified here:
        const recentVitals = await HealthRecord.find({ 
            patientId, 
            category: 'VITAL' 
        })
        .sort({ date: -1 })
        .limit(10); 
        
        // Dedup by title in JS for simplicity
        const uniqueVitals = [];
        const seenVitals = new Set();
        for(let v of recentVitals) {
            if(!seenVitals.has(v.title)) {
                uniqueVitals.push(v);
                seenVitals.add(v.title);
            }
            if(uniqueVitals.length >= 4) break;
        }

        // 3. Get Active Conditions (from User Profile)
        const user = await User.findById(patientId);
        const activeConditions = user.chronicConditions || [];

        // 4. Get Active Medications
        const activeMeds = await HealthRecord.find({
            patientId,
            category: 'MEDICATION',
            'data.active': true
        });

        // 5. Recent Diagnoses (Resolved/Active)
        const recentDiagnoses = await HealthRecord.find({
            patientId,
            category: 'DIAGNOSIS'
        }).sort({ date: -1 }).limit(5);

        res.json({
            healthScore,
            vitals: uniqueVitals,
            activeConditions,
            medications: activeMeds,
            recentDiagnoses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get Patient Health Records (All types)
// @route   GET /api/patients/records
// @access  Private (Patient)
router.get('/records', protect, authorize('PATIENT'), async (req, res) => {
    try {
        const { category } = req.query;
        let query = { patientId: req.user._id };
        
        if(category) {
            query.category = category.toUpperCase();
        }

        const records = await HealthRecord.find(query).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Upload a new Document (creates a HealthRecord)
// @route   POST /api/patients/documents
// @access  Private (Patient)
// Note: Actual file upload handling (multer) would go here. 
// For Hackathon, we might just store the metadata + mock URL or base64.
router.post('/documents', protect, authorize('PATIENT'), async (req, res) => {
    try {
        const { title, type, summary, fileUrl } = req.body;

        const newDoc = await HealthRecord.create({
            patientId: req.user._id,
            category: 'DOCUMENT',
            title,
            data: {
                type,
                summary,
                fileUrl: fileUrl || 'https://via.placeholder.com/150', // Mock if not provided
                fileType: 'pdf' // Default
            }
        });

        res.status(201).json(newDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get Patient Profile by ID (Doctor Access)
// @route   GET /api/patients/:id
// @access  Private (Doctor)
router.get('/:id', protect, authorize('DOCTOR'), async (req, res) => {
    try {
        const patient = await User.findById(req.params.id).select('-password');
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Also fetch recent cases for this patient
        const cases = await Case.find({ patientId: req.params.id }).sort({ createdAt: -1 });

        // Fetch health records
        const records = await HealthRecord.find({ patientId: req.params.id }).sort({ date: -1 });

        // Construct full profile response
        const profile = {
            ...patient.toObject(),
            cases,
            records
        };

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
