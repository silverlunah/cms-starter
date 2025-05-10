<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { isLoggedIn } from "$lib/stores/auth";

  /**-----------------------
   * 
   *    Logout function
   * 
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

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-50 w-auto">
  <div class="navbar-start">
    <a href="/" class="ml-4 pixel-h1 text-xl">Back Office</a>
  </div>

  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a class="pixel-p text-md" href="/dashboard">Dashboard</a></li>
      <li><a class="pixel-p text-md" href="/users">Users</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-square lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </div>
        <ul
          class="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <li><a class="pixel-p text-md" href="/dashboard">Dashboard</a></li>
          <li><a class="pixel-p text-md" href="/users">Users</a></li>
          <li>
            <a
              href="#"
              on:click={handleLogout}
              class="text-md"
              aria-label="mobile logout button"
            >
              Logout
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
</svg>

            </a>
          </li>
        </ul>
      </div>
      <button
        on:click={handleLogout}
        class="btn btn-ghost btn-square hidden lg:flex"
        aria-label="web logout button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
</svg>

      </button>
    </div>
  </div>
</div>
