/**
 * Migration Script: Supabase to Firebase
 * 
 * This script migrates data from Supabase to Firebase Firestore
 * 
 * Prerequisites:
 * 1. Run the SQL queries in migrate-supabase-to-firebase.sql to understand your schema
 * 2. Set up both Supabase and Firebase credentials in .env.local
 * 3. Ensure Firebase Firestore is initialized
 * 
 * Usage:
 * npx tsx scripts/migrate-to-firebase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Firebase Admin configuration
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL || ''

interface MigrationStats {
  students: { total: number; migrated: number; errors: number }
  teams: { total: number; migrated: number; errors: number }
  admins: { total: number; migrated: number; errors: number }
  authUsers: { total: number; migrated: number; errors: number }
}

async function main() {
  console.log('🚀 Starting Supabase to Firebase migration...\n')

  // Validate environment variables
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }

  if (!firebaseProjectId || !firebasePrivateKey || !firebaseClientEmail) {
    throw new Error('Missing Firebase Admin credentials. Set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL')
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Initialize Firebase Admin
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: firebaseProjectId,
        privateKey: firebasePrivateKey,
        clientEmail: firebaseClientEmail,
      }),
    })
  }
  const db = getFirestore()

  const stats: MigrationStats = {
    students: { total: 0, migrated: 0, errors: 0 },
    teams: { total: 0, migrated: 0, errors: 0 },
    admins: { total: 0, migrated: 0, errors: 0 },
    authUsers: { total: 0, migrated: 0, errors: 0 },
  }

  try {
    // Step 1: Migrate Auth Users
    console.log('📦 Step 1: Migrating auth users...')
    await migrateAuthUsers(supabase, stats)

    // Step 2: Migrate Students
    console.log('\n📦 Step 2: Migrating students...')
    await migrateStudents(supabase, db, stats)

    // Step 3: Migrate Teams
    console.log('\n📦 Step 3: Migrating teams...')
    await migrateTeams(supabase, db, stats)

    // Step 4: Migrate Admins
    console.log('\n📦 Step 4: Migrating admins...')
    await migrateAdmins(supabase, db, stats)

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ Migration Complete!')
    console.log('='.repeat(60))
    console.log('\n📊 Migration Statistics:')
    console.log(`\n  Students:  ${stats.students.migrated}/${stats.students.total} migrated, ${stats.students.errors} errors`)
    console.log(`  Teams:    ${stats.teams.migrated}/${stats.teams.total} migrated, ${stats.teams.errors} errors`)
    console.log(`  Admins:   ${stats.admins.migrated}/${stats.admins.total} migrated, ${stats.admins.errors} errors`)
    console.log(`  Auth:     ${stats.authUsers.migrated}/${stats.authUsers.total} migrated, ${stats.authUsers.errors} errors`)
    console.log('\n⚠️  Note: Auth users need to be migrated manually in Firebase Console')
    console.log('   or use Firebase Auth Import/Export tools\n')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

async function migrateAuthUsers(supabase: any, stats: MigrationStats) {
  try {
    // Note: Supabase auth.users table requires special access
    // This is a placeholder - you may need to export auth users differently
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.warn('⚠️  Could not fetch auth users:', error.message)
      console.warn('   You may need to migrate auth users manually')
      return
    }

    stats.authUsers.total = users?.users?.length || 0
    console.log(`   Found ${stats.authUsers.total} auth users`)
    console.log('   ⚠️  Auth users should be migrated using Firebase Auth Import/Export')
    console.log('   See: https://firebase.google.com/docs/auth/admin/import-users')
    
  } catch (error: any) {
    console.error('   Error migrating auth users:', error.message)
    stats.authUsers.errors++
  }
}

async function migrateStudents(supabase: any, db: any, stats: MigrationStats) {
  try {
    // Fetch all students from Supabase
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    stats.students.total = students?.length || 0
    console.log(`   Found ${stats.students.total} students`)

    // Migrate each student
    for (const student of students || []) {
      try {
        // Convert Supabase data to Firestore format
        const firestoreData: any = {
          name: student.name,
          email: student.email,
          zip_code: student.zip_code,
          school: student.school,
          first_level: student.first_level,
          areas_of_interest: student.areas_of_interest || [],
          grade: student.grade,
          time_commitment: student.time_commitment,
          resume_url: student.resume_url || null,
          impressive_things: student.impressive_things || '',
          why_join_team: student.why_join_team || '',
          is_matched: student.is_matched || false,
          matched_team_id: student.matched_team_id || null,
          phone_number: student.phone_number || null,
          created_at: student.created_at ? Timestamp.fromDate(new Date(student.created_at)) : Timestamp.now(),
          updated_at: Timestamp.now(),
        }

        // Use the student's ID from Supabase, or if it's a UUID from auth.users, use that
        // If student.id doesn't match auth user ID, we'll need to find the corresponding auth user
        const studentId = student.id

        // Write to Firestore
        await db.collection('students').doc(studentId).set(firestoreData)
        stats.students.migrated++

        if (stats.students.migrated % 10 === 0) {
          process.stdout.write(`   Migrated ${stats.students.migrated}/${stats.students.total}...\r`)
        }
      } catch (error: any) {
        console.error(`\n   Error migrating student ${student.id}:`, error.message)
        stats.students.errors++
      }
    }

    console.log(`\n   ✅ Migrated ${stats.students.migrated} students`)
  } catch (error: any) {
    console.error('   ❌ Error fetching students:', error.message)
    throw error
  }
}

async function migrateTeams(supabase: any, db: any, stats: MigrationStats) {
  try {
    // Fetch all teams from Supabase
    const { data: teams, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    stats.teams.total = teams?.length || 0
    console.log(`   Found ${stats.teams.total} teams`)

    // Migrate each team
    for (const team of teams || []) {
      try {
        // Convert Supabase data to Firestore format
        const firestoreData: any = {
          team_name: team.team_name,
          email: team.email,
          zip_code: team.zip_code,
          first_level: team.first_level,
          areas_of_need: team.areas_of_need || [],
          grade_range_min: team.grade_range_min,
          grade_range_max: team.grade_range_max,
          time_commitment: team.time_commitment,
          qualities: team.qualities || [],
          is_school_team: team.is_school_team || false,
          school_name: team.school_name || null,
          team_awards: team.team_awards || '',
          is_active: team.is_active !== undefined ? team.is_active : true,
          created_at: team.created_at ? Timestamp.fromDate(new Date(team.created_at)) : Timestamp.now(),
          updated_at: Timestamp.now(),
        }

        const teamId = team.id

        // Write to Firestore
        await db.collection('teams').doc(teamId).set(firestoreData)
        stats.teams.migrated++

        if (stats.teams.migrated % 10 === 0) {
          process.stdout.write(`   Migrated ${stats.teams.migrated}/${stats.teams.total}...\r`)
        }
      } catch (error: any) {
        console.error(`\n   Error migrating team ${team.id}:`, error.message)
        stats.teams.errors++
      }
    }

    console.log(`\n   ✅ Migrated ${stats.teams.migrated} teams`)
  } catch (error: any) {
    console.error('   ❌ Error fetching teams:', error.message)
    throw error
  }
}

async function migrateAdmins(supabase: any, db: any, stats: MigrationStats) {
  try {
    // Fetch all admins from Supabase
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    stats.admins.total = admins?.length || 0
    console.log(`   Found ${stats.admins.total} admins`)

    // Migrate each admin
    for (const admin of admins || []) {
      try {
        // Convert Supabase data to Firestore format
        const firestoreData: any = {
          name: admin.name || admin.email,
          email: admin.email,
          role: admin.role || 'admin',
          created_at: admin.created_at ? Timestamp.fromDate(new Date(admin.created_at)) : Timestamp.now(),
          updated_at: Timestamp.now(),
        }

        const adminId = admin.id

        // Write to Firestore
        await db.collection('admins').doc(adminId).set(firestoreData)
        stats.admins.migrated++

        if (stats.admins.migrated % 10 === 0) {
          process.stdout.write(`   Migrated ${stats.admins.migrated}/${stats.admins.total}...\r`)
        }
      } catch (error: any) {
        console.error(`\n   Error migrating admin ${admin.id}:`, error.message)
        stats.admins.errors++
      }
    }

    console.log(`\n   ✅ Migrated ${stats.admins.migrated} admins`)
  } catch (error: any) {
    console.error('   ❌ Error fetching admins:', error.message)
    throw error
  }
}

// Run migration
main().catch(console.error)

