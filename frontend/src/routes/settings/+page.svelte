<script lang="ts">
  import PageWrapper from "$lib/components/pages/PageWrapper.svelte";
  import SectionAllowedHosts from "./sections/SectionAllowedHosts.svelte";
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<PageWrapper>
  <SectionAllowedHosts />
</PageWrapper>
