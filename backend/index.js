const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Import HTTP module
const { WebSocketServer } = require('ws'); // Import WebSocket module

connectToMongo();
const app = express();
const port = 5000;

// Create an HTTP server and attach WebSocket to it
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));

app.use(cors());
app.use(express.json());

// WebSocket logic
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Server received: ${message}`); // Echo message back to client
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Start the server with WebSocket
server.listen(port, () => {
  console.log(`Noteify backend listening at http://localhost:${port}`);
});
