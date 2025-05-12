import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  const password = await bcrypt.hash("test", 10);

  await prisma.users.upsert({
    where: { id: "893d7514-8686-4815-b652-a9c8b81544g6" },
    update: {
      email: "admin@admin.com",
      firstName: "CMS",
      lastName: "Admin",
      username: "cmsadmin",
      password,
      role: 99,
      isActive: true,
      isLocked: true,
      updatedAt: new Date(),
    },
    create: {
      id: "893d7514-8686-4815-b652-a9c8b81544g6",
      email: "admin@admin.com",
      firstName: "CMS",
      lastName: "Admin",
      username: "cmsadmin",
      imgId: "893d7514-8686-4815-b652-a9c8b81544g7",
      occupation: "",
      organization: "",
      address: "",
      password,
      role: 99,
      isActive: true,
      isLocked: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Users table seeded`);
}
