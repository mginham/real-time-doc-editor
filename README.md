# real-time-doc-editor

Overview
Collab-Editor is a real-time collaborative editor that allows multiple users to edit a document simultaneously. This project uses Node.js, WebSockets, and React to provide a seamless collaborative experience.

How it Works
The Collab-Editor uses WebSockets to establish a real-time connection between the client and server. When a user makes changes to the document, the changes are broadcasted to all connected clients using WebSockets. The React frontend updates the document in real-time, providing a seamless collaborative experience.

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

Terminal Commands
- npm init -y
- npm install express ws cors
- node server.js
- npx create-react-app client
- npm install socket.io-client
- cd client
- npm start