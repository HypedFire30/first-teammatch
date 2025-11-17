/**
 * Admin Management Script
 * 
 * This script manages admin accounts in Firebase:
 * - Removes all existing admins
 * - Creates a new admin account
 * 
 * Prerequisites:
 * 1. Firebase Admin credentials must be set in .env.local
 * 
 * Usage:
 * npx tsx scripts/manage-admins.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Firebase Admin configuration
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL || ''

// New admin credentials
const newAdminEmail = 'vedrshah09@gmail.com'
const newAdminPassword = 'mercedes4Cursor!'
const newAdminName = 'Ved Shah' // You can customize this

async function main() {
  console.log('🔧 Starting admin management...\n')

  // Validate environment variables
  if (!firebaseProjectId || !firebasePrivateKey || !firebaseClientEmail) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env.local'
    )
  }

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

  try {
    // Step 1: List all existing admins
    console.log('📋 Step 1: Listing existing admins...')
    const adminsSnapshot = await db.collection('admins').get()
    const existingAdmins = adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`Found ${existingAdmins.length} admin(s):`)
    existingAdmins.forEach((admin, index) => {
      console.log(`  ${index + 1}. ${admin.email || 'No email'} (UID: ${admin.id})`)
    })

    // Step 2: Delete existing admins from Firestore
    console.log('\n🗑️  Step 2: Deleting existing admins from Firestore...')
    for (const admin of existingAdmins) {
      try {
        await db.collection('admins').doc(admin.id).delete()
        console.log(`  ✅ Deleted admin: ${admin.email || admin.id}`)
      } catch (error: any) {
        console.error(`  ❌ Error deleting admin ${admin.id}:`, error.message)
      }
    }

    // Step 3: Optionally delete Firebase Auth accounts
    console.log('\n🔐 Step 3: Checking Firebase Auth accounts...')
    for (const admin of existingAdmins) {
      try {
        await auth.getUser(admin.id)
        // User exists, delete it
        await auth.deleteUser(admin.id)
        console.log(`  ✅ Deleted Firebase Auth account: ${admin.email || admin.id}`)
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          console.log(`  ℹ️  Auth account not found for: ${admin.email || admin.id} (already deleted or never existed)`)
        } else {
          console.error(`  ❌ Error deleting Auth account ${admin.id}:`, error.message)
        }
      }
    }

    // Step 4: Check if new admin email already exists in Firebase Auth
    console.log('\n🔍 Step 4: Checking if new admin email exists...')
    let newAdminUid: string
    try {
      const existingUser = await auth.getUserByEmail(newAdminEmail)
      newAdminUid = existingUser.uid
      console.log(`  ℹ️  Email already exists in Firebase Auth (UID: ${newAdminUid})`)
      console.log(`  🔄 Updating password for existing account...`)
      
      // Update password for existing user
      await auth.updateUser(newAdminUid, {
        password: newAdminPassword,
        emailVerified: true, // Mark email as verified
      })
      console.log(`  ✅ Password updated for existing account`)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, create new one
        console.log(`  ➕ Creating new Firebase Auth account...`)
        const newUser = await auth.createUser({
          email: newAdminEmail,
          password: newAdminPassword,
          emailVerified: true, // Mark email as verified
        })
        newAdminUid = newUser.uid
        console.log(`  ✅ Created new Firebase Auth account (UID: ${newAdminUid})`)
      } else {
        throw error
      }
    }

    // Step 5: Add new admin to Firestore
    console.log('\n➕ Step 5: Adding new admin to Firestore...')
    const adminData = {
      email: newAdminEmail,
      name: newAdminName,
      role: 'admin',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    }

    await db.collection('admins').doc(newAdminUid).set(adminData)
    console.log(`  ✅ Added new admin to Firestore:`)
    console.log(`     Email: ${newAdminEmail}`)
    console.log(`     Name: ${newAdminName}`)
    console.log(`     UID: ${newAdminUid}`)

    // Step 6: Verify the new admin
    console.log('\n✅ Step 6: Verifying new admin...')
    const verifyDoc = await db.collection('admins').doc(newAdminUid).get()
    if (verifyDoc.exists) {
      console.log(`  ✅ Admin verified successfully!`)
      console.log(`     Data:`, verifyDoc.data())
    } else {
      throw new Error('Failed to verify admin creation')
    }

    console.log('\n🎉 Admin management completed successfully!')
    console.log('\n📝 Summary:')
    console.log(`   - Removed ${existingAdmins.length} existing admin(s)`)
    console.log(`   - Created/Updated admin: ${newAdminEmail}`)
    console.log(`   - UID: ${newAdminUid}`)
    console.log(`\n🔑 You can now log in with:`)
    console.log(`   Email: ${newAdminEmail}`)
    console.log(`   Password: ${newAdminPassword}`)

  } catch (error: any) {
    console.error('\n❌ Error during admin management:', error)
    console.error('Error details:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
    process.exit(1)
  }
}

// Run the script
main()
  .then(() => {
    console.log('\n✨ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })

