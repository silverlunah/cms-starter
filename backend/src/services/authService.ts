import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (
    user &&
    user.isActive &&
    (await bcrypt.compare(password, user.password))
  ) {
    // Return user fields needed for JWT or frontend
    return {
      id: user.id,
      email: user.email,
    };
  } else {
    throw new Error("Invalid credentials or inactive account");
  }
}
