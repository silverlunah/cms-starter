import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { verifyJWT } from "$lib/server/auth";

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (token) {
    const payload = await verifyJWT(token);

    if (payload) {
      throw redirect(302, "/profile");
    }
  }

  return {};
};
