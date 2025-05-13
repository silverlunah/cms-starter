import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedImages() {
  await prisma.images.upsert({
    where: { id: "893d7514-8688-4815-b922-a9c8b81540c3" },
    create: {
      id: "893d7514-8688-4815-b922-a9c8b81540c3",
      userId: "893d7514-8687-4815-b922-a9c8b81540c2",
      url: "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp",
      type: "avatar",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });
  console.log(`Images table seeded`);
}
