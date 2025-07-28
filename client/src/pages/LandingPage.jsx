import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function LandingPage() {
    const navigate = useNavigate();
    const [joinDocId, setJoinDocId] = useState(""); // State to hold the user-entered document ID

    // Create a new document with a unique ID and navigate to the editor
    const createNewDoc = () => {
        const newDocId = uuidv4(); // Generate a UUID
        navigate(`/edit/${newDocId}`); // Redirect to the editor route
    };

    // Join an existing document using the provided document ID
    const joinExistingDoc = () => {
        const trimmed = joinDocId.trim(); // Trim whitespace
        if (trimmed) {
            navigate(`/edit/${trimmed}`); // Redirect to the editor route with the provided ID
        }
    };

    return (
        <div style={{ padding: 40, textAlign: "center" }}>
            <h1>Welcome to Real-time Doc Editor</h1>
            <button
                onClick={createNewDoc}
                style={{
                    marginTop: 20,
                    padding: "12px 24px",
                    fontSize: 18,
                    cursor: "pointer",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "white",
                }}
            >
                Create New Document
            </button>
            <div style={{ marginTop: 40 }}>
                <input
                    type="text"
                    placeholder="Enter Document ID"
                    value={joinDocId}
                    onChange={(e) => setJoinDocId(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: 16,
                        width: 300,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginRight: 10,
                    }}
                />
                <button
                    onClick={joinExistingDoc}
                    style={{
                        padding: "10px 20px",
                        fontSize: 16,
                        cursor: "pointer",
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: "#2196F3",
                        color: "white",
                    }}
                >
                    Join Document
                </button>
            </div>
        </div>
    );
}