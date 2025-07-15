<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div
  class="relative text-base-content flex flex-col items-center justify-end p-4"
>
  <div class="w-96 md:w-3xl">
    {@render children?.()}
  </div>
</div>
