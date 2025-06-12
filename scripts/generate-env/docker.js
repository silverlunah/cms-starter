const fs = require("fs");
const path = require("path");

const backendEnvPath = path.join(__dirname, "../../backend/.env");
const frontendEnvPath = path.join(__dirname, "../../frontend/.env");

fs.writeFileSync(
  backendEnvPath,
  `# General Environment Variables
NODE_ENV="local"
JWT_SECRET="secret"

# URL Environment Variables
FRONTEND_URL="http://localhost:3002"

# Database Environment Variables
DATABASE_URL="mysql://root:root@mysql:3306/silverlunah"
`
);
console.log(`✅ Successfully setup backend/.env for Docker`);

fs.writeFileSync(
  frontendEnvPath,
  `# General Environment Variables
JWT_SECRET="secret"

# General Environment Variables
PUBLIC_API_URL="http://localhost:3001"
`
);
console.log(`✅ Successfully setup frontend/.env for Docker`);