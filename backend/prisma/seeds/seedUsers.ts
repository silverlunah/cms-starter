import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  const password = await bcrypt.hash("test", 10);

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {
      firstName: "Jann",
      lastName: "Espino",
      password,
      role: 0,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      email: "admin@admin.com",
      password,
      firstName: "Jann",
      lastName: "Espino",
      role: 0,
      isActive: true,
      createdAt: new Date(),
    },
  });

  console.log(`Users table seeded`);
}
