const fs = require("fs");
const path = require("path");

const backendEnvPath = path.join(__dirname, "../../backend/.env");
const pkg = require(path.join(__dirname, "../../package.json"));
const dbName = pkg.name || "silverlunah";

const defaultEnvContent = `# General Environment Variables
NODE_ENV="local"
JWT_SECRET="secret"

# URL Environment Variables
FRONTEND_URL="http://localhost:3002"

# Database Environment Variables
DATABASE_URL="mysql://root:root@localhost:3306/${dbName}"
`;

if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(backendEnvPath, defaultEnvContent);
  console.log("✅ Successfully setup backend/.env for local");
} else {
  const contents = fs.readFileSync(backendEnvPath, "utf8");
  const updated = contents.replace(
    /mysql:\/\/root:root@mysql:3306/g,
    "mysql://root:root@localhost:3306"
  );

  if (updated !== contents) {
    fs.writeFileSync(backendEnvPath, updated);
    console.log("🔁 Updated backend/.env DATABASE_URL to use `localhost` host");
  } else {
    console.log("✅ backend/.env already uses `localhost` host — no changes made");
  }
}
