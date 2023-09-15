const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://leks4bi:UosJngFDdrVqNXLF@cluster0.zsbkxfx.mongodb.net/StageTwoBackend';

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Person Schema
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const Person = mongoose.model('Person', personSchema);

// Routes
app.post('/api', async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!age || typeof age !== 'number') {
      return res.status(400).json({ error: 'Invalid age' });
    }

    const person = new Person({ name, age });
    await person.save();

    return res.status(201).json(person);
  } catch (error) {
    console.error('Error creating person:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/:user_id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.user_id);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    return res.status(200).json(person);
  } catch (error) {
    console.error('Error fetching person:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/:user_id', async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!age || typeof age !== 'number') {
      return res.status(400).json({ error: 'Invalid age' });
    }

    const person = await Person.findByIdAndUpdate(
      req.params.user_id,
      { name, age },
      { new: true }
    );
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    return res.status(200).json(person);
  } catch (error) {
    console.error('Error updating person:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/:user_id', async (req, res) => {
  try {
    const person = await Person.findByIdAndRemove(req.params.user_id);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting person:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});