import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import './index.css';
import LandingPage from "./pages/LandingPage";
import App from './App';
import { PresenceProvider } from './components/PresenceProvider';
import reportWebVitals from './reportWebVitals';

// Wrap App with PresenceProvider and pass docId from route
function AppWithPresence() {
    const { docId } = useParams();
    return (
        <PresenceProvider docId={docId}>
            <App />
        </PresenceProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
                path="/edit/:docId" 
                element={<AppWithPresence />}
            />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
