const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const backendPath = path.join(__dirname, "../backend");
const migrationsPath = path.join(backendPath, "prisma/migrations");

// Step 1: Run `prisma migrate dev` to create a single migration file
const migrationName = process.argv[2] || "initial-migration"; // Default to 'initial-migration' if none provided
try {
  console.log(`
==============================================================

    🌈⃤  🚀 Running: prisma migrate dev --name ${migrationName} 🚀 🌈⃤ 

==============================================================`);
  execSync(`npx prisma migrate dev --name ${migrationName}`, {
    cwd: backendPath,
    stdio: "inherit",
  });
} catch (err) {
  console.error(":", err.message);
  console.log(`
      🌈⃤  ❌ Error during "prisma migrate dev": ${err.message} ❌ 🌈⃤ 

==============================================================
`);
  process.exit(1);
}

// Step 2: Seed the database
try {
  console.log(`
==============================================================

            🌈⃤  🌱 Running: prisma db seed 🌱 🌈⃤ 

==============================================================
`);
  execSync(`npx prisma db seed`, {
    cwd: backendPath,
    stdio: "inherit",
  });
} catch (err) {
  console.error("❌ Error during seeding:", err.message);
  console.log(`
      🌈⃤  ❌ Error during "prisma migrate dev": ${err.message} ❌ 🌈⃤ 

==============================================================
`);
  process.exit(1);
}

console.log(`
==============================================================

🌈⃤  ✅ Single migration applied and seeding complete. ✅ 🌈⃤ 

==============================================================
`);
