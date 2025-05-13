import { seedAllowedHosts } from "./seeds/seedAllowedHosts";
import { seedImages } from "./seeds/seedImages";
import { seedUsers } from "./seeds/seedUsers";

async function main() {
  await seedUsers();
  await seedAllowedHosts();
  await seedImages();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
