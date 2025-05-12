import { writable } from "svelte/store";
import type { CurrentUser } from "$lib/types/currentUser";

export const currentUser = writable<CurrentUser | null>(null);

// Load user data from localStorage on page load
if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    currentUser.set(JSON.parse(savedUser) as CurrentUser);
  }
}
