import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
  return !!(apiKey && projectId && apiKey.length > 0 && projectId.length > 0 && !apiKey.includes('placeholder') && !projectId.includes('placeholder'))
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Initialize Firebase lazily - only if configured
let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null
let storageInstance: FirebaseStorage | null = null

function initializeFirebase() {
  if (app) return // Already initialized
  
  if (!isFirebaseConfigured()) {
    // Don't initialize if not configured - this prevents build errors
    return
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    authInstance = getAuth(app)
    dbInstance = getFirestore(app)
    storageInstance = getStorage(app)
  } catch (error) {
    // Silently handle errors during build - they'll be caught at runtime
    if (typeof window !== 'undefined') {
      console.warn('Firebase initialization error:', error)
    }
  }
}

// Export services - they will be initialized on first use in browser
// During build, if not configured, these will be null but we cast to the expected type
export const auth = (() => {
  // Only initialize in browser, and only if configured
  if (typeof window !== 'undefined' && isFirebaseConfigured()) {
    initializeFirebase()
  }
  return authInstance as unknown as Auth
})() as Auth

export const db = (() => {
  // Only initialize in browser, and only if configured
  if (typeof window !== 'undefined' && isFirebaseConfigured()) {
    initializeFirebase()
  }
  return dbInstance as unknown as Firestore
})() as Firestore

export const storage = (() => {
  // Only initialize in browser, and only if configured
  if (typeof window !== 'undefined' && isFirebaseConfigured()) {
    initializeFirebase()
  }
  return storageInstance as unknown as FirebaseStorage
})() as FirebaseStorage

