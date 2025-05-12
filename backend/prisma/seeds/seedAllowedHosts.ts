import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAllowedHosts() {
  const host = process.env.FRONTEND_URL;
  if (!host) {
    console.warn("FRONTEND_URL is not defined in the environment.");
    return;
  }

  await prisma.allowed_hosts.upsert({
    where: { url: host },
    update: {
      url: host,
      displayName: "Your Current URL",
      isLocked: true,
    },
    create: {
      url: host,
      displayName: "Your Current URL",
      isLocked: true,
    },
  });

  console.log(`AllowedHost table seeded`);
}
