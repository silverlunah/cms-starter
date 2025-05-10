<script lang="ts">
  export let role: number;
</script>

{#if role === 0}
  <span class="badge badge-secondary badge-sm">Admin</span>
{:else if role === 1}
  <span class="badge badge-primary badge-sm">User</span>
{/if}
