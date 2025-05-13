const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const backendPath = path.join(__dirname, "../backend");
const migrationsPath = path.join(backendPath, "prisma/migrations");

// Step 1: Delete migrations folder
if (fs.existsSync(migrationsPath)) {
  fs.rmSync(migrationsPath, { recursive: true, force: true });
  console.log(`
==============================================================

        🌈⃤  🗑️  Deleted backend/prisma/migrations 🗑️ 🌈⃤ 

  `);
} else {
  console.log(`
      ⚠️  No migrations folder found, skipping deletion. 🌈⃤ 

  `);
  console.log("");
}

// Step 2: Run `prisma migrate reset` to drop DB & clear history
try {
  console.log(`
          🌈⃤  🔄 Running: prisma migrate reset 🔄 🌈⃤ 

==============================================================`);
  execSync(`npx prisma migrate reset --force --skip-seed`, {
    cwd: backendPath,
    stdio: "inherit",
  });
} catch (err) {
  console.log(`

  🌈⃤  ❌ Error during "prisma migrate reset":, ${err.message} 🌈⃤ 

==============================================================`);
  process.exit(1);
}

// Step 3: Recreate initial migration
try {
  console.log(`
==============================================================

  🌈⃤  🚀 Running: prisma migrate dev --name initial-migration 🚀 🌈⃤ 

==============================================================
  `);
  execSync(`npx prisma migrate dev --name initial-migration`, {
    cwd: backendPath,
    stdio: "inherit",
  });
} catch (err) {
  console.log(`
==============================================================

  🌈⃤  ❌ Error during "prisma migrate dev":, ${err.message} 🌈⃤ 

==============================================================`);
  process.exit(1);
}
console.log(`
==============================================================

  🌈⃤  ✅ Prisma reset and reinitialization complete. ✅ 🌈⃤ 

  `);

// Step 4: Run the seed script explicitly
try {
  console.log(`
          🌈⃤  🌱 Running: prisma db seed 🌱 🌈⃤ 

==============================================================`);
  execSync(`npx prisma db seed`, {
    cwd: backendPath,
    stdio: "inherit",
  });
} catch (err) {
  console.error("❌ Error during seeding:", err.message);
  process.exit(1);
}
console.log(`
==============================================================

  🌈⃤  ✅ Prisma database reset, re-migrated, and seeded successfully. ✅ 🌈⃤ 

==============================================================`);
