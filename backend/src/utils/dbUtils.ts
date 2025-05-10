import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllowedOrigins(): Promise<string[]> {
  const entries = await prisma.allowedHosts.findMany({
    select: { url: true },
  });

  return entries.map((entry: { url: string }) => entry.url);
}
