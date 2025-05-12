<script lang="ts">
  export let role: number;
</script>

{#if role === 0}
  <span class="badge badge-secondary badge-sm">Admin</span>
{:else if role === 1}
  <span class="badge badge-primary badge-sm">User</span>
{:else if role === 99}
  <span class="badge badge-accent badge-sm">Owner</span>
{/if}
