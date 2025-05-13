import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDeveloperProfile() {
  const rawProfile = await prisma.users.findFirst({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      occupation: true,
      organization: true,
      profile: {
        select: { intro: true, tagLine: true },
      },
      userImages: {
        select: { url: true },
      },
    },
  });

  if (!rawProfile) {
    return null;
  }

  return {
    ...rawProfile,
    intro: rawProfile.profile?.intro ?? null,
    tagLine: rawProfile.profile?.tagLine ?? null,
    profile: undefined,
    avatarUrl: rawProfile.userImages?.[0]?.url ?? null,
    userImages: undefined,
  };
}
