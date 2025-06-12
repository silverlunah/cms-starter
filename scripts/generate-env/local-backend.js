const fs = require("fs");
const path = require("path");

const backendEnvPath = path.join(__dirname, "../../backend/.env");

fs.writeFileSync(
  backendEnvPath,
  `# General Environment Variables
NODE_ENV="local"
JWT_SECRET="secret"

# URL Environment Variables
FRONTEND_URL="http://localhost:3002"

# Database Environment Variables
DATABASE_URL="mysql://root:root@localhost:3306/silverlunah"
`
);
console.log(`✅ Successfully setup backend/.env for local`);