<script>
  import { currentUser } from "$lib/stores/currentUser";
  import ButtonLogout from "./buttons/ButtonLogout.svelte";
  import ToggleTheme from "./toggles/ToggleTheme.svelte";
  import Nameplate from "./user/Nameplate.svelte";
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-50 w-auto">
  <div class="navbar-start">
    <a href="/" class="ml-4 pixel-h1 text-xl">CMS Admin </a>
  </div>

  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a class="pixel-p text-md" href="/dashboard">Dashboard</a></li>
      <li><a class="pixel-p text-md" href="/users">Users</a></li>
      <li><a class="pixel-p text-md" href="/settings">Settings</a></li>
    </ul>
  </div>
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
        <li><a class="pixel-p text-md" href="/settings">Settings</a></li>
        <div class="flex justify-center gap-10 my-2">
          <ToggleTheme />
          <ButtonLogout />
        </div>
      </ul>
    </div>

    <div class="flex justify-between gap-4">
      {#if $currentUser}
        <Nameplate
          avatarUrl={$currentUser.avatarUrl}
          username={$currentUser.username}
          firstName={$currentUser.firstName}
          lastName={$currentUser.lastName}
          email={$currentUser.email}
          additionalClass="hidden lg:flex"
        />
      {/if}
      <ToggleTheme additionalClass="hidden lg:flex" />
      <ButtonLogout additionalClass="hidden lg:flex mt-3.5" />
    </div>
  </div>
</div>
