/**
 * Import Auth Accounts Script
 * 
 * This script creates Firebase Authentication accounts for users who have
 * profiles in Firestore but don't have Auth accounts yet.
 * 
 * It reads from the students and teams collections in Firestore and creates
 * corresponding Firebase Auth accounts.
 * 
 * Usage:
 * npx tsx scripts/import-auth-accounts.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Firebase Admin configuration
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL || ''

interface ImportStats {
    students: { total: number; created: number; skipped: number; errors: number }
    teams: { total: number; created: number; skipped: number; errors: number }
}

async function main() {
    console.log('🚀 Starting Auth Account Import...\n')

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

    const stats: ImportStats = {
        students: { total: 0, created: 0, skipped: 0, errors: 0 },
        teams: { total: 0, created: 0, skipped: 0, errors: 0 },
    }

    try {
        // ============================================
        // IMPORT STUDENT ACCOUNTS
        // ============================================
        console.log('📚 Processing Students...\n')
        const studentsSnapshot = await db.collection('students').get()
        stats.students.total = studentsSnapshot.size

        for (const studentDoc of studentsSnapshot.docs) {
            const studentId = studentDoc.id
            const studentData = studentDoc.data()
            const email = studentData.email

            if (!email) {
                console.log(`  ⚠️  Skipping student ${studentId}: No email found`)
                stats.students.skipped++
                continue
            }

            try {
                // Check if Auth account already exists
                let authUser
                try {
                    authUser = await auth.getUser(studentId)
                    console.log(`  ℹ️  Student ${email}: Auth account already exists (UID: ${studentId})`)
                    stats.students.skipped++
                    continue
                } catch (error: any) {
                    if (error.code !== 'auth/user-not-found') {
                        throw error
                    }
                }

                // Check if email is already used by another account
                try {
                    const existingUser = await auth.getUserByEmail(email)
                    console.log(`  ⚠️  Student ${email}: Email already used by UID ${existingUser.uid}`)
                    console.log(`     Note: Firestore document ID (${studentId}) doesn't match Auth UID (${existingUser.uid})`)
                    console.log(`     You may need to update the Firestore document ID to match the Auth UID`)
                    stats.students.skipped++
                    continue
                } catch (error: any) {
                    if (error.code !== 'auth/user-not-found') {
                        throw error
                    }
                }

                // Create Auth account with the document ID as UID
                // Generate a temporary password (user will need to reset)
                const tempPassword = generateTempPassword()

                await auth.createUser({
                    uid: studentId, // Use Firestore document ID as UID
                    email: email,
                    password: tempPassword,
                    emailVerified: false, // They'll need to verify
                    disabled: false,
                })

                console.log(`  ✅ Created Auth account for student: ${email}`)
                console.log(`     UID: ${studentId}`)
                console.log(`     Temporary password: ${tempPassword}`)
                console.log(`     ⚠️  User must reset password on first login`)
                stats.students.created++

            } catch (error: any) {
                console.error(`  ❌ Error creating Auth for student ${email}:`, error.message)
                stats.students.errors++
            }
        }

        // ============================================
        // IMPORT TEAM ACCOUNTS
        // ============================================
        console.log('\n🎯 Processing Teams...\n')
        const teamsSnapshot = await db.collection('teams').get()
        stats.teams.total = teamsSnapshot.size

        for (const teamDoc of teamsSnapshot.docs) {
            const teamId = teamDoc.id
            const teamData = teamDoc.data()
            const email = teamData.email

            if (!email) {
                console.log(`  ⚠️  Skipping team ${teamId}: No email found`)
                stats.teams.skipped++
                continue
            }

            try {
                // Check if Auth account already exists
                let authUser
                try {
                    authUser = await auth.getUser(teamId)
                    console.log(`  ℹ️  Team ${email}: Auth account already exists (UID: ${teamId})`)
                    stats.teams.skipped++
                    continue
                } catch (error: any) {
                    if (error.code !== 'auth/user-not-found') {
                        throw error
                    }
                }

                // Check if email is already used by another account
                try {
                    const existingUser = await auth.getUserByEmail(email)
                    console.log(`  ⚠️  Team ${email}: Email already used by UID ${existingUser.uid}`)
                    console.log(`     Note: Firestore document ID (${teamId}) doesn't match Auth UID (${existingUser.uid})`)
                    console.log(`     You may need to update the Firestore document ID to match the Auth UID`)
                    stats.teams.skipped++
                    continue
                } catch (error: any) {
                    if (error.code !== 'auth/user-not-found') {
                        throw error
                    }
                }

                // Create Auth account with the document ID as UID
                const tempPassword = generateTempPassword()

                await auth.createUser({
                    uid: teamId, // Use Firestore document ID as UID
                    email: email,
                    password: tempPassword,
                    emailVerified: false, // They'll need to verify
                    disabled: false,
                })

                console.log(`  ✅ Created Auth account for team: ${email}`)
                console.log(`     UID: ${teamId}`)
                console.log(`     Temporary password: ${tempPassword}`)
                console.log(`     ⚠️  User must reset password on first login`)
                stats.teams.created++

            } catch (error: any) {
                console.error(`  ❌ Error creating Auth for team ${email}:`, error.message)
                stats.teams.errors++
            }
        }

        // ============================================
        // SUMMARY
        // ============================================
        console.log('\n' + '='.repeat(60))
        console.log('📊 Import Summary')
        console.log('='.repeat(60))
        console.log('\n📚 Students:')
        console.log(`   Total: ${stats.students.total}`)
        console.log(`   Created: ${stats.students.created}`)
        console.log(`   Skipped: ${stats.students.skipped}`)
        console.log(`   Errors: ${stats.students.errors}`)
        console.log('\n🎯 Teams:')
        console.log(`   Total: ${stats.teams.total}`)
        console.log(`   Created: ${stats.teams.created}`)
        console.log(`   Skipped: ${stats.teams.skipped}`)
        console.log(`   Errors: ${stats.teams.errors}`)
        console.log('\n' + '='.repeat(60))

        if (stats.students.created > 0 || stats.teams.created > 0) {
            console.log('\n⚠️  IMPORTANT:')
            console.log('   Users with newly created accounts need to:')
            console.log('   1. Go to the login page')
            console.log('   2. Click "Forgot Password"')
            console.log('   3. Enter their email')
            console.log('   4. Set a new password via the reset link')
            console.log('\n   Or you can send them their temporary password (shown above)')
            console.log('   and they can change it after first login.')
        }

        console.log('\n✅ Import completed!')

    } catch (error: any) {
        console.error('\n❌ Fatal error during import:', error)
        console.error('Error details:', error.message)
        if (error.code) {
            console.error('Error code:', error.code)
        }
        process.exit(1)
    }
}

/**
 * Generate a temporary password
 * Users will need to reset this on first login
 */
function generateTempPassword(): string {
    const length = 16
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''

    // Ensure at least one uppercase, one lowercase, one number, one special char
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
    password += '0123456789'[Math.floor(Math.random() * 10)]
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)]
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
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

