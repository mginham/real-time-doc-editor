import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function LandingPage() {
    const navigate = useNavigate();

    const createNewDoc = () => {
        const newDocId = uuidv4();
        navigate(`/edit/${newDocId}`);
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
        </div>
    );
}