<!-- src/routes/+error.svelte -->
<script>
  export let status;
</script>

<svelte:head>
  <title>Page Not Found</title>
</svelte:head>

<div class="text-center p-10">
  <p class="text-lg mt-4">"Oops! Something went wrong."</p>
  <a href="/" class="btn btn-primary mt-6">Go Home</a>
</div>
