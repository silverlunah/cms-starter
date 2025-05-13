import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getAllUsers() {
  const rawUsers = await prisma.users.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      imgId: true,
      address: true,
      occupation: true,
      organization: true,
      role: true,
      isActive: true,
      isLocked: true,
      createdAt: true,
      updatedAt: true,
      userImages: {
        where: { type: "avatar" },
        take: 1,
        select: { url: true },
      },
    },
  });

  return rawUsers.map((user) => ({
    ...user,
    avatarUrl: user.userImages[0]?.url ?? null,
    userImages: undefined,
  }));
}

// Create user function with password hashing
export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string,
  role: number,
  address?: string,
  occupation?: string,
  organization?: string,
) {
  const existingEmail = await prisma.users.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error("Email is already registered");
  }

  const existingUsername = await prisma.users.findUnique({
    where: { username },
  });
  if (existingUsername) {
    throw new Error("Username is already registered");
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username,
      ...(address && { address }),
      ...(occupation && { occupation }),
      ...(organization && { organization }),
      role,
    },
  });

  return newUser;
}

export async function updateUser(
  id: string,
  data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    username: string;
    role: number;
    address?: string;
    occupation?: string;
    organization?: string;
  },
) {
  // Check if the email is used by another user
  const existingEmail = await prisma.users.findUnique({
    where: { email: data.email },
  });
  if (existingEmail && existingEmail.id !== id) {
    throw new Error("Email is already registered by another user");
  }

  // Check if the username is used by another user
  const existingUsername = await prisma.users.findUnique({
    where: { username: data.username },
  });
  if (existingUsername && existingUsername.id !== id) {
    throw new Error("Username is already registered by another user");
  }

  // Prepare the update data
  const updateData: any = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    ...(data.address && { address: data.address }),
    ...(data.occupation && { occupation: data.occupation }),
    ...(data.organization && { organization: data.organization }),
    role: data.role,
  };

  // Hash password if provided
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data: updateData,
  });

  return updatedUser;
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  let updatedUser;

  updatedUser = await prisma.users.update({
    where: { id },
    data: {
      isActive: !isActive,
    },
  });

  return updatedUser;
}

export async function deleteUser(id: string) {
  const deletedUser = await prisma.users.delete({
    where: { id },
  });

  return deletedUser;
}
