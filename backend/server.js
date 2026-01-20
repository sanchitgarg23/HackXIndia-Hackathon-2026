const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
require('colors');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'MedAssist API is running' });
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
// app.use('/api/documents', require('./routes/documents')); 
// Note: documents are also handled inside patients.js for patient-centric view, 
// but we might want a separate file if generic. For now, let's keep the structure simple.
// Since we used /api/patients/documents in the plan, that's covered.
// Let's comment out documents route if file doesn't exist to avoid crash
// app.use('/api/documents', require('./routes/documents')); 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.yellow.bold);
});
