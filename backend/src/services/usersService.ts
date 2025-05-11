import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Create user function with password hashing
export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: number
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
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
    role: number;
  }
) {
  // Check if the email is used by another user
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser && existingUser.id !== id) {
    throw new Error("Email is already registered by another user");
  }

  // Prepare the update data
  const updateData: any = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
  };

  // Hash password if provided
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return updatedUser;
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  let updatedUser;

  updatedUser = await prisma.user.update({
    where: { id },
    data: {
      isActive: !isActive,
    },
  });

  return updatedUser;
}

export async function deleteUser(id: string) {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return deletedUser;
}
