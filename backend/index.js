const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
const path = require("path");

connectToMongo();
const app = express();
const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/auth', require('./routes/verifyEmail')); // ✅ Add this line for email verification

app.listen(port, () => {
  console.log(`Noteify backend listening on http://localhost:${port}`);
});
