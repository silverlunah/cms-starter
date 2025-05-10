<script lang="ts">
  import SectionAllowedHosts from "./sections/SectionAllowedHosts.svelte";
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div
  class="relative text-base-content flex flex-col items-center justify-end p-4"
>
  <h1 class="text-2xl">Settings</h1>
  <SectionAllowedHosts />
</div>
