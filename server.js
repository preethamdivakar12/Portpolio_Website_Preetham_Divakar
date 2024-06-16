const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portpolio', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the schema and model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

// Route to handle form submission
app.post('/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
      res.status(201).send('Contact information saved successfully');
    } catch (err) {
      console.error('Error saving contact information:', err);
      res.status(500).send('Server error');
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
