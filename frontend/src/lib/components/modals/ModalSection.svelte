<script lang="ts">
  interface Props {
    label: string;
    children?: import("svelte").Snippet;
  }

  let { label, children }: Props = $props();
</script>

<div class="modal-section">
  <div class="divider">
    <h3 class="text-lg font-bold">{label}</h3>
  </div>
  {@render children?.()}
</div>
