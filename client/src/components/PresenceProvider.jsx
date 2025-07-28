import React, { useEffect, useState, createContext, useContext } from "react";
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

const PresenceContext = createContext(); // Create a context to share presence data throughout the app

// Define a set of colors to visually differentiate users
const COLORS = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
const getColor = (id) => COLORS[id.charCodeAt(0) % COLORS.length]; // Deterministic color assignment based on user ID

export const PresenceProvider = ({ docId, children }) => {
    // Get or generate a session-scoped user ID
    const getSessionUserId = () => {
        let id = sessionStorage.getItem("sessionUserId");
        if (!id) {
            id = auth.currentUser?.uid || uuidv4(); // Use auth UID if available, else random
            sessionStorage.setItem("sessionUserId", id);
        }
        return id;
    };
    const [userId] = useState(getSessionUserId); // Persist one userId for the session
    const color = getColor(userId); // Assign a consistent color based on userId

    const [users, setUsers] = useState({}); // State to track all active users in the document

    useEffect(() => {
        if (!userId) return; // Wait for userID to exist to prevent component from running twice with different userIds

        const docRef = doc(db, "documentPresences", docId, "users", userId); // Reference to the current user's presence doc
        const presenceColRef = collection(db, "documentPresences", docId, "users"); // Reference to the current user's presence collection

        // Listen for changes in the presence collection
        const unsub = onSnapshot(presenceColRef, (snapshot) => {
            const now = Date.now();
            const freshUsers = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                const lastActive = data.lastActive?.toMillis?.() || data.lastActive || 0; // Convert Firestore timestamp to millis if needed
                
                // Only include users active in the last 10 seconds
                if (now - lastActive < 10000) {
                    freshUsers[doc.id] = data;
                }
            });
            setUsers(freshUsers); // Update local state with all active users
        });

        // Sends regular heartbeats to signal user is still present
        const sendHeartbeat = () => {
            setDoc(docRef, {
                name: `User ${userId.slice(0, 4)}`,
                color,
                lastActive: serverTimestamp(), // Server-generated timestamp
            }, { merge: true }); // Merge with existing doc
        };
        sendHeartbeat(); // Initial heartbeat

        const heartbeatInterval = setInterval(sendHeartbeat, 5000); // Repeat every 5 sec

        // Debounced function to update user's cursor position
        const updateCursor = debounce((e) => {
            setDoc(docRef, {
                cursor: { x: e.clientX, y: e.clientY },
            }, { merge: true });
        }, 100);

        window.addEventListener("mousemove", updateCursor); // Track mouse movement

        // On tab close or reload, attempt to remove the presence document
        const handleUnload = async () => {
            try {
                await deleteDoc(docRef);
            } catch (err) {
                console.warn("Failed to delete presence on unload:", err);
            }
        };

        window.addEventListener("beforeunload", handleUnload);

        // Cleanup on unmount
        return () => {
            clearInterval(heartbeatInterval); // Stop heartbeat loop
            updateCursor.cancel(); // Cancel debounce
            window.removeEventListener("mousemove", updateCursor);
            window.removeEventListener("beforeunload", handleUnload);
            handleUnload(); // Try one last cleanup
            unsub(); // Unsubscribe from Firestore
        };
    }, [docId, userId, color]);

    return (
        <PresenceContext.Provider value={{ userId, users, color }}>
            {children}

            {/* Render presence cursors for other users */}
            {Object.entries(users).map(([id, data]) =>
                id !== userId ? (
                    <div
                        key={id}
                        style={{
                            position: "absolute",
                            left: data.cursor?.x,
                            top: data.cursor?.y,
                            backgroundColor: data.color,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.75rem",
                            pointerEvents: "none",
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        {data.name}
                    </div>
                ) : null
            )}

            {/* Fixed-position sidebar listing all active users */}
            <div style={{
                position: "fixed",
                top: 10,
                right: 10,
                backgroundColor: "#eee",
                padding: "8px",
                borderRadius: "6px",
                boxShadow: "0 0 4px rgba(0,0,0,0.2)"
            }}>
                <strong>Active Users</strong>
                {Object.values(users).map(user => (
                    <div key={user.name} style={{ color: user.color }}>
                        • {user.name}
                    </div>
                ))}
            </div>
        </PresenceContext.Provider>
    );
};

// Custom hook to access presence data from any child component
export const usePresence = () => useContext(PresenceContext);