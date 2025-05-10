// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { verifyJWT } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");

  if (token) {
    try {
      const user = await verifyJWT(token);
      event.locals.user = user;
    } catch (err) {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
