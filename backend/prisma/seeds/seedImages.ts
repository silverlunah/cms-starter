import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedImages() {
  await prisma.images.upsert({
    where: { id: "893d7514-8686-4815-b652-a9c8b81544g7" },
    create: {
      id: "893d7514-8686-4815-b652-a9c8b81544g7",
      userId: "893d7514-8686-4815-b652-a9c8b81544g6",
      url: "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
      type: "avatar",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });
  console.log(`Images table seeded`);
}
