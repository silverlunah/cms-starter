// src/routes/dashboard/+page.server.ts
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Locals } from "$lib/types/locals";

export const load: PageServerLoad = async ({ locals }: { locals: Locals }) => {
  if (!locals.user) {
    throw redirect(302, "/");
  }

  return {
    user: locals.user,
  };
};
