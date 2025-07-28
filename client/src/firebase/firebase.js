import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyANVq0brezQ32tad9wlFtX87vLyV96k80M",
    authDomain: "mginham-collaborative-editor.firebaseapp.com",
    projectId: "mginham-collaborative-editor",
    storageBucket: "mginham-collaborative-editor.firebasestorage.app",
    messagingSenderId: "517531743691",
    appId: "1:517531743691:web:8da3f84b0f697df72af24e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
signInAnonymously(auth)
    .then(() => {
        console.log('User signed in anonymously');
    })
    .catch((error) => {
        console.error('Error signing in anonymously:', error);
    }); // Simple anonymous auth

export { db, auth };