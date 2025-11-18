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

// Create a mock Auth object with no-op functions
function createMockAuth(): Auth {
  return {
    currentUser: null,
    onAuthStateChanged: () => () => {}, // Returns unsubscribe function
    onIdTokenChanged: () => () => {},
    signOut: async () => {},
  } as any as Auth
}

// Getter functions that initialize Firebase on first access
function getAuthInstance(): Auth {
  if (typeof window !== 'undefined') {
    initializeFirebase()
    if (!authInstance) {
      // Return mock instead of throwing - allows app to work without Firebase
      return createMockAuth()
    }
    return authInstance
  }
  // During build, return a mock object
  return createMockAuth()
}

function getDbInstance(): Firestore {
  if (typeof window !== 'undefined') {
    initializeFirebase()
    if (!dbInstance) {
      // Return mock instead of throwing - allows app to work without Firebase
      return {} as Firestore
    }
    return dbInstance
  }
  // During build, return a mock object
  return {} as Firestore
}

function getStorageInstance(): FirebaseStorage {
  if (typeof window !== 'undefined') {
    initializeFirebase()
    if (!storageInstance) {
      // Return mock instead of throwing - allows app to work without Firebase
      return {} as FirebaseStorage
    }
    return storageInstance
  }
  // During build, return a mock object
  return {} as FirebaseStorage
}

// Export services using Proxy to make them lazy
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const instance = getAuthInstance()
    const value = (instance as any)[prop]
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  }
})

// Initialize Firebase immediately in browser (not during build)
if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  initializeFirebase()
}

// Helper to get db instance, initializing if needed
function getDbInstance(): Firestore {
  if (typeof window !== 'undefined') {
    if (!dbInstance) {
      initializeFirebase()
    }
    if (!dbInstance) {
      throw new Error('Firestore is not initialized. Please check Firebase environment variables.')
    }
    return dbInstance
  }
  // During build, return empty object
  return {} as Firestore
}

// Helper to get storage instance
function getStorageInstance(): FirebaseStorage {
  if (typeof window !== 'undefined') {
    if (!storageInstance) {
      initializeFirebase()
    }
    if (!storageInstance) {
      throw new Error('Firebase Storage is not initialized. Please check Firebase environment variables.')
    }
    return storageInstance
  }
  // During build, return empty object
  return {} as FirebaseStorage
}

// Export db and storage as the actual instances
// They must be real instances (not Proxies) because they're passed as arguments to Firebase functions
// Initialize immediately in browser if configured
export const db = (typeof window !== 'undefined' && isFirebaseConfigured() && dbInstance) 
  ? dbInstance 
  : ({} as Firestore)

export const storage = (typeof window !== 'undefined' && isFirebaseConfigured() && storageInstance)
  ? storageInstance
  : ({} as FirebaseStorage)

