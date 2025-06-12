const fs = require("fs");
const path = require("path");

const frontendEnvPath = path.join(__dirname, "../../frontend/.env");


if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(
    frontendEnvPath,
      `# General Environment Variables
  JWT_SECRET="secret"

  # General Environment Variables
  PUBLIC_API_URL="http://localhost:3001"
  `
  );
  console.log(`✅ Successfully setup frontend/.env for local`);
}