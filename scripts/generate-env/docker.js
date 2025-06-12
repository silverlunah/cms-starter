const fs = require("fs");
const path = require("path");

const backendEnvPath = path.join(__dirname, "../../backend/.env");
const frontendEnvPath = path.join(__dirname, "../../frontend/.env");
const pkg = require(path.join(__dirname, "../../package.json"));
const dbName = pkg.name || "silverlunah";

/**-----------------------
 *   Backend config  
 ------------------------*/
if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(
    backendEnvPath,
    `# General Environment Variables
NODE_ENV="local"
JWT_SECRET="secret"

# URL Environment Variables
FRONTEND_URL="http://localhost:3002"

# Database Environment Variables
DATABASE_URL="mysql://root:root@mysql:3306/${dbName}"
`
  );
  console.log("✅ Successfully setup backend/.env for Docker");
} else {
  // This will make sure docker uses mysql instead of localhost
  const contents = fs.readFileSync(backendEnvPath, "utf8");
  const updated = contents.replace(
    /mysql:\/\/root:root@localhost:3306/g,
    "mysql://root:root@mysql:3306"
  );

  if (updated !== contents) {
    fs.writeFileSync(backendEnvPath, updated);
    console.log("🔁 Updated backend/.env DATABASE_URL to use `mysql` host");
  } else {
    console.log("✅ backend/.env already uses `mysql` host — no changes made");
  }
}

/**-----------------------
 *   Frontend config  
 ------------------------*/
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(
    frontendEnvPath,
    `# General Environment Variables
JWT_SECRET="secret"

# General Environment Variables
PUBLIC_API_URL="http://localhost:3001"
`
  );
  console.log("✅ Successfully setup frontend/.env for Docker");
} else {
  console.log("⚠️ frontend/.env already exists — skipping");
}
