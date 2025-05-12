<script lang="ts">
  export let id: string;
  export let label: string;
  export let additionalClass: string = "";
</script>

<dialog {id} class="modal">
  <div class="modal-box {additionalClass}">
    <div class="flex flex-col gap-6">
      <h3 class="text-2xl font-bold text-center">{label}</h3>
      <slot />
    </div>
  </div>
</dialog>
