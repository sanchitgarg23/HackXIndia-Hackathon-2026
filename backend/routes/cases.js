const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Case = require('../models/Case');
const User = require('../models/User');

// --- PATIENT ROUTES ---

// @desc    Create a new Symptom Check Case
// @route   POST /api/cases
// @access  Private (Patient)
router.post('/', protect, authorize('PATIENT'), async (req, res) => {
    try {
        const { inputMode, transcript, symptoms, aiAnalysis } = req.body;

        const newCase = await Case.create({
            patientId: req.user._id,
            inputMode,
            transcript,
            symptoms,
            aiAnalysis,
            status: 'NEW',
            priority: aiAnalysis?.severity === 'high' || aiAnalysis?.severity === 'critical' ? 'HIGH' : 
                      aiAnalysis?.severity === 'medium' ? 'MODERATE' : 'LOW'
        });

        res.status(201).json(newCase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get My Cases (History)
// @route   GET /api/cases/history
// @access  Private (Patient)
router.get('/history', protect, authorize('PATIENT'), async (req, res) => {
    try {
        const cases = await Case.find({ patientId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- DOCTOR ROUTES ---

// @desc    Get All Cases (Inbox/Triage)
// @route   GET /api/cases/doctor/inbox
// @access  Private (Doctor)
router.get('/doctor/inbox', protect, authorize('DOCTOR'), async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        
        // If search is provided, we need to find patients matching the name first
        if (search) {
            const patients = await User.find({ 
                name: { $regex: search, $options: 'i' },
                role: 'PATIENT'
            }).select('_id');
            
            const patientIds = patients.map(p => p._id);
            query.patientId = { $in: patientIds };
        }

        const cases = await Case.find(query)
            .populate('patientId', 'name email dob gender profilePhoto') // Hydrate patient info
            .sort({ 
                // Sort by priority (High first) and then date (Newest first)
                // However, simple sort:
                createdAt: -1
                // Priority sort is harder in simple Mongo without aggregation or defined order int values
                // We'll sort by date for now, client can sort by priority
            });

        res.json(cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get Single Case Details
// @route   GET /api/cases/:id
// @access  Private (Doctor, or Patient owner)
router.get('/:id', protect, async (req, res) => {
    try {
        const kase = await Case.findById(req.params.id)
            .populate('patientId', 'name email dob gender bloodGroup allergies chronicConditions profilePhoto')
            .populate('doctorId', 'name department');

        if (!kase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Authorization check
        if (req.user.role === 'PATIENT' && kase.patientId._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(kase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update Case (Review/Triage)
// @route   PATCH /api/cases/:id/review
// @access  Private (Doctor)
router.patch('/:id/review', protect, authorize('DOCTOR'), async (req, res) => {
    try {
        const { status, priority, doctorNotes, actionPlan } = req.body;

        const kase = await Case.findById(req.params.id);

        if (!kase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        kase.status = status || kase.status;
        kase.priority = priority || kase.priority;
        kase.doctorNotes = doctorNotes || kase.doctorNotes;
        kase.actionPlan = actionPlan || kase.actionPlan;
        kase.doctorId = req.user._id; // Assign to current doctor

        await kase.save();

        res.json(kase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
