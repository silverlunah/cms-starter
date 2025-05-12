import { seedAllowedHosts } from "./seeds/seedAllowedHosts";
import { seedImages } from "./seeds/seedImages";
import { seedUsers } from "./seeds/seedUsers";

async function main() {
  await seedUsers();
  await seedAllowedHosts();
  await seedImages();
  // Add more seeds here (e.g., seedPosts(), seedSettings())
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
