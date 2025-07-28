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

const COLORS = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
const getColor = (id) => COLORS[id.charCodeAt(0) % COLORS.length];

export default function PresenceProvider({ docId, children }) {
    const [users, setUsers] = useState({});
    const userId = auth.currentUser?.uid || uuidv4();
    const color = getColor(userId);

    useEffect(() => {
        const docRef = doc(db, "documentPresences", docId, "users", userId);
        const unsub = onSnapshot(
            collection(db, "documentPresences", docId, "users"),
            (snapshot) => {
                const data = {};
                snapshot.forEach((doc) => data[doc.id] = doc.data());
                setUsers(data);
            }
        );

        const handleMouseMove = (e) => {
            const presence = {
                name: `User ${userId.slice(0, 4)}`,
                color,
                cursor: { x: e.clientX, y: e.clientY },
                lastActive: Date.now()
            };
            setDoc(docRef, presence, { merge: true });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            deleteDoc(docRef);
            window.removeEventListener("mousemove", handleMouseMove);
            unsub();
        };
    }, [docId, userId]);

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