const express = require('express');
const mongoose = require('mongoose');

// Create Express application
const app = express();

// Configure MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/shoe_store'; // Update with your MongoDB URI
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a Shoe model using Mongoose
const shoeSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
});

const Shoe = mongoose.model('Shoe', shoeSchema);

// Configure Express routes
app.get('/', (req, res) => {
  res.send('Welcome to the Online Shoe Store!');
});

// Route to fetch all shoes
app.get('/shoes', async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new shoe
app.post('/shoes', async (req, res) => {
  const { name, brand, price } = req.body;
  try {
    const shoe = await Shoe.create({ name, brand, price });
    res.status(201).json(shoe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
