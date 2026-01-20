const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');

// @desc    Get Appointments (Patient or Doctor)
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        
        if (req.user.role === 'PATIENT') {
            query.patientId = req.user._id;
        } else if (req.user.role === 'DOCTOR') {
            query.doctorId = req.user._id;
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name profilePhoto')
            .populate('doctorId', 'name specialization hospital')
            .sort({ date: 1 }); // Ascending order (soonest first)

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Book a new Appointment
// @route   POST /api/appointments
// @access  Private (Patient)
router.post('/', protect, authorize('PATIENT'), async (req, res) => {
    try {
        const { doctorId, date, time, type, notes } = req.body;

        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            date,
            time,
            type,
            notes,
            status: 'PENDING' // Needs confirmation? Or Auto-confirm for demo
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update Appointment Status
// @route   PATCH /api/appointments/:id
// @access  Private (Doctor)
router.patch('/:id', protect, authorize('DOCTOR'), async (req, res) => {
    try {
        const { status, meetingLink } = req.body;
        
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        // Verify ownership
        if (appointment.doctorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status || appointment.status;
        if (meetingLink) appointment.meetingLink = meetingLink;

        await appointment.save();

        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
