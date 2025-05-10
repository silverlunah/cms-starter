<script lang="ts">
  import { page } from "$app/stores";
  import Navbar from "$lib/components/Navbar.svelte";
  import Notification from "$lib/components/notification/Notification.svelte";
  import "../app.css";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Jacquard+24&family=Jersey+10&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if $page.url.pathname !== "/"}
  <Navbar />
{/if}
<slot />
<Notification />
