<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { isLoggedIn } from "$lib/stores/auth";

  interface Props {
    additionalClass?: string;
  }

  let { additionalClass = "" }: Props = $props();
  /**-----------------------
   *    Logout function
  -----------------------*/
  async function handleLogout() {
    // Call the server-side logout endpoint
    await fetch(PUBLIC_API_URL + "/logout", {
      method: "GET",
      credentials: "include",
    });

    // Clear store
    isLoggedIn.set(false);

    // Redirect to the home page
    goto("/");
  }
</script>

<a href="#" onclick={handleLogout} class={additionalClass}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
    />
  </svg>
</a>
