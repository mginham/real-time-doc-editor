// Import necessary modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

// Express app
const app = express();

// Middleware to handle cross-origin requests (cors)
app.use(cors());

// HTTP Server to handle HTTP and WebSocket connections
const server = http.createServer(app);

// WebSocket Server
// - passed in HTTP server so that it listens on the same port
const wss = new WebSocket.Server({server})

// Variable to store text document content 
let document = ""

// Event listener for new client connections to the WebSocket server
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Convert the current state of the document to JSON format and send to the new client
    ws.send(JSON.stringify({ type: 'init', data: document }));

    // Event listener for new changes to the document
    ws.on('message', (message) => {
        try {
            // Convert the JSON string back into a Javascript object
            const parsedMessage = JSON.parse(message);

            // Verify that the change is indeed an update
            if (parsedMessage.type === 'update') {
                // Update the document on the server-side copy
                document = parsedMessage.data;

                // Broadcast the update to all connected clients
                wss.clients.forEach((client) => {
                    // Ensure client is still connected
                    if (client.readyState === WebSocket.OPEN) {
                        // Convert the current state of the document to JSON format and send to the connected client
                        client.send(JSON.stringify({ type: 'update', data: document }));
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server on the specified port
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});