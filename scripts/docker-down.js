const { execSync } = require("child_process");

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

console.log(`
==============================================================

🐋 🛑 Stopping and removing Docker containers and images...🛑 🐋

==============================================================
`);

run("docker compose down --rmi all --remove-orphans");
run("docker image prune -f");

console.log(`
==============================================================

🐋 ✅ Docker containers and images have been successfully removed. ✅ 🐋

==============================================================
`);
