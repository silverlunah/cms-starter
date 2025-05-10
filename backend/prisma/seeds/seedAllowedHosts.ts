import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAllowedHosts() {
  const host = process.env.FRONTEND_URL;
  if (!host) {
    console.warn("FRONTEND_URL is not defined in the environment.");
    return;
  }

  await prisma.allowedHosts.upsert({
    where: { url: host },
    update: {
      url: host,
      displayName: "Back Office Frontend URL",
    },
    create: {
      url: host,
      displayName: "Back Office Frontend URL",
    },
  });

  console.log(`AllowedHost table seeded`);
}
