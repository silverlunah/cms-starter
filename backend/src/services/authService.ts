import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.users.findUnique({
    where: { email },
    include: {
      userImages: {
        where: { type: "avatar" },
        take: 1,
        select: { url: true },
      },
    },
  });

  if (
    user &&
    user.isActive &&
    (await bcrypt.compare(password, user.password))
  ) {
    // Return user fields needed for JWT or frontend
    const rawUser = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatarUrl: user.userImages[0]?.url ?? null, // Get avatar URL or null if no avatar
    };
    return rawUser;
  } else {
    throw new Error("Invalid credentials or inactive account");
  }
}
