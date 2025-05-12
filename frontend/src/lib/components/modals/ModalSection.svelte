<script lang="ts">
  export let label: string;
</script>

<div class="modal-section">
  <div class="divider">
    <h3 class="text-lg font-bold">{label}</h3>
  </div>
  <slot />
</div>
