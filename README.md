# real-time-doc-editor

Overview
This editor is a real-time collaborative editor that allows multiple users to edit a text document simultaneously. This project uses Node.js, WebSockets, and React to provide a seamless collaborative experience.

How it Works
This editor uses WebSockets to establish a real-time connection between the client and server. When a user makes changes to the document, the changes are broadcasted to all connected clients using WebSockets. The React frontend updates the document in real-time, providing a seamless collaborative experience.

Features
- Real-time collaborative editing
- Runs locally on your machine
- Supports multiple users

Technologies Used
- Node.js
- WebSocket
- React

Dependencies
- express
- ws
- cors

Terminal Commands to Set Up Project
- Initialize a new Node.js project
    npm init -y
- Install backend dependencies
    npm install express ws cors
- Create a new React app
    npx create-react-app client
- Instal libraries
    npm install socket.io-client
- Start the server in the project root
    node server.js
- Navigate to the client directory in order to start the React app
    cd client
- Start the React app
    npm start