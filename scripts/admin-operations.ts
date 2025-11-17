/**
 * Admin Operations - Core Code
 * 
 * Firebase Firestore doesn't use SQL - it's a NoSQL database.
 * Here are the operations you need to run.
 * 
 * Run this with: npx tsx scripts/admin-operations.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL || ''

// New admin info
const newAdminEmail = 'vedrshah09@gmail.com'
const newAdminPassword = 'mercedes4Cursor!'
const newAdminName = 'Ved Shah'

async function main() {
  // Initialize Firebase Admin
  let app
  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert({
        projectId: firebaseProjectId,
        privateKey: firebasePrivateKey,
        clientEmail: firebaseClientEmail,
      }),
    })
  } else {
    app = getApps()[0]
  }

  const auth = getAuth(app)
  const db = getFirestore(app)

  // ============================================
  // OPERATION 1: DELETE ALL EXISTING ADMINS
  // ============================================
  console.log('Deleting all existing admins...')
  
  // Get all admins from Firestore
  const adminsSnapshot = await db.collection('admins').get()
  
  // Delete each admin document
  for (const adminDoc of adminsSnapshot.docs) {
    const adminId = adminDoc.id
    const adminData = adminDoc.data()
    
    // Delete from Firestore
    await db.collection('admins').doc(adminId).delete()
    console.log(`Deleted admin from Firestore: ${adminData.email || adminId}`)
    
    // Delete Firebase Auth account (if exists)
    try {
      await auth.deleteUser(adminId)
      console.log(`Deleted Firebase Auth account: ${adminData.email || adminId}`)
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        console.error(`Error deleting auth account: ${error.message}`)
      }
    }
  }

  // ============================================
  // OPERATION 2: CREATE NEW ADMIN
  // ============================================
  console.log('\nCreating new admin...')
  
  let newAdminUid: string
  
  // Check if email already exists in Firebase Auth
  try {
    const existingUser = await auth.getUserByEmail(newAdminEmail)
    newAdminUid = existingUser.uid
    console.log(`Email exists, updating password...`)
    
    // Update existing user
    await auth.updateUser(newAdminUid, {
      password: newAdminPassword,
      emailVerified: true,
    })
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      // Create new user
      const newUser = await auth.createUser({
        email: newAdminEmail,
        password: newAdminPassword,
        emailVerified: true,
      })
      newAdminUid = newUser.uid
      console.log(`Created new Firebase Auth account`)
    } else {
      throw error
    }
  }

  // Add to Firestore admins collection
  await db.collection('admins').doc(newAdminUid).set({
    email: newAdminEmail,
    name: newAdminName,
    role: 'admin',
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  })
  
  console.log(`✅ Admin created successfully!`)
  console.log(`   Email: ${newAdminEmail}`)
  console.log(`   UID: ${newAdminUid}`)
}

main().catch(console.error)

