<script lang="ts">
  import PageSection from "$lib/components/pages/PageSection.svelte";
  import PageSectionHeading from "$lib/components/pages/PageSectionHeading.svelte";
  import PageWrapper from "$lib/components/pages/PageWrapper.svelte";

  let tagLine: string;
  let introduction: string;

  let fieldErrors: { [key: string]: string } = {};
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<PageWrapper>
  <PageSectionHeading title="Dashboard" />
  <PageSection>Welcome to your dashboard!</PageSection>
</PageWrapper>
