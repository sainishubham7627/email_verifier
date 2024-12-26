const connectToMongo = require('./db');  // Import Mongo connection function
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Connect to MongoDB
connectToMongo();

app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/notes', require('./routes/notes')); // Notes routes

// Start the server
app.listen(port, () => {
    console.log(`Noteify backend listening at http://localhost:${port}`);
});
