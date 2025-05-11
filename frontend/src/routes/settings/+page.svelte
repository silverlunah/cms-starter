<script lang="ts">
  import PageWrapper from "$lib/components/pages/PageWrapper.svelte";
import SectionAllowedHosts from "./sections/SectionAllowedHosts.svelte";
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<PageWrapper>
  <h1 class="text-2xl">Settings</h1>
  <SectionAllowedHosts />
</PageWrapper>
