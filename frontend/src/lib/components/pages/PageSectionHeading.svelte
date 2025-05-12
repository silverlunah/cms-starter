<script lang="ts">
  export let title: string;
  export let description: string;
</script>

<div class="mb-4">
  <div class="divider divider-start text-xl text-base-content">{title}</div>
  <div class="w-full flex text-left mb-4">
    <p class="text-sm text-base-content">{description}</p>
  </div>
</div>
