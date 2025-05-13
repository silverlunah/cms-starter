import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  const password = await bcrypt.hash("test", 10);

  await prisma.users.upsert({
    where: { id: "893d7514-8687-4815-b922-a9c8b81540c2" },
    update: {
      email: "admin@admin.com",
      firstName: "CMS",
      lastName: "Admin",
      username: "CMSAdmin",
      password,
      role: 99,
      isActive: true,
      isLocked: true,
      updatedAt: new Date(),
    },
    create: {
      id: "893d7514-8687-4815-b922-a9c8b81540c2",
      email: "admin@admin.com",
      firstName: "CMS ",
      lastName: "Admin",
      username: "CMSAdmin",
      imgId: "893d7514-8688-4815-b922-a9c8b81540c3",
      occupation: "Occupation",
      organization: "Organization",
      address: "Address",
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
