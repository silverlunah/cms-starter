<script lang="ts">
  interface Props {
    id: string;
    label: string;
    additionalClass?: string;
    children?: import("svelte").Snippet;
  }

  let { id, label, additionalClass = "", children }: Props = $props();
</script>

<dialog {id} class="modal">
  <div class="modal-box {additionalClass}">
    <div class="flex flex-col gap-6">
      <h3 class="text-2xl font-bold text-center">{label}</h3>
      {@render children?.()}
    </div>
  </div>
</dialog>
