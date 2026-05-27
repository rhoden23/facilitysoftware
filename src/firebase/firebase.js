
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    query,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp, // Import Timestamp
    where, // Import where for querying
    orderBy, // Import orderBy for querying
    limit // Import limit for querying
} from 'firebase/firestore';

// --- Global Firebase Variables (provided by the environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'rcfe-multi-facility-app';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, collection, onSnapshot, addDoc, serverTimestamp, query, doc, updateDoc, deleteDoc, Timestamp, where, orderBy, limit, signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut, appId };
