require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📍 Database:', mongoURI.includes('mongodb+srv') ? 'Atlas (Production)' : 'Local (Development)');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  if (mongoURI.includes('localhost')) {
    console.log('💡 Make sure MongoDB is running locally');
  } else {
    console.log('💡 Check your MongoDB Atlas connection string');
  }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    console.log('📧 Contact saved:', { name, email, subject, timestamp: new Date().toISOString() });
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Route to view contacts (for testing)
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(20);
    res.json({
      total: await Contact.countDocuments(),
      contacts: contacts
    });
  } catch (err) {
    console.error('❌ Error fetching contacts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 View contacts: http://localhost:${PORT}/contacts`);
});