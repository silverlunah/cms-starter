import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getAllAllowedHosts() {
  return await prisma.allowed_hosts.findMany({
    select: {
      id: true,
      url: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createAllowedHost(url: string, displayName: string) {
  const existingAllowedHost = await prisma.allowed_hosts.findUnique({
    where: { url },
  });
  if (existingAllowedHost) {
    throw new Error("This host is already registered");
  }

  const newAllowedHost = await prisma.allowed_hosts.create({
    data: {
      url,
      displayName,
    },
  });

  return newAllowedHost;
}

export async function updateAllowedHost(
  id: number,
  data: {
    url: string;
    displayName: string;
  }
) {
  const updateData: any = {
    url: data.url,
    displayName: data.displayName,
  };

  const updatedUser = await prisma.allowed_hosts.update({
    where: { id },
    data: updateData,
  });

  return updatedUser;
}

export async function deleteAllowedHost(id: number) {
  const deletedAllowedHost = await prisma.allowed_hosts.delete({
    where: { id },
  });

  return deletedAllowedHost;
}
