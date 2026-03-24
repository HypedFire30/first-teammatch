/**
 * Admin Management Script
 *
 * Manage admin accounts in the PostgreSQL database.
 *
 * Usage:
 *   npm run manage:admins -- list
 *   npm run manage:admins -- add <email>
 *   npm run manage:admins -- remove <email>
 */

import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function listAdmins() {
  const result = await pool.query(
    "SELECT email, created_at FROM users WHERE role = 'admin' ORDER BY created_at"
  )
  if (result.rows.length === 0) {
    console.log('No admin accounts found.')
  } else {
    console.log(`${result.rows.length} admin(s):`)
    result.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.email} (created ${new Date(row.created_at).toLocaleDateString()})`)
    })
  }
}

async function addAdmin(email: string) {
  const normalized = email.toLowerCase().trim()
  const result = await pool.query(
    "UPDATE users SET role = 'admin', updated_at = NOW() WHERE email = $1 RETURNING email",
    [normalized]
  )
  if (result.rowCount === 0) {
    console.error(`No user found with email: ${normalized}`)
    console.error('The user must register an account first, then you can promote them.')
    process.exit(1)
  }
  console.log(`Promoted ${normalized} to admin.`)
}

async function removeAdmin(email: string) {
  const normalized = email.toLowerCase().trim()
  const result = await pool.query(
    "UPDATE users SET role = 'team', updated_at = NOW() WHERE email = $1 AND role = 'admin' RETURNING email",
    [normalized]
  )
  if (result.rowCount === 0) {
    console.error(`No admin found with email: ${normalized}`)
    process.exit(1)
  }
  console.log(`Removed admin role from ${normalized}.`)
}

async function main() {
  const [command, arg] = process.argv.slice(2)

  try {
    if (command === 'list') {
      await listAdmins()
    } else if (command === 'add' && arg) {
      await addAdmin(arg)
    } else if (command === 'remove' && arg) {
      await removeAdmin(arg)
    } else {
      console.error('Usage:')
      console.error('  npm run manage:admins -- list')
      console.error('  npm run manage:admins -- add <email>')
      console.error('  npm run manage:admins -- remove <email>')
      process.exit(1)
    }
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
