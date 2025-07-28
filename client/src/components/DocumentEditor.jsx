import React from "react";
import { usePresence } from "../components/PresenceProvider";

export default function DocumentEditor() {
    const { users, userId, color } = usePresence();

    return (
        <div
            style={{ 
                padding: "10px 40px",
                textAlign: "left" 
            }}
        >
            <h1>Welcome, User {userId.slice(0, 4)}</h1>
            <p>Your color: <span style={{ color }}>{color}</span></p>
        </div>
    );
}