// Firebase initialization with safe guards for missing env
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let auth = null
let db = null
let storage = null
let googleProvider = null
let firebaseReady = false

try {
  const required = ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_AUTH_DOMAIN','VITE_FIREBASE_PROJECT_ID','VITE_FIREBASE_APP_ID']
  const missing = required.filter((k) => !import.meta.env[k])
  if (missing.length === 0) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    googleProvider = new GoogleAuthProvider()
    firebaseReady = true
  } else {
    console.warn('Firebase env missing:', missing.join(', '))
  }
} catch (e) {
  console.error('Firebase init failed', e)
}

export { app, auth, db, storage, googleProvider, firebaseReady }
