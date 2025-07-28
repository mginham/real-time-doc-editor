// Import necessary modules
import React, { useState, useEffect } from 'react';
import './App.css';
import PresenceProvider from './components/PresenceProvider';

function App() {
    // String to store the current content of the text document
    const [document, setDocument] = useState("");
    // WebSocket instance to handle the WebSocket connection
    const [socket, setSocket] = useState(null);

    // Set up WebSocket connection
    // - This hook will run once when the component mounts
    // - This hook will clean up when the component ummounts
    useEffect(() => {
        // Create a new WebSocket connection to the server
        const newSocket = new WebSocket('ws://localhost:5000');
        // Set the socket state
        setSocket(newSocket);

        // Event listener for when a new connection is established
        newSocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        // Event listener for handling incoming messages to the server
        newSocket.onmessage = (event) => {
            try {
                // Convert the JSON string back into a Javascript object
                const message = JSON.parse(event.data);

                // Verify that the message is indeed an new connection
                if (message.type === 'init') {
                    setDocument(message.data);
                // Verify that the message is indeed an update
                } else if (message.type === 'update') {
                    setDocument(message.data);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        // Handle closed connection
        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Handle error
        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Clean up WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, []);

    // Function to send updates to the server
    const handleChange = (e) => {
        const newDocument = e.target.value;
        setDocument(newDocument);

        // Ensure input is NOT empty and WebSocket connection is open
        if (socket && socket.readyState === WebSocket.OPEN) {
            // Convert the current state of the document to JSON format and send to the connected client
            socket.send(JSON.stringify({ type: 'update', data: newDocument }));
        }
    };

    // Render the editor interface
    return (
        <PresenceProvider docId="demo-doc">
            <div className="App">
                <h1>Real-time Collaborative Editor</h1>
                <textarea
                    value={document}
                    onChange={handleChange}
                    rows="20"
                    cols="80"
                />
            </div>
        </PresenceProvider>
    );
}

export default App;