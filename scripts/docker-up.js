const { execSync } = require("child_process");

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

console.log(`
==============================================================

          🐋 📦 Setting Up Docker Containers...📦 🐋

==============================================================
`);

run("docker compose up -d --build");

console.log(`
==============================================================

      🐋 🥳 Successfully Set Up Docker Containers...🥳 🐋

==============================================================

                   🚀 Check it out now! 🚀 

- Frontend: http://localhost:3002
- Backend: http://localhost:3001

==============================================================
`);
