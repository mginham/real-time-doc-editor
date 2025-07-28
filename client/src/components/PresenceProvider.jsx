import React, { useEffect, useState } from "react";
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

const COLORS = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
const getColor = (id) => COLORS[id.charCodeAt(0) % COLORS.length];

export default function PresenceProvider({ docId, children }) {
    // Generate or get stable userId per tab/session
    const getSessionUserId = () => {
        let id = sessionStorage.getItem("sessionUserId");
        if (!id) {
            id = auth.currentUser?.uid || uuidv4();
            sessionStorage.setItem("sessionUserId", id);
        }
        return id;
    };
    const [userId] = useState(getSessionUserId);
    const color = getColor(userId);

    const [users, setUsers] = useState({});

    useEffect(() => {
        // Wait for userID to exist to prevent component from running twice with different userIds
        if (!userId) return;

        const docRef = doc(db, "documentPresences", docId, "users", userId);

        // Subscribe to all users' presence in this doc
        const unsub = onSnapshot(
            collection(db, "documentPresences", docId, "users"),
            (snapshot) => {
                const data = {};
                snapshot.forEach((doc) => data[doc.id] = doc.data());
                setUsers(data);
            }
        );

        // Debounced presence updater
        const updatePresence = debounce((e) => {
            const presence = {
                name: `User ${userId.slice(0, 4)}`,
                color,
                cursor: { x: e.clientX, y: e.clientY },
                lastActive: Date.now(),
            };
            setDoc(docRef, presence, { merge: true });
        }, 100);

        window.addEventListener("mousemove", updatePresence);

        // Cleanup on unmount
        return () => {
            // Ignore errors on delete
            deleteDoc(docRef).catch(() => {});

            window.removeEventListener("mousemove", updatePresence);
            unsub();
            updatePresence.cancel();
        };
    }, [docId, userId, color]);

    return (
        <>
            {children}
            {/* Render presence cursors */}
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

            {/* Sidebar of users */}
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
        </>
    );
}