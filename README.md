# real-time-doc-editor

## Overview

This project is a real-time collaborative text editor that allows multiple users to edit a shared document simultaneously. It features live document synchronization via WebSocket, visual indicators for each user's presence, and automatic cleanup of inactive sessions using Firebase. Built with React, Firebase, and a Node.js + WebSocket backend, the editor delivers a smooth, Google Docs–like experience—lightweight, extensible, and ideal for small teams or personal tools.


## How it Works

The editor uses WebSockets for live text synchronization and Firebase Firestore for user presence tracking.

- Real-time editing: A Node.js WebSocket server holds the authoritative version of the shared document in memory. As users type, changes are sent to the server and broadcasted to all connected clients instantly.
- User presence tracking: Each user gets a unique session ID and color. Their online status is tracked in Firestore with a periodic heartbeat that ensures they are marked as active.
- Live cursor tracking: User cursors are tracked and displayed on screen, allowing users to see where others are working in the document.
- Session cleanup: When a user closes the tab or goes inactive, their presence is automatically removed from the document's Firestore record.

This hybrid architecture enables scalable, responsive collaboration without a full backend database for the document itself.


## Features

- Real-time collaborative text editing
- Multi-user presence detection
- User-specific color indicators and labels
- Live pointer tracking
- Session-based user IDs for anonymous editing
- Auto-cleanup of users on disconnect
- Awareness sidebar showing active users
- Runs locally or can be deployed to the cloud


## Technologies Used

- React - Interactive frontend UI
- Firebase (Firestore) - User presence & cursor tracking
- Node.js + WebSocket - Server-based synchronization layer
- Lodash - Utility functions (e.g., debounce)
- UUID - Anonymous user session IDs


## Dependencies

- firebase
- lodash
- uuid
- express
- ws
- cors


## Architecture Diagram

<pre lang="text"><code> ```text +-------------------+ WebSocket +------------------+ | React Client | <------------------> | Node.js Server | | (Frontend in Vite)| | (WebSocket) | +-------------------+ +------------------+ | | | Firebase SDK | v v +------------------+ +------------------+ | Firebase | <------------------ | Firestore Sync | | (Firestore DB) | +------------------+ +------------------+ ``` </code></pre>

Responsibilities:
- React Client: UI, text editing, local user state
- Node WebSocket Server: Real-time sync of shared document
- Firebase Firestore: Presence, cursor tracking, and auto-cleanup


## Installation and Setup

1. Clone the repository
2. Install frontend dependencies
```
    cd client
    npm install
```
3. Install backend dependencies
```
    cd ../server
    npm install
```
4. Start the WebSocket server
```
    node server.js
```
5. Start the React frontend
```
    cd ../client
    npm run dev
```
6. Set up Firebase
    - Create a new project in Firestore
    - Replace the Firebase config in client/src/firebase.js


## Potential Features to be Added:

- Live sidebar chat
- Version History & Time Travel
- Commenting & Reviews (Allow commenting on selected text regions; support threaded discussion and emoji reactions)
- Formatting & Rich Content (Support rich text: bold, italic, lists, headings, images, tables; Image insertion via drag‑and‑drop or upload)
- Export & Import Options (Allow exporting to common formats: .docx, .pdf, .txt, .html; Import existing .docx or Markdown and convert for collaborative editing)
- Authentication & Permissions (User accounts, roles (admin/editor/viewer), and document sharing; Document access control: private/public, invite links, password‑protected docs)
- Mobile-Friendly & Responsive UI (Ensure the editor is usable on mobile and tablet – touch-friendly UI, adaptive layout)