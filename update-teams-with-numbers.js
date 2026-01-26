/**
 * Update existing teams with team numbers and set passwords
 * Run with: node update-teams-with-numbers.js
 *
 * You'll need to provide team numbers for each team
 */

const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Team numbers mapping
const teamNumbers = {
  "supersigmarobotics@gmail.com": "23918", // Super Sigma Robotics
  "acmarobotics@gmail.com": "19439", // Disconnect
  "beyondtechftc@gmail.com": "25952", // Beyond Tech
  "468048@bsd48.org": "12808", // RevAmped
  "ftc18119@gmail.com": "18119", // Mostly Operational
  "roushil.satta@gmail.com": "18108", // High Voltage
  // Test teams (no team numbers provided - will be skipped)
  "5468048@bsd48.org": null,
  "test@example2.com": null,
  "121290219021390@example.com": null,
};

async function updateTeams() {
  console.log("🚀 Updating teams with team numbers and passwords...\n");

  try {
    // Get all teams
    const teamsResult = await pgPool.query(
      `SELECT t.id, t.team_name, u.email 
       FROM teams t 
       JOIN users u ON t.id = u.id 
       ORDER BY t.team_name`
    );

    if (teamsResult.rows.length === 0) {
      console.log("ℹ️  No teams found");
      return;
    }

    console.log(`Found ${teamsResult.rows.length} teams\n`);

    let updated = 0;
    let skipped = 0;

    for (const team of teamsResult.rows) {
      const email = team.email.toLowerCase();
      const teamNumber = teamNumbers[email];

      if (!teamNumber) {
        console.log(
          `⏭️  Skipping ${team.team_name} (${email}): No team number provided`
        );
        skipped++;
        continue;
      }

      try {
        // Generate password: teamname + number in lowercase (remove spaces, special chars)
        const teamNameClean = team.team_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const password = teamNameClean + teamNumber.toLowerCase();
        const passwordHash = await bcrypt.hash(password, 12);

        // Update team number and password
        await pgPool.query("BEGIN");

        await pgPool.query("UPDATE teams SET team_number = $1 WHERE id = $2", [
          teamNumber,
          team.id,
        ]);

        await pgPool.query(
          "UPDATE users SET password_hash = $1 WHERE id = $2",
          [passwordHash, team.id]
        );

        await pgPool.query("COMMIT");

        console.log(`✅ Updated: ${team.team_name} (${email})`);
        console.log(`   Team Number: ${teamNumber}`);
        console.log(`   Password: ${password}\n`);
        updated++;
      } catch (error) {
        await pgPool.query("ROLLBACK");
        console.error(`❌ Error updating ${team.team_name}:`, error.message);
      }
    }

    console.log("\n📊 Update Summary:");
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  } finally {
    await pgPool.end();
    process.exit(0);
  }
}

updateTeams();
