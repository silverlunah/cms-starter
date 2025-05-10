<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";

  async function handleLogout() {
    // Call the server-side logout endpoint
    await fetch(PUBLIC_API_URL + "/logout", {
      method: "GET",
      credentials: "include",
    });

    // Redirect to the home page
    goto("/");
  }
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div
  class="relative text-white flex flex-col items-center justify-end overflow-hidden p-4"
>
  <div class="card w-auto md:w-3xl pixel-p p-4 text-center">
    Welcome to the dashboard!
  </div>
</div>

<style>
</style>
