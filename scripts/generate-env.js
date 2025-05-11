const fs = require("fs");
const path = require("path");

const rootEnvPath = path.join(__dirname, "../.env");
const backendEnvPath = path.join(__dirname, "../backend/.env");
const frontendEnvPath = path.join(__dirname, "../frontend/.env");

if (!fs.existsSync(backendEnvPath)) {
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
  console.log(`✅  Created backend/.env`);
} else {
  console.log(`⚠️  backend/.env already exists, skipping.`);
}

if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(
    frontendEnvPath,
    `# General Environment Variables
JWT_SECRET="secret"

# General Environment Variables
PUBLIC_API_URL="http://localhost:3001"
`
  );
  console.log(`✅  Created frontend/.env`);
} else {
  console.log(`⚠️  frontend/.env already exists, skipping.`);
}

if (!fs.existsSync(rootEnvPath)) {
  fs.writeFileSync(
    rootEnvPath,
    `# Docker Compose Environment Variables
MYSQL_PORT_MAPPING=3306:3306
`
  );
  console.log(`✅  Created .env in project root`);
} else {
  console.log(`⚠️  .env in project root already exists, skipping.`);
}
